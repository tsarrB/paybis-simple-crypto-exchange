<script setup lang="ts">
import { computed } from 'vue'
import { useUserWallet } from '@/composables/useUserWallet'
import { formatPrice } from '@/helpers/formatPrice'
import FormSelect from '@/components/FormSelect.vue'
import type { SupportedCrypto } from '@/types/wallet'
import type { CurrencyResponse } from '@/services/api'
import type { FormSelectOption } from '@/components/FormSelect.vue'
import { Input } from '@/components/ui/input'

const { getBalance } = useUserWallet()

const { prices, supportedCryptoOptions } = defineProps<{
  prices: CurrencyResponse
  supportedCryptoOptions: FormSelectOption[]
}>()

const currency = defineModel<SupportedCrypto>('currency', {
  required: true,
})

const amount = defineModel<number>('amount', {
  required: true,
})

const maxAmount = computed(() => {
  return getBalance(currency.value)
})
</script>

<template>
  <div class="flex-1 flex flex-col gap-2">
    <div>Amount: {{ getBalance(currency).toFixed(6) }}</div>
    <div>Dollar value: ${{ formatPrice(getBalance(currency) * prices[currency].usd) }}</div>
    <div>Rate: {{ prices[currency].usd.toFixed(6) }}</div>
    <FormSelect v-model="currency" :options="supportedCryptoOptions" />

    <!-- TODO: Add max amount validation -->
    <Input
      :model-value="amount"
      @update:model-value="amount = Number($event)"
      type="number"
      :min="0"
      :max="maxAmount"
    />
  </div>
</template>
