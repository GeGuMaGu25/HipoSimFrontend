<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const leads = ref<any[]>([]);
const isProcessing = ref<string | null>(null);
const activeDropdown = ref<string | null>(null); // Controla qué menú está abierto

// Estados de Filtros
const searchEmail = ref('');
const filterStatus = ref('');

const fetchLeads = async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    const response = await axios.get('http://localhost:5158/api/v1/CreditLeads', {
      headers: { Authorization: `Bearer ${token}` }
    });
    leads.value = response.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error al cargar leads', error);
  }
};

// Filtrado Reactivo
const filteredLeads = computed(() => {
  return leads.value.filter(lead => {
    const matchEmail = lead.customerEmail.toLowerCase().includes(searchEmail.value.toLowerCase());
    const matchStatus = filterStatus.value ? lead.status === filterStatus.value : true;
    return matchEmail && matchStatus;
  });
});

const toggleDropdown = (id: string) => {
  activeDropdown.value = activeDropdown.value === id ? null : id;
};

const updateLeadStatus = async (id: string, newStatus: string) => {
  try {
    isProcessing.value = id;
    activeDropdown.value = null; // Cierra el menú
    const token = localStorage.getItem('jwt_token');
    await axios.patch(`http://localhost:5158/api/v1/CreditLeads/${id}/status`,
        { newStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchLeads();
  } catch (error) {
    console.error('Error actualizando estado', error);
  } finally {
    isProcessing.value = null;
  }
};

const evaluateLeadAtBank = async (id: string) => {
  try {
    isProcessing.value = id;
    activeDropdown.value = null;
    const token = localStorage.getItem('jwt_token');
    await axios.post(`http://localhost:5158/api/v1/CreditEvaluations/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    await fetchLeads();
  } catch (error) {
    console.error('Error al evaluar', error);
  } finally {
    isProcessing.value = null;
  }
};

onMounted(fetchLeads);
</script>

<template>
  <div class="bg-slate-50 min-h-screen py-10 px-6">
    <div class="max-w-7xl mx-auto">

      <div class="mb-8">
        <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">Gestión de Solicitudes</h2>
        <p class="text-slate-500 mt-2">Administra y filtra el pipeline de clientes.</p>
      </div>

      <!-- Barra de Filtros -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Buscar por Email</label>
          <input type="text" v-model="searchEmail" placeholder="ejemplo@correo.com" class="w-full border border-slate-300 rounded-lg p-2.5 text-slate-700 focus:ring-2 focus:ring-blue-500 bg-slate-50">
        </div>
        <div class="flex-1">
          <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Filtrar por Estado</label>
          <select v-model="filterStatus" class="w-full border border-slate-300 rounded-lg p-2.5 text-slate-700 focus:ring-2 focus:ring-blue-500 bg-slate-50">
            <option value="">Todos los estados</option>
            <option value="Pending">Pendiente</option>
            <option value="Approved">Aprobado</option>
            <option value="Rejected">Rechazado</option>
            <option value="BankApproved">Aprobado por Banco</option>
            <option value="BankRejected">Rechazado por Banco</option>
            <option value="Sold">Venta Concretada</option>
          </select>
        </div>
      </div>

      <!-- Tabla Interactiva con Menú Desplegable -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="p-5 font-bold text-slate-500 text-xs uppercase">Cliente / Email</th>
            <th class="p-5 font-bold text-slate-500 text-xs uppercase">Monto Inmueble</th>
            <th class="p-5 font-bold text-slate-500 text-xs uppercase">Cuota</th>
            <th class="p-5 font-bold text-slate-500 text-xs uppercase">Estado</th>
            <th class="p-5 font-bold text-slate-500 text-xs uppercase text-right">Acciones</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
          <tr v-for="lead in filteredLeads" :key="lead.id" class="hover:bg-slate-50/80 transition-colors">
            <td class="p-5">
              <div class="font-semibold text-slate-800">{{ lead.customerName || 'Sin Nombre' }}</div>
              <div class="text-xs text-slate-500">{{ lead.customerEmail }}</div>
            </td>
            <td class="p-5 font-medium text-slate-700">${{ lead.propertyValue.toLocaleString('en-US') }}</td>
            <td class="p-5"><span class="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">${{ lead.monthlyPayment.toLocaleString('en-US') }}</span></td>
            <td class="p-5">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-bold uppercase border',
                  (lead.status || 'Pending') === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  lead.status === 'Approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  lead.status === 'Sold' ? 'bg-green-50 text-green-700 border-green-200' :
                  lead.status === 'BankApproved' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                  lead.status === 'BankRejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-700'
                ]">{{ lead.status || 'Pending' }}</span>
            </td>

            <!-- Celda de Acciones con Dropdown -->
            <td class="p-5 text-right relative">
              <button @click="toggleDropdown(lead.id)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <span v-if="isProcessing === lead.id" class="animate-spin text-sm">⏳</span>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
              </button>

              <!-- Menú Desplegable (Dropdown) -->
              <div v-if="activeDropdown === lead.id" class="absolute right-10 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden text-left">
                <button v-if="lead.status !== 'Approved'" @click="updateLeadStatus(lead.id, 'Approved')" class="w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left border-b border-slate-50">✔️ Marcar Aprobado</button>
                <button v-if="lead.status !== 'Rejected'" @click="updateLeadStatus(lead.id, 'Rejected')" class="w-full px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 text-left border-b border-slate-50">❌ Marcar Rechazado</button>
                <button v-if="lead.status !== 'Sold'" @click="updateLeadStatus(lead.id, 'Sold')" class="w-full px-4 py-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 text-left border-b border-slate-50">🤝 Venta Concretada</button>
                <button v-if="lead.status !== 'BankApproved' && lead.status !== 'BankRejected' && lead.status !== 'Sold'" @click="evaluateLeadAtBank(lead.id)" class="w-full px-4 py-3 text-sm font-bold text-purple-600 hover:bg-purple-50 text-left">🏦 Evaluación Bancaria</button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>