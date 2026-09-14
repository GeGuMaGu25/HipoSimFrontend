<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['login-success']);
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const login = async () => {
  try {
    const response = await axios.post('http://localhost:5158/api/v1/Auth/sign-in', {
      email: email.value,
      password: password.value
    });
    // Guardamos el token de forma local
    localStorage.setItem('jwt_token', response.data.token);
    emit('login-success');
  } catch (error) {
    errorMessage.value = 'Credenciales incorrectas o servidor caído.';
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Acceso Administrativo</h2>
    <form @submit.prevent="login" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Correo</label>
        <input v-model="email" type="email" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input v-model="password" type="password" class="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
      </div>
      <button type="submit" class="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded hover:bg-gray-900 transition">
        Ingresar
      </button>
      <p v-if="errorMessage" class="text-red-600 text-center text-sm mt-2">{{ errorMessage }}</p>
    </form>
  </div>
</template>