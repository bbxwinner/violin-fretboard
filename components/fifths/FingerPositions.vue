<template>
  <div class="fifths-finger-positions-host">
    <div class="fifths-finger-positions" :style="style">
      <div v-for="s in columns" :key="`column-${s.virtualIndex}`" class="string-column-highlight">
        <div class="string-notes-highlight">
          <div
            v-for="b in semitoneCount"
            :key="`${s.virtualIndex}-${b - 1}`"
            :class="['note-highlight-cell', { 'note-highlight-hit': isHit(s, b - 1) }]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  mode?: string
  semitoneCount?: number
}>()

const { $fifthsCircleModes, $getFifthsModePitchClasses } = useNuxtApp() as any
const store = useFifthStore()

const Xn = 52
const Kn = 10
const i = -6
const _ = 6
const Jn = 4
const Zn = 7
const zn = 11
const qn = 11
const f = Xn + Kn

const columns = computed(() => {
  const a = Jn + 6 * 2
  return Array.from({ length: a }, (r, s) => {
    const b = s - 6
    const C = (Zn + b * 7 + 1200) % 12
    return { virtualIndex: s, rootPitchClass: C }
  })
})
const cIndex = computed(() => {
  const a = $fifthsCircleModes.indexOf('C')
  return a >= 0 ? a : 0
})
const circleLength = computed(() => $fifthsCircleModes.length || 12)
const offset = ref(0)

function pick(a: number, r: number): number {
  const s = Array.from({ length: 9 }, (d, M) => a + (M - 4) * circleLength.value)
  const b = s.filter((d) => d >= i && d <= _)
  const C = b.length ? b : s
  C.sort((d, M) => {
    const A = Math.abs(d - r)
    const T = Math.abs(M - r)
    return A !== T ? A - T : Math.abs(d) - Math.abs(M)
  })
  const O = C[0]
  return O < i ? i : O > _ ? _ : O
}

watch(
  [() => props.mode, cIndex, circleLength],
  () => {
    const a = $fifthsCircleModes.indexOf(props.mode)
    if (a < 0) return
    const r = a - cIndex.value
    offset.value = pick(r, offset.value)
  },
  { immediate: true },
)

const cMajorPitchClasses = computed(() => new Set($getFifthsModePitchClasses('C')))
const style = computed(() => {
  const a = (-6 + offset.value) * f
  return {
    left: `${zn + a}px`,
    top: `${qn}px`,
    transition: `left ${store.fingerOverlayTransitionMs}ms ease`,
  }
})

function isHit(s: { rootPitchClass: number }, r: number): boolean {
  const pc = (s.rootPitchClass + r) % 12
  return cMajorPitchClasses.value.has(pc)
}
</script>
