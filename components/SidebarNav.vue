<template>
  <div class="flex h-full bg-custom-primary-500 rounded-br-3xl rounded-tr-3xl">
    <div
      class="flex flex-col w-[50px] bg-custom-primary h-full rounded-br-3xl rounded-tr-3xl"
    >
      <div class="flex flex-col mt-[100px]">
        <NuxtLink
          v-for="(navLink, index) in navItems.filter((navLink) =>
            navLink.roles.includes(authStore.user.role),
          )"
          :key="index"
          class="flex justify-center py-2 bg-custom-primary hover:bg-custom-primary-300 transition-all ease-in-out duration-150"
          :class="{ 'border-l-4 border-white': activeView == navLink.path }"
          :to="navLink.path"
        >
          <UIcon
            :name="
              activeView == navLink.path ? navLink.activeIcon : navLink.icon
            "
            class="text-2xl text-white"
          ></UIcon>
        </NuxtLink>
      </div>
      <button
        class="flex items-center bg-custom-primary hover:bg-custom-primary-300 mt-auto mb-4 w-max mx-auto rounded-full p-1 transition-colors duration-150 ease-in-out"
        @click="collapseSidebar = !collapseSidebar"
      >
        <UIcon
          name="i-mdi-chevron-double-right"
          class="text-white rounded-full cursor-pointer text-xl transition-all duration-150 ease-in-out"
          :class="{
            'rotate-0': collapseSidebar,
            'rotate-180': !collapseSidebar,
          }"
        ></UIcon>
      </button>
    </div>
    <div v-if="!collapseSidebar" class="flex flex-col relative w-[200px]">
      <div class="absolute top-0 flex items-center text-white p-2">
        <UIcon
          name="i-mdi-solar-power-variant-outline"
          class="text-[50px]"
        ></UIcon>
        <span class="font-semibold ml-2 text-lg">Energias Renovables</span>
      </div>
      <div class="flex flex-col mt-[100px]">
        <NuxtLink
          v-for="(navLink, index) in navItems.filter((navLink) =>
            navLink.roles.includes(authStore.user.role),
          )"
          :key="index"
          :to="navLink.path"
          class="flex justify-start items-center h-[40px] transition-all ease-in-out duration-150 rounded-s-3xl ps-4 text-sm"
          :class="{
            'bg-custom-background-100 hover:bg-custom-background-100 text-custom-primary-500':
              activeView == navLink.path,
            'bg-custom-primary-500 hover:bg-custom-primary text-white':
              activeView != navLink.path,
          }"
        >
          {{ navLink.label }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const route = useRoute();
const authStore = useAuthStore();

const navItems = ref([
  {
    icon: "i-mdi-chart-box-outline",
    activeIcon: "i-mdi-chart-box",
    label: "Estadísticas",
    path: "/",
    roles: ["standard-user", "admin"],
  },
  {
    icon: "i-mdi-solar-power",
    activeIcon: "i-mdi-solar-power",
    label: "Predicciones",
    path: "/predictions",
    roles: ["standard-user", "admin"],
  },
  {
    icon: "i-mdi-robot-outline",
    activeIcon: "i-mdi-robot",
    label: "Entrenar Modelos",
    path: "/train-models",
    roles: ["standard-user", "admin"],
  },
  {
    icon: "i-mdi-database-outline",
    activeIcon: "i-mdi-database",
    label: "Introducir Datos",
    path: "/enter-data",
    roles: ["standard-user", "admin"],
  },
  {
    icon: "i-mdi-factory",
    activeIcon: "i-mdi-factory",
    label: "Parques Solares",
    path: "/solar-parks",
    roles: ["admin"],
  },
  {
    icon: "i-mdi-account-hard-hat-outline",
    activeIcon: "i-mdi-account-hard-hat",
    label: "Trabajadores",
    path: "/users",
    roles: ["admin"],
  },
]);

const activeView = computed(() => route.path);

const collapseSidebar = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});
</script>
