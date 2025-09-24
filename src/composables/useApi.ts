import type { factory } from '~/services/api'
import { inject } from 'vue'

export const useApi = () => {
  const api = inject<ReturnType<typeof factory>>('api')

  if (!api) {
    throw new Error('Api not found')
  }

  return api
}
