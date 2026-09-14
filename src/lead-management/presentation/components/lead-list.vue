<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import type { CreditLead } from '../../domain/model/lead.entity';

const leads = ref<CreditLead[]>([]);
const loading = ref(true);
const errorMessage = ref<string | null>(null);

const fetchLeads = async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    const response = await axios.get<CreditLead[]>('http://localhost:5158/api/v1/CreditLeads', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    leads.value = response.data;
  } catch (error: any) {
    errorMessage.value = 'Error de acceso. Por favor, inicia sesión nuevamente.';
  } finally {
    loading.value = false;
  }
};

// Formatear la fecha para que se vea legible
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

onMounted(fetchLeads);
</script>

<template>
  <div class="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Dashboard Comercial - Leads Registrados</h2>

    <div v-if="loading" class="text-center text-gray-500 py-10">Cargando datos...</div>

    <div v-else-if="errorMessage" class="text-center text-red-600 font-medium py-10">{{ errorMessage }}</div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200">
        <thead class="bg-gray-100">
        <tr>
          <th class="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Cliente</th>
          <th class="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Inmueble</th>
          <th class="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Préstamo</th>
          <th class="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Cuota Mensual</th>
          <th class="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Fecha</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="lead in leads" :key="lead.id" class="hover:bg-gray-50 transition">
          <td class="py-3 px-4 border-b text-sm text-gray-800 font-medium">{{ lead.customerEmail }}</td>
          <td class="py-3 px-4 border-b text-sm text-gray-600">{{ lead.propertyValue }} {{ lead.currency }}</td>
          <td class="py-3 px-4 border-b text-sm text-gray-600">{{ lead.loanAmount }} {{ lead.currency }}</td>
          <td class="py-3 px-4 border-b text-sm text-green-700 font-bold">{{ lead.monthlyPayment }} {{ lead.currency }}</td>
          <td class="py-3 px-4 border-b text-sm text-gray-500">{{ formatDate(lead.createdAt) }}</td>
        </tr>
        <tr v-if="leads.length === 0">
          <td colspan="5" class="py-6 text-center text-gray-500">No hay leads registrados aún.</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>