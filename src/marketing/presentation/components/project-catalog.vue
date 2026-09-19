<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['view-details']);
const projects = ref<any[]>([]);
const loading = ref(true);

// Estados para los filtros avanzados
const selectedDepartment = ref('');
const selectedDistrict = ref('');
const selectedGroup = ref('');
const maxPrice = ref(500000);

const realEstateGroups = ['Grupo Centenario', 'Los Portales', 'Menorca', 'Besco'];

const fetchProjects = async () => {
  try {
    const response = await axios.get('http://localhost:5158/api/v1/Projects');

    projects.value = response.data.map((p: any) => {
      // Parseo temporal de ubicación para separar Departamento y Distrito
      // Asume que si el backend manda "Lima", lo usamos como distrito por defecto en el depto Lima.
      const parts = p.location.split(',').map((s: string) => s.trim());
      const depto = parts.length > 1 ? parts[0] : 'Lima';
      const dist = parts.length > 1 ? parts[1] : p.location;

      return {
        ...p,
        department: depto,
        district: dist,
        realEstateGroup: p.realEstateGroup || realEstateGroups[Math.floor(Math.random() * realEstateGroups.length)]
      };
    });
  } catch (error) {
    console.error('Error cargando el catálogo', error);
  } finally {
    loading.value = false;
  }
};

// Listas dinámicas basadas en los datos obtenidos
const departments = computed(() => [...new Set(projects.value.map(p => p.department))]);

const availableDistricts = computed(() => {
  if (!selectedDepartment.value) return [];
  return [...new Set(projects.value.filter(p => p.department === selectedDepartment.value).map(p => p.district))];
});

const onDepartmentChange = () => {
  selectedDistrict.value = ''; // Resetea el distrito si cambias de departamento
};

// Lógica Reactiva de Filtrado Múltiple
const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    const matchDepto = selectedDepartment.value ? p.department === selectedDepartment.value : true;
    const matchDist = selectedDistrict.value ? p.district === selectedDistrict.value : true;
    const matchGroup = selectedGroup.value ? p.realEstateGroup === selectedGroup.value : true;
    const matchPrice = p.basePrice <= maxPrice.value;

    return matchDepto && matchDist && matchGroup && matchPrice;
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

      <!-- Barra de Filtros Dividida -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">

        <!-- Filtro: Departamento -->
        <div class="w-full">
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Departamento</label>
          <select v-model="selectedDepartment" @change="onDepartmentChange" class="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            <option value="">Todos</option>
            <option v-for="dep in departments" :key="dep" :value="dep">{{ dep }}</option>
          </select>
        </div>

        <!-- Filtro: Distrito -->
        <div class="w-full">
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Distrito</label>
          <select v-model="selectedDistrict" :disabled="!selectedDepartment" class="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="">Todos los distritos</option>
            <option v-for="dist in availableDistricts" :key="dist" :value="dist">{{ dist }}</option>
          </select>
        </div>

        <!-- Filtro: Grupo Inmobiliario -->
        <div class="w-full">
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Inmobiliaria</label>
          <select v-model="selectedGroup" class="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            <option value="">Todas</option>
            <option v-for="group in realEstateGroups" :key="group" :value="group">{{ group }}</option>
          </select>
        </div>

        <!-- Filtro: Precio Máximo -->
        <div class="w-full">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Precio Máx.</label>
            <span class="text-blue-600 font-bold">${{ maxPrice.toLocaleString('en-US') }}</span>
          </div>
          <input type="range" v-model.number="maxPrice" min="50000" max="500000" step="10000" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
        </div>
      </div>

      <div v-if="loading" class="text-center text-slate-400 py-20 font-medium">
        Cargando catálogo...
      </div>

      <div v-else-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(project, index) in filteredProjects" :key="project.id" class="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col">
          <div class="relative h-56 overflow-hidden bg-slate-200">
            <img :src="index % 2 === 0 ? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'" alt="Fachada" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"/>
            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
              🏢 {{ project.realEstateGroup }}
            </div>
          </div>

          <div class="p-6 flex-grow flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-bold text-slate-800 mb-1">{{ project.name }}</h3>
              <p class="text-slate-500 text-sm mb-5">📍 {{ project.district }}, {{ project.department }}</p>
              <div class="mb-6">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Precio base</span>
                <p class="text-3xl font-black text-slate-800">${{ project.basePrice.toLocaleString('en-US') }}</p>
              </div>
            </div>

            <button @click="emit('view-details', project)" class="w-full bg-slate-900 group-hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 shadow-md">
              Ver Detalles del Proyecto
            </button>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
        <h3 class="text-xl font-bold text-slate-800 mb-2">No encontramos proyectos</h3>
        <p class="text-slate-500">Intenta ajustar los filtros de ubicación o aumentar el rango de precio.</p>
      </div>

    </div>
  </div>
</template>