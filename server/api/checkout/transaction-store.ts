import { promises as fs } from 'node:fs'
import { join } from 'node:path'

export type PixTransaction = {
  transactionId: string
  amount: number
  customer: {
    name: string
    email: string
    document: string
    phone: string
  }
  item: {
    title: string
    price: number
    quantity: number
  }
  paymentMethod: 'PIX'
  status: string
  createdAt: string
  updatedAt: string
  paidAt?: string
  description?: string
  utm?: string
  processed?: boolean
}

const DATA_DIR = join(process.cwd(), '.data')
const DB_PATH = join(DATA_DIR, 'pix-transactions.json')

const ensureDbFile = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true })
  const exists = await fs
    .stat(DB_PATH)
    .then(() => true)
    .catch(() => false)

  if (!exists) {
    await fs.writeFile(DB_PATH, '[]', 'utf-8')
  }
}

export const readTransactions = async (): Promise<PixTransaction[]> => {
  await ensureDbFile()
  const content = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(content || '[]') as PixTransaction[]
}

export const writeTransactions = async (transactions: PixTransaction[]) => {
  await ensureDbFile()
  await fs.writeFile(DB_PATH, JSON.stringify(transactions, null, 2), 'utf-8')
}

export const getTransaction = async (transactionId: string) => {
  const transactions = await readTransactions()
  return transactions.find((tx) => tx.transactionId === transactionId)
}

export const persistTransaction = async (transaction: PixTransaction) => {
  const transactions = await readTransactions()
  transactions.push(transaction)
  await writeTransactions(transactions)
  return transaction
}

export const updateTransactionStatus = async (
  transactionId: string,
  status: string,
  paidAt?: string
) => {
  const transactions = await readTransactions()
  const transaction = transactions.find((tx) => tx.transactionId === transactionId)
  if (!transaction) {
    return null
  }

  transaction.status = status
  transaction.updatedAt = new Date().toISOString()
  if (paidAt) {
    transaction.paidAt = paidAt
  }

  await writeTransactions(transactions)
  return transaction
}
