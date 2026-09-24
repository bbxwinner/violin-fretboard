<template>
  <div class="string-column">
    <div class="string-notes">
      <fifths-board-string-note
        v-for="m in notes"
        :key="`${type}-${m.semitone}`"
        :note="m"
        :highlight-mode="highlightMode"
        :mode="mode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: string
  semitoneCount?: number
  highlightMode?: boolean
  mode?: string | null
}>()
const { $getFifthsStringSemitoneNotes } = useNuxtApp() as any
const notes = computed(() => $getFifthsStringSemitoneNotes(String(props.type || '').trim().toUpperCase(), props.semitoneCount))
</script>
