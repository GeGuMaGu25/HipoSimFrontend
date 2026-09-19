<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import axios from 'axios';

// Propiedades para saber si tiene un proyecto pre-cargado y si está en modo "pantalla completa"
const props = defineProps({
  project: {
    type: Object,
    required: false,
    default: () => null
  },
  standalone: {
    type: Boolean,
    required: false,
    default: false
  }
});

const customerName = ref('');
const customerEmail = ref('');
const propertyValue = ref(props.project ? props.project.basePrice : 120000);
const downPaymentPercentage = ref(20);
const annualInterestRate = ref(8.5);
const loanTermYears = ref(20);

watch(() => props.project, (newVal) => {
  if (newVal) propertyValue.value = newVal.basePrice;
});

const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Cálculos reactivos en tiempo real
const downPaymentAmount = computed(() => propertyValue.value * (downPaymentPercentage.value / 100));
const loanAmount = computed(() => propertyValue.value - downPaymentAmount.value);

// Sincronización en tiempo real: Se calcula automáticamente sin necesidad de un botón
const monthlyPayment = computed(() => {
  const p = loanAmount.value;
  const r = (annualInterestRate.value / 100) / 12;
  const n = loanTermYears.value * 12;

  if (p <= 0 || r <= 0 || n <= 0) return 0;

  const calculatedPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Number(calculatedPayment.toFixed(2));
});

const submitLead = async () => {
  if (!customerName.value || !customerEmail.value || monthlyPayment.value <= 0) {
    errorMessage.value = 'Por favor completa tu nombre y correo.';
    return;
  }

  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await axios.post('http://localhost:5158/api/v1/CreditLeads', {
      projectId: props.project ? props.project.id : '00000000-0000-0000-0000-000000000000',
      customerName: customerName.value,
      customerEmail: customerEmail.value,
      propertyValue: propertyValue.value,
      downPayment: downPaymentAmount.value,
      loanAmount: loanAmount.value,
      monthlyPayment: monthlyPayment.value,
      currency: 'USD'
    });

    successMessage.value = '¡Solicitud registrada con éxito! Un asesor te contactará.';
    customerName.value = '';
    customerEmail.value = '';
  } catch (error) {
    errorMessage.value = 'Ocurrió un error al registrar la solicitud.';
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <!-- Contenedor dinámico: Si es standalone, ocupa toda la pantalla y muestra el video -->
  <div :class="standalone ? 'relative min-h-screen py-24 flex items-center justify-center' : 'bg-slate-50 py-12 px-6 rounded-3xl'">

    <!-- Video de fondo animado (Solo visible si es standalone) -->
    <div v-if="standalone" class="absolute inset-0 z-0 overflow-hidden bg-slate-900">
      <video autoplay loop muted playsinline class="absolute w-auto min-w-full min-h-full max-w-none object-cover opacity-40">
        <source src="../../../../public/assets/logo-animation.mp4" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/90 z-10"></div>
    </div>

    <!-- Contenido Principal -->
    <div :class="['relative z-20 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10', standalone ? 'px-6' : '']">

      <!-- Columna Izquierda: Controles -->
      <div class="lg:col-span-7 space-y-8 bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/20">

        <!-- Encabezado Condicional -->
        <div v-if="standalone" class="mb-6 border-b border-slate-100 pb-4">
          <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">Simulador Libre</h2>
          <p class="text-slate-500 mt-1">Calcula en tiempo real tu escenario ideal.</p>
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Valor del Inmueble</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input type="number" v-model.number="propertyValue" :disabled="!!props.project" class="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800 text-lg disabled:opacity-50" />
          </div>
        </div>

        <div>
          <div class="flex justify-between items-end mb-2">
            <label class="block text-sm font-bold text-slate-700 uppercase tracking-wider">Cuota Inicial</label>
            <span class="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg">{{ downPaymentPercentage }}%</span>
          </div>
          <input type="range" v-model.number="downPaymentPercentage" min="10" max="80" step="5" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-3" />
          <p class="text-sm text-slate-500 font-medium">Monto: ${{ downPaymentAmount.toLocaleString('en-US') }}</p>
        </div>

        <div>
          <div class="flex justify-between items-end mb-2">
            <label class="block text-sm font-bold text-slate-700 uppercase tracking-wider">Plazo (Años)</label>
            <span class="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg">{{ loanTermYears }} Años</span>
          </div>
          <input type="range" v-model.number="loanTermYears" min="5" max="30" step="5" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        </div>

      </div>

      <!-- Columna Derecha: Resultados y Lead Form -->
      <div class="lg:col-span-5">
        <div class="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 shadow-2xl shadow-blue-900/20 text-white sticky top-24 border border-white/10">
          <h3 class="text-blue-200 font-semibold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
            <span class="animate-pulse w-2 h-2 bg-green-400 rounded-full inline-block"></span> Sincronizado en vivo
          </h3>
          <div class="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 mb-8 transition-all duration-300">
            <span class="text-3xl text-white/50">$</span> {{ monthlyPayment > 0 ? monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00' }}
          </div>

          <!-- Formulario de Captura -->
          <div class="space-y-4 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10 mt-6">
            <p class="text-sm font-medium text-blue-100 mb-2">Solicita una evaluación pre-aprobada</p>

            <input type="text" v-model="customerName" placeholder="Tu Nombre Completo" class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-green-400 focus:outline-none transition-colors" />

            <input type="email" v-model="customerEmail" placeholder="tu@correo.com" class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-green-400 focus:outline-none transition-colors" />

            <button @click="submitLead" :disabled="isSaving || monthlyPayment <= 0" class="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {{ isSaving ? 'Enviando...' : 'Solicitar Crédito' }}
            </button>
          </div>

          <div v-if="successMessage" class="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200 text-sm text-center font-medium">{{ successMessage }}</div>
          <div v-if="errorMessage" class="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm text-center font-medium">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>