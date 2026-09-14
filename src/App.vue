<script setup lang="ts">
import { ref } from 'vue';
import SimulatorForm from './simulation/presentation/components/simulator-form.vue';
import LeadList from './lead-management/presentation/components/lead-list.vue';

const currentTab = ref<'simulator' | 'dashboard'>('simulator');
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Barra de Navegación -->
    <nav class="bg-blue-800 text-white p-4 shadow-md">
      <div class="max-w-5xl mx-auto flex gap-6 items-center">
        <h1 class="font-bold text-xl mr-4">HipoSim</h1>
        <button
            @click="currentTab = 'simulator'"
            :class="['px-3 py-2 rounded transition', currentTab === 'simulator' ? 'bg-blue-600 font-bold' : 'hover:bg-blue-700']">
          Simulador
        </button>
        <button
            @click="currentTab = 'dashboard'"
            :class="['px-3 py-2 rounded transition', currentTab === 'dashboard' ? 'bg-blue-600 font-bold' : 'hover:bg-blue-700']">
          Dashboard Leads
        </button>
      </div>
    </nav>

    <!-- Contenido Dinámico -->
    <div class="py-10">
      <SimulatorForm v-if="currentTab === 'simulator'" />
      <LeadList v-else />
    </div>
  </div>
</template>