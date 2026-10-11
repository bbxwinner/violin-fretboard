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
const props = withDefaults(
  defineProps<{
    type: string
    semitoneCount?: number
    highlightMode?: boolean
    mode?: string | null
  }>(),
  {
    semitoneCount: 30,
    highlightMode: false,
    mode: null,
  },
)
const { $getFifthsStringSemitoneNotes } = useNuxtApp() as any
const notes = computed(() => $getFifthsStringSemitoneNotes(String(props.type || '').trim().toUpperCase(), props.semitoneCount))
</script>

<style scoped>
.string-column,
.string-notes {
  display: flex;
  flex-direction: column;
}

.string-column {
  align-items: center;
}

.string-notes {
  gap: 6px;
}
</style>
