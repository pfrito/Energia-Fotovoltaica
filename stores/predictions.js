/*global defineStore, ref*/

export const usePredictionsStore = defineStore("predictions", () => {
  // state
  const predictions = ref([]);

  // actions
  function loadPredictions() {
    const savedPredictions = localStorage.getItem("predictions");
    predictions.value = savedPredictions ? JSON.parse(savedPredictions) : [];
  }

  function postPrediction(data) {
    loadPredictions();

    // travel for each date between startdate and enddate
    const startDate = data.startdate;
    const endDate = data.enddate;
    while (startDate <= endDate) {
      let payload = {
        city: data.city,
        park: data.park,
        date: formatDateToIsoDate(startDate),
      };

      // travel for each available time and set a random value
      const startTime = new Date(`${formatDateToIsoDate(startDate)}T07:00:00`);
      const endTime = new Date(`${formatDateToIsoDate(startDate)}T17:00:00`);
      while (startTime <= endTime) {
        payload[startTime.toTimeString().split(" ")[0]] =
          Math.floor(Math.random() * 800) + 200;
        startTime.setMinutes(startTime.getMinutes() + 60);
      }

      const newPredictions = [...predictions.value, payload];
      savePredictions(newPredictions);

      startDate.setDate(startDate.getDate() + 1);
    }

    return { success: true, message: "Predicción añadida exitosamente!" };
  }

  // private function for pinia persistency
  function savePredictions(data) {
    if (!localStorage) return;
    localStorage.setItem("predictions", JSON.stringify(data));
    loadPredictions();
  }

  return {
    predictions,
    loadPredictions,
    postPrediction,
  };
});
