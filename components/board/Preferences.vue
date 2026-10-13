<template>
  <v-sheet>
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
          :label="t('board_theme')"
          :items="themeItems"
          item-title="label"
          item-value="value"
          v-model="theme"
        />
        <v-select
          v-model="display"
          :items="displayItems"
          item-title="label"
          item-value="value"
          chips
          multiple
        />
        <v-row class="mt-2">
          <v-col cols="4"><span class="text-caption">{{ t('board_pref_board_width') }}</span></v-col>
          <v-col cols="8">
            <v-slider v-model="boardW" :min="100" :max="320" step="5" thumb-label>
              <template #thumb-label="{ modelValue }">{{ modelValue }}px</template>
            </v-slider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4"><span class="text-caption">{{ t('board_pref_note_font_size') }}</span></v-col>
          <v-col cols="8">
            <v-slider v-model="font" :min="8" :max="24" step="0.2" thumb-label>
              <template #thumb-label="{ modelValue }">{{ modelValue }}px</template>
            </v-slider>
          </v-col>
        </v-row>
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
              ? `⏹ ${t('board_arpeggio_stop')}`
              : mode
                ? `▶ ${t('board_arpeggio_play')}`
                : `▶ ${t('board_arpeggio_select_key')}`
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
    </v-expansion-panels>
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
  </v-sheet>
</template>

<script setup lang="ts">
import { U } from '../../utils/music'
import { useBoardPreference, useThemePreference } from '../../composables/useBoardPreference'

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
const theme = useBoardPreference('theme')
const boardW = useThemePreference('boardWidth')
const font = useThemePreference('noteFontSize')

const modeItems = $getTranslatedModesOptions()
const displayItems = computed(() => $getTranslatedDisplayOptions(U))
const themeItems = [
  { label: t('board_theme_classic'), value: 'classic' },
  { label: t('board_theme_antique'), value: 'antique' },
]

function reset() {
  store.resetPreferenceToDefault()
  store.savePreferenceLocalStorage()
}
</script>
