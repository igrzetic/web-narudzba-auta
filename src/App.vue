<template>
  <router-view />
</template>

<script setup>
defineOptions({
  name: "App",
});

import { watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

watch(route, (newRoute) => {
  console.log("Nova ruta: ", newRoute.fullPath);
});

// onMounted(() => {
//   const userRole = localStorage.getItem("userRole");
//   if (!userRole) {
//     router.push("/login");
//   }
// });
</script>
