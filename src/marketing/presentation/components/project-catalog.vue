<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['go-to-simulator']);
const projects = ref<any[]>([]);
const loading = ref(true);

// Estados para los filtros
const selectedLocation = ref('');
const selectedGroup = ref('');
const maxPrice = ref(500000); // Valor por defecto alto para mostrar todos al inicio

// Opciones de filtros (Extraídas dinámicamente o simuladas por ahora)
const locations = computed(() => [...new Set(projects.value.map(p => p.location))]);
// Nota: Como "Grupo Inmobiliario" aún no existe en nuestro backend C#, lo preparamos en la UI.
const realEstateGroups = ['Grupo Centenario', 'Los Portales', 'Menorca', 'Besco'];

const fetchProjects = async () => {
  try {
    const response = await axios.get('http://localhost:5158/api/v1/Projects');
    // Para propósitos visuales, le asignamos un grupo inmobiliario aleatorio si el backend no lo trae
    projects.value = response.data.map((p: any) => ({
      ...p,
      realEstateGroup: p.realEstateGroup || realEstateGroups[Math.floor(Math.random() * realEstateGroups.length)]
    }));
  } catch (error) {
    console.error('Error cargando el catálogo', error);
  } finally {
    loading.value = false;
  }
};

// Lógica Reactiva de Filtrado
const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    const matchLocation = selectedLocation.value ? p.location === selectedLocation.value : true;
    const matchGroup = selectedGroup.value ? p.realEstateGroup === selectedGroup.value : true;
    const matchPrice = p.basePrice <= maxPrice.value;

    return matchLocation && matchGroup && matchPrice;
  });
});

onMounted(fetchProjects);
</script>

<template>
  <div class="bg-slate-50 min-h-screen py-10 px-6">
    <div class="max-w-7xl mx-auto">

      <div class="mb-10 text-center">
        <h2 class="text-3xl font-extrabold text-slate-800 mb-4">Catálogo de Proyectos Inmobiliarios</h2>
        <p class="text-slate-500 max-w-2xl mx-auto">Encuentra el proyecto ideal utilizando nuestros filtros de búsqueda avanzada.</p>
      </div>

      <!-- Barra de Filtros -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-6 items-end">

        <!-- Filtro: Ubicación -->
        <div class="flex-1 w-full">
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ubicación</label>
          <select v-model="selectedLocation" class="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            <option value="">Todas las ubicaciones</option>
            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </div>

        <!-- Filtro: Grupo Inmobiliario -->
        <div class="flex-1 w-full">
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Grupo Inmobiliario</label>
          <select v-model="selectedGroup" class="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            <option value="">Todos los grupos</option>
            <option v-for="group in realEstateGroups" :key="group" :value="group">{{ group }}</option>
          </select>
        </div>

        <!-- Filtro: Precio Máximo -->
        <div class="flex-1 w-full">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Precio Máximo</label>
            <span class="text-blue-600 font-bold">${{ maxPrice.toLocaleString('en-US') }}</span>
          </div>
          <input
              type="range"
              v-model.number="maxPrice"
              min="50000"
              max="500000"
              step="10000"
              class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          >
        </div>
      </div>

      <!-- Estado de Carga -->
      <div v-if="loading" class="text-center text-slate-400 py-20 font-medium">
        <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        Cargando catálogo...
      </div>

      <!-- Grid de Proyectos -->
      <div v-else-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
            v-for="(project, index) in filteredProjects"
            :key="project.id"
            class="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col"
        >
          <div class="relative h-56 overflow-hidden bg-slate-200">
            <img
                :src="index % 2 === 0 ? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'"
                alt="Fachada del proyecto"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />
            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
              🏢 {{ project.realEstateGroup }}
            </div>
          </div>

          <div class="p-6 flex-grow flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{{ project.name }}</h3>

              <p class="text-slate-500 text-sm mb-5 flex items-center gap-1.5">
                📍 {{ project.location }}
              </p>

              <div class="mb-6">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Precio base</span>
                <p class="text-3xl font-black text-slate-800">
                  ${{ project.basePrice.toLocaleString('en-US') }}
                </p>
              </div>
            </div>

            <button
                @click="emit('go-to-simulator', project.id)"
                class="w-full bg-slate-900 group-hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 shadow-md"
            >
              Simular Financiamiento
            </button>
          </div>
        </div>
      </div>

      <!-- Estado Vacío (Sin resultados) -->
      <div v-else class="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
        <div class="text-5xl mb-4">🔍</div>
        <h3 class="text-xl font-bold text-slate-800 mb-2">No encontramos proyectos</h3>
        <p class="text-slate-500">Intenta ajustar los filtros de ubicación o aumentar el rango de precio máximo.</p>
      </div>

    </div>
  </div>
</template>