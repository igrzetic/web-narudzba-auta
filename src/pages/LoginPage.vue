<template>
  <q-page class="flex flex-center">
    <q-card
      class="q-pa-lg shadow-3"
      style="width: 500px; max-width: 90%; border-radius: 15px"
    >
      <q-form @submit.prevent="login" class="q-gutter-md">
        <q-input
          flat
          v-model="korisnickoIme"
          label="Korisničko ime"
          type="text"
          dense
          required
        />
        <q-input
          flat
          v-model="lozinka"
          label="Lozinka"
          type="password"
          dense
          required
        />

        <div
          class="flex justify-center"
          style="margin-top: 20%; margin-bottom: 10%"
        >
          <q-btn
            push
            color="primary"
            type="submit"
            label="Prijavi se"
            style="padding: 15px 50px; border-radius: 100px"
            :loading="isLoading"
          />
        </div>
      </q-form>
      <q-banner
        v-if="errorMessages"
        class="q-mt-md"
        style="color: red; background-color: pink; border-radius: 15px"
      >
        {{ errorMessages }}
      </q-banner>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const korisnickoIme = ref("");
const lozinka = ref("");
const errorMessages = ref("");
const isLoading = ref(false);

// Funkcija za prijavu korisnika
const login = async () => {
  isLoading.value = true;

  try {
    // Dohvaćamo sve djelatnike s API-ja
    const response = await axios.get("http://localhost:3001/api/djelatnici");
    const djelatnici = response.data;
    errorMessages.value = "";

    // Provjeravamo postoji li korisnik s odgovarajućim korisničkim imenom i lozinkom
    const korisnik = djelatnici.find(
      (djelatnik) =>
        djelatnik.korisnickoIme === korisnickoIme.value &&
        djelatnik.lozinka === lozinka.value
    );

    // Ako korisnik postoji, ispišemo korisničko ime i lozinku u konzolu
    if (korisnik) {
      console.log("Korisnik postoji u bazi:");
      console.log("Korisničko ime: ", korisnik.korisnickoIme);
      console.log("Lozinka: ", korisnik.lozinka);
    } else {
      console.log("Korisnik ne postoji u bazi");
      errorMessages.value = "Neispravno korisničko ime ili lozinka!";
    }
  } catch (error) {
    console.error("Greška pri dohvaćanju korisnika: ", error);
    errorMessages.value = "Pogreška pri spajanju na bazu.";
  } finally {
    isLoading.value = false;
  }
};
</script>
