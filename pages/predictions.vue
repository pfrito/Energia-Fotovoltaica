<template>
  <div class="w-full bg-white flex flex-col rounded-3xl">
    <UForm
      ref="filtersForm"
      :state="filters"
      class="flex flex-wrap gap-2 p-4 justify-start"
      @submit="applyFilters"
    >
      <UFormGroup name="city" class="custom-input-wrapper">
        <USelectMenu
          v-model="filters.city"
          placeholder="Provincia"
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
      <UFormGroup name="park" class="custom-input-wrapper">
        <USelectMenu
          v-model="filters.park"
          placeholder="Parque o Planta"
          icon="i-mdi-factory"
          :options="dynamicParks"
          option-attribute="name"
          value-attribute="id"
          variant="none"
          class="custom-input-field"
        >
          <template #empty>
            <p>No hay parques en esta provincia"</p>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UButton
        icon="i-mdi-refresh"
        label="Aplicar"
        class="h-[40px] px-4 w-max flex justify-center items-center bg-custom-primary hover:bg-custom-primary-500 focus-visible:outline-custom-primary-500 transition-colors ease-in-out duration-150 rounded-full float-right"
      />
    </UForm>
  </div>
</template>

<script setup>
import { z } from "zod";

useHead({
  title: "Predicciones | Administración",
});

definePageMeta({
  middleware: ["auth"],
  requiresRoles: ["standard-user", "admin"],
  layout: "dashboard",
});

const parksStore = useParksStore();

const filters = ref({
  city: null,
  park: null,
  date: null,
});

const dynamicParks = computed(() =>
  parksStore.parks.filter((park) => park.city == filters.value.city),
);

onMounted(() => {
  parksStore.loadParks();
});
</script>
