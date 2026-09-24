<template>
  <div class="string-container" :style="{ height: store.preference.stringLength + 'px' }">
    <div class="string-space" />
    <div class="string-space string-on-left" :style="{ borderLeft: thickness + 'px solid black' }">
      <finger-position
        v-for="i in semitones"
        :key="i"
        :nth-semitone="i - 1"
        :str-thickness="thickness"
        :str-freq="freq"
        :str-pitch="pitch"
        :str-octave="octave"
        :str-freq-just-intonation="freqJustIntonation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  thickness: number
  freq: number
  freqJustIntonation: number
  octave: number
  pitch: string
}>()

const store = useBoardStore()
const semitones = computed(() => store.preference.semitonesPerString)
</script>
