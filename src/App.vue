<template>
  <router-view />
</template>

<script setup>
defineOptions({
  name: "App",
});

import { ref, watchEffect, watch } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import LoginPage from "pages/LoginPage.vue";

const isAuthenticated = ref(false);
const router = useRouter();
const route = useRoute();

watch(route, (newRoute) => {
  console.log("Nova ruta: ", newRoute.fullPath);
});

watchEffect(() => {
  isAuthenticated.value = localStorage.getItem("user") !== null;
});
</script>
