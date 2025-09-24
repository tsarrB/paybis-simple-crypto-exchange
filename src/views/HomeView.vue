<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

import TransactionsList from '~/components/TransactionsList.vue'
import { useApi } from '~/composables/useApi'
import { SUPPORTED_CRYPTO_IDS } from '@/services/api'
import { useUserWallet } from '@/composables/useUserWallet'
import Exchange from '@/components/Exchange.vue'
import WalletBalance from '@/components/WalletBalance.vue'
import CryptoRates from '@/components/CryptoRates.vue'

const api = useApi()
const { transactions } = useUserWallet()

const { data, isLoading } = useQuery({
  queryKey: ['currency'],
  queryFn: () => api.currency.getByIds(Array.from(SUPPORTED_CRYPTO_IDS), ['usd']),
  refetchOnWindowFocus: true,
  refetchInterval: 3000,
})
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Crypto Exchange</h1>
      <p class="text-gray-600">Live cryptocurrency prices</p>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      <p class="text-gray-600 mt-2">Loading prices...</p>
    </div>

    <div v-else class="flex flex-col gap-4">
      <WalletBalance />

      <CryptoRates v-if="data" :currencies="data" />

      <Exchange v-if="data" :prices="data" />

      <TransactionsList :transactions="transactions" />
    </div>
  </main>
</template>
