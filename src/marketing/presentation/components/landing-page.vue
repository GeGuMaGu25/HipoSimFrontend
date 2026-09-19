<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['go-to-simulator']);
const projects = ref<any[]>([]);
const loading = ref(true);

const fetchProjects = async () => {
  try {
    const response = await axios.get('http://localhost:5158/api/v1/Projects');
    projects.value = response.data;
  } catch (error) {
    console.error('Error cargando el catálogo', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProjects);
</script>

<template>
  <div>
    <!-- Modern Hero Section -->
    <div class="relative overflow-hidden bg-slate-900 text-white py-24 px-6 text-center isolate">
      <!-- Elementos decorativos de fondo (Glow effects) -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div class="max-w-4xl mx-auto">
        <span class="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-300 text-sm font-semibold tracking-wider mb-6 border border-blue-500/20 backdrop-blur-sm">
          SIMULADOR FINANCIERO INTELIGENTE
        </span>
        <h1 class="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-300">
          Encuentra y financia <br/> el hogar de tus sueños
        </h1>
        <p class="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Explora nuestros proyectos exclusivos y descubre tu cuota mensual al instante. Transparencia total, sin papeleos.
        </p>

        <div class="flex justify-center gap-4">
          <button class="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
            Ver Proyectos
          </button>
          <button class="bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-full backdrop-blur-sm border border-white/10 transition-all hover:-translate-y-0.5">
            ¿Cómo funciona?
          </button>
        </div>
      </div>
    </div>

    <!-- Catálogo de Proyectos -->
    <div class="max-w-6xl mx-auto py-12 px-6">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Proyectos Destacados</h2>

      <div v-if="loading" class="text-center text-gray-500 py-10">
        Cargando catálogo de inmuebles...
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
            v-for="(project, index) in projects"
            :key="project.id"
            class="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col"
        >
          <!-- Imagen con efecto Zoom (Glassmorphism en la etiqueta) -->
          <div class="relative h-56 overflow-hidden bg-slate-200">
            <img
                :src="index % 2 === 0 ? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'"
                alt="Fachada del proyecto"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />
            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
              ✨ En Venta
            </div>
          </div>

          <!-- Información del Proyecto -->
          <div class="p-6 flex-grow flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{{ project.name }}</h3>

              <!-- Icono de ubicación en formato SVG integrado -->
              <p class="text-slate-500 text-sm mb-5 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {{ project.location }}
              </p>

              <div class="mb-6">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Precio base</span>
                <p class="text-3xl font-black text-slate-800">
                  ${{ project.basePrice.toLocaleString('en-US') }}
                </p>
              </div>
            </div>

            <!-- Botón con micro-interacción -->
            <button
                @click="emit('go-to-simulator', project.id)"
                class="w-full bg-slate-900 group-hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 shadow-md"
            >
              Simular Financiamiento
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>