<template>
  <v-list>
    <v-list-subheader>{{ title }}</v-list-subheader>
    <v-list-item v-for="(track, i) in tracks" :key="i">
      <template #prepend>
        <v-icon icon="mdi-music" class="mr-2" />
      </template>
      <v-list-item-title>Track {{ track.index === undefined ? i + 1 : track.index + 1 }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ track.keySignatureName || 'C' }} | {{ track.notesCount }} notes | {{ track.keySignatureName ? '' : '' }}
      </v-list-item-subtitle>
      <template #append>
        <span class="text-caption">{{ formatDuration(track.totalMs) }}</span>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
  url?: string
  tracks: Array<{
    index?: number
    name?: string
    keySignatureName?: string
    notesCount?: number
    totalMs?: number
  }>
}>()

const title = computed(() => props.title || 'Melody')

function formatDuration(ms?: number) {
  if (!ms) return '0:00'
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}
</script>