<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import SimulatorForm from './simulation/presentation/components/simulator-form.vue';
import LeadList from './lead-management/presentation/components/lead-list.vue';
import LoginForm from './iam/presentation/components/login-form.vue';
import UserManagement from './iam/presentation/components/user-management.vue';
import LandingPage from './marketing/presentation/components/landing-page.vue';
import ProjectCatalog from './marketing/presentation/components/project-catalog.vue';
import ProjectDetail from './marketing/presentation/components/project-detail.vue';

const currentTab = ref<'home' | 'catalog' | 'project-detail' | 'simulator' | 'dashboard' | 'login' | 'users'>('home');
const selectedProject = ref<any>(null);

const isAuthenticated = ref(false);
const userRole = ref<string | null>(null);
const isScrolled = ref(false);

const checkAuth = () => {
  const token = localStorage.getItem('jwt_token');
  isAuthenticated.value = !!token;

  if (token) {
    try {
      const payloadString = token.split('.')[1] || '';
      const payload = JSON.parse(atob(payloadString));
      userRole.value = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
    } catch {
      userRole.value = null;
    }
  } else {
    userRole.value = null;
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const handleLoginSuccess = () => {
  checkAuth();
  currentTab.value = 'dashboard';
};

const logout = () => {
  localStorage.removeItem('jwt_token');
  checkAuth();
  currentTab.value = 'home';
};

const handleViewDetails = (project: any) => {
  selectedProject.value = project;
  currentTab.value = 'project-detail';
};

onMounted(() => {
  checkAuth();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans">

    <!-- Barra de Navegación Fija (Oculta en Login) -->
    <nav v-if="currentTab !== 'login'"
         :class="[
           'fixed w-full top-0 z-50 transition-all duration-500',
           isScrolled || currentTab !== 'home' ? 'bg-blue-900 shadow-md py-3' : 'bg-slate-900/40 backdrop-blur-md py-5 border-b border-white/10'
         ]">
      <div class="max-w-6xl mx-auto px-6 flex gap-6 items-center justify-between text-white">

        <div class="flex gap-8 items-center">
          <!-- Logo Real -->
          <img src="../public/assets/logo.jpeg" alt="HipoSim Logo" class="h-10 cursor-pointer hover:scale-105 transition-transform" @click="currentTab = 'home'" />

          <div class="hidden md:flex gap-2">
            <button @click="currentTab = 'home'" :class="['px-4 py-2 rounded-full transition text-sm font-medium', currentTab === 'home' ? 'bg-white/20' : 'hover:bg-white/10']">
              Inicio
            </button>
            <button @click="currentTab = 'catalog'" :class="['px-4 py-2 rounded-full transition text-sm font-medium', currentTab === 'catalog' || currentTab === 'project-detail' ? 'bg-white/20' : 'hover:bg-white/10']">
              Proyectos
            </button>
            <button @click="currentTab = 'simulator'" :class="['px-4 py-2 rounded-full transition text-sm font-medium', currentTab === 'simulator' ? 'bg-white/20' : 'hover:bg-white/10']">
              Simulador
            </button>

            <button v-if="isAuthenticated" @click="currentTab = 'dashboard'" :class="['px-4 py-2 rounded-full transition text-sm font-medium', currentTab === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10']">
              Dashboard Leads
            </button>

            <button v-if="isAuthenticated && userRole === 'Admin'" @click="currentTab = 'users'" :class="['px-4 py-2 rounded-full transition text-sm font-medium', currentTab === 'users' ? 'bg-white/20' : 'hover:bg-white/10']">
              Gestión Usuarios
            </button>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button v-if="!isAuthenticated" @click="currentTab = 'login'" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full transition font-bold text-sm shadow-lg shadow-blue-600/30">
            Acceso Comercial
          </button>
          <button v-if="isAuthenticated" @click="logout" class="px-5 py-2.5 bg-red-500 hover:bg-red-400 rounded-full transition font-bold text-sm shadow-lg shadow-red-500/30">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>

    <!-- Contenido Dinámico -->
    <div :class="currentTab !== 'login' ? 'pt-20' : ''">
      <LandingPage v-if="currentTab === 'home'" @explore-projects="currentTab = 'catalog'" />

      <ProjectCatalog
          v-else-if="currentTab === 'catalog'"
          @view-details="handleViewDetails"
      />

      <ProjectDetail
          v-else-if="currentTab === 'project-detail'"
          :project="selectedProject"
          @go-back="currentTab = 'catalog'"
      />

      <SimulatorForm v-else-if="currentTab === 'simulator'" />
      <LeadList v-else-if="currentTab === 'dashboard'" />
      <UserManagement v-else-if="currentTab === 'users'" />
      <LoginForm v-else-if="currentTab === 'login'" @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>