<script setup lang="ts">
import SimulatorForm from '../../../simulation/presentation/components/simulator-form.vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['go-back']);
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-10 px-6">
    <div class="max-w-6xl mx-auto">

      <!-- Botón Volver -->
      <button @click="emit('go-back')" class="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Volver al catálogo
      </button>

      <!-- Hero del Proyecto -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-12">
        <div class="h-96 bg-slate-200 relative">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" alt="Vista del Proyecto" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

          <div class="absolute bottom-8 left-8 right-8 text-white">
            <span class="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-lg">🏢 {{ project.realEstateGroup }}</span>
            <h1 class="text-4xl md:text-5xl font-extrabold drop-shadow-md">{{ project.name }}</h1>
            <p class="text-xl text-slate-200 mt-2 flex items-center gap-2">
              📍 {{ project.district }}, {{ project.department }}
            </p>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-100">
          <div>
            <span class="block text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Precio Desde</span>
            <span class="text-3xl font-black text-slate-800">${{ project.basePrice.toLocaleString('en-US') }}</span>
          </div>
          <div class="md:col-span-2 text-slate-600 leading-relaxed">
            <p>Descubre un estilo de vida único en {{ project.name }}. Un proyecto residencial diseñado para ofrecer comodidad, seguridad y áreas comunes exclusivas. Ubicado estratégicamente en {{ project.district }}, estarás cerca de todo lo que necesitas.</p>
          </div>
        </div>
      </div>

      <!-- Sección de Simulación -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-slate-800">Simula tu Financiamiento</h2>
        <p class="text-slate-500 mt-2">Calcula tu cuota mensual para {{ project.name }} y solicita tu evaluación ahora.</p>
      </div>

      <!-- Aquí embebemos el simulador y le pasamos el proyecto -->
      <SimulatorForm :project="project" />

    </div>
  </div>
</template>