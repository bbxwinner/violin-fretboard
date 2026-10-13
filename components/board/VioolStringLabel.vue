<template>
  <div
    class="string-container string-label-container"
    :style="{ height: store.preference.stringLength + 'px' }"
    @click="store.setCurrentNote(null)"
  >
    <finger-position-label v-for="n in visibleSemitones" :key="n" :nth-semitone="n" :is-left="isLeft" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ isLeft: boolean }>()

const store = useBoardStore()
const visibleSemitones = computed(() => store.visibleSemitones)
</script>
