<template>
  <div>
    <v-card v-if="show">
      <v-row class="vf-row-container">
        <v-col cols="4" class="vf-container">
          <div :ref="vfRef" :id="'vfBoard-' + (isMobile ? 'm' : 'd')" />
        </v-col>
        <v-col :cols="isMobile ? 6 : 8">
          <div v-if="info">
            <h2>
              {{ $getDisplayPitch(info.pitch) + ' ' }}<span v-if="info.altPitch">/ {{ $getDisplayPitch(info.altPitch) }}</span><v-chip class="note-info-octave-label">{{ info.octave }}</v-chip>
            </h2>
            <h3>
              {{ $getDisplaySolfege(info.pitch) + ' ' }}<span v-if="info.altPitch">/ {{ $getDisplaySolfege(info.altPitch) }}</span>
            </h3>
            <div>{{ Math.round(info.freq * 1e6) / 1e6 }} Hz </div>
          </div>
        </v-col>
        <v-col v-if="isMobile" cols="2" class="d-flex flex-column">
          <v-btn icon="mdi-cog" @click="sheet = true" />
          <v-btn icon="mdi-close" @click="show = false" />
        </v-col>
      </v-row>
    </v-card>
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
const { $vexflow, $getDisplayPitch, $getDisplaySolfege, $isNoteHiddenInCurrentMode, $getPurePitchInCurrentMode } =
  useNuxtApp() as any

const show = ref(false)
const sheet = ref(false)
const info = computed(() => store.currentNoteInfo)
const vfRef = ref<HTMLElement | null>(null)

function draw(note: any) {
  show.value = true
  nextTick(() => renderStaff(note))
}
function renderStaff(note: any) {
  const el = vfRef.value
  if (!el) return
  el.innerHTML = ''
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
  const D: any = new Factory({ renderer: { elementId: el.id, height: k } })
  const y = D.EasyScore()
  const T = D.System({ x: 10, y: V })
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
}

onMounted(() => {
  if (!props.isMobile) draw(info.value)
})
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
