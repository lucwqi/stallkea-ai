<template>
  <div class="min-h-screen bg-[#050505] text-white font-sans flex flex-col items-center pb-20">
    <!-- Header -->
    <header class="w-full max-w-[450px] p-6 text-center border-b border-gray-800/50">
      <div class="flex items-center justify-center gap-2 mb-2">
          <UIcon name="i-lucide-lock" class="w-4 h-4 text-green-500" />
          <span class="text-xs text-green-500 font-bold tracking-widest uppercase">Pagamento Seguro</span>
      </div>
      <h1 class="text-xl font-bold text-white">Finalizar Pagamento</h1>
    </header>

    <div class="w-full max-w-[450px] px-6 mt-6 flex-1 flex flex-col">
        
        <!-- Resumo do Pedido -->
        <div class="bg-[#111113] border border-purple-500/20 rounded-2xl p-5 mb-6">
             <div class="flex justify-between items-center mb-4">
                 <div class="flex items-center gap-3">
                     <div class="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                         <UIcon name="i-lucide-zap" class="w-5 h-5 text-purple-400" />
                     </div>
                     <div class="flex flex-col">
                         <span class="font-bold text-sm">Acesso VIP Stalkea</span>
                         <span class="text-[10px] text-gray-400">Plano Vitalício</span>
                     </div>
                 </div>
                 <span class="font-black text-lg text-white">R$ {{ currentPriceFormatted }}</span>
             </div>
             
             <div class="h-[1px] w-full bg-gray-800 mb-4"></div>
             
             <!-- Timer -->
             <div class="flex items-center justify-center gap-2 text-red-400 bg-red-400/10 py-2 rounded-lg">
                 <UIcon name="i-lucide-timer" class="w-4 h-4" />
                 <span class="text-xs font-bold">Pague em até {{ timerString }} para garantir a vaga</span>
             </div>
        </div>

        <!-- Step 1: Formulário do Lead -->
        <div v-if="step === 1" class="flex-1 flex flex-col">
            <h2 class="text-white font-bold text-lg mb-4">Preencha seus dados</h2>
            
            <form @submit.prevent="generatePix" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label class="text-xs text-gray-400 ml-1">Nome completo</label>
                    <input 
                        v-model="leadForm.name" 
                        type="text" 
                        required 
                        placeholder="Ex: João da Silva"
                        class="bg-[#2A2A2E] border border-gray-600 text-white placeholder-gray-500 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:bg-[#323236] transition-colors"
                    />
                </div>

                <!-- Order Bumps -->
                <div class="space-y-3 w-full mt-4">
                    <h3 class="text-white font-bold text-sm mb-2">Adicione ao seu pedido:</h3>
                    
                    <!-- Localização em Tempo Real -->
                    <div class="bg-[#1A1A1D] border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3" 
                        :class="selectedUpsells.has('location') ? 'border-purple-500 bg-purple-500/10' : 'border-purple-500/20 hover:border-purple-500/50'"
                        @click="selectUpsell('location')">
                        <div class="w-5 h-5 rounded border border-gray-500 flex items-center justify-center flex-shrink-0" :class="selectedUpsells.has('location') ? 'bg-purple-500 border-purple-500' : ''">
                            <UIcon v-if="selectedUpsells.has('location')" name="i-lucide-check" class="w-3 h-3 text-white" />
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-center">
                                <h3 class="text-white font-bold text-sm">Rastreamento Geográfico</h3>
                                <span class="text-green-400 font-bold text-sm whitespace-nowrap ml-2">+R$ 11,73</span>
                            </div>
                            <p class="text-gray-400 text-[10px] mt-1 leading-tight">Localize em tempo real onde a pessoa está agora e todos os lugares que visitou</p>
                        </div>
                    </div>

                    <!-- Histórico de Chamadas -->
                    <div class="bg-[#1A1A1D] border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3" 
                        :class="selectedUpsells.has('calls') ? 'border-purple-500 bg-purple-500/10' : 'border-purple-500/20 hover:border-purple-500/50'"
                        @click="selectUpsell('calls')">
                        <div class="w-5 h-5 rounded border border-gray-500 flex items-center justify-center flex-shrink-0" :class="selectedUpsells.has('calls') ? 'bg-purple-500 border-purple-500' : ''">
                            <UIcon v-if="selectedUpsells.has('calls')" name="i-lucide-check" class="w-3 h-3 text-white" />
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-center">
                                <h3 class="text-white font-bold text-sm">Histórico de Chamadas</h3>
                                <span class="text-green-400 font-bold text-sm whitespace-nowrap ml-2">+R$ 8,71</span>
                            </div>
                            <p class="text-gray-400 text-[10px] mt-1 leading-tight">Veja todas as chamadas realizadas e recebidas com duração e horários</p>
                        </div>
                    </div>

                    <!-- WhatsApp -->
                    <div class="bg-[#1A1A1D] border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3" 
                        :class="selectedUpsells.has('whatsapp') ? 'border-purple-500 bg-purple-500/10' : 'border-purple-500/20 hover:border-purple-500/50'"
                        @click="selectUpsell('whatsapp')">
                        <div class="w-5 h-5 rounded border border-gray-500 flex items-center justify-center flex-shrink-0" :class="selectedUpsells.has('whatsapp') ? 'bg-purple-500 border-purple-500' : ''">
                            <UIcon v-if="selectedUpsells.has('whatsapp')" name="i-lucide-check" class="w-3 h-3 text-white" />
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-center">
                                <h3 class="text-white font-bold text-sm">Monitoramento WhatsApp</h3>
                                <span class="text-green-400 font-bold text-sm whitespace-nowrap ml-2">+R$ 14,67</span>
                            </div>
                            <p class="text-gray-400 text-[10px] mt-1 leading-tight">Acesse todas as conversas, fotos e vídeos do WhatsApp incluindo apagadas</p>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    :disabled="loadingPix"
                    class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-lg flex items-center justify-center disabled:opacity-70"
                >
                    <UIcon v-if="loadingPix" name="i-lucide-loader-2" class="w-5 h-5 animate-spin mr-2" />
                    <span>Gerar Código PIX</span>
                </button>
            </form>
        </div>

        <!-- Step 3: Removed -->

        <!-- Step 2: Área do PIX -->
        <div v-if="step === 2" class="flex-1 flex flex-col items-center">
            
            <p class="text-center text-sm text-gray-300 mb-6">
                Abra o app do seu banco e escolha a opção<br>
                <span class="font-bold text-purple-400">PIX Copia e Cola</span> ou escaneie o QR Code.
            </p>

            <!-- QR Code Box -->
            <div class="bg-white p-3 rounded-2xl mb-6 shadow-[0_0_30px_rgba(139,92,246,0.15)] border-4 border-purple-500/20">
                <img 
                    v-if="qrCodeDataUrl" 
                    :src="qrCodeDataUrl" 
                    class="w-[200px] h-[200px] object-contain"
                />
                <div v-else class="w-[200px] h-[200px] bg-gray-100 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                    <UIcon name="i-lucide-qr-code" class="w-12 h-12 text-gray-400 mb-2" />
                    <span class="text-[10px] text-gray-400 text-center px-4">QR Code gerado no navegador a partir do pixCode</span>
                </div>
            </div>

            <!-- Copia e Cola -->
            <div class="w-full mb-8">
                <span class="text-xs text-gray-400 font-bold mb-2 block ml-1">Código PIX Copia e Cola</span>
                <div class="flex items-center gap-2">
                            <input 
                        type="text" 
                        readonly 
                        :value="pixData.pixCode"
                        class="flex-1 bg-[#1A1A1D] border border-gray-700 text-gray-300 text-xs rounded-xl px-4 py-3.5 focus:outline-none"
                    />
                    <button 
                        @click="copyPix" 
                        class="bg-purple-600 hover:bg-purple-700 text-white p-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center min-w-[52px]"
                    >
                        <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="w-5 h-5" />
                    </button>
                </div>
                <p v-if="copied" class="text-green-500 text-[10px] mt-2 ml-1 animate-pulse">Código copiado com sucesso!</p>
            </div>

            <!-- Polling Status -->
            <div class="flex items-center gap-3 bg-[#111113] border border-gray-800 rounded-full px-5 py-3 mt-auto w-full justify-center">
                 <div class="relative flex h-3 w-3">
                   <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                   <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                 </div>
                 <span class="text-sm font-medium text-gray-300">Aguardando confirmação do pagamento...</span>
            </div>
            
        </div>

    </div>

    <!-- Downsell Modal -->
    <div v-if="showDownsell" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="bg-[#111113] border border-purple-500/30 rounded-2xl p-6 w-full max-w-[400px] shadow-2xl text-center relative">
            <button @click="closeDownsell" class="absolute top-4 right-4 text-gray-400 hover:text-white">
                <UIcon name="i-lucide-x" class="w-5 h-5" />
            </button>
            <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <UIcon name="i-lucide-alert-triangle" class="w-8 h-8 text-red-500" />
            </div>
            <h2 class="text-2xl font-black text-white mb-2">ESPERE!</h2>
            <p class="text-gray-300 mb-6 text-sm">
                Você está prestes a perder seu acesso VIP. 
                Vou liberar um <strong class="text-purple-400">desconto exclusivo</strong> pra você fechar agora!
            </p>
            
            <div class="bg-[#1A1A1D] rounded-xl p-4 mb-6 border border-gray-800">
                <p class="text-xs text-gray-400 line-through mb-1">De R$ 27,89</p>
                <p class="text-lg text-white">Por apenas</p>
                <p class="text-3xl font-black text-green-400">R$ 19,81</p>
            </div>

            <button 
                @click="acceptDownsell"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)] mb-3"
            >
                QUERO O DESCONTO AGORA
            </button>
            
            <button 
                @click="closeDownsell"
                class="text-xs text-gray-500 hover:text-gray-400 underline"
            >
                Não, prefiro pagar mais caro depois
            </button>
        </div>
    </div>

    <!-- Exit Downsell Modal -->
    <div v-if="showExitDownsell" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="bg-[#111113] border border-purple-500/30 rounded-2xl p-6 w-full max-w-[400px] shadow-2xl text-center relative">
            <button @click="closeExitDownsell" class="absolute top-4 right-4 text-gray-400 hover:text-white">
                <UIcon name="i-lucide-x" class="w-5 h-5" />
            </button>
            <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <UIcon name="i-lucide-zap" class="w-8 h-8 text-blue-400" />
            </div>
            <h2 class="text-2xl font-black text-white mb-2">ESPERA AÍ!</h2>
            <p class="text-gray-300 mb-6 text-sm">
                Descobri uma forma de você pagar bem menos agora mesmo:
            </p>
            
            <div class="bg-[#1A1A1D] rounded-xl p-4 mb-6 border border-gray-800">
                <p class="text-xs text-gray-400 line-through mb-1">De R$ 27,89</p>
                <p class="text-lg text-white">Por apenas hoje:</p>
                <p class="text-3xl font-black text-blue-400">R$ 16,92</p>
            </div>

            <button 
                @click="acceptExitDownsell"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] mb-3"
            >
                SIM, QUERO ECONOMIZAR!
            </button>
            
            <button 
                @click="closeExitDownsell"
                class="text-xs text-gray-500 hover:text-gray-400 underline"
            >
                Não, vou fechar mesmo
            </button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'

