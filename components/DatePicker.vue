<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from "v-calendar";
import type { DatePickerDate } from "v-calendar/dist/types/src/use/datePicker";
import "v-calendar/dist/style.css";

const props = defineProps({
  modelValue: {
    type: [Date] as PropType<DatePickerDate | null>,
    default: null,
  },
});

const emit = defineEmits(["update:model-value", "close"]);

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:model-value", value);
    emit("close");
  },
});

const attrs = {
  transparent: true,
  borderless: true,
  "first-day-of-week": 2,
};
</script>

<template>
  <VCalendarDatePicker v-model="date" v-bind="{ ...attrs, ...$attrs }" />
</template>
