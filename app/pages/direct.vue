<template>
  <div class="bg-black h-screen text-white flex flex-col font-sans overflow-hidden max-w-[450px] mx-auto relative shadow-2xl border-x border-gray-800">
    
    <!-- Top Bar -->
    <header class="flex justify-between items-center px-4 py-3 bg-black z-50 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="goBack">
           <UIcon name="i-lucide-arrow-left" class="w-7 h-7" />
        </button>
        <span class="text-xl font-bold tracking-tight">{{ username || 'leandro_cardosoo._' }}</span>
      </div>
      
      <div class="flex items-center gap-5">
        <button>
          <UIcon name="i-lucide-video" class="w-7 h-7" />
        </button>
        <button>
          <UIcon name="i-lucide-square-pen" class="w-6 h-6" /> <!-- Edit/New Message Icon -->
        </button>
      </div>
    </header>

    <!-- Scrollable Content Area -->
    <div class="flex-1 overflow-y-auto scrollbar-hide pt-2">
        
        <!-- Search Bar -->
        <div class="px-4 mb-6" @click="openBlockedModal">
            <div class="bg-[#262626] rounded-xl flex items-center px-3 py-2.5 gap-3">
                 <!-- Search Icon / Meta AI Logo -->
                <img src="https://aifundingtracker.com/wp-content/uploads/2026/02/metaai-color-1.png" alt="Meta AI" class="w-6 h-6 object-contain" />
                <span class="text-gray-400 text-[15px]">Interaja com a Meta AI ou pesquise</span>
            </div>
        </div>


        <!-- Stories / Notes Rail -->
        <div class="mb-4">
          <!-- Added pt-10 to accommodate the absolute positioned bubbles -->
          <div class="flex overflow-x-auto gap-4 px-4 scrollbar-hide pt-10 pb-2">
            
            <!-- User Note -->
            <button class="flex flex-col items-center gap-1 min-w-[72px] relative shrink-0" @click="openBlockedModal">
               <div class="absolute -top-7 left-1/2 -translate-x-1/2 px-3.5 py-2.5 rounded-[20px] text-[11px] font-medium bg-[#333333] text-gray-200 leading-snug z-20 text-center min-w-[75px] max-w-[95px] shadow-md after:content-[''] after:absolute after:-bottom-1.5 after:left-4 after:w-3.5 after:h-3.5 after:bg-[#333333] after:rotate-45 after:rounded-sm after:-z-10">
                   Conte as<br>novidades
               </div>
               <div class="w-[72px] h-[72px] rounded-full relative">
                  <img :src="userProfilePic || getProxyUrl('https://github.com/shadcn.png')" class="w-full h-full rounded-full object-cover border border-gray-800" />
                  <div class="absolute bottom-0 right-0 bg-[#262626] rounded-full w-6 h-6 flex items-center justify-center border-2 border-black">
                     <UIcon name="i-lucide-plus" class="w-4 h-4 text-white" />
                  </div>
               </div>
               <span class="text-xs text-zinc-400 mt-1">Sua nota</span>
            </button>

            <!-- Mocked Notes from Real Data -->
            <button v-for="(note, index) in notesList" :key="note.username" class="flex flex-col items-center gap-1 min-w-[72px] relative shrink-0" @click="openBlockedModal">
                <!-- Balloon -->
               <div class="absolute -top-7 left-1/2 -translate-x-1/2 px-3.5 py-2.5 rounded-[20px] text-[11px] font-medium bg-[#333333] text-white leading-snug z-20 text-center min-w-[75px] max-w-[95px] shadow-md after:content-[''] after:absolute after:-bottom-1.5 after:left-4 after:w-3.5 after:h-3.5 after:bg-[#333333] after:rotate-45 after:rounded-sm after:-z-10">
                   <span v-html="note.noteText"></span>
               </div>
               
               <div class="w-[72px] h-[72px] rounded-full p-[2px] border border-gray-800">
                  <img :src="getProxyUrl(note.profile_pic_url)" 
                       class="w-full h-full rounded-full object-cover" />
               </div>
               
               <span class="text-xs text-white mt-1 truncate w-20 text-center">{{ note.username }}</span>
            </button>

          </div>
        </div>

        <!-- Messages Section -->
        <div class="px-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="font-bold text-lg">Mensagens</h2>
                <button class="text-[#0095f6] text-sm font-semibold">Pedidos (4)</button>
            </div>

            <!-- Message List -->
            <div class="flex flex-col gap-5">
                <div v-for="(msg, i) in displayMessages" :key="msg.username + i" class="flex items-center gap-3 cursor-pointer" @click="openBlockedModal">
                    <div class="w-14 h-14 rounded-full bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                         <img v-if="msg.img" :src="getProxyUrl(msg.img)" class="w-full h-full object-cover blur-md" />
                         <UIcon v-else name="i-lucide-user" class="w-6 h-6 text-zinc-600" />
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <div class="flex justify-between items-center">
                            <span class="font-normal text-white truncate">{{ msg.username }}</span>
                        </div>
                        <div class="flex items-center gap-1 text-sm text-gray-400">
                            <span :class="{'font-bold text-white': msg.unread}" class="truncate">{{ msg.text }}</span>
                            <span v-if="msg.time">· {{ msg.time }}</span>
                        </div>
                    </div>
                    <div class="shrink-0 flex items-center gap-3">
                        <div v-if="msg.unread" class="w-2.5 h-2.5 bg-[#0095f6] rounded-full"></div>
                        <UIcon name="i-lucide-camera" class="w-6 h-6 text-zinc-500" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Padding for bottom banner -->
        <div class="h-32"></div>

    </div>

    <!-- VIP Banner Overlay -->
    <div class="absolute bottom-6 left-4 right-4 bg-gradient-to-r from-[#6e4ef2] to-[#9834db] rounded-xl p-4 shadow-lg z-50">
        <div class="flex justify-between items-start mb-1">
             <div class="flex items-center gap-2 text-white font-bold text-sm">
                 <UIcon name="i-lucide-zap" class="w-4 h-4 fill-yellow-300 text-yellow-300" />
                 <span>Prévia disponível por {{ timerString }}</span>
                 <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 opacity-80" />
             </div>
             <button @click="navigateTo({ path: '/cta', query: { username } })" class="bg-white text-purple-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                 Tornar-se VIP
             </button>
        </div>
        <p class="text-[11px] text-white/90 leading-snug pr-20">
            Você ganhou 10 minutos para testar gratuitamente nossa ferramenta, mas para liberar todas as funcionalidades e ter acesso permanente é necessário ser um membro VIP.
        </p>
    </div>

    <!-- Blocked Action Modal -->
    <div v-if="showBlockedModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
       <div class="bg-[#1C1C1E] border border-gray-800 w-full max-w-[320px] rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl relative">
          
          <div class="mb-4">
             <UIcon name="i-lucide-triangle-alert" class="w-8 h-8 text-white" />
          </div>
          
          <h3 class="text-white text-lg font-bold mb-2">Ação bloqueada</h3>
          
          <p class="text-gray-400 text-sm mb-6 leading-relaxed">
             Seja um membro VIP do Stalkea.ai para ter acesso aos stories
          </p>
          
          <button @click="handleVipClick" class="w-full bg-[#8A7178] hover:bg-[#9d828a] text-white font-semibold py-3 rounded-xl transition-colors">
             Adquirir Acesso VIP
          </button>
          
          <button @click="showBlockedModal = false" class="absolute top-4 right-4 text-gray-500 hover:text-white">
             <UIcon name="i-lucide-x" class="w-5 h-5" />
          </button>
       </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { StalkeaService } from '~/services/stalkea.service'
