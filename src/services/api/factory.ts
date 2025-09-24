import { type $Fetch } from 'ofetch'

import { type CurrencyResponse } from './types'
import { GET_PRICES_MOCK } from './constants'

const CACHE_STORAGE: Record<string, any> = {}

export const factory = (api: $Fetch) => {
  return {
    currency: {
      getByIds: async (ids: string[], vsCurrencies: string[]): Promise<CurrencyResponse> => {
        try {
          const response = await api(
            `/simple/price?ids=${ids.join(',')}&vs_currencies=${vsCurrencies.join(',')}`,
          )

          CACHE_STORAGE[`${ids.join(',')}_${vsCurrencies.join(',')}`] = response

          return response
        } catch (error) {
          console.error(error)
          const cachedResponse = CACHE_STORAGE[`${ids.join(',')}_${vsCurrencies.join(',')}`]

          return cachedResponse || GET_PRICES_MOCK
        }
      },
    },
  }
}
