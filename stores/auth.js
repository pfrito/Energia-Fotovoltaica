/*global defineStore, computed*/

export const useAuthStore = defineStore("auth", () => {
  // state
  const user = computed(() => {
    if (!process.client) return {};
    const savedUser = localStorage.getItem("logged-user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const isLogged = computed(() => (user.value.id ? true : false));

  // actions
  function logout() {
    localStorage.removeItem("logged-user");
  }

  return {
    user,
    isLogged,
    logout,
  };
});
