import type { App } from 'vue'
import { ofetch } from 'ofetch'

import { factory } from '~/services/api'

const apiPlugin = {
  install: (app: App) => {
    const API_URL = import.meta.env.VITE_API_URL

    const fetcher = ofetch.create({
      baseURL: API_URL,
    })

    const api = factory(fetcher)

    app.config.globalProperties.$api = api
    app.provide('api', api)
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: ReturnType<typeof factory>
  }
}

export default apiPlugin
