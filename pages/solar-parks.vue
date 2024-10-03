<template>
  <div class="w-full bg-white flex flex-col rounded-3xl">
    <UTable :rows="parks" :columns="columns" class="p-4">
      <template #name-data="{ row }">
        <div class="text-center">
          {{ row.name }}
        </div>
      </template>
      <template #address-data="{ row }">
        <div class="text-center">
          {{ row.address }}
        </div>
      </template>
      <template #city-data="{ row }">
        <div class="text-center">
          {{ row.city }}
        </div>
      </template>
      <template #actions-data="{ row }">
        <div class="flex justify-center items-center gap-1">
          <UButton
            icon="i-mdi-pencil"
            size="sm"
            variant="ghost"
            class="text-[#00DC82] rounded-full"
            @click="openParkForm(row)"
          />
          <UButton
            icon="i-mdi-delete"
            size="sm"
            variant="ghost"
            class="text-red-500 rounded-full"
            @click="deletePark(row)"
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

    <UModal v-model="showParkForm" :prevent-close="false">
      <UCard
        :ui="{ ring: '', divide: 'divide-y divide-custom-text-500' }"
        class="p-4"
      >
        <template #header>
          <p class="text-center">
            {{ state.id ? "Editar" : "Crear" }} Parque Solar
          </p>
        </template>

        <UForm
          ref="form"
          :state="state"
          :schema="schema"
          class="flex flex-col gap-4"
          @submit="submitForm"
        >
          <UFormGroup name="name" class="custom-input-wrapper">
            <UInput
              v-model="state.name"
              type="text"
              variant="none"
              icon="i-mdi-factory"
              placeholder="Entra el nombre de la planta"
              class="custom-input-field"
            />
          </UFormGroup>
          <UFormGroup name="address" class="custom-input-wrapper">
            <UInput
              v-model="state.address"
              type="text"
              variant="none"
              icon="i-mdi-directions"
              placeholder="Entra la dirección de la planta"
              class="custom-input-field"
            />
          </UFormGroup>
          <UFormGroup name="city" class="custom-input-wrapper">
            <USelectMenu
              v-model="state.city"
              placeholder="Elige el nombre de la provincia"
              icon="i-mdi-map-marker"
              :options="[
                'Pinar del Río',
                'Artemisa',
                'La Habana',
                'Mayabeque',
                'Matanzas',
                'Cienfuegos',
                'Villa Clara',
                'Sancti Spíritus',
                'Ciego de Ávila',
                'Camagüey',
                'Las Tunas',
                'Holguín',
                'Granma',
                'Santiago de Cuba',
                'Guantánamo',
                'Isla de la Juventud',
              ]"
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

  <div class="flex justify-end items-center">
    <UButton
      variant="solid"
      label="Añadir Parque"
      icon="i-mdi-plus"
      class="rounded-3xl focus-visible:outline-custom-primary-500 bg-custom-primary text-white hover:bg-custom-primary-500 transition-colors ease-in-out duration-150"
      @click="openParkForm()"
    />
  </div>
</template>

<script setup>
import { z } from "zod";

useHead({
  title: "Parques Solares | Administración",
});

definePageMeta({
  middleware: ["auth"],
  requiresRoles: ["admin"],
  layout: "dashboard",
});

const parksStore = useParksStore();

const page = ref(1);
const pageCount = ref(10);
const showParkForm = ref(false);
const form = ref();
const state = ref({
  id: "",
  name: "",
  address: "",
  city: null,
});
const schema = z.object({
  name: z.string().min(1, "Nombre de Planta Requerido"),
  city: z.string().min(1, "Provincia Requerida"),
});
const columns = [
  {
    key: "name",
    label: "Nombre",
    class: "italic text-center",
  },
  {
    key: "address",
    label: "Dirección",
    class: "italic text-center",
  },
  {
    key: "city",
    label: "Provincia",
    class: "italic text-center",
  },
  {
    key: "actions",
    label: "Acciones",
    class: "italic text-center",
  },
];

const parks = computed(() => {
  return parksStore.parks.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value,
  );
});

const total = computed(() => parks.value.length);

onMounted(() => parksStore.loadParks());

async function submitForm() {
  form.value.validate();

  const { start, finish } = useLoadingIndicator();
  const toast = useToast();

  start();
  setTimeout(
    () => {
      let rSuccess, rMessage;
      if (state.value.id) {
        const { success, message } = parksStore.putPark(state.value);
        rSuccess = success;
        rMessage = message;
      } else {
        const { success, message } = parksStore.postPark(state.value);
        rSuccess = success;
        rMessage = message;
      }
      finish();
      toast.add({
        id: uniqueId(),
        title: rSuccess ? "Éxito" : "Error",
        description: rMessage,
        icon: rSuccess ? "i-mdi-check" : "i-mdi-close-circle-outline",
        color: rSuccess ? "green" : "red",
        timeout: 3000,
      });
      if (rSuccess) showParkForm.value = false;
    },
    Math.floor(Math.random() * 1801) + 200,
  );
}

function deletePark(park) {
  const { start, finish } = useLoadingIndicator();
  const toast = useToast();

  start();
  setTimeout(
    () => {
      const { success, message } = parksStore.deletePark(park.id);
      finish();
      toast.add({
        id: uniqueId(),
        title: success ? "Éxito" : "Error",
        description: message,
        icon: success ? "i-mdi-check" : "i-mdi-close-circle-outline",
        color: success ? "green" : "red",
        timeout: 3000,
      });
    },
    Math.floor(Math.random() * 1801) + 200,
  );
}

function openParkForm(park) {
  showParkForm.value = true;
  state.value = {
    ...park,
  };
}
function goToPage(delta) {
  page.value = page.value + delta;
}
</script>
