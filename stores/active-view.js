/*global defineStore, computed*/

export const useActiveViewStore = defineStore("active-view", () => {
  // state
  const activeView = ref("stats");

  // actions
  function setActiveView(path) {
    activeView.value = path;
  }

  return {
    activeView,
    setActiveView,
  };
});
