<template>
  <div class="fifths-hand-position-overlay">
    <div v-for="S in boxes" :key="`position-${S.position}`" class="position-box" :style="S.style">
      <div class="position-label" :style="{ color: S.color }">{{ t(S.labelKey) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  semitoneCount?: number
}>()

const store = useFifthStore()

const no = 52
const oo = 10
const te = 52
const so = 6
const io = 11
const ao = 11
const Pe = 4

const o = [
  { position: 1, labelKey: 'fifths_pref_hand_position_first', leftOffset: 0, color: '#ef4444' },
  { position: 2, labelKey: 'fifths_pref_hand_position_second', leftOffset: 0, color: '#f97316' },
  { position: 3, labelKey: 'fifths_pref_hand_position_third', leftOffset: 2, color: '#22c55e' },
  { position: 4, labelKey: 'fifths_pref_hand_position_fourth', leftOffset: 0, color: '#06b6d4' },
  { position: 5, labelKey: 'fifths_pref_hand_position_fifth', leftOffset: 0, color: '#3b82f6' },
  { position: 6, labelKey: 'fifths_pref_hand_position_sixth', leftOffset: 0, color: '#8b5cf6' },
  { position: 7, labelKey: 'fifths_pref_hand_position_seventh', leftOffset: 0, color: '#ec4899' },
]

const width = computed(() => Pe * no + (Pe - 1) * oo)
function top(m: number): number {
  return ao + m * (te + so)
}
function bottom(m: number): number {
  return top(m) + te
}

const boxes = computed(() => {
  const m = Math.max((props.semitoneCount ?? 30) - 1, 0)
  return o
    .filter((g) => store.isHandPositionVisible(g.position))
    .map((g) => {
      const S = store.getHandPositionRange(g.position)
      const V = Math.min(S.startRow, m)
      const P = Math.min(Math.max(S.endRow, V), m)
      const y = top(V)
      const v = bottom(P)
      return {
        position: g.position,
        labelKey: g.labelKey,
        color: g.color,
        style: {
          left: `${io + g.leftOffset}px`,
          top: `${y}px`,
          width: `${width.value}px`,
          height: `${Math.max(v - y, te)}px`,
          borderColor: g.color,
        },
      }
    })
})
</script>