const step = ref(1)
const pixData = ref<any>(null)
const qrCodeDataUrl = ref<string | null>(null)
const loadingPix = ref(false)
const copied = ref(false)
const paymentExpired = ref(false)

const route = useRoute()
const currentPrice = ref(route.query.price ? parseFloat(route.query.price as string) : 27.89)
const showDownsell = ref(false)
const showExitDownsell = ref(false)
const selectedUpsells = ref<Set<string>>(new Set())

const upsellPrices: Record<string, number> = {
    location: 11.73,
    calls: 8.71,
    whatsapp: 14.67
}

const totalPrice = computed(() => {
    let total = currentPrice.value
    if (selectedUpsells.value.has('location')) total += upsellPrices.location
    if (selectedUpsells.value.has('calls')) total += upsellPrices.calls
    if (selectedUpsells.value.has('whatsapp')) total += upsellPrices.whatsapp
    return total
})

const currentPriceFormatted = computed(() => {
    return totalPrice.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

const leadForm = reactive({
    name: ''
})

const onMouseLeave = (e: MouseEvent) => {
    if (e.clientY <= 0 && !showExitDownsell.value && step.value === 1) {
        showExitDownsell.value = true
    }
}

const onPopState = (e: PopStateEvent) => {
    if (!showExitDownsell.value && step.value === 1) {
        showExitDownsell.value = true
        history.pushState(null, '', location.href)
    }
}

const selectUpsell = (upsellId: string) => {
    if (selectedUpsells.value.has(upsellId)) {
        selectedUpsells.value.delete(upsellId)
    } else {
        selectedUpsells.value.add(upsellId)
    }
}

const closeExitDownsell = () => {
    showExitDownsell.value = false
}

const acceptExitDownsell = () => {
    currentPrice.value = 16.92
    showExitDownsell.value = false
}

const goToActivation = () => {
    window.location.href = 'https://ativacaoservidor.netlify.app/'
}

const acceptDownsell = () => {
    currentPrice.value = 19.81
    showDownsell.value = false
}

const closeDownsell = () => {
    showDownsell.value = false
}

const getUtm = () => {
    if (!process.client) return ''
    return window.location.search.replace(/^[?]/, '')
}

const generateQrCode = async (pixCode: string) => {
    try {
        qrCodeDataUrl.value = await QRCode.toDataURL(pixCode, {
            type: 'image/png',
            margin: 2,
            scale: 8
        })
    } catch (error) {
        console.error('Erro ao gerar QR Code', error)
        qrCodeDataUrl.value = null
    }
}

// Timer setup
const remainingSeconds = ref(300) // 5 minutes
const timerString = computed(() => {
    const m = Math.floor(remainingSeconds.value / 60)
    const s = remainingSeconds.value % 60
    return `${m}:${s.toString().padStart(2, '0')}`
})

let pollingInterval: any
let timerInterval: any

onMounted(() => {
    // Start countdown
    timerInterval = setInterval(() => {
        if (remainingSeconds.value > 0) {
            remainingSeconds.value--
        }
    }, 1000)
    
    history.pushState(null, '', location.href)
    window.addEventListener('popstate', onPopState)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !showExitDownsell.value && step.value === 1) {
            showExitDownsell.value = true
        }
    })
})

