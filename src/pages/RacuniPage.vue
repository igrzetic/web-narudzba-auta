<template>
  <q-page class="q-pa-md">
    <h4>Dodaj novi račun</h4>
    <q-form ref="formRef" @submit.prevent="spremi">
      <div class="q gutter-md">
        <q-select
          v-model="noviRacun.brojNarudzbe"
          style="width: 30%"
          label="Broj narudžbe"
          emit-value
          map-options
          filled
          :options="narudzbe"
          :rules="[(val) => !!val || 'Odaberite narudžbu']"
        />
        <q-input
          v-model="idDjelatnika"
          style="width: 30%"
          label="Djelatnik"
          readonly
          filled
        />
        <q-input
          v-model="vozilo"
          style="width: 30%"
          label="Vozilo"
          readonly
          filled
        />
        <q-input
          v-model="kolicina"
          style="width: 30%"
          label="Količina"
          readonly
          filled
        />
        <q-input
          v-model="iznosRacuna"
          style="width: 30%"
          label="Iznos računa"
          readonly
          filled
        />
        <q-select
          v-model="noviRacun.nacinPlacanja"
          style="width: 30%"
          label="Način plaćanja"
          emit-value
          map-options
          filled
          :options="naciniPlacanja"
          :rules="[(val) => !!val || 'Odaberite način plaćanja']"
        />
      </div>

      <div class="row q-gutter-x-md">
        <q-btn
          push
          type="submit"
          label="Izradi račun"
          color="primary"
          class="q-mt-md"
          :disable="!validacija()"
        />
        <q-btn
          push
          label="Obriši"
          color="secondary"
          class="q-mt-md"
          @click="obrisi"
          :disable="!odabraniRedak"
        />
      </div>
    </q-form>

    <q-separator class="q-my-md" />

    <q-btn
      :label="prikaz ? 'Sakrij račune' : 'Prikaži račune'"
      class="q-mb-md"
      color="primary"
      @click="prikaziTablicu"
      id="prikaziTablicuBtn"
    />

    <q-table
      title="Računi"
      :rows="racuni"
      :columns="columns"
      row-key="brojRacuna"
      v-if="prikaz"
      @row-click="odaberiRedak"
      style="width: 85%; margin: 20px auto"
    />

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
import { ref, onMounted, watch } from "vue";
import api from "src/api";
import { useQuasar } from "quasar";
import axios from "axios";

const formRef = ref(null);
const racuni = ref([]);
const narudzbe = ref([]);
const prikaz = ref(false);
const $q = useQuasar();
const odabraniRedak = ref(null);
const idDjelatnika = ref(0);
const idKupca = ref(0);
const vozilo = ref("");
const kolicina = ref(0);
const iznosRacuna = ref(0);

// Novi račun
const noviRacun = ref({
  brojNarudzbe: "",
  idDjelatnika: "",
  idKupca: "",
  vozilo: "",
  kolicina: 0,
  iznosRacuna: 0,
  nacinPlacanja: "",
});

const dohvatiNarudzbe = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/narudzbe");
    narudzbe.value = response.data.map((narudzba) => ({
      label: narudzba.BrojNarudzbe,
      value: narudzba.BrojNarudzbe,
    }));
  } catch (error) {
    console.error("Greška pri dohvaćanju narudžbi:", error);
  }
};

onMounted(dohvatiNarudzbe);

const naciniPlacanja = ref([
  { label: "Gotovina", value: "Gotovina" },
  { label: "Kartica", value: "Kartica" },
  { label: "Bankovna uplata", value: "Bankovna uplata" },
]);

const dohvatiPodatkeONarudzbi = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/narudzbe");
    const odabranaNarudzba = response.data.find(
      (narudzba) =>
        `${narudzba.BrojNarudzbe}`.trim() ===
        `${noviRacun.value.brojNarudzbe}`.trim()
    );

    if (odabranaNarudzba) {
      vozilo.value = odabranaNarudzba.VoziloNaNarudzbi;
      kolicina.value = odabranaNarudzba.Kolicina;
      iznosRacuna.value = odabranaNarudzba.Cijena;
      idDjelatnika.value = odabranaNarudzba.IdDjelatnika;
      idKupca.value = odabranaNarudzba.IdKupca;
    }
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka o narudžbi:", error);
  }
};

watch(
  () => noviRacun.value.brojNarudzbe,
  () => {
    dohvatiPodatkeONarudzbi();
  }
);

// Funkcija za prikaz tablice
const prikaziTablicu = () => {
  prikaz.value = !prikaz.value;
  if (prikaz.value) {
    ucitajTablicu();
  }
};

