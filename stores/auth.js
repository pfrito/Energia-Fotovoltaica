/*global defineStore, computed*/

export const useAuthStore = defineStore("auth", () => {
  // state
  const user = computed(() => {
    const savedUser = localStorage.getItem("logged-user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const isLogged = computed(() => (user.value.id ? true : false));

  // actions
  function logout() {
    localStorage.removeItem("logged-user");
    return { success: true, message: "Usuario deslogueado exitosamente!" };
  }

  return {
    user,
    isLogged,
    logout,
  };
});
