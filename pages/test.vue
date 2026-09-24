<template>
  <v-container>
    <v-card>
      <v-card-text>
        <canvas ref="canvas" width="400" height="600" class="test-canvas" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')!
  ctx.clearRect(0, 0, 400, 600)
  // Draw a simple reference staff grid (visual test scaffold).
  ctx.strokeStyle = '#aaa'
  ctx.lineWidth = 1
  for (let r = 0; r < 5; r++) {
    ctx.beginPath()
    ctx.moveTo(20, 40 + r * 16)
    ctx.lineTo(380, 40 + r * 16)
    ctx.stroke()
  }
  ctx.strokeStyle = '#0066cc'
  const notes = [0, 2, 4, 5, 7, 9, 11, 12]
  notes.forEach((n, i) => {
    ctx.beginPath()
    ctx.arc(40 + i * 40, 40 + (5 - (n % 8)) * 8, 6, 0, Math.PI * 2)
    ctx.fillStyle = i % 2 ? '#fff' : '#222'
    ctx.fill()
    ctx.stroke()
  })
})
</script>