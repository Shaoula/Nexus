import { pwa } from './app/config/pwa'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    '@nuxthub/core',
    'nuxt-resend'
  ],

  runtimeConfig: {
    public: {
      auth: {
        redirectUserTo: '/auth/login',
        redirectGuestTo: '/auth/login',
      },
    },
    auth: {
      secret: process.env.BETTER_AUTH_SECRET,
    },
    resend: {
      apiKey: process.env.NUXT_RESEND_API_KEY,
    },
  },

  // $production: {
  //   resend: {
  //     apiKey: process.env.NUXT_RESEND_API_KEY,
  //   },
  // },

  css: ['~/assets/css/main.css'],

  hub: {
    workers: true,
    analytics: true,
    blob: true,
    cache: true,
    database: true,
    kv: true,
  },

  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.json',
        name: 'English',
      },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'nexus-lang',
      redirectOn: 'root',
    },
  },

  pwa,
})