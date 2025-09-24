import { computed } from 'vue'
import { toast } from 'vue-sonner'
import { useLocalStorage } from '@vueuse/core'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

import type {
  WalletBalance,
  Transaction,
  ExchangeParams,
  BuySellParams,
  SupportedCrypto,
} from '@/types/wallet'

import { delay } from '~/utils/delay'

const GLOBAL_FEE = 0.01
const DEFAULT_BALANCES = {
  bitcoin: 3,
  ethereum: 5.324,
  tether: 100000,
  solana: 41,
}

// TODO: make as store
export const useUserWallet = (params: { onTransactionSuccess?: () => void } = {}) => {
  // Emulate profile balances
  const balances = useLocalStorage<WalletBalance>('crypto-wallet-balances', {
    ...DEFAULT_BALANCES,
  })

  // Emulate user transaction history
  const transactions = useLocalStorage<Transaction[]>('crypto-transaction-history', [])

  const queryClient = useQueryClient()

  const recentTransactions = computed(() => {
    return transactions.value
      .slice()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
  })

  // Transaction mutations
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }

    transactions.value.unshift(newTransaction)
    return newTransaction
  }

  const updateBalance = (currency: SupportedCrypto, amount: number) => {
    if (balances.value[currency] === undefined) {
      balances.value[currency] = 0
    }

    balances.value[currency] += amount
  }

  const buyMutation = useMutation({
    mutationFn: async (params: BuySellParams) => {
      // Simulate API call delay
      await delay(1000)

      const { currency, amount, rate } = params
      const fee = amount * rate * GLOBAL_FEE
      const total = amount * rate + fee

      // Check if user has enough USDT
      if (balances.value.tether < total) {
        toast.error('Insufficient USDT balance')
        throw new Error('Insufficient USDT balance')
      }

      return { currency, amount, rate, fee, total }
    },
    onSuccess: (data) => {
      const { currency, amount, rate, fee, total } = data

      updateBalance(currency, amount)
      updateBalance('tether', -total)

      addTransaction({
        type: 'buy',
        toCurrency: currency,
        amount,
        rate,
        fee,
        total,
        status: 'completed',
      })

      toast.success(`Bought ${currency} for $${total}`)

      params.onTransactionSuccess?.()

      queryClient.invalidateQueries({ queryKey: ['currency'] })
    },
    onError: (error) => {
      console.error('Buy transaction failed:', error)
    },
  })

  const sellMutation = useMutation({
    mutationFn: async (params: BuySellParams) => {
      await delay(1000)

      const { currency, amount, rate } = params
      const fee = amount * rate * GLOBAL_FEE
      const total = amount * rate - fee

      // Check if user has enough of the currency
      if (balances.value[currency] < amount) {
        toast.error(`Insufficient ${currency} balance`)
        throw new Error(`Insufficient ${currency} balance`)
      }

      return { currency, amount, rate, fee, total }
    },
    onSuccess: (data) => {
      const { currency, amount, rate, fee, total } = data

      updateBalance(currency, -amount)
      updateBalance('tether', total)

      addTransaction({
        type: 'sell',
        fromCurrency: currency,
        toCurrency: 'tether',
        amount,
        rate,
        fee,
        total,
        status: 'completed',
      })

      queryClient.invalidateQueries({ queryKey: ['currency'] })

      toast.success(`Sold ${currency} for $${total}`)

      params.onTransactionSuccess?.()
    },
    onError: (error) => {
      console.error('Sell transaction failed:', error)
    },
  })

  const exchangeMutation = useMutation({
    mutationFn: async (params: ExchangeParams) => {
      // Simulate API call delay
      await delay(1000)

      const { fromCurrency, toCurrency, amount, rate } = params
      const fee = amount * GLOBAL_FEE
      const receiveAmount = (amount - fee) * rate

      if (balances.value[fromCurrency] < amount) {
        toast.error(`Insufficient ${fromCurrency} balance`)
        throw new Error(`Insufficient ${fromCurrency} balance`)
      }

      return { fromCurrency, toCurrency, amount, rate, fee, receiveAmount }
    },
    onSuccess: (data) => {
      const { fromCurrency, toCurrency, amount, rate, fee, receiveAmount } = data

      updateBalance(fromCurrency, -amount)
      updateBalance(toCurrency, receiveAmount)

      addTransaction({
        type: 'exchange',
        fromCurrency,
        toCurrency,
        amount: receiveAmount,
        rate,
        fee,
        total: amount,
        status: 'completed',
      })

      queryClient.invalidateQueries({ queryKey: ['currency'] })

      toast.success(`Exchanged ${fromCurrency} for $${receiveAmount}`)

      params.onTransactionSuccess?.()
    },
    onError: (error) => {
      console.error('Exchange transaction failed:', error)
    },
  })

  const canAfford = (currency: SupportedCrypto, amount: number): boolean => {
    return getBalance(currency) >= amount
  }

  const getBalance = (currency: SupportedCrypto): number => {
    return balances.value[currency] || 0
  }

  const resetWallet = () => {
    balances.value = DEFAULT_BALANCES

    transactions.value = []
  }

  return {
    balances: computed(() => balances.value),
    transactions: computed(() => transactions.value),
    recentTransactions,

    getBalance,
    canAfford,

    buyMutation,
    sellMutation,
    exchangeMutation,
    resetWallet,

    isBuying: computed(() => buyMutation.isPending.value),
    isSelling: computed(() => sellMutation.isPending.value),
    isExchanging: computed(() => exchangeMutation.isPending.value),
    isTransacting: computed(
      () =>
        buyMutation.isPending.value ||
        sellMutation.isPending.value ||
        exchangeMutation.isPending.value,
    ),

    buy: buyMutation.mutate,
    sell: sellMutation.mutate,
    exchange: exchangeMutation.mutate,
  }
}
