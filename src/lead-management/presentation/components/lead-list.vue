<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Estados
const leads = ref<any[]>([]);
const metrics = ref<any>(null);
const errorMessage = ref('');
const isProcessing = ref<string | null>(null); // Para mostrar estado de carga en botones

const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

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
    isProcessing.value = id;
    const token = localStorage.getItem('jwt_token');
    await axios.patch(`http://localhost:5158/api/v1/CreditLeads/${id}/status`,
        { newStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchDashboardData();
  } catch (error) {
    console.error('Error actualizando estado', error);
  } finally {
    isProcessing.value = null;
  }
};

const evaluateLeadAtBank = async (id: string) => {
  try {
    isProcessing.value = id;
    const token = localStorage.getItem('jwt_token');
    await axios.post(`http://localhost:5158/api/v1/CreditEvaluations/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchDashboardData();
  } catch (error) {
    console.error('Error al solicitar evaluación externa', error);
  } finally {
    isProcessing.value = null;
  }
};

onMounted(fetchDashboardData);
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-10 px-6">
    <div class="max-w-7xl mx-auto">

      <!-- Cabecera del Dashboard -->
      <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">Panel de Control de Ventas</h2>
          <p class="text-slate-500 mt-2">Gestiona solicitudes, evalúa riesgos y cierra ventas inmobiliarias.</p>
        </div>
        <button @click="fetchDashboardData" class="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 px-4 py-2 rounded-xl shadow-sm transition-colors font-medium text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Actualizar Datos
        </button>
      </div>

      <p v-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">{{ errorMessage }}</p>

      <!-- Tarjetas de Métricas KPI Premium -->
      <div v-if="metrics" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <!-- KPI 1 -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shadow-inner">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Solicitudes</p>
            <p class="text-3xl font-black text-slate-800">{{ metrics.totalLeads }} <span class="text-sm font-semibold text-blue-500 ml-1 bg-blue-50 px-2 py-0.5 rounded-full">+{{ metrics.leadsToday }} hoy</span></p>
          </div>
        </div>

        <!-- KPI 2 -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div class="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-inner">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Este Mes</p>
            <p class="text-3xl font-black text-slate-800">{{ metrics.leadsThisMonth }}</p>
          </div>
        </div>

        <!-- KPI 3 -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div class="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-2xl shadow-inner">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Concretadas</p>
            <p class="text-3xl font-black text-slate-800">{{ metrics.totalSales }}</p>
          </div>
        </div>

        <!-- KPI 4 -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 relative overflow-hidden">
          <!-- Decoración de fondo para el KPI principal -->
          <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500 rounded-full opacity-10"></div>

          <div class="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shadow-inner z-10">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div class="z-10">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Volumen Ventas</p>
            <p class="text-2xl font-black text-emerald-600">${{ metrics.totalSalesVolume.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</p>
          </div>
        </div>
      </div>

      <!-- Tabla Interactiva Moderna -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Cliente / Email</th>
              <th class="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Monto Inmueble</th>
              <th class="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Cuota Estimada</th>
              <th class="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Estado Actual</th>
              <th class="p-5 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Gestión Comercial</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
            <tr v-for="lead in leads" :key="lead.id" class="hover:bg-slate-50/80 transition-colors group">
              <td class="p-5">
                <div class="font-semibold text-slate-800">{{ lead.customerEmail }}</div>
                <div class="text-xs text-slate-400 font-mono mt-0.5">ID: {{ lead.id.substring(0,8) }}...</div>
              </td>
              <td class="p-5 font-medium text-slate-700">${{ lead.propertyValue.toLocaleString('en-US') }}</td>
              <td class="p-5">
                  <span class="inline-flex items-center gap-1.5 font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    ${{ lead.monthlyPayment.toLocaleString('en-US') }}
                  </span>
              </td>
              <td class="p-5">
                <!-- Badges Estilizados -->
                <span :class="[
                    'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border',
                    (lead.status || 'Pending') === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    lead.status === 'Approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    lead.status === 'Sold' ? 'bg-green-50 text-green-700 border-green-200' :
                    lead.status === 'BankApproved' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                    lead.status === 'BankRejected' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-slate-50 text-slate-700 border-slate-200'
                  ]">
                    {{ lead.status || 'Pending' }}
                  </span>
              </td>
              <td class="p-5 flex items-center justify-end gap-3">

                <select
                    @change="updateLeadStatus(lead.id, ($event.target as HTMLSelectElement).value)"
                    :disabled="isProcessing === lead.id"
                    class="border border-slate-200 rounded-xl p-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium text-slate-600 disabled:opacity-50 transition-all hover:border-slate-300"
                >
                  <option value="" disabled selected>Cambiar estado...</option>
                  <option value="Pending" :disabled="lead.status === 'Pending'">Volver a Pendiente</option>
                  <option value="Approved" :disabled="lead.status === 'Approved'">Marcar Aprobado</option>
                  <option value="Rejected" :disabled="lead.status === 'Rejected'">Marcar Rechazado</option>
                  <option value="Sold" :disabled="lead.status === 'Sold'">Venta Concretada</option>
                </select>

                <button
                    v-if="lead.status !== 'BankApproved' && lead.status !== 'BankRejected' && lead.status !== 'Sold'"
                    @click="evaluateLeadAtBank(lead.id)"
                    :disabled="isProcessing === lead.id"
                    title="Enviar a evaluación bancaria externa"
                    class="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-xl transition-all shadow-sm shadow-purple-600/30 disabled:opacity-50 flex items-center justify-center min-w-[40px]"
                >
                  <span v-if="isProcessing === lead.id" class="animate-spin text-sm">⏳</span>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </button>

              </td>
            </tr>
            <tr v-if="leads.length === 0">
              <td colspan="5" class="p-12 text-center text-slate-400">
                <div class="text-4xl mb-3">📭</div>
                <p class="font-medium">No hay solicitudes registradas aún.</p>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>