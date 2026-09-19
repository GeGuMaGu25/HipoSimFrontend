<script setup lang="ts">
const emit = defineEmits(['explore-projects']);
</script>

<template>
  <div class="bg-white">
    <!-- Hero Section con Video de Fondo -->
    <div class="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">

      <!-- Video Animado del Logo -->
      <video
          autoplay
          loop
          muted
          playsinline
          class="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover opacity-60"
      >
        <source src="../../../../public/assets/logo-animation.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      <!-- Overlay oscuro para asegurar que el texto sea legible sobre el video -->
      <div class="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/90 z-10"></div>

      <!-- Contenido Principal del Hero -->
      <div class="relative z-20 text-center px-6 max-w-4xl mx-auto mt-10">
        <!-- Logo estático (opcional si el video ya lo muestra, pero ideal para refuerzo) -->
        <img src="../../../../public/assets/logo.jpeg" alt="HipoSim Logo" class="h-32 mx-auto mb-8 drop-shadow-2xl bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20" />

        <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">
          El crédito hipotecario, <br/> <span class="text-green-400">simplificado.</span>
        </h1>
        <p class="text-xl text-slate-200 mb-10 font-light drop-shadow">
          Simulador financiero inteligente para conectar tus sueños con las mejores opciones de financiamiento inmobiliario.
        </p>
        <button
            @click="emit('explore-projects')"
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-green-500/30 transition-all hover:-translate-y-1 text-lg"
        >
          Explorar Proyectos
        </button>
      </div>
    </div>

    <!-- Sección de Explicación de Servicios -->
    <div class="max-w-6xl mx-auto py-24 px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">¿Por qué elegir HipoSim?</h2>
        <p class="text-slate-500 max-w-2xl mx-auto text-lg">Nuestra plataforma optimiza todo el ciclo de vida del crédito hipotecario, desde la simulación inicial hasta la aprobación bancaria.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- Servicio 1 -->
        <div class="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300 text-center group">
          <div class="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
            ⚡
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-3">Simulación Precisa</h3>
          <p class="text-slate-600 leading-relaxed">Cálculos exactos con tasas efectivas, cronogramas de pago detallados y proyección de cuotas adaptadas a tu perfil financiero.</p>
        </div>

        <!-- Servicio 2 -->
        <div class="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300 text-center group">
          <div class="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
            🏢
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-3">Catálogo Exclusivo</h3>
          <p class="text-slate-600 leading-relaxed">Acceso directo a los mejores proyectos de los grupos inmobiliarios más prestigiosos, con información transparente de precios y ubicaciones.</p>
        </div>

        <!-- Servicio 3 -->
        <div class="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300 text-center group">
          <div class="w-16 h-16 mx-auto bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
            🏦
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-3">Aprobación Rápida</h3>
          <p class="text-slate-600 leading-relaxed">Conexión directa mediante nuestra pasarela segura para evaluación de riesgo crediticio con entidades bancarias en tiempo récord.</p>
        </div>
      </div>
    </div>
  </div>
</template>