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
      :style="nodeStyle(Number(B), '--major-radius')"
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
  $vexflowFontsReady,
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
async function drawCoreStaff() {
  if (!coreStaffEl.value || !$vexflow) return
  coreStaffEl.value.innerHTML = ''
  try {
    if ($vexflowFontsReady) {
      await Promise.race([$vexflowFontsReady, new Promise((resolve) => setTimeout(resolve, 8000))])
    }
    const { Factory } = $vexflow
    const M = new Factory({ renderer: { elementId: coreStaffEl.value.id, width: 132, height: 88 } })
    const T = M.System({ x: 6, y: -8, width: 120 }).addStave({ voices: [] })
    T.addClef('treble')
    if (value.value) T.addKeySignature(value.value)
    M.draw()
  } catch (err) {
    console.error('Failed to draw fifths circle staff:', err)
  }
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

<style scoped>
.fifths-circle-wrap {
  --outer-ring-size: 420px;
  --inner-ring-size: 298px;
  --inner-ring-border: 30px;
  --major-radius: 178px;
  --accidental-radius: calc(var(--inner-ring-size) / 2 - var(--inner-ring-border) / 2);
  --minor-radius: calc(var(--inner-ring-size) / 2 - var(--inner-ring-border) - 12px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 440px;
  height: 440px;
}

.fifths-circle-settings-btn {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
}

.fifths-circle-ring-outer {
  position: absolute;
  width: var(--outer-ring-size);
  height: var(--outer-ring-size);
  border: 3px solid rgba(0, 0, 0, 0.35);
  border-radius: 50%;
  background: radial-gradient(circle at center, #ffffffeb 0, #f7f9fcf7 65%, #e9edf3fa);
}

.fifths-circle-ring-inner {
  position: absolute;
  width: var(--inner-ring-size);
  height: var(--inner-ring-size);
  border: var(--inner-ring-border) solid #374151;
  border-radius: 50%;
  background: transparent;
}

.fifths-circle-core {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 144px;
  height: 144px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  background: #ffffffd9;
}

.fifths-circle-core-staff {
  width: 132px;
  height: 88px;
  opacity: 0.72;
  pointer-events: none;
}

.fifths-circle-node-major {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  padding: 0;
  border: 2px solid rgba(0, 0, 0, 0.25);
  border-radius: 50%;
  background: #fffffff2;
  color: #1f2937;
  line-height: 1.05;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.fifths-circle-node-major:hover {
  background: #dbeafecc;
  border-color: #2563eb;
}

.fifths-circle-node-major-active {
  background: #fef3c8d9;
  border: 3px solid #1d4ed8;
}

.fifths-circle-node-accidental,
.fifths-circle-node-minor {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  box-shadow: none;
  background: transparent;
  pointer-events: none;
}

.fifths-circle-node-minor {
  width: auto;
  height: auto;
}

.node-major {
  font-size: 0.88rem;
  font-weight: 700;
}

.node-major-alt {
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1;
  opacity: 0.84;
}

.node-minor {
  color: #111827;
  font-size: 0.96rem;
  font-weight: 700;
  opacity: 0.96;
  text-shadow: 0 1px 0 hsla(0, 0%, 100%, 0.65);
}

.node-accidental {
  color: #f9fafb;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

@media (max-width: 480px) {
  .fifths-circle-wrap {
    --major-radius: 142px;
    --outer-ring-size: 336px;
    --inner-ring-size: 236px;
    --inner-ring-border: 24px;
    width: 372px;
    height: 372px;
  }

  .node-minor {
    font-size: 0.88rem;
  }

  .node-accidental {
    font-size: 0.72rem;
  }
}
</style>
