import type { SUPPORTED_CRYPTO_IDS } from '@/services/api/constants'

export type SupportedCrypto = (typeof SUPPORTED_CRYPTO_IDS)[number]

export type WalletBalance = Record<SupportedCrypto, number>

export interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'exchange'
  fromCurrency?: SupportedCrypto
  toCurrency: SupportedCrypto
  amount: number
  rate: number
  fee: number
  total: number
  timestamp: Date
  status: 'pending' | 'completed' | 'failed'
}

export interface ExchangeParams {
  fromCurrency: SupportedCrypto
  toCurrency: SupportedCrypto
  amount: number
  rate: number
}

export interface BuySellParams {
  currency: SupportedCrypto
  amount: number
  rate: number
}

export interface WalletState {
  balances: WalletBalance
  transactions: Transaction[]
  isInitialized: boolean
}

export interface WalletMutationResult {
  success: boolean
  transaction?: Transaction
  error?: string
}
