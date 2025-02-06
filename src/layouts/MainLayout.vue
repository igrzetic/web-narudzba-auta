<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Web narudžba auta </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Izbornik </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

defineOptions({
  name: "MainLayout",
});

const linksList = [
  {
    title: "Narudžbe",
    caption: "kreiranje / pregled narudžbi",
    icon: "add_shopping_cart",
    link: "/narudzbe",
  },
  {
    title: "Vozila",
    caption: "pregled / izmjena vozila",
    icon: "directions_car",
    link: "/vozila",
  },
  {
    title: "Kupci",
    caption: "dodavanje / izmjena kupaca",
    icon: "group",
    link: "/kupci",
  },
  {
    title: "Računi",
    caption: "generiranje / pregled računa",
    icon: "receipt",
    link: "/racuni",
  },
  {
    title: "Djelatnik",
    caption: "log out",
    icon: "account_circle",
    link: "/djelatnici",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
