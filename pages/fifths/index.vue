<template>
  <v-container>
    <div class="fifths-layout">
      <aside class="fifths-circle-side">
        <fifths-circle v-model="mode" />
        <fifths-mode-info :mode="mode" />
      </aside>
      <section class="fifths-board-side">
        <fifths-board-with-finger-positions :mode="mode" />
      </section>
    </div>
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

<style scoped>
.fifths-layout {
  display: grid;
  grid-template-columns: auto auto;
  gap: 24px;
  align-items: start;
  width: -moz-max-content;
  width: max-content;
  max-width: 100%;
  margin: 0 auto;
}

.fifths-circle-side {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: calc(var(--v-layout-top, 64px) + 12px);
  z-index: 60;
}

.fifths-board-side {
  min-width: 0;
  overflow: visible;
}

@media (max-width: 640px) {
  .fifths-layout {
    grid-template-columns: 1fr;
    width: 100%;
  }

  .fifths-circle-side {
    position: static;
    justify-content: center;
    margin-bottom: 16px;
  }

  .fifths-board-side {
    padding-left: 0;
  }
}
</style>
