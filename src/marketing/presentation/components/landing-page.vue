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
    <!-- Hero Section -->
    <div class="bg-blue-900 text-white py-20 px-6 text-center">
      <h1 class="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Encuentra y financia el hogar de tus sueños</h1>
      <p class="text-lg md:text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
        Explora nuestros proyectos inmobiliarios exclusivos y descubre tu cuota mensual al instante con nuestro simulador inteligente.
      </p>
    </div>

    <!-- Catálogo de Proyectos -->
    <div class="max-w-6xl mx-auto py-12 px-6">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Proyectos Destacados</h2>

      <div v-if="loading" class="text-center text-gray-500 py-10">
        Cargando catálogo de inmuebles...
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
            v-for="project in projects"
            :key="project.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col"
        >
          <!-- Placeholder de imagen simulada -->
          <div class="h-48 bg-gray-200 flex items-center justify-center">
            <span class="text-gray-400 font-medium">🏡 {{ project.name }}</span>
          </div>

          <div class="p-6 flex-grow flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ project.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">📍 {{ project.location }}</p>
              <p class="text-2xl font-black text-blue-600 mb-4">
                Desde ${{ project.basePrice.toLocaleString('en-US') }}
              </p>
            </div>

            <button
                @click="emit('go-to-simulator', project.id)"
                class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition-colors"
            >
              Simular Cuota
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>