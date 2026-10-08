<template>
  <v-card class="fingerboard" :class="themeClass" :style="cardStyle">
    <VioolStringLabel :is-left="true" />
    <div class="fingerboard-strings">
      <div class="vf-string-row">
        <VioolString
          v-for="s in store.strings"
          :key="s.pitch"
          :pitch="s.pitch"
          :thickness="s.thickness"
          :freq="s.freq"
          :octave="s.octave"
          :freq-just-intonation="s.freqJustIntonation"
          :fan-offset="s.fanOffset"
        />
      </div>
    </div>
    <VioolStringLabel :is-left="false" />
  </v-card>
</template>

<script setup lang="ts">
const store = useBoardStore()
const themeClass = computed(() => (store.preference.theme === 'antique' ? 'fingerboard--antique' : ''))
const cardStyle = computed(() => {
  const theme = store.preference.theme
  const antique = theme === 'antique'
  const scale = store.preference.boardWidth[theme] / 160
  const unit = (antique ? 11 : 20) * scale
  const font = store.preference.noteFontSize[theme]
  const style: Record<string, string> = {
    '--unit-size': unit + 'px',
    '--unit-double-size': unit * 2 + 'px',
    '--vf-string-slot': 40 * scale + 'px',
    '--vf-note-font': font + 'px',
  }
  return style
})
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
