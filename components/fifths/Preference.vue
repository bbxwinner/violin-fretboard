<template>
  <v-card class="fifths-preference-card">
    <v-card-title class="fifths-preference-title">{{ t('fifths_pref_title') }}</v-card-title>
    <v-card-text>
      <div class="fifths-pref-section-title">{{ t('fifths_pref_section_hand_positions') }}</div>
      <div class="fifths-position-ranges">
        <div class="fifths-position-range-header">
          <div />
          <div>{{ t('fifths_pref_position_start_row') }}</div>
          <div>{{ t('fifths_pref_position_end_row') }}</div>
        </div>
        <div v-for="r in 7" :key="`hand-position-range-${r}`" class="fifths-position-range-row">
          <v-checkbox
            :model-value="store.isHandPositionVisible(r)"
            :label="t(labelFor(r))"
            density="compact"
            hide-details
            class="fifths-pref-checkbox fifths-position-visibility"
            @update:model-value="(v: boolean) => store.setHandPositionVisible(r, !!v)"
          />
          <v-text-field
            :model-value="rangeFor(r).startRow"
            type="number"
            density="compact"
            hide-details
            variant="outlined"
            class="fifths-position-range-input"
            @update:model-value="(v: unknown) => setStart(r, v)"
          />
          <v-text-field
            :model-value="rangeFor(r).endRow"
            type="number"
            density="compact"
            hide-details
            variant="outlined"
            class="fifths-position-range-input"
            @update:model-value="(v: unknown) => setEnd(r, v)"
          />
        </div>
        <div class="fifths-position-ranges-actions">
          <v-btn size="small" variant="text" color="primary" @click="store.resetHandPositionRanges()">
            {{ t('fifths_pref_reset_all_position_ranges') }}
          </v-btn>
        </div>
      </div>
      <div class="fifths-pref-section-title fifths-pref-section-title-with-margin">
        {{ t('fifths_pref_section_motion_speed') }}
      </div>
      <v-slider
        v-model="transitionMs"
        :min="120"
        :max="2200"
        step="20"
        thumb-label="always"
        hide-details
        color="primary"
      >
        <template #append>
          <span class="fifths-pref-slider-value">{{ transitionMs }} ms</span>
        </template>
      </v-slider>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" variant="text" @click="store.setPreferenceDialogOpen(false)">
        {{ t('board_pref_btn_done') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
const { t } = useI18n()
const store = useFifthStore()

const t_ = {
  1: 'fifths_pref_hand_position_first',
  2: 'fifths_pref_hand_position_second',
  3: 'fifths_pref_hand_position_third',
  4: 'fifths_pref_hand_position_fourth',
  5: 'fifths_pref_hand_position_fifth',
  6: 'fifths_pref_hand_position_sixth',
  7: 'fifths_pref_hand_position_seventh',
} as Record<number, string>

function labelFor(h: number) {
  return t_[h] || t_[1]
}
function rangeFor(h: number) {
  return store.getHandPositionRange(h)
}
function num(h: unknown, fallback: number): number {
  const r = Number(h)
  return Number.isFinite(r) ? Math.max(0, Math.floor(r)) : fallback
}
function setStart(h: number, a: unknown) {
  const r = rangeFor(h)
  const s = num(a, r.startRow)
  const b = Math.max(s, r.endRow)
  store.setHandPositionRange(h, s, b)
}
function setEnd(h: number, a: unknown) {
  const r = rangeFor(h)
  const s = num(a, r.endRow)
  const b = Math.min(r.startRow, s)
  store.setHandPositionRange(h, b, s)
}
const transitionMs = computed({
  get: () => store.fingerOverlayTransitionMs,
  set: (h: number) => store.setFingerOverlayTransitionMs(Number(h)),
})
</script>
