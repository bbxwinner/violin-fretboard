<template>
  <v-container>
    <template v-if="melody">
      <v-row>
        <v-col cols="12">
          <v-card class="mb-4">
            <v-toolbar color="primary">
              <v-toolbar-title>{{ melody.name }}</v-toolbar-title>
              <v-spacer />
              <v-btn icon="mdi-delete" variant="text" @click="remove" />
            </v-toolbar>
            <v-card-text>
              <p class="text-caption">
                {{ keySignatureLabel }}: {{ keys.join(', ') }} |
                {{ timeSignatureLabel }}: {{ melody.parsed?.timeSignature || '4/4' }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="(track, i) in melody.parsed?.tracks || []" :key="i" cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>Track {{ i + 1 }}</v-card-title>
            <v-card-text>
              <client-only>
                <canvas ref="staffRefs" class="staff" :width="480" :height="render.height" />
              </client-only>
              <MelodyTrackSummary
                :title="track.name"
                :tracks="[trackSummary(track)]"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <v-alert v-else type="warning">{{ notFoundLabel }}</v-alert>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const nuxtApp = useNuxtApp()
const { $getMelody, $deleteMelody, $getMelodyTrackTotalMs, $getMelodyTrackNumNotes, $getKeySignatureName, $getkeySignatureKeys } = nuxtApp
const $vexflow = nuxtApp.$vexflow as (typeof import('vexflow')) | null | undefined

const id = route.params.id as string
const melody = ref<Record<string, any> | null>(loadMelody())

function loadMelody() {
  if (import.meta.server) return null
  return $getMelody(id)
}

const keySignatureLabel = ref('Key signature')
const timeSignatureLabel = ref('Time signature')
const notFoundLabel = ref('Melody not found.')
const render = { height: 160 }

const keys = computed(() => {
  const tracks = melody.value?.parsed?.tracks || []
  const all = tracks.flatMap((t: any) => $getkeySignatureKeys(t.events || t.events || []))
  return all.length ? [...new Set(all)].map((k) => $getKeySignatureName(k)) : ['C']
})

function trackSummary(track: any) {
  const evts = track.events || []
  return {
    index: track.index,
    name: track.name,
    keySignatureName: $getKeySignatureName($getkeySignatureKeys(evts)[0] || 'C0'),
    notesCount: $getMelodyTrackNumNotes(evts),
    totalMs: $getMelodyTrackTotalMs({ ticksPerBeat: track.ticksPerBeat }, evts),
  }
}

function remove() {
  $deleteMelody(id)
  navigateTo({ name: 'player' })
}

const staffRefs = ref<HTMLCanvasElement[]>([])

watch(
  () => [melody.value, staffRefs.value.length],
  () => {
    if (!$vexflow) return
    const tracks = melody.value?.parsed?.tracks || []
    tracks.forEach((track: any, i: number) => {
      const canvas = staffRefs.value[i]
      if (!canvas) return
      try {
        const { Stave, StaveNote, Formatter, Renderer } = $vexflow
        const ctx = Renderer.buildCanvasContext(canvas.width, canvas.height)
        const stave = new Stave(20, 40, canvas.width - 40)
        stave.addClef(melody.parsed?.mode === 'minor' ? 'treble' : 'treble').addTimeSignature('4/4')
        stave.setContext(ctx).draw()
        const noteNames = track.events
          .filter((e: any) => e.type === 'noteOn' && e.velocity > 0)
          .map((e: any) => noteName(e.midi))
        const notes = noteNames.slice(0, 16).map((n: string) =>
          new StaveNote({ keys: [n], duration: 'q' }),
        )
        if (notes.length) {
          Formatter.FormatAndDraw(ctx, stave, notes)
        }
      } catch (err) {
        console.error(err)
      }
    })
  },
)

function noteName(midi: number) {
  const names = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  const idx = (midi - 60) % 12
  const baseIdx = [0, 1, 3, 4, 5, 7, 8, 10][idx % 8]
  const accidental = ['', '', '', '', '', 'b', 'b', ''][baseIdx % 8]
  const midiOctave = Math.floor(midi / 12) - 1
  return `${names[baseIdx]}${accidental}/${midiOctave}`
}

useHead({ title: () => melody.value?.name || 'Melody' })
</script>

<style scoped>
.staff {
  max-width: 100%;
}
</style>