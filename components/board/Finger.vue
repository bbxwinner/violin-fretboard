<template>
  <v-card class="fingerboard">
    <VioolStringLabel :is-left="true" />
    <VioolString
      v-for="s in store.strings"
      :key="s.pitch"
      :pitch="s.pitch"
      :thickness="s.thickness"
      :freq="s.freq"
      :octave="s.octave"
      :freq-just-intonation="s.freqJustIntonation"
    />
    <VioolStringLabel :is-left="false" />
  </v-card>
</template>

<script setup lang="ts">
const store = useBoardStore()
const eo = 4

let startX: number | null = null
let startY: number | null = null

function onTouchStart(o: TouchEvent) {
  if (o.touches.length === 1) {
    startX = o.touches[0].clientX
    startY = o.touches[0].clientY
  }
}
function onTouchMove(o: TouchEvent) {
  if (o.touches.length !== 1 || startX === null) return
  const s = o.touches[0].clientX
  const S = o.touches[0].clientY
  const h = s - startX
  const v = (S - (startY ?? 0)) / h
  if (Math.abs(v) < 0.8) {
    store.adjustStringLength(h * eo)
    startX = s
  }
}
function onTouchEnd() {
  startX = null
  startY = null
}

onMounted(() => {
  store.loadPreferenceLocalStorage()
  window.addEventListener('touchstart', onTouchStart)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('touchend', onTouchEnd)
})
onUnmounted(() => {
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
})
</script>
