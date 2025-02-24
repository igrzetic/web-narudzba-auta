<template>
  <q-layout view="hHh Lpr lff">
    <!-- Gornji Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>Web narudžba auta</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Bočni Drawer -->
    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      :width="200"
      bordered
      class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item clickable v-ripple to="/">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Početna</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/narudzbe">
            <q-item-section avatar>
              <q-icon name="add_shopping_cart" />
            </q-item-section>
            <q-item-section>Narudžbe</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/vozila">
            <q-item-section avatar>
              <q-icon name="directions_car" />
            </q-item-section>
            <q-item-section>Vozila</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/kupci">
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>
            <q-item-section>Kupci</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/racuni">
            <q-item-section avatar>
              <q-icon name="receipt" />
            </q-item-section>
            <q-item-section>Računi</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/djelatnici">
            <q-item-section avatar>
              <q-icon name="account_circle" />
            </q-item-section>
            <q-item-section>Djelatnici</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Glavni sadrzaj -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(false);
const miniState = ref(true);
</script>