// Definicija kolona za tablicu
const columns = [
  {
    name: "BrojRacuna",
    required: true,
    label: "Broj računa",
    align: "left",
    field: (row) => row.BrojRacuna,
  },
  {
    name: "DatumRacuna",
    required: true,
    label: "Datum računa",
    align: "left",
    field: (row) => row.DatumRacuna,
  },
  {
    name: "IdDjelatnika",
    required: true,
    label: "ID djelatnika",
    align: "left",
    field: (row) => row.IdDjelatnika,
  },
  {
    name: "BrojNarudzbe",
    required: true,
    label: "Broj narudžbe",
    align: "left",
    field: (row) => row.BrojNarudzbe,
  },
  {
    name: "StavkaRacuna",
    required: true,
    label: "Vozilo",
    align: "left",
    field: (row) => row.StavkaRacuna,
  },
  {
    name: "Kolicina",
    required: true,
    label: "Količina",
    align: "left",
    field: (row) => row.Kolicina,
  },
  {
    name: "IznosRacuna",
    required: true,
    label: "Iznos računa",
    align: "left",
    field: (row) => row.IznosRacuna,
  },
  {
    name: "NacinPlacanja",
    required: true,
    label: "Način plaćanja",
    align: "left",
    field: (row) => row.NacinPlacanja,
  },
];

// Funkcija za validaciju inputa
const validacija = () => {
  return noviRacun.value.brojNarudzbe && noviRacun.value.nacinPlacanja;
};

// Funkcija za učitavanje podataka iz baze
const ucitajTablicu = async () => {
  try {
    const response = await api.getRacuni(); // API poziv

    // Obrada datuma
    racuni.value = response.data.map((racun) => {
      return {
        ...racun,
        DatumRacuna: formatDate(racun.DatumRacuna),
      };
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju narudžbi: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri dohvaćanju narudžbi.",
    });
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

// Funkcija za spremanje novog računa
const spremi = async () => {
  if (!validacija()) {
    $q.notify({ type: "warning", message: "Sva polja moraju biti popunjena!" });
    return;
  }

  try {
    await api.createRacun({
      IdDjelatnika: idDjelatnika.value,
      StavkaRacuna: vozilo.value,
      Kolicina: kolicina.value,
      IznosRacuna: iznosRacuna.value,
      NacinPlacanja: noviRacun.value.nacinPlacanja,
      IdKupca: idKupca.value,
      BrojNarudzbe: noviRacun.value.brojNarudzbe,
    });

    $q.notify({ type: "positive", message: "Račun uspješno spremljen!" });

    // Resetiranje forme
    noviRacun.value = {
      brojNarudzbe: "",
      idDjelatnika: "",
      vozilo: "",
      kolicina: "",
      iznosRacuna: "",
      nacinPlacanja: "",
    };

    formRef.value.resetValidation(); // Resetiraj validaciju forme

    // Osvježi tablicu
    ucitajTablicu();
  } catch (error) {
    console.error("Greška pri spremanju računa: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri spremanju računa!",
    });
  }
};

// Učitaj tablicu kada se komponenta montira
onMounted(ucitajTablicu);

// Funkcija za odabir retka
const odaberiRedak = (event, row) => {
  odabraniRedak.value = row;

  // Popunjavanje inputa podacima iz reda
  noviRacun.value = {
    brojNarudzbe: row.BrojNarudzbe,
    idDjelatnika: row.IdDjelatnika,
    vozilo: row.StavkaRacuna,
    kolicina: row.Kolicina,
    iznosRacuna: row.IznosRacuna,
    nacinPlacanja: row.NacinPlacanja,
  };
};

// Brisanje računa
const obrisi = async () => {
  if (!odabraniRedak.value) {
    $q.notify({
      type: "warning",
      message: "Odaberite račun za brisanje!",
    });
    return;
  }

  $q.dialog({
    title: "Potvrda",
    message: "Jeste li sigurni da želite obrisati ovaj račun?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.deleteRacun(odabraniRedak.value.BrojRacuna);
      $q.notify({ type: "positive", message: "Račun uspješno obrisan!" });
      ucitajTablicu();

      // Resetiranje forme
      noviRacun.value = {
        brojNarudzbe: "",
        idDjelatnika: "",
        vozilo: "",
        kolicina: "",
        iznosRacuna: "",
        nacinPlacanja: "",
      };

      odaberiRedak.value = null;
    } catch (error) {
      console.error("Greška pri brisanju računa: ", error);
      $q.notify({
        type: "negative",
        message: "Greška pri brisanju računa!",
      });
    }
  });
};
</script>
