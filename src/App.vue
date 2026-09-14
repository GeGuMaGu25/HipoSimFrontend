<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SimulatorForm from './simulation/presentation/components/simulator-form.vue';
import LeadList from './lead-management/presentation/components/lead-list.vue';
import LoginForm from './iam/presentation/components/login-form.vue';
import UserManagement from './iam/presentation/components/user-management.vue';

const currentTab = ref<'simulator' | 'dashboard' | 'login' | 'users'>('simulator');
const isAuthenticated = ref(false);
const userRole = ref<string | null>(null);

const checkAuth = () => {
  const token = localStorage.getItem('jwt_token');
  isAuthenticated.value = !!token;

  if (token) {
    try {
      // Usamos || '' para garantizar que atob() siempre reciba un string, resolviendo el TS2345
      const payloadString = token.split('.')[1] || '';
      const payload = JSON.parse(atob(payloadString));

      // Claim estándar de Microsoft para roles
      userRole.value = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
    } catch {
      userRole.value = null;
    }
  } else {
    userRole.value = null;
  }
};

const handleLoginSuccess = () => {
  checkAuth();
  currentTab.value = 'dashboard';
};

const logout = () => {
  localStorage.removeItem('jwt_token');
  checkAuth();
  currentTab.value = 'simulator';
};

onMounted(checkAuth);
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Barra de Navegación -->
    <nav class="bg-blue-800 text-white p-4 shadow-md">
      <div class="max-w-5xl mx-auto flex gap-6 items-center justify-between">
        <div class="flex gap-6 items-center">
          <h1 class="font-bold text-xl mr-4">HipoSim</h1>
          <button @click="currentTab = 'simulator'" :class="['px-3 py-2 rounded transition', currentTab === 'simulator' ? 'bg-blue-600 font-bold' : 'hover:bg-blue-700']">
            Simulador
          </button>

          <button v-if="isAuthenticated" @click="currentTab = 'dashboard'" :class="['px-3 py-2 rounded transition', currentTab === 'dashboard' ? 'bg-blue-600 font-bold' : 'hover:bg-blue-700']">
            Dashboard Leads
          </button>

          <!-- Botón exclusivo para el rol Admin -->
          <button v-if="isAuthenticated && userRole === 'Admin'" @click="currentTab = 'users'" :class="['px-3 py-2 rounded transition', currentTab === 'users' ? 'bg-blue-600 font-bold' : 'hover:bg-blue-700']">
            Gestión Usuarios
          </button>

          <button v-if="!isAuthenticated" @click="currentTab = 'login'" :class="['px-3 py-2 rounded transition', currentTab === 'login' ? 'bg-blue-600 font-bold' : 'hover:bg-blue-700']">
            Acceso Comercial
          </button>
        </div>

        <button v-if="isAuthenticated" @click="logout" class="px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition font-bold text-sm">
          Cerrar Sesión
        </button>
      </div>
    </nav>

    <!-- Contenido Dinámico -->
    <div class="py-10">
      <SimulatorForm v-if="currentTab === 'simulator'" />
      <LeadList v-else-if="currentTab === 'dashboard'" />
      <UserManagement v-else-if="currentTab === 'users'" />
      <LoginForm v-else-if="currentTab === 'login'" @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>