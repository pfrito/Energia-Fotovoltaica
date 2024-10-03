/*global defineNuxtRouteMiddleware, useAuthStore*/

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const router = useRouter();

  if (
    to.meta.requiresRoles &&
    !to.meta.requiresRoles.includes(authStore.user.role)
  ) {
    await router.push("/authentication");
  }
});
