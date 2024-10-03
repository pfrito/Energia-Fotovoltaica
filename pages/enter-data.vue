<template>
  <div class="w-full bg-white flex flex-col rounded-3xl">
    <UForm :state="filters" class="flex flex-wrap gap-2 p-4 justify-start">
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
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
          icon="i-mdi-calendar"
          :label="filters.date ? formatDateToIsoDate(filters.date) : 'Fecha'"
          variant="none"
          class="custom-input-field rounded-3xl w-[140px] h-[40px]"
          :class="{
            'text-custom-text': filters.date,
            'text-gray-400': !filters.date,
          }"
        ></UButton>

        <template #panel="{ close }">
          <DatePicker v-model="filters.date" is-required @close="close" />
        </template>
      </UPopover>

      <UButton
        v-if="filters.city || filters.date || filters.park"
        variant="solid"
        label="Cancelar Filtros"
        icon="i-mdi-filter-remove-outline"
        class="rounded-3xl focus-visible:outline-custom-primary-500 bg-custom-primary text-white hover:bg-custom-primary-500 transition-colors ease-in-out duration-150"
        @click="cleanFilters"
      />
    </UForm>

    <UTable :rows="predictions" :columns="columns" class="p-4">
      <template #park-data="{ row }">
        <div class="text-center">
          {{ parks.find((park) => park.id == row.park).name }}
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
          class="rounded-full bg-custom-primary hover:bg-custom-primary-500 focus-visible:outline-custom-primary-500 transition-colors ease-in-out duration-150 text-white p-2 flex items-center text-xl"
          :disabled="page == 1"
          @click="goToPage(-1)"
        >
          <UIcon name="i-mdi-chevron-left" />
        </button>
        <button
          class="rounded-full bg-custom-primary hover:bg-custom-primary-500 focus-visible:outline-custom-primary-500 transition-colors ease-in-out duration-150 text-white p-2 flex items-center text-xl"
          :disabled="page * pageCount >= total"
          @click="goToPage(1)"
        >
          <UIcon name="i-mdi-chevron-right" />
        </button>
      </div>
    </div>

    <UModal v-model="showDataForm" :prevent-close="false">
      <UCard
        :ui="{ ring: '', divide: 'divide-y divide-custom-text-500' }"
        class="p-4"
      >
        <template #header>
          <p class="text-center">Introducir Datos</p>
        </template>

        <UForm
          ref="form"
          :state="state"
          :validate="validate"
          class="flex flex-wrap gap-4"
          @submit="submitForm"
        >
          <UFormGroup name="park" class="custom-input-wrapper w-full">
            <USelectMenu
              v-model="state.park"
              placeholder="Parque o planta"
              icon="i-mdi-factory"
              :options="parks"
              option-attribute="name"
              value-attribute="id"
              variant="none"
              class="custom-input-field"
            />
          </UFormGroup>
          <UFormGroup name="date" class="custom-input-wrapper w-full">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton
                icon="i-mdi-calendar-today"
                :label="
                  state.date ? formatDateToIsoDate(state.date) : 'Fecha Inicio'
                "
                variant="none"
                class="custom-input-field rounded-3xl w-full h-[40px]"
                :class="{
                  'text-custom-text': state.date,
                  'text-gray-400': !state.date,
                }"
              ></UButton>

              <template #panel="{ close }">
                <DatePicker
                  v-model="state.date"
                  is-required
                  @close="onClose(close)"
                />
              </template>
            </UPopover>
          </UFormGroup>
          <UFormGroup
            v-for="(timeField, index) in Object.entries(timeFields)"
            :key="index"
            :name="timeField[0]"
            class="custom-input-wrapper grow w-[48%]"
          >
            <UInput
              v-model="state[timeField[0]]"
              type="text"
              variant="none"
              icon="i-mdi-solar-power"
              :placeholder="`Irradiancia durante ${timeField[0]}`"
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
      label="Introducir Datos"
      icon="i-mdi-plus"
      class="rounded-3xl focus-visible:outline-custom-primary-500 bg-custom-primary text-white hover:bg-custom-primary-500 transition-colors ease-in-out duration-150"
      @click="showDataForm = true"
    />
  </div>
