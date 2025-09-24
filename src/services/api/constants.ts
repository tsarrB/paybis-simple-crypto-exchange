import type { CurrencyResponse } from './types'

export const SUPPORTED_CRYPTO_IDS = ['bitcoin', 'ethereum', 'tether', 'solana'] as const

export const CRYPTO_SYMBOLS: Record<(typeof SUPPORTED_CRYPTO_IDS)[number], string> = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  tether: 'USDT',
  solana: 'SOL',
}

export const CRYPTO_NAMES: Record<(typeof SUPPORTED_CRYPTO_IDS)[number], string> = {
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
  tether: 'USD',
  solana: 'Solana',
}

export const GET_PRICES_MOCK: CurrencyResponse = {
  bitcoin: {
    usd: 113040,
  },
  ethereum: {
    usd: 4165.79,
  },
  solana: {
    usd: 211.99,
  },
  tether: {
    usd: 1,
  },
}
