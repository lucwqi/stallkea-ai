<template>
  <div 
    class="relative w-full max-w-sm mx-auto p-[2px] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1"
    :class="gradientBg"
  >
    <!-- Badge -->
    <div v-if="badge" class="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
      <div 
        class="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg uppercase tracking-wider whitespace-nowrap"
        :class="badgeClass"
      >
        {{ badge }}
      </div>
    </div>

    <!-- Outer Glow/Border -->
    <div class="bg-[#111111] rounded-[30px] p-5 sm:p-7 h-full flex flex-col items-center relative overflow-hidden">
      
      <!-- Card Header -->
      <div class="text-center mb-4">
        <h2 
          class="text-3xl font-bold bg-clip-text text-transparent mb-1"
          :class="gradientText"
        >
          {{ title }}
        </h2>
        <p class="text-white text-sm tracking-widest uppercase">Plano</p>
      </div>

      <!-- Feature Container -->
      <div class="w-full bg-[#1A1A1A] border border-[#333] rounded-[24px] p-4 mb-5 relative flex-grow flex flex-col">
        <!-- Price -->
        <div class="text-center mb-5">
          <div v-if="originalPrice" class="text-gray-500 text-sm line-through font-medium mb-1">{{ originalPrice }}</div>
          <span 
            class="text-5xl font-bold bg-clip-text text-transparent"
            :class="gradientText"
          >
            {{ price }}
          </span>
        </div>

        <!-- Features List -->
        <ul class="space-y-1.5 flex-grow">
          <li v-for="(feature, index) in features" :key="index" class="flex items-start gap-2">
            <!-- Included -->
            <template v-if="feature.included">
              <UIcon name="i-heroicons-check" class="w-4 h-4 shrink-0 mt-0.5" :class="iconColor" />
              <span class="text-xs text-gray-300 leading-relaxed">
                {{ feature.text }}
                <span v-if="feature.subtext" class="text-gray-500">{{ feature.subtext }}</span>
              </span>
            </template>
            <!-- Excluded -->
            <template v-else>
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-red-900 shrink-0 mt-0.5" />
              <span class="text-xs text-gray-600 line-through leading-relaxed">{{ feature.text }}</span>
            </template>
          </li>
        </ul>

        <!-- Button Overlay Container -->
        <div class="mt-6">
           <button 
            class="w-full text-white rounded-[16px] py-3.5 shadow-lg transition-all active:scale-95 hover:shadow-xl"
            :class="buttonClass"
            @click="$emit('select')"
           >
            <span class="block text-lg font-bold">{{ buttonText }}</span>
            <span class="block text-[10px] font-medium opacity-90">{{ subtitle }}</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  text: string
  subtext?: string
  included: boolean
}

const props = defineProps<{
  title: string
  price: string
  originalPrice?: string
  badge?: string
  theme: 'gold' | 'silver' | 'bronze' | 'diamond' | 'premium'
  features: Feature[]
  buttonText: string
  subtitle: string
}>()

defineEmits(['select'])

// Computed classes for theming
const gradientBg = computed(() => {
  switch (props.theme) {
    case 'gold': return 'bg-gradient-to-b from-[#d4af37] via-[#f4e89a] to-[#d4af37]'
    case 'diamond': return 'bg-gradient-to-b from-[#4facfe] via-[#00f2fe] to-[#4facfe]'
    case 'premium': return 'bg-gradient-to-b from-[#8E2DE2] via-[#A855F7] to-[#4A00E0]'
    case 'silver': return 'bg-gradient-to-b from-[#E0E0E0] via-[#F5F5F5] to-[#BDBDBD]'
    case 'bronze': return 'bg-gradient-to-b from-[#CD7F32] via-[#E6AA68] to-[#A0522D]'
    default: return 'bg-gradient-to-b from-[#d4af37] via-[#f4e89a] to-[#d4af37]'
  }
})

const gradientText = computed(() => {
  switch (props.theme) {
    case 'gold': return 'bg-gradient-to-r from-[#d4af37] via-[#f4e89a] to-[#d4af37]'
    case 'diamond': return 'bg-gradient-to-r from-[#4facfe] via-[#00f2fe] to-[#4facfe]'
    case 'premium': return 'bg-gradient-to-r from-[#8E2DE2] via-[#D8B4FE] to-[#4A00E0]'
    case 'silver': return 'bg-gradient-to-r from-[#E0E0E0] via-[#F5F5F5] to-[#BDBDBD]'
    case 'bronze': return 'bg-gradient-to-r from-[#CD7F32] via-[#E6AA68] to-[#A0522D]'
    default: return 'bg-gradient-to-r from-[#d4af37] via-[#f4e89a] to-[#d4af37]'
  }
})

const iconColor = computed(() => {
  switch (props.theme) {
    case 'gold': return 'text-[#d4af37]'
    case 'diamond': return 'text-[#00f2fe]'
    case 'premium': return 'text-[#A855F7]'
    case 'silver': return 'text-[#E0E0E0]'
    case 'bronze': return 'text-[#CD7F32]'
    default: return 'text-[#d4af37]'
  }
})

const buttonClass = computed(() => {
  switch (props.theme) {
    case 'gold': return 'bg-gradient-to-r from-[#C69C2F] to-[#E3C669] hover:from-[#d4af37] hover:to-[#f4e89a] shadow-[0_4px_20px_rgba(198,156,47,0.3)]'
    case 'diamond': return 'bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:from-[#4facfe] hover:to-[#00f2fe] shadow-[0_4px_20px_rgba(0,198,255,0.3)]'
    case 'premium': return 'bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] hover:from-[#A855F7] hover:to-[#6B21A8] shadow-[0_4px_20px_rgba(142,45,226,0.3)]'
    case 'silver': return 'bg-gradient-to-r from-[#757575] to-[#9E9E9E] hover:from-[#9E9E9E] hover:to-[#E0E0E0] shadow-[0_4px_20px_rgba(158,158,158,0.3)]'
    case 'bronze': return 'bg-gradient-to-r from-[#8B4513] to-[#CD853F] hover:from-[#CD7F32] hover:to-[#E6AA68] shadow-[0_4px_20px_rgba(205,127,50,0.3)]'
    default: return 'bg-gradient-to-r from-[#C69C2F] to-[#E3C669]'
  }
})

const badgeClass = computed(() => {
  switch (props.theme) {
    case 'gold': return 'bg-gradient-to-r from-[#C69C2F] to-[#E3C669]'
    case 'diamond': return 'bg-gradient-to-r from-[#00c6ff] to-[#0072ff]'
    case 'premium': return 'bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0]'
    default: return 'bg-gray-600'
  }
})
</script>
