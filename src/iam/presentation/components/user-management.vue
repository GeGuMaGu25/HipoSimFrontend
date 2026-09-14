<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const password = ref('');
const role = ref('Agent');
const message = ref('');
const errorMessage = ref('');

const createUser = async () => {
  message.value = '';
  errorMessage.value = '';

  try {
    const response = await axios.post('http://localhost:5158/api/v1/Auth/sign-up', {
      email: email.value,
      password: password.value,
      role: role.value
    });
    message.value = response.data.message;
    email.value = '';
    password.value = '';
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Error al crear el usuario.';
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Gestión de Usuarios</h2>

    <div class="bg-gray-50 p-4 rounded border mb-6">
      <h3 class="font-semibold text-gray-700 mb-4">Crear Nuevo Acceso</h3>
      <form @submit.prevent="createUser" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input v-model="email" type="email" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Contraseña Temporal</label>
            <input v-model="password" type="password" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Rol del Sistema</label>
          <select v-model="role" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option value="Agent">Agente de Ventas</option>
            <option value="Admin">Administrador</option>
          </select>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition">
          Registrar Usuario
        </button>
      </form>
      <p v-if="message" class="text-green-600 text-center text-sm mt-3 font-semibold">{{ message }}</p>
      <p v-if="errorMessage" class="text-red-600 text-center text-sm mt-3">{{ errorMessage }}</p>
    </div>
  </div>
</template>