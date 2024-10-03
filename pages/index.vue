<template>
  <div class="flex flex-col gap-4">
    <div class="w-full bg-custom-primary-50 p-4 flex flex-col rounded-3xl">
      <span class="text-xl text-custom-primary font-semibold"
        >Plantas máximas generadoras</span
      >
      <p class="text-sm text-custom-text-200">
        en orden descendente las plantas que mas geeración han acumulado durante
        el tiempo
      </p>

      <div class="grid grid-cols-2 lg:grid-cols-3 mt-4 gap-4">
        <div
          v-for="(stat, index) in Object.entries(maxGenerators)"
          :key="index"
          class="bg-white p-4 rounded-3xl flex flex-col gap-1 shadow-sm"
        >
          <span class="text-xl font-semibold">{{ stat[1].sum }}</span>
          <span
            >{{ stat[0] }}
            <p class="text-custom-text-200">({{ stat[1].city }})</p></span
          >
        </div>
      </div>
    </div>
  </div>
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

const parksStore = useParksStore();
const predictionsStore = usePredictionsStore();

onMounted(() => {
  parksStore.loadParks();
  predictionsStore.loadPredictions();
});

const maxGenerators = computed(() => {
  const plantas = {};
  predictionsStore.predictions.forEach((prediction) => {
    let sum = 0;
    const parkData = parksStore.parks.find(
      (park) => park.id == prediction.park,
    );
    Object.entries(timeFields.value).forEach((timeField) => {
      sum += prediction[timeField[0]];
    });
    plantas[parkData.name] = {
      city: parkData.city,
      sum,
    };
  });
  return plantas;
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
</script>