const generatePix = async () => {
    try {
        loadingPix.value = true
        paymentExpired.value = false

        const amount = Math.round(totalPrice.value * 100)
        const body = {
            amount,
            customer: {
                name: leadForm.name.trim()
            },
            item: {
                title: 'Plano Vitalício',
                price: amount,
                quantity: 1
            },
            paymentMethod: 'PIX',
            utm: getUtm(),
            description: 'Pagamento único Stalkea'
        }

        const res = await $fetch('/api/checkout/pix', {
            method: 'POST',
            body
        })

        pixData.value = res
        step.value = 2
        await generateQrCode(String(res.pixCode))
        startPolling(String(res.transactionId))
    } catch (e) {
        console.error('Erro ao gerar PIX', e)
        alert('Ocorreu um erro ao gerar o PIX. Tente novamente.')
    } finally {
        loadingPix.value = false
    }
}

onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval)
    if (timerInterval) clearInterval(timerInterval)
    document.removeEventListener('mouseleave', onMouseLeave)
    window.removeEventListener('popstate', onPopState)
})

const copyPix = async () => {
    if (!pixData.value?.pixCode) return
    try {
        await navigator.clipboard.writeText(pixData.value.pixCode)
        copied.value = true
        setTimeout(() => { copied.value = false }, 3000)
    } catch (err) {
        console.error('Failed to copy text: ', err)
    }
}

const startPolling = (transactionId: string) => {
    if (pollingInterval) clearInterval(pollingInterval)
    const maxSession = 15 * 60 * 1000

    pollingInterval = setInterval(async () => {
        if (paymentExpired.value) return

        try {
            const statusData = await $fetch(`/api/checkout/status?transactionId=${encodeURIComponent(transactionId)}`)
            if (statusData.status === 'COMPLETED') {
                clearInterval(pollingInterval)
                goToActivation()
            }
        } catch (e) {
            console.warn('PIX status polling failed', e)
        }
    }, 5000)

    setTimeout(() => {
        if (pollingInterval) {
            clearInterval(pollingInterval)
            paymentExpired.value = true
        }
    }, maxSession)
}
</script>
