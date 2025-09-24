<script setup lang="ts">
import { CRYPTO_NAMES, CRYPTO_SYMBOLS } from '@/services/api/constants'
import { formatPrice } from '@/helpers/formatPrice'
import Panel from '@/components/Panel.vue'
import type { CurrencyResponse } from '@/services/api'

const { currencies } = defineProps<{
  currencies: CurrencyResponse
}>()
</script>

<template>
  <Panel>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Crypto Rates</h2>

    <div
      v-for="(currencyData, currencyId) in currencies"
      :key="currencyId"
      class="flex flex-row gap-2 justify-between items-center"
    >
      <div class="flex items-center gap-3">
        <span class="font-medium text-gray-900">
          {{ CRYPTO_NAMES[currencyId] }}
        </span>

        <span
          class="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded uppercase tracking-wide"
        >
          {{ CRYPTO_SYMBOLS[currencyId] }}
        </span>
      </div>

      <div class="flex flex-row gap-4 items-center">
        <div class="text-base font-semibold text-gray-900">
          ${{ formatPrice(currencyData.usd) }}
        </div>
      </div>
    </div>
  </Panel>
</template>
