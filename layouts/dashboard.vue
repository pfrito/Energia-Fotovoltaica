<template>
  <div class="bg-custom-background-100 flex">
    <div class="h-[100vh] sticky top-0 left-0">
      <SidebarNav />
    </div>
    <div class="grow"><slot /></div>
  </div>
</template>
