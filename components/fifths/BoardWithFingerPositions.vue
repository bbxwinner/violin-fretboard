<template>
  <div class="fifths-overlay-host">
    <fifths-board />
    <fifths-finger-positions :mode="mode" :semitone-count="semitoneCount" />
    <fifths-hand-position :semitone-count="semitoneCount" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    mode?: string
    semitoneCount?: number
  }>(),
  {
    mode: 'C',
    semitoneCount: 30,
  },
)
</script>

<style scoped>
.fifths-overlay-host {
  position: relative;
  overflow: visible;
  width: -moz-fit-content;
  width: fit-content;
}
</style>
