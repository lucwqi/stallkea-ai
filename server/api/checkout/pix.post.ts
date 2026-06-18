import { persistTransaction } from './transaction-store'

const sanitizeDigits = (value: unknown) => `${value ?? ''}`.replace(/\D/g, '')
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Generate random valid CPF (11 digits)
const generateRandomCpf = () => {
    const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))
    
    // Calculate first check digit
    let sum = digits.reduce((acc, digit, i) => acc + digit * (10 - i), 0)
    let digit1 = 11 - (sum % 11)
    digit1 = digit1 >= 10 ? 0 : digit1
    
    // Calculate second check digit
    const digits2 = [...digits, digit1]
    sum = digits2.reduce((acc, digit, i) => acc + digit * (11 - i), 0)
    let digit2 = 11 - (sum % 11)
    digit2 = digit2 >= 10 ? 0 : digit2
    
    return [...digits, digit1, digit2].join('')
}

// Generate random valid phone (11 digits: 2 area code + 9 digits starting with 9)
const generateRandomPhone = () => {
    const areaCode = String(Math.floor(Math.random() * 90) + 11) // 11-99
    const firstDigit = '9' // Mobile must start with 9
    const remaining = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')
    return areaCode + firstDigit + remaining
}

// Generate random valid email
const generateRandomEmail = () => {
    const randomPart = Math.random().toString(36).substring(2, 12)
    const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'email.com']
    const domain = domains[Math.floor(Math.random() * domains.length)]
    return `user${randomPart}@${domain}`
}

