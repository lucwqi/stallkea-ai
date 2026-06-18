import { getTransaction, updateTransactionStatus } from './transaction-store'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const transactionId = String(query.transactionId || query.txid || '')

    if (!transactionId) {
        throw createError({ statusCode: 400, statusMessage: 'transactionId is required' })
    }

    const existing = await getTransaction(transactionId).catch(() => null)

    const gatewayUrl = process.env.DUTTYFY_PIX_URL_ENCRYPTED || 'https://www.pagamentos-seguros.app/api-pix/W_yEy5NQna0jUTvrFkCbw56cSi1xJTE5ISMqWHmi65d6u4DC-Z7HRzyJMN8wO5mVsOaag8j5Hh1KwLATavkEBg'

    const statusUrl = `${gatewayUrl}?transactionId=${encodeURIComponent(transactionId)}`

    try {
        const response = await $fetch(statusUrl, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            timeout: 10000
        }) as any

        const status = (response.status || 'PENDING').toUpperCase()
        const paidAt = response.paidAt ? String(response.paidAt) : undefined

        const normalizedStatus = status === 'COMPLETED' ? 'COMPLETED' : 'PENDING'
        await updateTransactionStatus(transactionId, normalizedStatus, paidAt)

        return { status: normalizedStatus, ...(paidAt && { paidAt }) }
    } catch (error: any) {
        if (error?.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
            throw error
        }

        return { status: existing?.status || 'PENDING' }
    }
})
