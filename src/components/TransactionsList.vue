<script setup lang="ts">
import { CRYPTO_SYMBOLS } from '@/services/api'
import { formatPrice } from '@/helpers/formatPrice'
import type { Transaction } from '@/types/wallet'

import Panel from '~/components/Panel.vue'

defineProps<{
  transactions: Transaction[]
}>()

const TRANSACTIONS_COLORS = {
  buy: 'bg-green-500',
  sell: 'bg-red-500',
  exchange: 'bg-blue-500',
}
</script>

<template>
  <Panel>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Recent Transactions</h2>

    <div class="space-y-3">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <div
            :class="{
              [TRANSACTIONS_COLORS[transaction.type]]: true,
            }"
            class="h-3 w-3 rounded-full"
          />
          <div>
            <div class="font-medium text-gray-900 dark:text-gray-100">
              {{ transaction.type.toUpperCase() }}
              {{ transaction.fromCurrency ? `${CRYPTO_SYMBOLS[transaction.fromCurrency]} → ` : '' }}
              {{ CRYPTO_SYMBOLS[transaction.toCurrency] }}
            </div>
            <div class="text-sm text-gray-500">
              {{ transaction.timestamp.toLocaleString() }}
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-semibold text-gray-900 dark:text-gray-100">
            {{ transaction.amount.toFixed(6) }} {{ CRYPTO_SYMBOLS[transaction.toCurrency] }}
          </div>
          <div class="text-sm text-gray-500">Fee: ${{ formatPrice(transaction.fee) }}</div>
        </div>
      </div>
    </div>

    <div v-if="!transactions.length" class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">No transactions found</p>
    </div>
  </Panel>
</template>
