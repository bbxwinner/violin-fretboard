<template>
  <div class="fifths-board-wrap">
    <div class="fifths-board">
      <fifths-board-string type="G" />
      <fifths-board-string type="D" />
      <fifths-board-string type="A" />
      <fifths-board-string type="E" />
    </div>
  </div>
</template>

<style scoped>
.fifths-board-wrap {
  position: relative;
  width: -moz-fit-content;
  width: fit-content;
}

.fifths-board {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 10px 8px;
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  border-radius: 12px;
  background:
    linear-gradient(90deg, #ffffff0f, #ffffff04 14%, #0000000f 32%, #ffffff03 54%, #0000000d 72%, #ffffff05),
    linear-gradient(180deg, #1a1a1a, #0f0f10 55%, #050505);
  box-shadow: inset 0 0 0 1px #ffffff0a, 0 8px 20px #00000040;
}

.fifths-board::before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #ffffff1f, #ffffff05 12%, #fff0, #ffffff06 52%, #fff0 76%, #ffffff17);
  pointer-events: none;
  content: "";
}
</style>
