/*global defineStore, computed*/

export const useUsersStore = defineStore("users", () => {
  // state
  const users = computed(() => {
    if (!process.client) return [];
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // actions
  function login(data) {
    const existingUser = users.value.find((user) => user.email == data.email);
    if (existingUser) {
      if (existingUser.password == data.password) {
        localStorage.setItem("logged-user", JSON.stringify(data));
        return { success: true, message: "Usuario logueado exitosamente!" };
      } else {
        return {
          success: false,
          message:
            "Su correo o contraseña son incorrectos, por favor inténtelo de nuevo.",
        };
      }
    } else {
      return {
        success: false,
        message: "No existe un usuario con este correo, por favor registrese.",
      };
    }
  }

  function register(data) {
    const userData = {
      ...data,
      role: "standard-user",
      is_active: true,
      id: uniqueId(),
    };

    const index = users.value.findIndex((user) => user.email == userData.email);
    if (index != -1) {
      return { success: false, message: "Este correo ya esta registrado." };
    } else {
      const newUsers = [...users.value, userData];
      saveUsers(newUsers);
      localStorage.setItem("logged-user", JSON.stringify(userData));
      return { success: true, message: "Usuario registrado exitosamente!" };
    }
  }

  // private function for pinia persistency
  function saveUsers(data) {
    if (!localStorage) return;
    localStorage.setItem("users", JSON.stringify(data));
  }

  return {
    users,
    login,
    register,
  };
});
