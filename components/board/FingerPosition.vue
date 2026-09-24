<template>
  <div>
    <div
      v-if="store.preference.tuningJustIntonation && strPitch !== 'A'"
      class="finger-position"
      :style="standardStyle"
    >
      <div class="finger-position-content">
        <div class="finger-position-circle finger-position-circle-standard" :style="opacityStyle" />
      </div>
    </div>
    <div class="finger-position" :style="style">
      <div class="finger-position-content">
        <div v-if="store.hasDisplayOption(3)" class="finger-position-octave-highlight" :style="octaveHighlight">
          <span v-if="nthSemitone > 0" class="finger-position-octave-highlight-text">{{ pos.octave }}</span>
        </div>
        <div :class="circleClass" :style="opacityStyle" @click="select">
          <div v-if="store.hasDisplayOption(0)">{{ $getDisplayPitch(pos.pitch) }}</div>
          <div v-if="pos.altPitch && store.hasDisplayOption(0)">{{ $getDisplayPitch(pos.altPitch) }}</div>
          <div v-if="store.hasDisplayOption(1)">{{ $getDisplaySolfege(pos.pitch) }}</div>
          <div v-if="pos.altPitch && store.hasDisplayOption(1)">{{ $getDisplaySolfege(pos.altPitch) }}</div>
          <div v-if="store.hasDisplayOption(2)">{{ Math.round(pos.freq) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  nthSemitone: number
  strThickness: number
  strPitch: string
  strFreq: number
  strFreqJustIntonation: number
  strOctave: number
}>()

const store = useBoardStore()
const { $getPositionOnString, $getDisplayPitch, $getDisplaySolfege, $isNoteHiddenInCurrentMode } =
  useNuxtApp() as any

const justFreq = computed(() => (store.preference.tuningJustIntonation ? props.strFreqJustIntonation : null))

const pos = computed(() =>
  $getPositionOnString(props.nthSemitone, props.strPitch, props.strFreq, props.strOctave, justFreq.value),
)

const offset = computed(() => props.strThickness / 2)
const style = computed(() => ({
  top: `calc(100% - ${pos.value.position.percentage}%)`,
  transform: `translate(calc(-50% + -${offset.value}px), -50%)`,
}))
const standardStyle = computed(() => ({
  top: `calc(100% - ${pos.value.standardPosition.percentage}%)`,
  transform: `translate(calc(-50% + -${offset.value}px), -50%)`,
}))
const opacityStyle = computed(() => ({
  opacity: $isNoteHiddenInCurrentMode(pos.value.pitch, pos.value.altPitch, store.preference.modeMajor) ? 0.2 : 1,
}))
const isActive = computed(
  () =>
    store.currentNote &&
    store.currentNote.pitch === pos.value.pitch &&
    store.currentNote.octave === pos.value.octave,
)
const isArpeggioNote = computed(() => {
  if (!store.hasDisplayOption(7)) return false
  const p = store.currentArpeggioPitches
  if (!p || !p.length) return false
  return p.includes(pos.value.pitch) || !!(pos.value.altPitch && p.includes(pos.value.altPitch))
})
const octaveHighlight = computed(() => {
  const prev =
    props.nthSemitone > 0
      ? $getPositionOnString(props.nthSemitone - 1, props.strPitch, props.strFreq, props.strOctave, justFreq.value)
      : null
  const N =
    (prev ? prev.position.percentage - pos.value.position.percentage : 0) * store.preference.stringLength / 100
  const next = $getPositionOnString(
    props.nthSemitone + 1,
    props.strPitch,
    props.strFreq,
    props.strOctave,
    justFreq.value,
  )
  const V = (pos.value.position.percentage - next.position.percentage) * store.preference.stringLength / 100
  const x = ['#d7bde2', '#aed6f1', '#a3e4d7', '#f9e79f', '#f5cba7', '#f5b7b1']
  return {
    top: -(N / 2 - 20) + 'px',
    height: N / 2 + V / 2 + 'px',
    backgroundColor: x[pos.value.octave - 3],
  }
})
const circleClass = computed(() => ({
  'finger-position-circle': true,
  'finger-position-circle-piano-black': pos.value.altPitch && store.hasDisplayOption(6),
  'finger-position-circle-arpeggio': isArpeggioNote.value,
  'finger-position-circle-highlighted': isActive.value,
}))

function select() {
  console.log(pos.value)
  store.setCurrentNote({ pitch: pos.value.pitch, octave: pos.value.octave })
}
</script>
