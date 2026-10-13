<template>
  <!-- 窄屏（<960px）：指板下方的横向把位标签行 -->
  <div v-if="mobile" class="position-labels-row">
    <div
      v-for="p in HAND_POSITIONS"
      :key="p"
      class="hand-position-label hand-position-label-chip"
      :class="{ 'hand-position-label-active': store.preference.handPosition === p }"
      @click="toggle(p)"
    >
      {{ t('board_hand_position_nth', { n: p }) }}
    </div>
  </div>
  <!-- 宽屏：右侧灰色半音条右边的纵向把位标签列 -->
  <div v-else class="position-label-container" :style="{ height: store.preference.stringLength + 'px' }">
    <div
      v-for="p in HAND_POSITIONS"
      :key="p"
      class="hand-position-label"
      :class="{ 'hand-position-label-active': store.preference.handPosition === p }"
      :style="{ top: topOf(p) }"
      @click="toggle(p)"
    >
      {{ t('board_hand_position_nth', { n: p }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { HAND_POSITIONS, getHandPositionRange } from '../../utils/handPositions'
import { useBoardPreference } from '../../composables/useBoardPreference'

defineProps<{ mobile?: boolean }>()

const { t } = useI18n()
const store = useBoardStore()
const position = useBoardPreference('handPosition')

// 标签垂直对齐该把位最靠近琴头（指板上方）的灰色半音条，即起始行
// toFixed(2) 与 getPositionOnString 一致，避免 Node/浏览器浮点末位差异导致 hydration mismatch
function topOf(p: number): string {
  const range = getHandPositionRange(p)
  if (!range) return '0'
  const pct = parseFloat((Math.pow(2, -range.startRow / 12) * 100).toFixed(2))
  return `calc(100% - ${pct}%)`
}

// 点击 = 选中该把位；再次点击 = 取消（回到「全部」）
function toggle(p: number) {
  position.value = store.preference.handPosition === p ? 0 : p
}
</script>

<style scoped>
.position-label-container {
  flex-shrink: 0;
  margin: 0 10px 0 2px;
  position: relative;
  width: 78px;
}
.hand-position-label {
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 0.72rem;
  left: 0;
  line-height: 1.5;
  padding: 1px 5px;
  position: absolute;
  transform: translateY(-50%);
  user-select: none;
  white-space: nowrap;
}
.hand-position-label:hover {
  background-color: rgba(0, 0, 0, 0.08);
}
.hand-position-label-active {
  background-color: var(--v-theme-primary, #1976d2);
  color: var(--v-theme-on-primary, #fff);
  font-weight: 600;
}
.position-labels-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  padding: 12px 16px 0;
}
.hand-position-label-chip {
  position: static;
  transform: none;
  left: auto;
  padding: 3px 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 14px;
  background-color: rgba(0, 0, 0, 0.03);
  font-size: 0.72rem;
}
.hand-position-label-chip.hand-position-label-active {
  border-color: var(--v-theme-primary, #1976d2);
}
</style>
