<template>
  <div class="w-full bg-white flex flex-col rounded-3xl">
    <div class="flex items-center gap-2 p-4">
      <div
        v-for="(status, index) in statusFilters"
        :key="index"
        class="py-2 px-4 rounded-full flex items-center cursor-pointer transition-colors duration-150 ease-in-out border border-custom-primary"
        :class="{
          'bg-white text-custom-primary-500 hover:bg-custom-primary hover:text-white':
            status != filters.status,
          'bg-custom-primary text-white': status == filters.status,
        }"
        @click="filters.status = status"
      >
        <span class="text-sm">{{ status }}</span>
      </div>
    </div>

    <UTable :rows="users" :columns="columns" class="p-4">
      <template #name-data="{ row }">
        <div class="text-center">
          {{ row.name }}
        </div>
      </template>
      <template #email-data="{ row }">
        <div class="text-center">
          {{ row.email }}
        </div>
      </template>
      <template #park-data="{ row }">
        <div class="flex justify-center items-center gap-1">
          <span>{{ row.park ? row.park : "Ninguno" }}</span>
          <UButton
            icon="i-mdi-pencil"
            size="sm"
            variant="ghost"
            class="text-[#00DC82] rounded-full"
            @click="editUserPark(row)"
          />
        </div>
      </template>
      <template #is_active-data="{ row }">
        <div class="flex justify-center items-center gap-1">
          <UBadge
            :label="row.is_active ? 'Activo' : 'Inactivo'"
            :class="row.is_active ? 'active' : 'unactive'"
          />
          <UButton
            icon="i-mdi-refresh"
            size="sm"
            variant="ghost"
            class="text-[#00DC82] rounded-full"
            @click="toggleUserState(row)"
          />
        </div>
      </template>
    </UTable>

    <div class="border-t border-custom-text-500 flex p-4">
      <p class="text-custom-text-200 mt-1">
        {{
          `${Math.min(total, (page - 1) * pageCount + 1)}-${Math.min(total, page * pageCount)} de ${total} elementos`
        }}
      </p>
      <div class="ml-auto flex gap-1">
        <button
          class="rounded-full bg-custom-primary text-white p-2 flex items-center text-xl"
          :disabled="page == 1"
          @click="goToPage(-1)"
        >
          <UIcon name="i-mdi-chevron-left" />
        </button>
        <button
          class="rounded-full bg-custom-primary text-white p-2 flex items-center text-xl"
          :disabled="page * pageCount >= total"
          @click="goToPage(1)"
        >
          <UIcon name="i-mdi-chevron-right" />
        </button>
      </div>
    </div>

    <UModal v-model="showUserForm" :prevent-close="false">
      <UCard
        :ui="{ ring: '', divide: 'divide-y divide-custom-text-500' }"
        class="p-4"
      >
        <template #header>
          <p class="text-center">Editar Usuario</p>
        </template>

        <UForm
          ref="form"
          :state="state"
          :schema="schema"
          class="flex flex-col gap-4"
          @submit="submitForm"
        >
          <UFormGroup name="park" class="custom-input-wrapper">
            <USelectMenu
              v-model="state.park"
              placeholder="Elige el nombre de tu planta"
              icon="i-mdi-factory"
              :options="[]"
              variant="none"
              class="custom-input-field"
            />
          </UFormGroup>
          <div class="w-full mx-auto">
            <UButton
              type="submit"
              label="Enviar"
              class="h-[40px] px-4 w-max flex justify-center items-center bg-custom-primary hover:bg-custom-primary-500 focus-visible:outline-custom-primary-500 transition-colors ease-in-out duration-150 rounded-full float-right"
            />
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { z } from "zod";

useHead({
  title: "Trabajadores | Administración",
});

definePageMeta({
  middleware: ["auth"],
  requiresRoles: ["admin"],
  layout: "dashboard",
});

const usersStore = useUsersStore();

const filters = ref({
  status: "All",
});
const statusFilters = ref(["All", "Active", "Unactive"]);
const page = ref(1);
const pageCount = ref(10);
const showUserForm = ref(false);
const form = ref();
const state = ref({
  id: "",
  name: "",
  email: "",
  password: "",
  park: null,
  is_active: null,
  role: "",
});
const schema = z.object({
  park: z.string().min(1, "Nombre de Planta Requerido"),
});
const columns = [
  {
    key: "name",
    label: "Nombre",
    class: "italic text-center",
  },
  {
    key: "email",
    label: "Correo",
    class: "italic text-center",
  },
  {
    key: "park",
    label: "Parque",
    class: "italic text-center",
  },
  {
    key: "is_active",
    label: "Estado",
    class: "italic text-center",
  },
];

const users = computed(() => {
  return usersStore.users
    .filter((user) => {
      if (
        filters.value.status == "All" ||
        (filters.value.status == "Active" && user.is_active) ||
        (filters.value.status == "Unactive" && !user.is_active)
      )
        return true;
    })
    .slice((page.value - 1) * pageCount.value, page.value * pageCount.value);
});

const total = computed(() => users.value.length);

onMounted(() => usersStore.loadUsers());

async function submitForm() {
  form.value.validate();

  const { start, finish } = useLoadingIndicator();
  const toast = useToast();

  start();
  setTimeout(
    () => {
      const { success, message } = usersStore.putUser(state.value);
      finish();
      toast.add({
        id: uniqueId(),
        title: success ? "Éxito" : "Error",
        description: message,
        icon: success ? "i-mdi-check" : "i-mdi-close-circle-outline",
        color: success ? "green" : "red",
        timeout: 3000,
      });
      if (success) showUserForm.value = false;
    },
    Math.floor(Math.random() * 1801) + 200,
  );
}

function toggleUserState(user) {
  const userData = {
    ...user,
    is_active: !user.is_active,
  };

  const { start, finish } = useLoadingIndicator();
  const toast = useToast();

  start();
  setTimeout(
    () => {
      const { success, message } = usersStore.putUser(userData);
      finish();
      toast.add({
        id: uniqueId(),
        title: success ? "Éxito" : "Error",
        description: message,
        icon: success ? "i-mdi-check" : "i-mdi-close-circle-outline",
        color: success ? "green" : "red",
        timeout: 3000,
      });
      if (success) showUserForm.value = false;
    },
    Math.floor(Math.random() * 1801) + 200,
  );
}

function editUserPark(user) {
  showUserForm.value = true;
  state.value = {
    ...user,
  };
}

function goToPage(delta) {
  page.value = page.value + delta;
}
</script>

<style scoped>
.active {
  @apply text-green-600 text-xs bg-green-100 rounded-full font-normal;
}
.unactive {
  @apply text-red-600 text-xs bg-red-100 rounded-full font-normal;
}
</style>
