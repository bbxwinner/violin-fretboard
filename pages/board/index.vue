<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="6" class="d-none d-sm-block">
        <div id="control-panel">
          <v-sheet elevation="2">
            <note-info :is-mobile="false" class="note-info-desktop" />
          </v-sheet>
          <preferences :is-mobile="false" />
        </div>
      </v-col>
      <v-col cols="12" sm="6">
        <finger />
      </v-col>
    </v-row>
    <v-row class="info-mobile d-block d-sm-none" justify="center">
      <v-col cols="12" class="info-fixed">
        <note-info :is-mobile="true" />
      </v-col>
    </v-row>
    <article class="seo-content">
      <h1>{{ $t('board_seo_h1') }}</h1>
      <section>
        <h2>{{ $t('board_seo_intro_h2') }}</h2>
        <p>{{ $t('board_seo_intro_p') }}</p>
      </section>
      <section>
        <h2>{{ $t('board_seo_features_h2') }}</h2>
        <ul>
          <li v-for="i in 7" :key="i">{{ $t('board_seo_features_' + i) }}</li>
        </ul>
      </section>
      <section>
        <h2>{{ $t('board_seo_howto_h2') }}</h2>
        <ol>
          <li v-for="i in 5" :key="i">{{ $t('board_seo_howto_' + i) }}</li>
        </ol>
      </section>
      <section>
        <h2>{{ $t('board_seo_tuning_h2') }}</h2>
        <p>{{ $t('board_seo_tuning_p1') }}</p>
        <p>{{ $t('board_seo_tuning_p2') }}</p>
      </section>
      <section class="seo-faq">
        <h2>{{ $t('board_seo_faq_h2') }}</h2>
        <h3>{{ $t('board_seo_faq_q1') }}</h3>
        <p>{{ $t('board_seo_faq_a1') }}</p>
        <h3>{{ $t('board_seo_faq_q2') }}</h3>
        <p>{{ $t('board_seo_faq_a2') }}</p>
        <h3>{{ $t('board_seo_faq_q3') }}</h3>
        <p>{{ $t('board_seo_faq_a3') }}</p>
      </section>
    </article>
  </v-container>
</template>

<script setup lang="ts">
import { noteToMidi } from '../../utils/arpeggio'

definePageMeta({
  appBarTitleKey: 'board_name',
  seoTitleKey: 'board_name',
  seoDescriptionKey: 'board_description',
})

const store = useBoardStore()

// 音频库自托管（public/ 下），避免依赖外部 GitHub Pages 域名（部分地区无法访问）
const { app: runtimeApp } = useRuntimeConfig()
useHead({
  script: [
    { src: `${runtimeApp.baseURL}WebAudioFontPlayer.js`, defer: true },
    { src: `${runtimeApp.baseURL}0400_Aspirin_sf2_file.js`, defer: true },
  ],
})

let sf2: any
let audioCtx: AudioContext | null = null
let player: any

function ensureAudio() {
  const w = window as any
  if (player) return
  if (!w.WebAudioFontPlayer || !w._tone_0400_Aspirin_sf2_file) return
  sf2 = w._tone_0400_Aspirin_sf2_file
  const AC = w.AudioContext || w.webkitAudioContext
  audioCtx = new AC()
  player = new w.WebAudioFontPlayer()
  player.loader.decodeAfterLoading(audioCtx, '_tone_0400_Aspirin_sf2_file')
}

function playNote(pitch: string, octave: number, duration: number, velocity: number) {
  ensureAudio()
  const v = noteToMidi(pitch + octave)
  if (v === null || !audioCtx || !player) return
  player.queueWaveTable(audioCtx, audioCtx.destination, sf2, 0, v, duration, velocity / 127)
}

onMounted(() => {
  // defer 脚本可能尚未就绪：自动重试 30s；之后每次点音符也会懒初始化
  let n = 0
  const tick = () => {
    ensureAudio()
    if (!player && n++ < 60) setTimeout(tick, 500)
  }
  tick()
})

onUnmounted(() => {
  store.stopArpeggioPlay()
})

watch(
  () => store.currentNoteInfo,
  (s: any) => {
    if (s && store.preference.volume > 0) {
      playNote(s.pitch, s.octave, store.preference.noteDuration / 1e3, store.preference.volume * 1.27)
    }
  },
)
</script>

<style>
:root {
  --unit-size: 20px;
  --unit-double-size: calc(var(--unit-size) * 2);
}

.vf-container {
  overflow: hidden;
  padding: 0 !important;
}
.vf-container svg {
  max-width: 100%;
}
.note-info-octave-label {
  margin-left: 10px;
  vertical-align: text-bottom;
}
.fixed-cog-icon {
  bottom: 6px;
  position: fixed;
  right: 6px;
}
.vf-row-container {
  margin-top: 0;
}
/* 移动端信息条的操作按钮组（齿轮/关闭）：fixed 定位在右下角，
   与屏幕下/右边框保持 12px，两按钮间距 12px；z-index 高于信息条(10) */
