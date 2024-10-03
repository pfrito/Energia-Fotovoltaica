<template>
  <div class="bg-custom-background-100 flex">
    <div class="h-[100vh] sticky top-0 left-0">
      <SidebarNav />
    </div>
    <div class="grow p-4 flex flex-col gap-4">
      <ProfileNav />
      <slot />
    </div>
  </div>
</template>
