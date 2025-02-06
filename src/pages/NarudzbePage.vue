<template>
  <q-page class="q-pa-md">
    <q-btn
      :label="prikaz ? 'Sakrij narudžbe' : 'Prikaži narudžbe'"
      class="q-mb-md"
      color="primary"
      @click="prikaziTablicu"
      id="prikaziTablicuBtn"
    />

    <q-table
      title="Narudžbe"
      :rows="narudzbe"
      :columns="columns"
      row-key="id"
      v-show="prikaz"
    />
    <p v-if="prikaz && narudzbe.length === 0">Nema podataka za prikaz.</p>

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

const narudzbe = ref([]);
const prikaz = ref(false);

const columns = [
  {
    name: "BrojNarudzbe",
    required: true,
    label: "Broj Narudžbe",
    align: "left",
    field: (row) => row.BrojNarudzbe,
  },
  {
    name: "DatumNarudzbe",
    required: true,
    label: "Datum Narudžbe",
    align: "left",
    field: (row) => row.DatumNarudzbe,
  },
  {
    name: "VoziloNaNarudzbi",
    required: true,
    label: "Vozilo na narudžbi",
    align: "left",
    field: (row) => row.VoziloNaNarudzbi,
  },
  {
    name: "Kolicina",
    required: true,
    label: "Količina",
    align: "left",
    field: (row) => row.Kolicina,
  },
  {
    name: "Cijena",
    required: true,
    label: "Cijena",
    align: "left",
    field: (row) => row.Cijena,
  },
  {
    name: "IdKupca",
    required: true,
    label: "ID Kupca",
    align: "left",
    field: (row) => row.IdKupca,
  },
  {
    name: "BrojSasije",
    required: true,
    label: "Broj Šasije",
    align: "left",
    field: (row) => row.BrojSasije,
  },
  {
    name: "IdDjelatnika",
    required: true,
    label: "ID Djelatnika",
    align: "left",
    field: (row) => row.IdDjelatnika,
  },
];

// Funkcija koja dohvaća podatke
const ucitajTablicu = async () => {
  try {
    const response = await api.getNarudzbe(); // API poziv
    console.log("Api response: ", response.data);

    if (!Array.isArray(response.data)) {
      throw new Error(
        "API ne vraća niz, nego: " + JSON.stringify(response.data)
      );
    }

    // Obrada datuma
    narudzbe.value = response.data.map((narudzba) => {
      return {
        ...narudzba,
        DatumNarudzbe: formatDate(narudzba.DatumNarudzbe),
      };
    });

    // console.log(
    //   "Prvi objekt u nizu narudzbe.value: ",
    //   narudzbe.value.length > 0 ? narudzbe.value[0] : "Nema podataka"
    // );
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

// Funkcija za formatiranje datuma
const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Formatiraj datum u format "dd.mm.yyyy"
  return `${date.getDate().toString().padStart(2, "0")}.${date
    .getMonth()
    .toString()
    .padStart(2, "0")}.${date.getFullYear()}`;
};

onMounted(ucitajTablicu);
</script>
