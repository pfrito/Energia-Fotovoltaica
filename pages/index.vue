<template>
  <div>Admin</div>
</template>

<script setup>
useHead({
  title: "Estadísticas | Administración",
});

definePageMeta({
  middleware: ["auth"],
  requiresRoles: ["standard-user", "admin"],
  layout: "dashboard",
});
</script>
