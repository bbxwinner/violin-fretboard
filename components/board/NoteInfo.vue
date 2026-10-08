<template>
  <div>
    <v-sheet v-if="show">
      <v-row class="vf-row-container">
        <v-col cols="4" class="vf-container">
          <div :ref="vfRef" :id="'vfBoard-' + (isMobile ? 'm' : 'd')" />
        </v-col>
        <v-col :cols="isMobile ? 6 : 8">
          <div v-if="info">
            <h2>
              {{ $getDisplayPitch(displayInfo.main) + ' ' }}<span v-if="displayInfo.alt">/ {{ $getDisplayPitch(displayInfo.alt) }}</span><v-chip class="note-info-octave-label">{{ info.octave }}</v-chip>
            </h2>
            <h3>
              {{ $getDisplaySolfege(displayInfo.main) + ' ' }}<span v-if="displayInfo.alt">/ {{ $getDisplaySolfege(displayInfo.alt) }}</span>
            </h3>
            <div>{{ Math.round(info.freq * 1e6) / 1e6 }} Hz </div>
          </div>
        </v-col>
        <v-col v-if="isMobile" cols="2" class="d-flex flex-column">
          <v-btn icon="mdi-cog" @click="sheet = true" />
          <v-btn icon="mdi-close" @click="show = false" />
        </v-col>
      </v-row>
    </v-sheet>
    <v-bottom-sheet v-if="isMobile" v-model="sheet">
      <v-card>
        <v-card-text>
          <preferences :is-mobile="true" @done="sheet = false" />
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
    <v-btn v-if="isMobile && !show" class="fixed-cog-icon" icon="mdi-cog" @click="sheet = true" />
  </div>
</template>

<script setup lang="ts">
import { __mmToKey } from '../../utils/music'

const props = defineProps<{ isMobile?: boolean }>()

const store = useBoardStore()
const { $vexflow, $vexflowFontsReady, $getDisplayPitch, $getDisplaySolfege, $isNoteHiddenInCurrentMode, $getPurePitchInCurrentMode, $getPreferredPitch } =
  useNuxtApp() as any

const show = ref(false)
const sheet = ref(false)
const info = computed(() => store.currentNoteInfo)
const displayInfo = computed(() => {
  const i = info.value
  if (!i) return null
  const preferred = $getPreferredPitch(i.pitch, i.altPitch, store.preference.modeMajor)
  if (preferred === null) return { main: i.pitch, alt: i.altPitch }
  return { main: preferred, alt: null }
})
const vfRef = ref<HTMLElement | null>(null)
let renderToken = 0

function withTimeout(p: Promise<unknown>, ms: number): Promise<unknown> {
  return Promise.race([
    p,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ])
}

function draw(note: any) {
  show.value = true
  nextTick(() => renderStaff(note))
}
async function renderStaff(note: any) {
  const token = ++renderToken
  const id = 'vfBoard-' + (props.isMobile ? 'm' : 'd')
  const el = vfRef.value || document.getElementById(id)
  if (!el) return
  try {
    if ($vexflowFontsReady) await withTimeout($vexflowFontsReady, 8000)
    // 双保险：确保 Bravura/Academico 已可用于 measureText，
    // 否则 VexFlow 用后备字体测量会把调号排进谱号里（视觉重叠）
    try {
      await Promise.all([
        (document as any).fonts.load('30pt Bravura'),
        (document as any).fonts.load('30pt Academico'),
      ])
    } catch {
      /* ignore */
    }
    // 等待期间可能有更新的渲染开始——旧的直接放弃；清空放到绘制前，
    // 保证容器里始终只有一个 SVG（避免两个五线谱叠加）
    if (token !== renderToken) return
    el.innerHTML = ''
    const w = el.clientWidth || 180
    let k = 100
    let V = 0
    if (note) {
      if (note.freq < 245) V = -15
      else if (note.freq > 2641) {
        V = 50
        k = 150
      } else if (note.freq > 2096) {
        V = 40
        k = 140
      } else if (note.freq > 1762) {
        V = 30
        k = 130
      } else if (note.freq > 1399) {
        V = 20
        k = 120
      } else if (note.freq > 1176) {
        V = 10
        k = 110
      }
    }
    const { Factory } = $vexflow
    const D: any = new Factory({ renderer: { elementId: el.id, width: w, height: k } })
    const y = D.EasyScore()
    const T = D.System({ x: 10, y: V, width: Math.max(100, w - 20) })
    const de: any[] = []
    if (note && note.pitch) {
      let J: string
      if (store.preference.modeMajor) {
        if ($isNoteHiddenInCurrentMode(note.pitch, note.altPitch, store.preference.modeMajor)) {
          J = note.pitch.length === 2 ? note.pitch : note.pitch + 'n'
        } else {
          J = $getPurePitchInCurrentMode(note.pitch, note.altPitch, store.preference.modeMajor)
        }
      } else {
        J = note.pitch
      }
      const z = note.octave ?? 4
      const X = `${J}${z}/q`
      de.push(y.voice(y.notes(X), { time: '1/4' }))
    }
    const O = T.addStave({ voices: de }).addClef('treble')
    if (store.preference.modeMajor) O.addKeySignature(__mmToKey(store.preference.modeMajor))
    D.draw()
  } catch (err) {
    console.error('Failed to render staff:', err)
  }
}

onMounted(() => {
  if (!props.isMobile) draw(info.value)
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
function onResize() {
  if (show.value) draw(info.value)
}
watch(
  () => store.currentNoteInfo,
  (n) => {
    if (n) draw(n)
    else show.value = false
  },
)
watch(
  () => store.preference.modeMajor,
  () => {
    draw(info.value)
  },
)
</script>
