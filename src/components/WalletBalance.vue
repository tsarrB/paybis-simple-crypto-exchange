<script setup lang="ts">
import { CRYPTO_NAMES } from '@/services/api/constants'
import { useUserWallet } from '@/composables/useUserWallet'
import Panel from '@/components/Panel.vue'

const { balances } = useUserWallet()
</script>

<template>
  <Panel>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Wallet Balances</h2>

    <div class="flex flex-col gap-1">
      <div
        v-for="(balance, currencyId) in balances"
        :key="currencyId"
        class="flex flex-row gap-1 items-center"
      >
        <span class="text-base font-medium text-gray-900">{{ CRYPTO_NAMES[currencyId] }}: </span>
        <span class="text-base font-medium text-gray-900">{{ balance }}</span>
      </div>
    </div>
  </Panel>
</template>
