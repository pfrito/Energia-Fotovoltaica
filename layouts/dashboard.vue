<template>
  <div class="bg-custom-background-100 flex">
    <div class="h-[100vh] sticky top-0 left-0">
      <SidebarNav v-model="collapseSidebar" />
    </div>
    <div
      class="px-8 py-4 flex flex-col gap-4"
      :style="
        collapseSidebar
          ? 'width: calc(100% - 50px)'
          : 'width: calc(100% - 250px)'
      "
    >
      <ProfileNav />
      <slot />
    </div>
  </div>
</template>

<script setup>
const collapseSidebar = ref(false);
</script>
