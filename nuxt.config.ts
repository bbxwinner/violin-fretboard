import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: true,

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
  ],

  build: {
    transpile: ['vuetify'],
  },

  components: [
    { path: '~/components', prefix: true },
    { path: '~/components/board', prefix: false },
  ],

  vite: {
    plugins: [vuetify({ autoImport: true })],
    ssr: { noExternal: ['vuetify'] },
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    'nuxt-gtag',
    '@nuxtjs/sitemap',
  ],

  gtag: {
    id: 'G-6GXQ7HEFZN',
  },

  i18n: {
    strategy: 'prefix',
    defaultLocale: 'en',
    baseUrl: process.env.NUXT_SITE_URL || 'https://bbxwinner.github.io',
    langDir: 'locales',
    locales: [
      { code: 'ar', name: 'العربية', language: 'ar', file: 'ar.json' },
      { code: 'bg', name: 'Български', language: 'bg', file: 'bg.json' },
      { code: 'ca', name: 'Català', language: 'ca', file: 'ca.json' },
      { code: 'cs', name: 'Čeština', language: 'cs', file: 'cs.json' },
      { code: 'da', name: 'Dansk', language: 'da', file: 'da.json' },
      { code: 'de', name: 'Deutsch', language: 'de', file: 'de.json' },
      { code: 'el', name: 'Ελληνικά', language: 'el', file: 'el.json' },
      { code: 'en', name: 'English', language: 'en', file: 'en.json' },
      { code: 'es', name: 'Español', language: 'es', file: 'es.json' },
      { code: 'et', name: 'Eesti', language: 'et', file: 'et.json' },
      { code: 'fi', name: 'Suomi', language: 'fi', file: 'fi.json' },
      { code: 'fr', name: 'Français', language: 'fr', file: 'fr.json' },
      { code: 'he', name: 'עברית', language: 'he', file: 'he.json' },
      { code: 'hi', name: 'हिन्दी', language: 'hi', file: 'hi.json' },
      { code: 'hr', name: 'Hrvatski', language: 'hr', file: 'hr.json' },
      { code: 'hu', name: 'Magyar', language: 'hu', file: 'hu.json' },
      { code: 'id', name: 'Bahasa Indonesia', language: 'id', file: 'id.json' },
      { code: 'is', name: 'Íslenska', language: 'is', file: 'is.json' },
      { code: 'it', name: 'Italiano', language: 'it', file: 'it.json' },
      { code: 'ja', name: '日本語', language: 'ja', file: 'ja.json' },
      { code: 'ko', name: '한국어', language: 'ko', file: 'ko.json' },
      { code: 'lt', name: 'Lietuvių', language: 'lt', file: 'lt.json' },
      { code: 'lv', name: 'Latviešu', language: 'lv', file: 'lv.json' },
      { code: 'ms', name: 'Bahasa Melayu', language: 'ms', file: 'ms.json' },
      { code: 'nl', name: 'Nederlands', language: 'nl', file: 'nl.json' },
      { code: 'no', name: 'Norsk', language: 'no', file: 'no.json' },
      { code: 'pl', name: 'Polski', language: 'pl', file: 'pl.json' },
      { code: 'pt', name: 'Português', language: 'pt', file: 'pt.json' },
      { code: 'ro', name: 'Română', language: 'ro', file: 'ro.json' },
      { code: 'ru', name: 'Русский', language: 'ru', file: 'ru.json' },
      { code: 'sk', name: 'Slovenčina', language: 'sk', file: 'sk.json' },
      { code: 'sl', name: 'Slovenščina', language: 'sl', file: 'sl.json' },
      { code: 'sr', name: 'Српски', language: 'sr', file: 'sr.json' },
      { code: 'sv', name: 'Svenska', language: 'sv', file: 'sv.json' },
      { code: 'th', name: 'ไทย', language: 'th', file: 'th.json' },
      { code: 'tl', name: 'Tagalog', language: 'tl', file: 'tl.json' },
      { code: 'tr', name: 'Türkçe', language: 'tr', file: 'tr.json' },
      { code: 'uk', name: 'Українська', language: 'uk', file: 'uk.json' },
      { code: 'vi', name: 'Tiếng Việt', language: 'vi', file: 'vi.json' },
      { code: 'zh-cn', name: '简体中文', language: 'zh-cn', file: 'zh-cn.json' },
      { code: 'zh-tw', name: '繁體中文', language: 'zh-tw', file: 'zh-tw.json' },
    ],
    lazy: true,
  },

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/violin-fretboard/',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Violin Tools',
      titleTemplate: '%s | Violin Tools',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
      ],
    },
  },

  sitemap: {
    siteUrl: process.env.NUXT_SITE_URL || 'https://bbxwinner.github.io',
  },

  site: {
    url: process.env.NUXT_SITE_URL || 'https://bbxwinner.github.io',
  },
})