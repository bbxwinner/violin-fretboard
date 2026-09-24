<template>
  <div
    class="string-container string-label-container"
    :style="{ height: store.preference.stringLength + 'px' }"
    @click="store.setCurrentNote(null)"
  >
    <finger-position-label v-for="i in semitones" :key="i" :nth-semitone="i - 1" :is-left="isLeft" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ isLeft: boolean }>()

const store = useBoardStore()
const semitones = computed(() => store.preference.semitonesPerString)
</script>
