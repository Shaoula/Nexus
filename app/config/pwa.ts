import type { ModuleOptions } from '@vite-pwa/nuxt'
import process from 'node:process'
import { appDescription, appName } from '../constants/index'

const scope = '/'

export const pwa: ModuleOptions = {
  registerType: 'autoUpdate',
  scope,
  base: scope,
  manifest: {
    id: scope,
    scope,
    start_url: scope,
    display: 'standalone',
    background_color: '#ffffff',
    lang: 'tr',
    orientation: 'portrait',
    shortcuts: [
      {
        name: 'Randevu Ekle',
        url: '/bookings/new',
        icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Randevu Listesi',
        url: '/bookings',
        icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Müşteri Listesi',
        url: '/clients',
        icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Hizmet Listesi',
        url: '/services',
        icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
    name: appName,
    short_name: appName,
    description: appDescription,
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'maskable-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,txt,png,ico,svg}'],
    navigateFallbackDenylist: [/^\/api\//, /^\/auth\//, /^\/api\/auth\//],
    navigateFallback: '/',
    cleanupOutdatedCaches: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts.googleapis.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts.gstatic.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gstatic-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /^\/api\/.*/i,
        handler: 'NetworkOnly',
      },
      {
        urlPattern: /^\/api\/auth\/.*/i,
        handler: 'NetworkOnly',
      },
      {
        urlPattern: /^\/auth\/.*/i,
        handler: 'NetworkOnly',
      },
    ],
  },
  registerWebManifestInRouteRules: true,
  writePlugin: true,
  devOptions: {
    enabled: process.env.VITE_PLUGIN_PWA === 'true',
    navigateFallback: scope,
  },
}
