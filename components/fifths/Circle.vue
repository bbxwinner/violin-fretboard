<template>
  <div class="fifths-circle-wrap">
    <v-btn
      class="fifths-circle-settings-btn"
      icon="mdi-cog"
      size="small"
      variant="elevated"
      color="white"
      @click="store.setPreferenceDialogOpen(true)"
    />
    <v-dialog v-model="dialog" max-width="420">
      <fifths-preference />
    </v-dialog>
    <div class="fifths-circle-ring-outer" />
    <div class="fifths-circle-ring-inner" />
    <div class="fifths-circle-core">
      <div :id="staffId" ref="coreStaffEl" class="fifths-circle-core-staff" />
    </div>
    <button
      v-for="(T, B) in nodes"
      :key="T.major"
      :class="['fifths-circle-node-major', { 'fifths-circle-node-major-active': T.major === modelValue }]"
      :style="nodeStyle(B, '--major-radius')"
      type="button"
      @click="setMode(T.major)"
    >
      <span class="node-major">{{ T.majorDisplay }}</span>
      <span v-if="T.majorEnharmonicDisplay" class="node-major-alt">{{ T.majorEnharmonicDisplay }}</span>
    </button>
    <div
      v-for="T in nodes"
      :key="`${T.major}-acc`"
      class="fifths-circle-node-accidental"
      :style="nodeStyleAccidental(T)"
    >
      <span class="node-accidental">{{ T.accidentalLabel }}</span>
    </div>
    <div v-for="T in nodes" :key="`${T.major}-minor`" class="fifths-circle-node-minor" :style="nodeStyleMinor(T)">
      <span class="node-minor">{{ T.minor }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
}>()
const emit = defineEmits(['update:modelValue'])

const {
  $vexflow,
  $fifthsCircleModes,
  $getFifthsDisplayPitchSymbol,
  $getFifthsEnharmonicDisplayPitch,
  $getFifthsRelativeMinorDisplay,
  $getFifthsModeAccidentalLabel,
} = useNuxtApp() as any

const store = useFifthStore()
const coreStaffEl = ref<HTMLElement | null>(null)
const staffId = `fifths-circle-core-staff-${Math.random().toString(36).slice(2, 10)}`

const value = computed(() => props.modelValue)
const dialog = computed({
  get: () => store.isPreferenceDialogOpen,
  set: (d: boolean) => store.setPreferenceDialogOpen(!!d),
})
const nodes = computed(() =>
  $fifthsCircleModes.map((d: string) => ({
    major: d,
    majorDisplay: $getFifthsDisplayPitchSymbol(d),
    majorEnharmonicDisplay: $getFifthsEnharmonicDisplayPitch(d),
    accidentalLabel: $getFifthsModeAccidentalLabel(d) || '',
    minor: $getFifthsRelativeMinorDisplay(d) || '',
  })),
)

function setMode(d: string) {
  emit('update:modelValue', d)
}
function isEditableTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const M = el.tagName
  if (M === 'INPUT' || M === 'TEXTAREA' || M === 'SELECT') return true
  return !!(el.isContentEditable || el.closest('[contenteditable="true"]'))
}
function cycle(d: number) {
  const M = $fifthsCircleModes.length
  if (!M) return
  const A = $fifthsCircleModes.indexOf(value.value)
  const B = ((A >= 0 ? A : 0) + d + M) % M
  setMode($fifthsCircleModes[B])
}
function onKeydown(d: KeyboardEvent) {
  if ((d.defaultPrevented || d.altKey || d.ctrlKey || d.metaKey) || isEditableTarget(d.target)) return
  if (d.key === 'ArrowRight') {
    d.preventDefault()
    cycle(1)
    return
  }
  if (d.key === 'ArrowLeft') {
    d.preventDefault()
    cycle(-1)
  }
}
function nodeStyle(B: number, M: string) {
  const A = -90 + (B * 360) / nodes.value.length
  return {
    transform: `translate(-50%, -50%) rotate(${A}deg) translate(var(${M})) rotate(${-A}deg)`,
  }
}
function nodeStyleAccidental(T: { major: string }) {
  const B = $fifthsCircleModes.indexOf(T.major)
  return nodeStyle(B, '--accidental-radius')
}
function nodeStyleMinor(T: { major: string }) {
  const B = $fifthsCircleModes.indexOf(T.major)
  return nodeStyle(B, '--minor-radius')
}
function drawCoreStaff() {
  if (!coreStaffEl.value || !$vexflow) return
  coreStaffEl.value.innerHTML = ''
  const { Factory } = $vexflow
  const M = new Factory({ renderer: { elementId: coreStaffEl.value.id, width: 132, height: 88 } })
  const T = M.System({ x: 6, y: -8, width: 120 }).addStave({ voices: [] })
  T.addClef('treble')
  if (value.value) T.addKeySignature(value.value)
  M.draw()
}

onMounted(() => {
  drawCoreStaff()
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
watch(value, () => {
  drawCoreStaff()
})
</script>
