<template>
  <div class="flex justify-end items-center">
    <UAvatar
        size="sm"
        src="/avatar.jpg"
        alt="Avatar"
    />
    <span class="ml-4 mr-1">{{ authStore.user.name }}</span>
    <UPopover>
        <UButton color="custom-text-100" variant="ghost" trailing-icon="i-mdi-chevron-down" />

        <template #panel>
        <div class="p-4">
            <UButton @click="logout" color="custom-text-100" variant="ghost" label="Cerrar Sesión" icon="i-mdi-logout" />
        </div>
        </template>
    </UPopover>
  </div>
</template>

<script setup>
const authStore = useAuthStore();
const router = useRouter();

function logout() {
  const { start, finish } = useLoadingIndicator();
  const toast = useToast();

  start();
  setTimeout(
    () => {
      const { success, message } = authStore.logout();
      finish();
      toast.add({
        id: uniqueId(),
        title: success ? "Éxito" : "Error",
        description: message,
        icon: success ? "i-mdi-check" : "i-mdi-close-circle-outline",
        color: success ? "green" : "red",
        timeout: 3000,
      });
      if (success) router.push("/authentication");
    },
    Math.floor(Math.random() * 1801) + 200,
  );
}
</script>
