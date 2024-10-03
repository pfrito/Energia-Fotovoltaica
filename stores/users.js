/*global defineStore, computed*/

export const useUsersStore = defineStore("users", () => {
  // state
  const users = ref([]);

  // actions
  function loadUsers() {
    if (!process.client) return [];
    const savedUsers = localStorage.getItem("users");
    users.value = savedUsers ? JSON.parse(savedUsers) : [];
  }

  function login(data) {
    loadUsers();

    const existingUser = users.value.find((user) => user.email == data.email);
    if (existingUser) {
      if (existingUser.password == data.password) {
        if (existingUser.is_active) {
          localStorage.setItem("logged-user", JSON.stringify(existingUser));
          return { success: true, message: "Usuario logueado exitosamente!" };
        }
        else {
          return { success: false, message: "La cuenta asociada a este email esta inactiva." };
        }
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
    loadUsers();

    const userData = {
      ...data,
      role:
        data.email == "carlos.rolando.morell@gmail.com"
          ? "admin"
          : "standard-user",
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

  function putUser(data) {
    loadUsers();

    const index = users.value.findIndex((user) => user.id == data.id);
    if (index != -1) {
      let newUsers = [...users.value];
      newUsers[index] = { ...data };
      saveUsers(newUsers);
      return {
        success: true,
        message: "Información de usuario editada exitosamente!",
      };
    } else {
      return {
        success: false,
        message: "Ha ocurrido un error editando la información de usuario.",
      };
    }
  }

  // private function for pinia persistency
  function saveUsers(data) {
    if (!localStorage) return;
    localStorage.setItem("users", JSON.stringify(data));
    loadUsers();
  }

  return {
    users,
    loadUsers,
    login,
    register,
    putUser,
  };
});
