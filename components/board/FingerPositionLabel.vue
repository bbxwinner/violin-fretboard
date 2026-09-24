<template>
  <a class="finger-position-label" :style="style" @click="toggle">
    <div v-if="isLeft && store.hasDisplayOption(4)" class="finger-position-label-text">
      {{ info.position.percentage }}%
    </div>
    <div v-if="!isLeft && store.hasDisplayOption(5)" class="finger-position-label-text">{{ nthSemitone }}</div>
  </a>
</template>

<script setup lang="ts">
import { DP } from '../../utils/music'

const props = defineProps<{ nthSemitone: number; isLeft: boolean }>()

const store = useBoardStore()
const { $getPositionOnString } = useNuxtApp() as any

const info = computed(() => $getPositionOnString(props.nthSemitone, 'A', 440, 4))
const style = computed(() => ({
  top: `calc(100% - ${info.value.position.percentage}%)`,
  backgroundColor: DP[store.fingerPositionLabelColorArray[props.nthSemitone] || 0],
}))

function toggle() {
  store.toggleFingerPositionLabelColor(props.nthSemitone)
  store.savePreferenceLocalStorage()
}
</script>
