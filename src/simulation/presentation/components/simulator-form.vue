<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Estado del Catálogo
const projects = ref<any[]>([]);
const selectedProjectId = ref('');

// Estado del Simulador
const propertyValue = ref(0);
const downPayment = ref(0);
const annualRate = ref(8.5);
const years = ref(20);
const monthlyPayment = ref<number | null>(null);

// Estado del Lead
const customerEmail = ref('');
const message = ref('');
const errorMessage = ref('');

// Cargar proyectos desde el backend
const fetchProjects = async () => {
  try {
    const response = await axios.get('http://localhost:5158/api/v1/Projects');
    projects.value = response.data;
  } catch (error) {
    console.error('Error al cargar el catálogo de proyectos', error);
  }
};

// Auto-completar el precio cuando el usuario elige un proyecto
const handleProjectChange = () => {
  const project = projects.value.find(p => p.id === selectedProjectId.value);
  if (project) {
    propertyValue.value = project.basePrice;
    downPayment.value = project.basePrice * 0.10; // 10% de inicial por defecto
  }
};

onMounted(fetchProjects);

const simulateAndSaveLead = async () => {
  message.value = '';
  errorMessage.value = '';

  if (!selectedProjectId.value) {
    errorMessage.value = 'Debes seleccionar un proyecto inmobiliario.';
    return;
  }

  try {
    // 1. Lógica de cálculo matemático de la cuota
    const principal = propertyValue.value - downPayment.value;
    const monthlyRate = Math.pow(1 + (annualRate.value / 100), 1 / 12) - 1;
    const numberOfPayments = years.value * 12;
    const calculated = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    monthlyPayment.value = parseFloat(calculated.toFixed(2));

    // 2. Persistir el Lead en la base de datos (Enviando el nuevo projectId)
    await axios.post('http://localhost:5158/api/v1/CreditLeads', {
      projectId: selectedProjectId.value,
      customerEmail: customerEmail.value,
      propertyValue: propertyValue.value,
      downPayment: downPayment.value,
      loanAmount: principal,
      monthlyPayment: monthlyPayment.value,
      currency: 'USD'
    });

    message.value = 'Simulación procesada y Lead registrado con éxito.';
  } catch (error) {
    errorMessage.value = 'Error al conectar con el servidor para guardar el Lead.';
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 text-center">Simulador de Crédito Inmobiliario</h2>

    <form @submit.prevent="simulateAndSaveLead" class="space-y-5">

      <!-- Nuevo campo: Selección de Proyecto -->
      <div class="bg-blue-50 p-4 rounded border border-blue-100">
        <label class="block text-sm font-semibold text-blue-900 mb-1">Proyecto de Interés</label>
        <select v-model="selectedProjectId" @change="handleProjectChange" class="w-full border border-gray-300 rounded-md p-2 bg-white" required>
          <option value="" disabled>-- Selecciona un proyecto del catálogo --</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }} - {{ project.location }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Valor del Inmueble (USD)</label>
          <input v-model.number="propertyValue" type="number" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Cuota Inicial (USD)</label>
          <input v-model.number="downPayment" type="number" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tasa Efectiva Anual (%)</label>
          <input v-model.number="annualRate" type="number" step="0.1" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Plazo (Años)</label>
          <input v-model.number="years" type="number" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Correo Electrónico (Para envío de cotización)</label>
        <input v-model="customerEmail" type="email" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
      </div>

      <button type="submit" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded hover:bg-green-700 transition">
        Calcular Cuota y Solicitar Evaluación
      </button>

      <!-- Resultados -->
      <div v-if="monthlyPayment" class="mt-6 p-4 bg-gray-50 border-l-4 border-green-500 rounded">
        <p class="text-sm text-gray-600">Cuota Mensual Estimada</p>
        <p class="text-3xl font-bold text-green-700">${{ monthlyPayment }} USD</p>
      </div>

      <p v-if="message" class="text-green-600 text-center text-sm font-semibold">{{ message }}</p>
      <p v-if="errorMessage" class="text-red-600 text-center text-sm font-semibold">{{ errorMessage }}</p>
    </form>
  </div>
</template>