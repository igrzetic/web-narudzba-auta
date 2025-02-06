<template>
  <q-page class="q-pa-md">
    <q-btn
      :label="prikaz ? 'Sakrij djelatnike' : 'Prikaži djelatnike'"
      class="q-mb-md"
      color="primary"
      @click="prikaziTablicu"
      id="prikaziTablicuBtn"
    />

    <q-table
      title="Djelatnici"
      :rows="djelatnici"
      :columns="columns"
      row-key="id"
      v-show="prikaz"
    />
    <p v-if="prikaz && djelatnici.length === 0">Nema podataka za prikaz.</p>

    <q-btn
      v-show="prikaz"
      @click="ucitajTablicu"
      label="Osvježi"
      color="primary"
      class="q-mt-md"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "src/api";

const djelatnici = ref([]);
const prikaz = ref(false);

const columns = [
  {
    name: "IdDjelatnika",
    required: true,
    label: "ID Djelatnika",
    align: "left",
    field: (row) => row.IdDjelatnika,
  },
  {
    name: "ImeDjelatnika",
    required: true,
    label: "Ime djelatnika",
    align: "left",
    field: (row) => row.ImeDjelatnika,
  },
  {
    name: "PrezimeDjelatnika",
    required: true,
    label: "Prezime djelatnika",
    align: "left",
    field: (row) => row.PrezimeDjelatnika,
  },
  {
    name: "korisnickoIme",
    required: true,
    label: "Korisničko ime",
    align: "left",
    field: (row) => row.korisnickoIme,
  },
  {
    name: "lozinka",
    required: true,
    label: "Lozinka",
    align: "left",
    field: (row) => row.lozinka,
  },
];

// Funkcija koja dohvaća podatke
const ucitajTablicu = async () => {
  try {
    const response = await api.getDjelatnici(); // API poziv
    console.log("Api response: ", response.data);

    djelatnici.value = response.data;

    console.log(
      "Prvi objekt u nizu djelatnici.value: ",
      djelatnici.value.length > 0 ? djelatnici.value[0] : "Nema podataka"
    );
  } catch (error) {
    console.error("Greška pri dohvaćanju narudžbi: ", error);
  }
};

// Toggle funkcija za tablicu
const prikaziTablicu = () => {
  prikaz.value = !prikaz.value;
  if (prikaz.value) {
    ucitajTablicu();
  }
};

onMounted(ucitajTablicu);
</script>
