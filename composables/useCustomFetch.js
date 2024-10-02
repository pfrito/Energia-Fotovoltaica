import { useLoadingIndicator, useToast } from "#imports";

export function useCustomFetch() {
  return async (url, options = {}) => {
    const { start, finish } = useLoadingIndicator();
    const toast = useToast();
    const uniqueId = () => new Date() + "-" + Math.floor(Math.random() * 1000);

    try {
      start();
      // eslint-disable-next-line no-undef
      const response = await $fetch(url, options);
      return response;
    } catch (error) {
      toast.add({
        id: uniqueId(),
        title: "Error",
        description: `Algo salió mal`,
        icon: "i-material-symbols-error-outline",
        color: "red",
        timeout: 3000,
      });
      throw error;
    } finally {
      finish();
    }
  };
}
