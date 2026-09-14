<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Estados
const leads = ref<any[]>([]);
const metrics = ref<any>(null);
const errorMessage = ref('');

const fetchDashboardData = async () => {
  try {
    // 1. Recuperamos el token de la sesión actual
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // 2. Pasamos el config con el token a ambas peticiones
    const [leadsRes, metricsRes] = await Promise.all([
      axios.get('http://localhost:5158/api/v1/CreditLeads', config),
      axios.get('http://localhost:5158/api/v1/CreditLeads/metrics', config)
    ]);

    leads.value = leadsRes.data.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    metrics.value = metricsRes.data;
  } catch (error) {
    errorMessage.value = 'Error al cargar los datos del Dashboard.';
    console.error(error);
  }
};

const updateLeadStatus = async (id: string, newStatus: string) => {
  try {
    const token = localStorage.getItem('jwt_token');

    // En las peticiones PATCH/POST, el config va como tercer parámetro
    await axios.patch(`http://localhost:5158/api/v1/CreditLeads/${id}/status`,
        { newStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    await fetchDashboardData();
  } catch (error) {
    console.error('Error actualizando estado', error);
  }
};

onMounted(fetchDashboardData);
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 mt-2">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Dashboard de Ventas Inmobiliarias</h2>
    <p v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</p>

    <!-- Tarjetas de Métricas KPI -->
    <div v-if="metrics" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
        <p class="text-sm text-gray-500 font-semibold mb-1">Total Solicitudes / Hoy</p>
        <p class="text-2xl font-bold text-gray-800">{{ metrics.totalLeads }} <span class="text-blue-500 text-lg">/ {{ metrics.leadsToday }}</span></p>
      </div>
      <div class="bg-white p-5 rounded-lg shadow border-l-4 border-indigo-500">
        <p class="text-sm text-gray-500 font-semibold mb-1">Solicitudes (Este Mes)</p>
        <p class="text-2xl font-bold text-gray-800">{{ metrics.leadsThisMonth }}</p>
      </div>
      <div class="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
        <p class="text-sm text-gray-500 font-semibold mb-1">Ventas Concretadas</p>
        <p class="text-2xl font-bold text-gray-800">{{ metrics.totalSales }}</p>
      </div>
      <div class="bg-white p-5 rounded-lg shadow border-l-4 border-emerald-500">
        <p class="text-sm text-gray-500 font-semibold mb-1">Volumen de Ventas</p>
        <p class="text-2xl font-bold text-gray-800">${{ metrics.totalSalesVolume.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</p>
      </div>
    </div>

    <!-- Tabla Interactiva de Leads -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-100 border-b">
        <tr>
          <th class="p-4 font-semibold text-gray-700">Cliente (Email)</th>
          <th class="p-4 font-semibold text-gray-700">Monto Inmueble</th>
          <th class="p-4 font-semibold text-gray-700">Cuota Estimada</th>
          <th class="p-4 font-semibold text-gray-700">Estado Actual</th>
          <th class="p-4 font-semibold text-gray-700">Acción Comercial</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="lead in leads" :key="lead.id" class="border-b hover:bg-gray-50 transition">
          <td class="p-4 text-gray-800">{{ lead.customerEmail }}</td>
          <td class="p-4 font-medium text-gray-700">${{ lead.propertyValue.toLocaleString('en-US') }}</td>
          <td class="p-4 text-blue-600 font-semibold">${{ lead.monthlyPayment.toLocaleString('en-US') }}</td>
          <td class="p-4">
              <span :class="[
                'px-2 py-1 rounded text-xs font-bold uppercase tracking-wider',
                (lead.status || 'Pending') === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                lead.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                lead.status === 'Sold' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              ]">
                {{ lead.status || 'Pending' }}
              </span>
          </td>
          <td class="p-4">
            <select
                @change="updateLeadStatus(lead.id, ($event.target as HTMLSelectElement).value)"
                class="border border-gray-300 rounded p-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="" disabled selected>Cambiar estado...</option>
              <option value="Pending" :disabled="lead.status === 'Pending'">Volver a Pendiente</option>
              <option value="Approved" :disabled="lead.status === 'Approved'">Marcar Aprobado</option>
              <option value="Rejected" :disabled="lead.status === 'Rejected'">Marcar Rechazado</option>
              <option value="Sold" :disabled="lead.status === 'Sold'">Venta Concretada</option>
            </select>
          </td>
        </tr>
        <tr v-if="leads.length === 0">
          <td colspan="5" class="p-8 text-center text-gray-500">No hay solicitudes registradas aún.</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>