<template>
  <UForm
    ref="form"
    :state="state"
    :schema="schema"
    class="flex flex-col gap-4"
    @submit="submitForm"
  >
    <UFormGroup name="email" class="custom-input-wrapper">
      <UInput
        v-model="state.email"
        type="email"
        variant="none"
        icon="i-mdi-email-outline"
        placeholder="Entra tu correo"
        class="custom-input-field"
      />
    </UFormGroup>

    <UFormGroup name="password" class="custom-input-wrapper relative">
      <UInput
        v-model="state.password"
        :type="showPassword ? 'text' : 'password'"
        variant="none"
        icon="i-mdi-lock-outline"
        placeholder="Contraseña"
        class="custom-input-field pe-6"
      />
      <UIcon
        v-if="showPassword"
        id="eye-icon"
        name="i-mdi-eye-outline"
        @click="togglePasswordVisibility"
      />
      <UIcon
        v-else
        id="eye-off-icon"
        name="i-mdi-eye-off-outline"
        @click="togglePasswordVisibility"
      />
    </UFormGroup>
    <UButton
      type="submit"
      label="Entrar"
      class="w-full bg-custom-primary hover:bg-custom-primary-500 focus-visible:outline-custom-primary-500 rounded-full border-none flex justify-center items-center mx-auto h-[40px] transition-colors ease-in-out duration-150"
    />
  </UForm>
</template>

<script setup>
import { z } from "zod";

const router = useRouter();
const usersStore = useUsersStore();

const form = ref();
const state = ref({
  email: "",
  password: "",
});
const schema = z.object({
  email: z.string().email("Correo Inválido"),
  password: z.string().min(8, "Debe tener al menos 8 caracteres"),
});
const showPassword = ref(false);

async function submitForm() {
  form.value.validate();

  const { start, finish } = useLoadingIndicator();
  const toast = useToast();

  start();
  setTimeout(
    () => {
      const { success, message } = usersStore.login(state.value);
      finish();
      toast.add({
        id: uniqueId(),
        title: success ? "Éxito" : "Error",
        description: message,
        icon: success ? "i-mdi-check" : "i-mdi-close-circle-outline",
        color: success ? "green" : "red",
        timeout: 3000,
      });
      if (success) router.push("/");
    },
    Math.floor(Math.random() * 1801) + 200,
  );
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}
</script>

<style scoped>
#eye-icon {
  @apply absolute top-3 right-3 text-custom-text-200 cursor-pointer;
}

#eye-off-icon {
  @apply absolute top-3 right-3 text-custom-text-200 cursor-pointer;
}
</style>
