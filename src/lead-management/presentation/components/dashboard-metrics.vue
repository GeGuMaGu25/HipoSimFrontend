<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const metrics = ref<any>(null);
const errorMessage = ref('');

const fetchMetrics = async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    const response = await axios.get('http://localhost:5158/api/v1/CreditLeads/metrics', {
      headers: { Authorization: `Bearer ${token}` }
    });
    metrics.value = response.data;
  } catch (error) {
    errorMessage.value = 'Error al cargar las métricas de ventas.';
    console.error(error);
  }
};

onMounted(fetchMetrics);
</script>

<template>
  <div class="bg-slate-50 min-h-screen py-10 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">Métricas Comerciales</h2>
          <p class="text-slate-500 mt-2">Visión general del rendimiento y volumen de ventas.</p>
        </div>
        <button @click="fetchMetrics" class="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 px-4 py-2 rounded-xl shadow-sm transition-colors font-medium text-sm">
          🔄 Actualizar
        </button>
      </div>

      <p v-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">{{ errorMessage }}</p>

      <div v-if="metrics" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- KPI 1 -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shadow-inner">📊</div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Solicitudes</p>
            <p class="text-3xl font-black text-slate-800">{{ metrics.totalLeads }} <span class="text-sm font-semibold text-blue-500 ml-1 bg-blue-50 px-2 py-0.5 rounded-full">+{{ metrics.leadsToday }} hoy</span></p>
          </div>
        </div>
        <!-- KPI 2 -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div class="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-inner">📅</div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Este Mes</p>
            <p class="text-3xl font-black text-slate-800">{{ metrics.leadsThisMonth }}</p>
          </div>
        </div>
        <!-- KPI 3 -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div class="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-2xl shadow-inner">✅</div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Concretadas</p>
            <p class="text-3xl font-black text-slate-800">{{ metrics.totalSales }}</p>
          </div>
        </div>
        <!-- KPI 4 -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500 rounded-full opacity-10"></div>
          <div class="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shadow-inner z-10">💰</div>
          <div class="z-10">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Volumen Ventas</p>
            <p class="text-2xl font-black text-emerald-600">${{ metrics.totalSalesVolume.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>