.vf-sheet-actions {
  bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: fixed;
  right: 12px;
  z-index: 11;
}
.finger-position-label {
  cursor: pointer;
  height: 10px;
  position: absolute;
  transform: translateY(-50%);
  width: 100%;
}
.finger-position-label-text {
  font-size: 80%;
  margin-top: 8px;
}
.string-container.string-label-container {
  margin: 0 4px;
  position: relative;
  width: 60px;
}
.finger-position {
  position: absolute;
}
.finger-position-content {
  height: var(--unit-double-size);
  position: relative;
  width: var(--unit-double-size);
}
.finger-position-octave-highlight {
  opacity: 0.5;
  position: absolute;
  width: var(--unit-double-size);
}
.finger-position-circle {
  background-color: #fff;
  border: 1px solid #000;
  border-radius: var(--unit-size);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: var(--vf-note-font, 80%);
  height: var(--unit-double-size);
  justify-content: space-evenly;
  line-height: 0%;
  position: absolute;
  text-align: center;
  width: var(--unit-double-size);
}
.finger-position-circle-standard {
  background-color: #555;
}
.finger-position-circle-piano-black {
  background-color: #333;
  color: #fff;
}
.finger-position-circle-highlighted {
  background-color: #ff0;
  color: #000;
}
.finger-position-circle-arpeggio {
  background-color: #ffd700 !important;
  color: #000 !important;
  border: 2px solid #ff6600 !important;
  box-shadow: 0 0 10px rgba(255, 102, 0, 0.9) !important;
  font-weight: bold;
}
.finger-position-octave-highlight-text {
  opacity: 0.5;
  padding-left: 2px;
}
.string-container {
  display: flex;
  flex-direction: row;
  margin: 0;
  width: var(--vf-string-slot, 40px);
}
.string-container .string-space {
  width: 50%;
}
.string-container .string-on-left {
  position: relative;
}
.fingerboard {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 40px 0;
}
.fingerboard-strings {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.vf-string-row {
  display: flex;
  flex-direction: row;
}
.fingerboard.fingerboard--antique {
  --vf-string-color: #c0c0c0;
}
.fingerboard.fingerboard--antique .vf-string-row {
  position: relative;
}
.fingerboard.fingerboard--antique .vf-string-row::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: #24150a;
  background-image:
    radial-gradient(ellipse at 32% 18%, #3d2515 0%, #24150a 62%, #150b05 100%),
    repeating-linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.28) 0 2px,
      rgba(255, 255, 255, 0.02) 2px 4px,
      rgba(0, 0, 0, 0) 4px 9px
    ),
    repeating-linear-gradient(
      3deg,
      rgba(90, 55, 28, 0.1) 0 9px,
      rgba(0, 0, 0, 0) 9px 17px
    );
  clip-path: polygon(22.03% 0%, 77.97% 0%, 100% 100%, 0% 100%);
}
.fingerboard.fingerboard--antique .vf-string-row > .string-container {
  position: relative;
  z-index: 1;
}
.fingerboard.fingerboard--antique .finger-position-circle {
  background-color: #24150a;
  border-color: #fff;
  color: #fff;
}
.fingerboard.fingerboard--antique .finger-position-circle-standard {
  background-color: #24150a;
  border-color: rgba(255, 255, 255, 0.55);
}
.fingerboard.fingerboard--antique .finger-position-circle-piano-black {
  background-color: #24150a;
  border-color: #fff;
  color: #fff;
}
.fingerboard.fingerboard--antique .finger-position-circle-highlighted {
  background-color: #ffd700;
  border-color: #ffd700;
  color: #000;
}
.info-mobile .info-fixed {
  background-color: #fff;
  bottom: 0;
  box-shadow: 0 -2px 5px #0003;
  left: 0;
  padding: 0 10px;
  position: fixed;
  width: 100%;
  z-index: 10;
}
.note-info-desktop {
  margin-bottom: 20px;
  margin-left: 16px;
}
#control-panel {
  background-color: #fff;
  padding-top: 20px;
  position: sticky;
  top: 70px;
  z-index: 10;
}
.seo-content {
  border-top: 1px solid #e0e0e0;
  color: #555;
  margin-top: 40px;
  padding: 20px 0 40px;
}
@media (max-width: 599px) {
  .seo-content {
    padding-bottom: 80px;
  }
}
.seo-content h1 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 24px;
}
.seo-content h2 {
  color: #444;
  font-size: 1.2rem;
  margin-bottom: 12px;
  margin-top: 24px;
}
.seo-content h3 {
  color: #444;
  font-size: 1rem;
  margin-bottom: 8px;
  margin-top: 16px;
}
.seo-content p {
  line-height: 1.7;
  margin-bottom: 12px;
}
.seo-content ol,
.seo-content ul {
  margin-bottom: 12px;
  padding-left: 24px;
}
.seo-content li {
  line-height: 1.6;
  margin-bottom: 6px;
}
</style>
