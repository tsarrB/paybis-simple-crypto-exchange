<script setup lang="ts">
import { computed } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

const modelValue = defineModel<string>('modelValue', {
  default: '',
})

export type FormSelectOption =
  | string
  | {
      label: string
      value: string
    }

const { options } = defineProps<{
  options: FormSelectOption[]
}>()

const normalizedOptions = computed(() => {
  return options.map((option) => {
    if (typeof option === 'string') {
      return { label: option, value: option }
    }

    return option
  })
})
</script>

<template>
  <Select v-model="modelValue">
    <SelectTrigger class="w-full">
      <SelectValue placeholder="Select an item" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem v-for="option in normalizedOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
