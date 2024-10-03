<template>
  <div class="w-full bg-white flex flex-col rounded-3xl p-4 gap-2">
    <h1 class="text-custom-primary text-xl font-semibold w-full text-center">
      Entrenar Modelos
    </h1>
    <p class="text-custom-text-200 text-center">
      {{ `Esta funcionalidad aún esta en desarrollo, vuelva más tarde ;)` }}
    </p>
  </div>
</template>

<script setup>
useHead({
  title: "Entrenar Modelos | Administración",
});

definePageMeta({
  middleware: ["auth"],
  requiresRoles: ["standard-user", "admin"],
  layout: "dashboard",
});
</script>