import type { InstagramFeedResponse, PerfilPublico } from '~/types/instagram'

const route = useRoute()
const username = ref(route.query.username as string)
const feedData = ref<InstagramFeedResponse | null>(null)
const showBlockedModal = ref(false)

const openBlockedModal = () => {
   showBlockedModal.value = true
}

const handleVipClick = () => {
    navigateTo({ 
        path: '/cta',
        query: { username: username.value }
    })
    showBlockedModal.value = false
}

const goBack = () => {
    navigateTo({ path: '/feed', query: { username: username.value } })
}

const userProfilePic = computed(() => {
    const url = feedData.value?.perfil_buscado?.profile_pic_url
    return url ? getProxyUrl(url) : ''
})

// Mock texts for Notes
const noteTexts = [
    'Preguiça<br>Hoje 😩😴',
    'll 🤕ção Partido<br>Grupo Menos...',
    'O vontde<br>fudê a 3 😈',
    'Bom dia<br>família 🙏',
    'Sextouuu<br>🍻',
    'Saudades<br>disso 🏖️',
    'Mood de<br>hoje'
]

const messages = [
    { username: 'Fer*****', text: 'Oi delícia, adivinha o que vc esq...', time: 'Agora', unread: true, img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150' },
    { username: 'Ana*****', text: 'Encaminhou um reel de jonas...', time: '33 min', unread: true, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
    { username: 'Gab*****', text: 'Respondeu ao seu story', time: '2 h', unread: false, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { username: 'Jul*****', text: 'Mandei a foto...', time: '5 h', unread: false, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    { username: 'Car*****', text: 'kkkkkkkkkk', time: '1 d', unread: false, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
]

const displayMessages = computed(() => {
    const list = feedData.value?.lista_perfis_publicos
    const apiDMs = list ? list.slice(5, 12).map((profile, i) => {
        const textOptions = ['Respondeu ao seu story', 'Mandei a foto...', 'kkkkkkkkkk', 'Amanhã te falo', '🔥🔥🔥', '👀', 'Já viu aquilo?']
        const timeOptions = ['2 d', '3 d', '1 sem', '1 sem', '2 sem', '3 sem', '4 sem']
        return {
            username: profile.username.substring(0, 3) + '*******',
            text: textOptions[i % textOptions.length],
            time: timeOptions[i % timeOptions.length],
            unread: false,
            img: profile.profile_pic_url
        }
    }) : []
    
    return [...messages, ...apiDMs]
})

const notesList = computed(() => {
    const list = feedData.value?.lista_perfis_publicos
    if (!list) return []
    // Take first 5 items for notes
    return list.slice(0, 5).map((profile, index) => ({
        ...profile,
        username: profile.username.substring(0, 3) + '*******',
        noteText: noteTexts[index % noteTexts.length]
    }))
})

// Timer Logic
const { getRemainingTime } = useAccessTimer()
const remainingMs = ref(0) // Start at 0, will update immediately on mount

const timerString = computed(() => {
    const totalSeconds = Math.floor(remainingMs.value / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
})

let timerInterval: any

onMounted(async () => {
    // Timer
    remainingMs.value = getRemainingTime()
    timerInterval = setInterval(() => {
        remainingMs.value = getRemainingTime()
    }, 1000)

    // Fetch Data
    try {
        // Try cache first (to be synced with feed if possible, though cache is redundant if service handles it)
        // StalkeaService handles cache internally if implemented in memory/storage?
        // Checking existing service implementation: It checks CacheService.
        
        if (username.value) {
            feedData.value = await StalkeaService.getProfileFeed(username.value)
        }
    } catch (e) {
        console.error("Failed to load feed for direct", e)
    }
})

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
})

</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
