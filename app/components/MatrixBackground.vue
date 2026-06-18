<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden opacity-15">
    <div class="matrix-grid flex flex-wrap gap-2 text-[10px] font-mono leading-none select-none">
      <span v-for="n in 2000" :key="n" class="text-purple-500 whitespace-nowrap">
        {{ characters[Math.floor(Math.random() * characters.length)] }}
      </span>
    </div>
  </div>
</template>

<script setup>
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789STALKEA'.split('')
</script>

<style scoped>
.matrix-grid {
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  width: 100%;
}
</style>
