import type { SUPPORTED_CRYPTO_IDS } from './constants'

export type CurrencyResponse = Record<(typeof SUPPORTED_CRYPTO_IDS)[number], Record<string, number>>
