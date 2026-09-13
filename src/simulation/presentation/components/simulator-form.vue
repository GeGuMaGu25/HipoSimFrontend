<script setup lang="ts">
import { ref } from 'vue';
import type { SimulateCreditRequest, SimulateCreditResponse } from '../../domain/model/simulation.entity';

const form = ref<SimulateCreditRequest>({
  propertyValue: 100000,
  downPayment: 20000,
  currency: 'USD',
  annualInterestRate: 8.5,
  termInYears: 20
});

const result = ref<SimulateCreditResponse | null>(null);

const simulate = () => {
  // Aquí conectaremos con el backend en el siguiente paso
  console.log('Datos enviados:', form.value);
};
</script>

<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Simulador de Crédito Inmobiliario</h2>

    <form @submit.prevent="simulate" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Valor del Inmueble</label>
        <input v-model.number="form.propertyValue" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Cuota Inicial</label>
        <input v-model.number="form.downPayment" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Tasa Anual (%)</label>
          <input v-model.number="form.annualInterestRate" type="number" step="0.1" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Plazo (Años)</label>
          <input v-model.number="form.termInYears" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Moneda</label>
        <select v-model="form.currency" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          <option value="USD">Dólares (USD)</option>
          <option value="PEN">Soles (PEN)</option>
        </select>
      </div>

      <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition">
        Calcular Cuota
      </button>
    </form>
  </div>
</template>