<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';

// Estados del formulario
const customerEmail = ref('');
const propertyValue = ref(120000);
const downPaymentPercentage = ref(20);
const annualInterestRate = ref(8.5);
const loanTermYears = ref(20);

// Estados de la UI
const monthlyPayment = ref<number | null>(null);
const isCalculating = ref(false);
const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Cálculos reactivos en tiempo real para la interfaz
const downPaymentAmount = computed(() => propertyValue.value * (downPaymentPercentage.value / 100));
const loanAmount = computed(() => propertyValue.value - downPaymentAmount.value);

const calculateSim = async () => {
  isCalculating.value = true;
  try {
    // Usamos la fórmula matemática estándar para que la UI reaccione rápido
    // (P * r * (1 + r)^n) / ((1 + r)^n - 1)
    const p = loanAmount.value;
    const r = (annualInterestRate.value / 100) / 12;
    const n = loanTermYears.value * 12;

    const calculatedPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    monthlyPayment.value = Number(calculatedPayment.toFixed(2));
  } catch (error) {
    console.error('Error calculando:', error);
  } finally {
    isCalculating.value = false;
  }
};

const submitLead = async () => {
  if (!customerEmail.value || !monthlyPayment.value) return;

  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // Usamos tu endpoint exacto que verificamos en Swagger
    await axios.post('http://localhost:5158/api/v1/CreditLeads', {
      projectId: '00000000-0000-0000-0000-000000000000', // ID por defecto o dinámico
      customerEmail: customerEmail.value,
      propertyValue: propertyValue.value,
      downPayment: downPaymentAmount.value,
      loanAmount: loanAmount.value,
      monthlyPayment: monthlyPayment.value,
      currency: 'USD'
    });

    successMessage.value = '¡Solicitud registrada con éxito! Un asesor te contactará.';
  } catch (error) {
    errorMessage.value = 'Ocurrió un error al registrar la solicitud.';
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12 px-6">
    <div class="max-w-6xl mx-auto">

      <!-- Encabezado -->
      <div class="mb-10 text-center md:text-left">
        <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Simulador de Crédito</h2>
        <p class="text-slate-500 mt-2 text-lg">Ajusta los valores para encontrar la cuota que mejor se adapte a ti.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

        <!-- Columna Izquierda: Formulario de Controles -->
        <div class="lg:col-span-7 space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">

          <!-- Valor del Inmueble -->
          <div>
            <label class="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Valor del Inmueble</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                  type="number"
                  v-model.number="propertyValue"
                  class="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-slate-800 text-lg transition-all"
              />
            </div>
          </div>

          <!-- Cuota Inicial (Slider) -->
          <div>
            <div class="flex justify-between items-end mb-2">
              <label class="block text-sm font-bold text-slate-700 uppercase tracking-wider">Cuota Inicial (Enganche)</label>
              <span class="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg">{{ downPaymentPercentage }}%</span>
            </div>
            <input
                type="range"
                v-model.number="downPaymentPercentage"
                min="10" max="80" step="5"
                class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-3"
            />
            <p class="text-sm text-slate-500 font-medium">Monto: ${{ downPaymentAmount.toLocaleString('en-US') }}</p>
          </div>

          <!-- Plazo del préstamo (Slider) -->
          <div>
            <div class="flex justify-between items-end mb-2">
              <label class="block text-sm font-bold text-slate-700 uppercase tracking-wider">Plazo de Financiamiento</label>
              <span class="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg">{{ loanTermYears }} Años</span>
            </div>
            <input
                type="range"
                v-model.number="loanTermYears"
                min="5" max="30" step="5"
                class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <!-- Tasa de Interés -->
          <div>
            <label class="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Tasa Efectiva Anual (TEA)</label>
            <div class="relative">
              <input
                  type="number"
                  step="0.1"
                  v-model.number="annualInterestRate"
                  class="w-full pr-8 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-slate-800 text-lg transition-all"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
            </div>
          </div>

          <button
              @click="calculateSim"
              class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Calcular Cuota Mensual
          </button>
        </div>

        <!-- Columna Derecha: Tarjeta de Resultados Flotante -->
        <div class="lg:col-span-5">
          <div class="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 shadow-2xl shadow-blue-900/20 text-white sticky top-10">

            <h3 class="text-blue-200 font-semibold uppercase tracking-wider text-sm mb-6">Resumen de Simulación</h3>

            <div class="mb-8">
              <p class="text-slate-300 text-sm mb-2">Tu Cuota Mensual Estimada</p>
              <div class="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 flex items-baseline gap-2">
                <span class="text-3xl text-white/50">$</span>
                {{ monthlyPayment ? monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00' }}
              </div>
            </div>

            <div class="space-y-4 border-t border-white/10 pt-6 mb-8">
              <div class="flex justify-between text-sm">
                <span class="text-slate-300">Monto a Financiar</span>
                <span class="font-bold">${{ loanAmount.toLocaleString('en-US') }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-300">Tasa de Interés</span>
                <span class="font-bold">{{ annualInterestRate }}% TEA</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-300">Plazo Total</span>
                <span class="font-bold">{{ loanTermYears * 12 }} meses</span>
              </div>
            </div>

            <!-- Formulario de Captura de Lead -->
            <div v-if="monthlyPayment" class="space-y-4 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
              <label class="block text-sm font-medium text-blue-100">Correo Electrónico para solicitar evaluación</label>
              <input
                  type="email"
                  v-model="customerEmail"
                  placeholder="tu@correo.com"
                  class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              <button
                  @click="submitLead"
                  :disabled="isSaving"
                  class="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/30 disabled:opacity-50"
              >
                {{ isSaving ? 'Enviando...' : 'Solicitar Crédito' }}
              </button>
            </div>

            <!-- Mensajes de feedback -->
            <div v-if="successMessage" class="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200 text-sm text-center">
              {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm text-center">
              {{ errorMessage }}
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>