<template>
  <div
    class="bg-white w-[400px] p-4 rounded-3xl flex flex-col gap-x-4 gap-y-8 shadow-sm"
  >
    <span class="w-full text-center text-lg font-semibold">{{
      selectedAuthOption == "Login" ? "Iniciar Sesión" : "Registrarse"
    }}</span>
    <p class="w-full text-center text-custom-text-300 text-sm">
      {{
        selectedAuthOption == "Login"
          ? "Inicia sesión en nuestra plataforma para acceder a todas nuestras funcionalidades!"
          : "Conviertete en un nuevo usuario de nuestra plataforma al registrarte!"
      }}
    </p>
    <Transition name="slide-fade">
      <FormLogin v-if="selectedAuthOption == 'Login'" />
    </Transition>
    <Transition name="slide-fade">
      <FormRegister v-if="selectedAuthOption == 'Register'" />
    </Transition>
    <div class="w-full flex flex-col items-center">
      <span class="text-sm font-semibold">{{
        selectedAuthOption == "Login"
          ? "¿No tienes una cuenta aún?"
          : "¿Ya tienes una cuenta?"
      }}</span>
      <button
        class="w-max focus:outline-none font-semibold text-custom-primary transition-colors ease-in-out duration-150 hover:text-custom-primary-500"
        @click="changeAuthOption"
      >
        {{ selectedAuthOption == "Login" ? "Regístrate" : "Inicia Sesión" }}
      </button>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Autenticarse",
});

const selectedAuthOption = ref("Login");

function changeAuthOption() {
  selectedAuthOption.value =
    selectedAuthOption.value == "Login" ? "Register" : "Login";
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}
</style>
