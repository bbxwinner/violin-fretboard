<template>
  <section class="fifths-mode-info">
    <div class="mode-tabs-card">
      <v-slide-group v-model="tab" density="compact" color="primary" class="mode-tabs">
        <v-tab value="major">{{ majorTitle }}</v-tab>
        <v-tab value="minor">{{ minorTitle }}</v-tab>
      </v-slide-group>
      <v-window v-model="tab" class="mode-tab-panels">
        <v-window-item value="major">
          <table class="mode-notes-table">
            <tbody>
              <tr v-for="s in majorRows" :key="`major-${s.degree}`">
                <td class="degree-cell">{{ s.degree }}</td>
                <td class="role-cell">{{ s.role }}</td>
                <td class="note-cell">{{ s.note }}</td>
                <td>{{ s.solfege }}</td>
              </tr>
            </tbody>
          </table>
        </v-window-item>
        <v-window-item value="minor">
          <table class="mode-notes-table mode-minor-variants-table">
            <tbody>
              <tr>
                <td class="degree-cell" />
                <td class="variant-label-cell" />
                <td class="variant-degree-cell">{{ $t('fifths_mode_minor_variant_natural') }}</td>
                <td class="variant-degree-cell">{{ $t('fifths_mode_minor_variant_harmonic') }}</td>
                <td class="variant-degree-cell">{{ $t('fifths_mode_minor_variant_melodic_ascending') }}</td>
                <td class="variant-degree-cell">{{ $t('fifths_mode_minor_variant_melodic_descending') }}</td>
              </tr>
              <tr v-for="s in minorRows" :key="`minor-role-${s.degree}`">
                <td class="degree-cell">{{ s.degree }}</td>
                <td class="variant-label-cell">{{ s.role }}</td>
                <td class="note-cell">{{ s.natural }}</td>
                <td class="note-cell">{{ s.harmonic }}</td>
                <td class="note-cell">{{ s.melodicAscending }}</td>
                <td class="note-cell">{{ s.melodicDescending }}</td>
              </tr>
            </tbody>
          </table>
        </v-window-item>
      </v-window>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  mode?: string
}>()

const { t } = useI18n()
const {
  $getFifthsDisplayPitchSymbol,
  $getFifthsModeNotes,
  $getFifthsPitchSolfege,
  $getFifthsRelativeMinorScaleVariants,
  $getFifthsRelativeMinorDisplay,
} = useNuxtApp() as any

const majorRoles = [
  'fifths_mode_role_tonic',
  'fifths_mode_role_supertonic',
  'fifths_mode_role_mediant',
  'fifths_mode_role_subdominant',
  'fifths_mode_role_dominant',
  'fifths_mode_role_submediant',
  'fifths_mode_role_leading_tone',
]
const minorRoles = [
  'fifths_mode_role_tonic',
  'fifths_mode_role_supertonic',
  'fifths_mode_role_mediant',
  'fifths_mode_role_subdominant',
  'fifths_mode_role_dominant',
  'fifths_mode_role_submediant',
  'fifths_mode_role_subtonic',
]

const tab = ref('major')
const displayMode = computed(() => $getFifthsDisplayPitchSymbol(props.mode))
const relativeMinorDisplay = computed(() => $getFifthsRelativeMinorDisplay(props.mode) || '')
const majorTitle = computed(() => `${displayMode.value}${t('fifths_mode_major_suffix')}`)
const minorTitle = computed(() => `${String(relativeMinorDisplay.value || '').toLowerCase()}${t('fifths_mode_minor_suffix')}`)

const majorRows = computed(() => {
  const a = $getFifthsModeNotes(props.mode)
  return majorRoles.map((r, s) => ({
    degree: s + 1,
    note: $getFifthsDisplayPitchSymbol(a[s] || ''),
    solfege: $getFifthsPitchSolfege(a[s] || ''),
    role: t(r),
  }))
})
const minorRows = computed(() => {
  const a = $getFifthsRelativeMinorScaleVariants(props.mode)
  return minorRoles.map((r, s) => {
    const b = Array.isArray(a?.natural) ? a.natural : []
    const C = Array.isArray(a?.harmonic) ? a.harmonic : []
    const O = Array.isArray(a?.melodicAscending) ? a.melodicAscending : []
    const d = Array.isArray(a?.melodicDescendingByDegree) ? a.melodicDescendingByDegree : []
    return {
      degree: s + 1,
      role: t(r),
      natural: $getFifthsDisplayPitchSymbol(b[s] || ''),
      harmonic: $getFifthsDisplayPitchSymbol(C[s] || ''),
      melodicAscending: $getFifthsDisplayPitchSymbol(O[s] || ''),
      melodicDescending: $getFifthsDisplayPitchSymbol(d[s] || ''),
    }
  })
})
</script>
