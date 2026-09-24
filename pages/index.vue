<template>
  <v-container class="index-main">
    <v-col class="fill-height d-flex align-center justify-center">
      <div class="cards-grid">
        <NuxtLink :to="localePath('board')" class="no-style-link">
          <v-card class="feature-card" elevation="8">
            <v-card-text class="text-center py-16 px-8">
              <h1 class="card-title">{{ t('board_name') }}</h1>
              <p class="card-subtitle">{{ t('board_description') }}</p>
            </v-card-text>
          </v-card>
        </NuxtLink>
        <NuxtLink :to="localePath('fifths')" class="no-style-link">
          <v-card class="feature-card" elevation="8">
            <v-card-text class="text-center py-16 px-8">
              <h1 class="card-title">{{ t('fifths_name') }}</h1>
              <p class="card-subtitle">{{ t('fifths_description') }}</p>
            </v-card-text>
          </v-card>
        </NuxtLink>
      </div>
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<style scoped>
.no-style-link {
  color: inherit;
  text-decoration: none;
}
.index-main {
  min-height: calc(100vh - 64px);
}
.cards-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  width: min(1200px, 100%);
}
.feature-card {
  border-radius: 24px;
  height: 100%;
  width: 100%;
}
.card-title {
  font-size: clamp(2.2rem, 6vw, 4rem);
  line-height: 1.1;
  margin-bottom: 16px;
}
.card-subtitle {
  color: #000000b3;
  font-size: clamp(1rem, 2.3vw, 1.35rem);
  margin: 0;
}
</style>
