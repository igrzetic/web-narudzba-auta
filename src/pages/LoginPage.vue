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
import { useRouter } from "vue-router";
import axios from "axios";

const korisnickoIme = ref("");
const lozinka = ref("");
const errorMessages = ref("");
const isLoading = ref(false);
const router = useRouter();

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

    // Ako korisnik postoji, preusmjeravamo ga na narudzbaPage
    if (korisnik) {
      console.log("Korisnik postoji u bazi:", korisnik);

      // Spremi korisnika u localStorage
      localStorage.setItem("user", JSON.stringify(korisnik));

      // Preusmjeri korisnika na narudzbaPage
      router.push("narudzbe");
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
