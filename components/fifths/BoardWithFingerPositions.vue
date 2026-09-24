<template>
  <div class="fifths-overlay-host">
    <fifths-board />
    <fifths-finger-positions :mode="mode" :semitone-count="semitoneCount" />
    <fifths-hand-position :semitone-count="semitoneCount" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  mode?: string
  semitoneCount?: number
}>()
</script>
