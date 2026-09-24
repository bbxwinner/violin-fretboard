<template>
  <v-expansion-panels v-model="open">
    <v-expansion-panel :title="t('board_pref_group_title_display')">
      <v-expansion-panel-text>
        <v-select
          :label="t('board_mode')"
          :items="modeItems"
          item-title="label"
          item-value="value"
          v-model="mode"
        />
        <v-select
          v-model="display"
          :items="displayItems"
          item-title="label"
          item-value="value"
          chips
          multiple
        />
        <v-btn
          :color="store.isPlayingArpeggio ? 'error' : 'primary'"
          variant="elevated"
          block
          class="mt-2 mb-2"
          :disabled="!mode"
          @click="store.toggleArpeggioPlay()"
        >
          {{
            store.isPlayingArpeggio
              ? '⏹ 停止播放琶音'
              : mode
                ? '▶ 播放当前调性琶音'
                : '▶ 请先选择调性以播放琶音'
          }}
        </v-btn>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel :title="t('board_pref_group_title_string')">
      <v-expansion-panel-text>
        <v-row>
          <v-col cols="4"><span class="text-caption">{{ t('board_pref_string_length') }}</span></v-col>
          <v-col cols="8">
            <v-slider v-model="len" :min="500" :max="5000" step="1" thumb-label />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4"><span class="text-caption">{{ t('board_pref_pitch_standard') }}</span></v-col>
          <v-col cols="8">
            <v-text-field v-model.number="std" type="number" :min="1" variant="outlined" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4"><span class="text-caption">{{ t('board_pref_semitones_per_string') }}</span></v-col>
          <v-col cols="8">
            <v-text-field v-model.number="semi" type="number" :min="1" :max="60" variant="outlined" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-switch v-model="just" color="primary" :label="t('board_pref_runing_just_intonation')" />
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel :title="t('board_pref_group_title_sound')">
      <v-expansion-panel-text>
        <v-row>
          <v-col cols="4"><span class="text-caption">{{ t('board_pref_volume') }}</span></v-col>
          <v-col cols="8">
            <v-slider v-model="vol" :min="0" :max="100" step="1" thumb-label />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4"><span class="text-caption">{{ t('board_pref_note_duration') }}</span></v-col>
          <v-col cols="8">
            <v-slider v-model="dur" :min="100" :max="2000" step="50" thumb-label>
              <template #thumb-label="{ modelValue }">{{ modelValue }}ms </template>
            </v-slider>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <div class="preference-board-button-area mt-4">
      <div class="d-flex justify-space-between">
        <v-btn @click="reset">{{ t('board_pref_btn_reset_default') }}</v-btn>
        <v-btn
          v-if="isMobile"
          class="ml-2"
          variant="elevated"
          color="primary"
          @click="$emit('done')"
        >
          {{ t('board_pref_btn_done') }}
        </v-btn>
      </div>
    </div>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { U } from '../../utils/music'
import { useBoardPreference } from '../../composables/useBoardPreference'

defineProps<{ isMobile?: boolean }>()
defineEmits(['done'])

const { t } = useI18n()
const store = useBoardStore()
const { $getTranslatedModesOptions, $getTranslatedDisplayOptions } = useNuxtApp() as any

const open = ref(0)
const len = useBoardPreference('stringLength')
const std = useBoardPreference('pitchStandard')
const semi = useBoardPreference('semitonesPerString')
const just = useBoardPreference('tuningJustIntonation')
const vol = useBoardPreference('volume')
const dur = useBoardPreference('noteDuration')
const mode = useBoardPreference('modeMajor')
const display = useBoardPreference('displayOptions')

const modeItems = $getTranslatedModesOptions()
const displayItems = computed(() => {
  const opts = $getTranslatedDisplayOptions(U)
  return opts.map((o: any) =>
    o.value === 7 || o.label === 'board_display_option_Arpeggio' || o.label.includes('Arpeggio')
      ? { ...o, label: '琶音' }
      : o,
  )
})

function reset() {
  store.resetPreferenceToDefault()
  store.savePreferenceLocalStorage()
}
</script>
