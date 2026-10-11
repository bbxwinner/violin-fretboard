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

<style scoped>
.note-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 6px;
  background: #fff;
  line-height: 1;
  user-select: none;
}

.note-cell-natural {
  background: #f9fafb;
  font-weight: 700;
}

.note-natural {
  font-size: 1.1rem;
}

.note-accidental {
  font-size: 0.72rem;
  font-weight: 600;
}

.note-cell-highlight-mode {
  border: 4px solid transparent;
  background: transparent;
}

.note-cell-highlight-hit {
  border-color: #1e40af;
  background: #facc1559;
}

.note-cell-highlight-miss {
  border-color: transparent;
  background: transparent;
  color: transparent;
}
</style>
