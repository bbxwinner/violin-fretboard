<template>
  <div class="string-container" :style="{ height: store.preference.stringLength + 'px', ...fanStyle }">
    <div class="string-space" />
    <div
      class="string-space string-on-left"
      :style="{ borderLeft: `${thickness * scale}px solid var(--vf-string-color, #000)` }"
    >
      <finger-position
        v-for="n in visibleSemitones"
        :key="n"
        :nth-semitone="n"
        :str-thickness="thickness * scale"
        :str-freq="freq"
        :str-pitch="pitch"
        :str-octave="octave"
        :str-freq-just-intonation="freqJustIntonation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  thickness: number
  freq: number
  freqJustIntonation: number
  octave: number
  pitch: string
  fanOffset: number
}>()

const store = useBoardStore()
const visibleSemitones = computed(() => store.visibleSemitones)
const scale = computed(() => store.preference.boardWidth[store.preference.theme] / 160)
const fanStyle = computed(() => {
  if (store.preference.theme !== 'antique' || !props.fanOffset) return {}
  const angle = (Math.asin(props.fanOffset / store.preference.stringLength) * 180) / Math.PI
  return { transform: `rotate(${angle}deg)`, transformOrigin: '50% 100%' }
})
</script>
