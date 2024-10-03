/*global defineStore, computed*/

export const useParksStore = defineStore("parks", () => {
  // state
  const parks = ref([]);

  // actions
  function loadParks() {
    if (!process.client) return [];
    const savedParks = localStorage.getItem("parks");
    parks.value = savedParks ? JSON.parse(savedParks) : [];
  }

  function postPark(data) {
    loadParks();

    const parkData = {
      ...data,
      id: uniqueId(),
    };

    const index = parks.value.findIndex((park) => park.name == parkData.name);
    if (index != -1) {
      return {
        success: false,
        message: "Ya existe un parque con este nombre.",
      };
    } else {
      const newParks = [...parks.value, parkData];
      saveParks(newParks);
      return { success: true, message: "Parque registrado exitosamente!" };
    }
  }

  function putPark(data) {
    loadParks();

    const index = parks.value.findIndex((park) => park.id == data.id);
    if (index != -1) {
      let newParks = [...parks.value];
      newParks[index] = { ...data };
      saveParks(newParks);
      return {
        success: true,
        message: "Información del parque editada exitosamente!",
      };
    } else {
      return {
        success: false,
        message: "Ha ocurrido un error editando la información del parque.",
      };
    }
  }

  function deletePark(id) {
    loadParks();

    const index = parks.value.findIndex((park) => park.id == id);
    if (index != -1) {
      const newParks = parks.value.filter((park) => park.id != id);
      saveParks(newParks);
      return { success: true, message: "Parque eliminado exitosamente!" };
    } else {
      return {
        success: true,
        message: "Ha ocurrido un error eliminando el parque.",
      };
    }
  }

  // private function for pinia persistency
  function saveParks(data) {
    if (!localStorage) return;
    localStorage.setItem("parks", JSON.stringify(data));
    loadParks();
  }

  return {
    parks,
    loadParks,
    postPark,
    putPark,
    deletePark,
  };
});
