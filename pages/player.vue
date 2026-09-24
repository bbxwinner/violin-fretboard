<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-toolbar color="primary">
            <v-toolbar-title>{{ title }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field v-model="name" :label="label" />
            <v-file-input
              v-model="file"
              accept=".mid,.midi,.smf"
              :label="fileLabel"
              variant="outlined"
            />
            <v-select
              v-model="key"
              :label="keyLabel"
              :items="chromatic"
              variant="outlined"
            />
            <v-btn-toggle v-model="mode" variant="tonal">
              <v-btn value="major">{{ majorLabel }}</v-btn>
              <v-btn value="minor">{{ minorLabel }}</v-btn>
            </v-btn-toggle>
            <div class="mt-4">
              <v-btn color="primary" :disabled="!file || !name" @click="addMelody">
                {{ saveLabel }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>{{ melodiesTitle }}</v-card-title>
          <v-card-text>
            <v-list disabled>
              <v-list-item v-for="(melody, id) in melodies" :key="id">
                <v-list-item-title>
                  <NuxtLink :to="localePath({ name: 'melody-id', params: { id: String(id) } })">
                    {{ melody.name }}
                  </NuxtLink>
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <p v-if="!Object.keys(melodies).length" class="text-caption">{{ emptyLabel }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const nuxtApp = useNuxtApp()
const $addMelody = nuxtApp.$addMelody
const $getAllMelodiesDict = nuxtApp.$getAllMelodiesDict

const title = ref('Violin Player')
const label = ref('Name')
const fileLabel = ref('MIDI File')
const keyLabel = ref('Key')
const majorLabel = ref('Major')
const minorLabel = ref('Minor')
const saveLabel = ref('Save')
const melodiesTitle = ref('Voila Melodies')
const emptyLabel = ref('No melody inventory yet.')

const name = ref('')
const file = ref<File | null>(null)
const key = ref('C')
const mode = ref<'major' | 'minor'>('major')
const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const melodies = ref<Record<string, any>>({})

onMounted(() => {
  melodies.value = $getAllMelodiesDict()
})

async function addMelody() {
  const buffer = await file.value!.arrayBuffer()
  const { default: MIDI } = await import('midi-parser-js')
  const parsed = MIDI.parse(new Uint8Array(buffer))
  const info: Record<string, unknown> = {
    key: key.value,
    mode: mode.value,
    tracks: parsed.track.map((track: any, i: number) => ({
      index: i,
      name: `Track ${i + 1}`,
      events: track.event,
      ticksPerBeat: parsed.header.ticksPerBeat,
    })),
    timeSignature: '4/4',
  }
  const id = $addMelody(name.value, info)
  melodies.value = $getAllMelodiesDict()
  file.value = null
  name.value = ''
}
</script>