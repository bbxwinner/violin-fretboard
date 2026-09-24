<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title>{{ t('help_title') }}</v-card-title>
          <v-card-text>
            <p class="mb-2">{{ feedback }}</p>
            <v-divider class="my-3" />
            <p v-html="donateHtml" />
            <v-divider class="my-3" />
            <h3 class="text-subtitle-1">{{ t('help_sentence_version_history') }}</h3>
            <ul class="pl-6">
              <li>{{ version_1 }}</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n()

const email = 'violin@chienwen.net'
const feedback = t('help_sentence_feedback', { email })
const donateHtml = computed(() => {
  const template = t('help_sentence_donate', { link: 'https://ko-fi.com/chienwen' })
  const md = template.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  return md.replace(/\n/g, '<br/>')
})
const version_1 = t('help_sentence_version_history_1', { date: '2024-10' })

useHead({ title: () => t('help_title') })
</script>