</template>

<script setup>
useHead({
  title: "Introducir Datos | Administración",
});

definePageMeta({
  middleware: ["auth"],
  requiresRoles: ["standard-user", "admin"],
  layout: "dashboard",
});

const parksStore = useParksStore();
const predictionsStore = usePredictionsStore();

const showDataForm = ref(false);
const form = ref();
const page = ref(1);
const pageCount = ref(10);
const filters = ref({
  city: null,
  park: null,
  date: null,
});
const state = ref({
  park: "",
  date: null,
});
const timeFields = computed(() => {
  const fields = {};
  const start = new Date("1970-01-01T07:00:00");
  const end = new Date("1970-01-01T17:00:00");
  while (start <= end) {
    const key = start.toTimeString().split(" ")[0];
    fields[key] = null;
    start.setMinutes(start.getMinutes() + 60);
  }

  return fields;
});
const columns = ref([
  {
    key: "date",
    label: "Fecha",
    class: "italic text-center",
  },
  {
    key: "park",
    label: "Parque",
    class: "italic text-center",
  },
]);

const validate = (state) => {
  const errors = [];
  if (!state.park || !state.park.length)
    errors.push({ path: "park", message: "Parque Requerido" });
  if (!state.date) errors.push({ path: "date", message: "Fecha Requerida" });

  // validate time fields
  Object.entries(timeFields.value).forEach((timeField) => {
    if (!state[timeField[0]] || !state[timeField[0]].length)
      errors.push({ path: timeField[0], message: "Irradiancia Requerida" });
  });
  return errors;
};

const parks = computed(() => parksStore.parks);

const dynamicParks = computed(() =>
  parks.value.filter((park) => park.city == filters.value.city),
);

const predictions = computed(() => {
  return predictionsStore.predictions
    .filter((prediction) => {
      if (
        (filters.value.city && prediction.city != filters.value.city) ||
        (filters.value.park && prediction.park != filters.value.park) ||
        (filters.value.date &&
          formatDateToIsoDate(filters.value.date) != prediction.date)
      )
        return false;
      return true;
    })
    .slice((page.value - 1) * pageCount.value, page.value * pageCount.value);
});

const total = computed(
  () =>
    predictionsStore.predictions.filter((prediction) => {
      if (
        (filters.value.city && prediction.city != filters.value.city) ||
        (filters.value.park && prediction.park != filters.value.park) ||
        (filters.value.date &&
          formatDateToIsoDate(filters.value.date) != prediction.date)
      )
        return false;
      return true;
    }).length,
);

onMounted(() => {
  parksStore.loadParks();
  predictionsStore.loadPredictions();

  Object.entries(timeFields.value).forEach((timeField) => {
    //generate time columns for table
    columns.value.push({
      key: timeField[0],
      label: timeField[0],
      class: "italic text-center",
    });

    //generate time fields for state object
    state.value[timeField[0]] = null;
  });
});

function submitForm() {
  form.value.validate();

  const { start, finish } = useLoadingIndicator();
  const toast = useToast();

  const payload = {
    ...state.value,
    city: parks.value.find((park) => park.id == state.value.park).city,
    date: formatDateToIsoDate(state.value.date),
  };

  start();
  setTimeout(
    () => {
      const { success, message } = predictionsStore.postData(payload);
      finish();
      toast.add({
        id: uniqueId(),
        title: success ? "Éxito" : "Error",
        description: message,
        icon: success ? "i-mdi-check" : "i-mdi-close-circle-outline",
        color: success ? "green" : "red",
        timeout: 3000,
      });
      if (success) showDataForm.value = false;
    },
    Math.floor(Math.random() * 1801) + 200,
  );
}

function cleanFilters() {
  filters.value = {
    date: null,
    city: null,
    park: null,
  };
}

function onClose(defaultClose) {
  defaultClose();
  validate(state.value);
}

function goToPage(delta) {
  page.value = page.value + delta;
}
</script>
