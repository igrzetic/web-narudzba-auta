<template>
  <q-page>
    <div class="q-pa-md">
      <q-form @submit.prevent="login">
        <div class="q-gutter-md">
          <q-input
            filled
            v-model="korisnickoIme"
            label="Korisničko ime"
            type="text"
            style="width: 30%"
            required
          />
          <q-input
            filled
            v-model="lozinka"
            label="Lozinka"
            type="password"
            style="width: 30%"
            required
          />

          <q-btn push color="primary" type="submit" label="Prijavi se" />
        </div>
      </q-form>
      <q-banner v-if="errorMessages" class="q-mt-md" color="negative">
        {{ errorMessages }}
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const korisnickoIme = ref("");
const lozinka = ref("");
const errorMessages = ref("");
const router = useRouter();

const login = () => {};
</script>
