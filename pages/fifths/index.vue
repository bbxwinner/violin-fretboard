<template>
  <v-container>
    <v-card>
      <div class="fifths-layout">
        <aside class="fifths-circle-side">
          <fifths-circle v-model="mode" />
          <fifths-mode-info :mode="mode" />
        </aside>
        <section class="fifths-board-side">
          <fifths-board-with-finger-positions :mode="mode" />
        </section>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  appBarTitleKey: 'fifths_name',
  seoTitleKey: 'fifths_name',
  seoDescriptionKey: 'fifths_description',
})

const { $fifthsCircleModes } = useNuxtApp() as any
const store = useFifthStore()

const mode = computed({
  get: () => store.selectedMode,
  set: (l: string) => store.setSelectedMode(String(l || '')),
})

onMounted(() => {
  store.loadPreferenceLocalStorage()
  store.ensureSelectedMode($fifthsCircleModes)
})
</script>

<style>
.fifths-layout {
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
}
@media (min-width: 960px) {
  .fifths-layout {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
}
.fifths-circle-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.fifths-board-side {
  width: 100%;
  overflow-x: auto;
}
.fifths-circle-wrap {
  --major-radius: 150px;
  --accidental-radius: 190px;
  --minor-radius: 110px;
  position: relative;
  width: 420px;
  height: 420px;
}
.fifths-circle-settings-btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
}
.fifths-circle-ring-outer,
.fifths-circle-ring-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
}
.fifths-circle-ring-outer {
  width: 300px;
  height: 300px;
  border: 1px solid #e0e0e0;
}
.fifths-circle-ring-inner {
  width: 220px;
  height: 220px;
  border: 1px dashed #e0e0e0;
}
.fifths-circle-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.fifths-circle-core-staff {
  width: 132px;
  height: 88px;
}
.fifths-circle-node-major,
.fifths-circle-node-accidental,
.fifths-circle-node-minor {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fifths-circle-node-major {
  width: 56px;
  height: 56px;
  padding: 0;
  border: 2px solid #0066cc;
  border-radius: 50%;
  background: #fff;
  color: #0066cc;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  z-index: 2;
}
.fifths-circle-node-major-active {
  background: #0066cc;
  color: #fff;
}
.node-major-alt {
  font-size: 0.6rem;
  margin-left: 1px;
}
.fifths-circle-node-accidental {
  width: 30px;
  height: 30px;
  background: #f5f5f5;
  border-radius: 50%;
  pointer-events: none;
}
.node-accidental {
  font-size: 0.7rem;
  color: #666;
}
.fifths-circle-node-minor {
  width: 34px;
  height: 34px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  pointer-events: none;
}
.node-minor {
  font-size: 0.75rem;
  color: #555;
}
.fifths-mode-info {
  width: min(560px, 100%);
}
.mode-tabs-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 8px;
}
.mode-notes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.mode-notes-table td {
  border-bottom: 1px solid #eee;
  padding: 6px 8px;
}
.mode-notes-table .note-cell {
  font-weight: 700;
}
.mode-minor-variants-table .variant-label-cell {
  font-weight: 700;
}
.fifths-overlay-host {
  position: relative;
  display: inline-block;
}
.fifths-board-wrap {
  padding: 16px 0 8px;
}
.fifths-board {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.string-column {
  width: 52px;
}
.string-notes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.note-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 52px;
  height: 52px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  font-size: 0.95rem;
}
.note-cell-natural {
  border-color: #999;
  font-weight: 700;
}
.note-accidental {
  color: #666;
}
.note-cell-highlight-mode.note-cell-highlight-hit {
  border-color: #ff6600;
  background: #fff3e0;
}
.note-cell-highlight-mode.note-cell-highlight-miss {
  opacity: 0.35;
}
.fifths-finger-positions-host {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.fifths-finger-positions {
  position: absolute;
}
.string-column-highlight {
  width: 52px;
  margin: 0 5px;
}
.string-notes-highlight {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.note-highlight-cell {
  width: 52px;
  height: 52px;
  border: 2px solid transparent;
  border-radius: 6px;
}
.note-highlight-hit {
  border-color: rgba(255, 102, 0, 0.55);
  background: rgba(255, 215, 0, 0.12);
}
.fifths-hand-position-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.position-box {
  position: absolute;
  border: 3px solid;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
}
.position-label {
  position: absolute;
  top: 2px;
  left: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}
.fifths-preference-card {
  width: 100%;
}
.fifths-pref-section-title {
  font-weight: 700;
  margin-bottom: 8px;
}
.fifths-pref-section-title-with-margin {
  margin-top: 20px;
}
.fifths-position-ranges {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.fifths-position-range-header,
.fifths-position-range-row {
  display: grid;
  grid-template-columns: 1fr 90px 90px;
  gap: 8px;
  align-items: center;
}
.fifths-pref-checkbox {
  min-width: 0;
}
.fifths-position-ranges-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}
.fifths-pref-slider-value {
  min-width: 70px;
  text-align: right;
}
</style>
