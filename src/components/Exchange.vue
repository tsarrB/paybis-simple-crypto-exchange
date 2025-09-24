<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { SUPPORTED_CRYPTO_IDS, CRYPTO_NAMES } from '@/services/api/constants'
import type { CurrencyResponse } from '@/services/api'
import type { SupportedCrypto } from '@/types/wallet'

import Panel from '@/components/Panel.vue'
import { useUserWallet } from '@/composables/useUserWallet'
import ExchangeItem from '@/components/ExchangeItem.vue'
import { Button } from '@/components/ui/button'

const { prices } = defineProps<{
  prices: CurrencyResponse
}>()

const selectedCurrency = ref<SupportedCrypto>('bitcoin')
const selectedCurrencyAmount = ref<number>(0)

const selectedCurrencyTo = ref<SupportedCrypto>('tether')
const selectedCurrencyToAmount = ref<number>(0)

const { exchange, sell, buy, isTransacting } = useUserWallet({
  onTransactionSuccess: () => {
    selectedCurrencyAmount.value = 0
    selectedCurrencyToAmount.value = 0
  },
})

const supportedCryptoOptions = computed(() => {
  return SUPPORTED_CRYPTO_IDS.map((id) => ({ label: CRYPTO_NAMES[id], value: id }))
})

const reset = () => {
  selectedCurrencyAmount.value = 0
  selectedCurrencyToAmount.value = 0
}

const isBuying = computed(() => {
  return selectedCurrency.value === 'tether'
})

const isSelling = computed(() => {
  return selectedCurrencyTo.value === 'tether'
})

const isExchanging = computed(() => {
  return ![selectedCurrency.value, selectedCurrencyTo.value].includes('tether')
})

const buttonLabel = computed(() => {
  if (isExchanging.value) return 'Exchange'
  if (isSelling.value) return 'Sell'

  return 'Buy'
})

const isDisabled = computed(() => {
  return (
    isTransacting.value ||
    selectedCurrencyAmount.value <= 0 ||
    selectedCurrencyToAmount.value <= 0 ||
    selectedCurrency.value === selectedCurrencyTo.value
  )
})

const handleExchange = () => {
  if (isExchanging.value) {
    exchange({
      fromCurrency: selectedCurrency.value,
      toCurrency: selectedCurrencyTo.value,
      amount: selectedCurrencyAmount.value,
      rate: prices[selectedCurrency.value].usd / prices[selectedCurrencyTo.value].usd,
    })
  }

  if (isSelling.value) {
    sell({
      currency: selectedCurrency.value,
      amount: selectedCurrencyAmount.value,
      rate: prices[selectedCurrency.value].usd,
    })
  }

  if (isBuying.value) {
    buy({
      currency: selectedCurrencyTo.value,
      amount: selectedCurrencyToAmount.value,
      rate: prices[selectedCurrencyTo.value].usd,
    })
  }
}

watch(selectedCurrencyAmount, (newVal) => {
  selectedCurrencyToAmount.value =
    (newVal * prices[selectedCurrency.value].usd) / prices[selectedCurrencyTo.value].usd
})

watch(selectedCurrencyToAmount, (newVal) => {
  selectedCurrencyAmount.value =
    (newVal * prices[selectedCurrencyTo.value].usd) / prices[selectedCurrency.value].usd
})
</script>

<template>
  <Panel>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Exchange</h2>

    <div class="flex flex-col gap-4">
      <div class="flex gap-2">
        <ExchangeItem
          v-model:currency="selectedCurrency"
          v-model:amount="selectedCurrencyAmount"
          :prices="prices"
          :supportedCryptoOptions="supportedCryptoOptions"
          @update:currency="reset"
        />

        <ExchangeItem
          v-model:currency="selectedCurrencyTo"
          v-model:amount="selectedCurrencyToAmount"
          :prices="prices"
          :supportedCryptoOptions="supportedCryptoOptions"
          @update:currency="reset"
        />
      </div>

      <div class="flex gap-2">
        {{ selectedCurrencyAmount }} {{ selectedCurrency }} to {{ selectedCurrencyToAmount }}
        {{ selectedCurrencyTo }}
      </div>

      <Button @click="handleExchange" :disabled="isDisabled">
        {{ isTransacting ? 'Processing...' : buttonLabel }}
      </Button>
    </div>
  </Panel>
</template>
