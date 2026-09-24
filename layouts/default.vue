<template>
  <v-app>
    <v-app-bar elevation="2">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer">
        <NuxtLink to="/" class="no-style-link" @click="ga('title')">
          {{ t(appBarTitleKey) }}
        </NuxtLink>
      </v-app-bar-nav-icon>
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" @click="ga('language_menu')">
            <v-icon icon="mdi-translate" />
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="i in localeList" :key="i.code" @click="selectLocale(i.code)">
            <template #prepend>
              <v-icon icon="mdi-check" :style="{ visibility: i.code === locale ? 'visible' : 'hidden' }" />
            </template>
            <v-list-item-title>
              <span class="language_code">{{ i.code.substring(0, 2) }}</span><span class="language_name">{{ i.name }}</span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :location="isMobile ? 'bottom' : undefined" temporary>
      <v-list>
        <v-list-item v-for="item in paths" :key="item.textTransKey">
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>
          <v-list-item-title>
            <NuxtLink class="no-style-link" :to="item.path" @click="drawerTo(item.textTransKey)">
              {{ t(item.textTransKey) }}
            </NuxtLink>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <NuxtPage />
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { t, locales, locale, setLocale } = useI18n()
const { $sendGAClickNavigationEvent: ga } = useNuxtApp() as any
const route = useRoute()
const { mobile: isMobile } = useDisplay()

const appBarTitleKey = computed(() => (route.meta.appBarTitleKey as string) || 'app_name')
const seoTitleKey = computed(() => (route.meta.seoTitleKey as string) || 'app_name')
const seoDescriptionKey = computed(() => (route.meta.seoDescriptionKey as string) || 'app_description')

const i18nHead = useLocaleHead({ seo: true })
useHead({
  title: () => t(seoTitleKey.value),
  htmlAttrs: { lang: () => locale.value },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
})
useSeoMeta({
  title: () => t(seoTitleKey.value),
  description: () => t(seoDescriptionKey.value),
  ogTitle: () => t(seoTitleKey.value),
  ogDescription: () => t(seoDescriptionKey.value),
})

const localeList = computed(() => (locales.value || []).filter((i) => typeof i === 'object'))
const localePath = useLocalePath()
const drawer = ref(false)

const paths = computed(() => [
  { textTransKey: 'layout_nav_index', icon: 'mdi-home-circle', path: localePath('index') },
  { textTransKey: 'layout_nav_board', icon: 'mdi-violin', path: localePath('board') },
  { textTransKey: 'layout_nav_fifths', icon: 'mdi-circle-slice-8', path: localePath('fifths') },
  { textTransKey: 'layout_nav_help', icon: 'mdi-information-outline', path: localePath('help') },
])

watch(drawer, (w) => ga('drawer_' + w))

function selectLocale(code: string) {
  setLocale(code)
  ga('language_set_' + code)
}
function drawerTo(key: string) {
  ga('drawer_to_' + key)
  drawer.value = false
}
</script>

<style>
.no-style-link {
  color: inherit;
  text-decoration: none;
}
.language_code {
  color: #999;
  font-size: 70%;
  margin-right: 4px;
}
</style>