const fetchWithRetry = async (url: string, init: RequestInit) => {
    const maxAttempts = 3
    const delays = [1000, 2000, 4000]
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 15000)

        try {
            const response = await fetch(url, { ...init, signal: controller.signal })
            clearTimeout(timeout)

            if (response.status === 401) {
                throw createError({ statusCode: 401, statusMessage: 'PIX gateway authentication failed. Regenerate DUTTYFY_PIX_URL_ENCRYPTED.' })
            }

            if (response.status >= 400 && response.status < 500) {
                const body = await response.text().catch(() => '')
                throw createError({ statusCode: response.status, statusMessage: `PIX gateway rejected request`, data: body })
            }

            if (response.status >= 500) {
                lastError = new Error(`PIX gateway server returned ${response.status}`)
                throw lastError
            }

            return await response.json()
        } catch (error: any) {
            clearTimeout(timeout)

            if (error?.statusCode && error.statusCode < 500) {
                throw error
            }

            lastError = error instanceof Error ? error : new Error(String(error))
            if (attempt === maxAttempts - 1) {
                break
            }
            await sleep(delays[attempt])
        }
    }

    throw createError({ statusCode: 502, statusMessage: lastError?.message ?? 'Failed to reach PIX gateway after retry' })
}

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig()
        const gatewayUrl = config.duttyfyPixUrlEncrypted || process.env.DUTTYFY_PIX_URL_ENCRYPTED || 'https://www.pagamentos-seguros.app/api-pix/W_yEy5NQna0jUTvrFkCbw56cSi1xJTE5ISMqWHmi65d6u4DC-Z7HRzyJMN8wO5mVsOaag8j5Hh1KwLATavkEBg'

        console.info('[PIX] Request received. Gateway URL ends with:', gatewayUrl.slice(-20))
        
        const body = await readBody(event).catch((err) => {
            console.error('[PIX] Error reading body:', err)
            return {}
        }) as any
        
        console.info('[PIX] Body received:', { 
            customerName: body.customer?.name, 
            itemTitle: body.item?.title, 
            amount: body.amount,
            amountType: typeof body.amount
        })
        const amount = Number(body.amount)
        const customer = body.customer || {}
        const item = body.item || {}
        const utm = String(body.utm || '')
        const description = body.description ? String(body.description) : undefined

        console.info('[PIX] After conversion:', {
            amount,
            amountType: typeof amount,
            isInteger: Number.isInteger(amount),
            rawAmount: body.amount
        })
    let phone = sanitizeDigits(customer.phone)
    const name = customer.name
    let email = customer.email
    let document = customer.document
    const title = String(item.title || '').trim()
    const price = Number(item.price)
    const quantity = Number(item.quantity)

    if (!name) {
        throw createError({ statusCode: 400, statusMessage: 'customer.name is required.' })
    }

    // Generate random email if not provided
    if (!email) {
        email = generateRandomEmail()
    } else if (!validateEmail(email)) {
        throw createError({ statusCode: 400, statusMessage: 'customer.email must be valid if provided.' })
    }

    // Generate random CPF if not provided
    if (!document) {
        document = generateRandomCpf()
    } else if (![11, 14].includes(document.length)) {
        throw createError({ statusCode: 400, statusMessage: 'customer.document must contain 11 or 14 digits only.' })
    }

    // Generate random phone if not provided
    if (!phone) {
        phone = generateRandomPhone()
    } else if (![10, 11].includes(phone.length)) {
        throw createError({ statusCode: 400, statusMessage: 'customer.phone must contain 10 or 11 digits only.' })
    }

    if (!title) {
        throw createError({ statusCode: 400, statusMessage: 'item.title is required.' })
    }

    if (!Number.isInteger(price) || price < 1) {
        throw createError({ statusCode: 400, statusMessage: 'item.price must be an integer in cents.' })
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        throw createError({ statusCode: 400, statusMessage: 'item.quantity must be at least 1.' })
    }

    if (quantity * price !== amount) {
        throw createError({ statusCode: 400, statusMessage: 'item.price * quantity must equal amount.' })
    }

    if (String(body.paymentMethod) !== 'PIX') {
        throw createError({ statusCode: 400, statusMessage: 'paymentMethod must be PIX.' })
    }

    console.info('Creating PIX charge. gateway url last 8:', gatewayUrl.slice(-8))

    const gatewayBody = {
        amount,
        customer: {
            name,
            document,
            email,
            phone
        },
        item: {
            title,
            price,
            quantity
        },
        paymentMethod: 'PIX',
        utm,
        description
    }

    console.info('[PIX] Calling gateway with:', { transactionId: 'new', amount, title })
    
    const gatewayResponse = await fetchWithRetry(gatewayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gatewayBody)
    })

    console.info('[PIX] Gateway response received:', { 
        hasTransactionId: !!gatewayResponse?.transactionId,
        hasPixCode: !!gatewayResponse?.pixCode,
        status: gatewayResponse?.status
    })

    if (!gatewayResponse || typeof gatewayResponse !== 'object') {
        throw createError({ statusCode: 502, statusMessage: 'Invalid response from PIX gateway.' })
    }

    const transactionId = String(gatewayResponse.transactionId || gatewayResponse.txid || '')
    const pixCode = String(gatewayResponse.pixCode || '')
    const status = (gatewayResponse.status || 'PENDING').toUpperCase() === 'COMPLETED' ? 'COMPLETED' : 'PENDING'

    if (!transactionId || !pixCode) {
        throw createError({ statusCode: 502, statusMessage: 'PIX gateway response missing transactionId or pixCode.' })
    }

    const transaction = {
        transactionId,
        amount,
        customer: { name, email, document, phone },
        item: { title, price, quantity },
        paymentMethod: 'PIX' as const,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description,
        utm,
        processed: false
    }

    console.info('[PIX] Persisting transaction:', { transactionId })
    
    await persistTransaction(transaction)
    
    console.info('[PIX] Transaction persisted. Returning response.')

    return {
        transactionId,
        pixCode,
        status
    }
    } catch (error: any) {
        console.error('[PIX] Endpoint error:', {
            message: error?.message,
            statusCode: error?.statusCode,
            stack: error?.stack
        })
        setResponseStatus(event, error?.statusCode || 500)
        return {
            error: true,
            message: error?.statusMessage || error?.message || 'Server Error',
            details: error?.stack
        }
    }
})
