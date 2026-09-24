<template>
  <div :class="cellClass">
    <template v-if="!highlightMode || hit">
      <div v-if="note.isNatural" class="note-natural">{{ note.natural }}</div>
      <template v-else>
        <div class="note-accidental">{{ note.sharp }}</div>
        <div class="note-accidental">{{ note.flat }}</div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  note: {
    semitone: number
    isNatural: boolean
    natural: string | null
    sharp: string | null
    flat: string | null
  }
  highlightMode?: boolean
  mode?: string | null
}>()

const { $isFifthsSemitoneNoteInMode } = useNuxtApp() as any
const hit = computed(() => (props.highlightMode ? $isFifthsSemitoneNoteInMode(props.note, props.mode) : false))
const cellClass = computed(() => ({
  'note-cell': true,
  'note-cell-natural': props.note.isNatural,
  'note-cell-highlight-mode': props.highlightMode,
  'note-cell-highlight-hit': props.highlightMode && hit.value,
  'note-cell-highlight-miss': props.highlightMode && !hit.value,
}))
</script>
