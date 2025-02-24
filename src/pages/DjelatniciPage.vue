<template>
  <q-page class="q-pa-md">
    <h4>Dodaj novog djelatnika</h4>
    <q-form ref="formRef" @submit.prevent="spremi">
      <div class="q-gutter-md">
        <q-input
          v-model="imeFormatted"
          style="width: 30%"
          label="Ime djelatnika"
          outlined
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="prezimeFormatted"
          style="width: 30%"
          label="Prezime djelatnika"
          outlined
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="noviDjelatnik.korisnickoIme"
          style="width: 30%"
          label="Korisničko ime"
          outlined
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="noviDjelatnik.lozinka"
          style="width: 30%"
          label="Lozinka"
          outlined
          type="password"
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
      </div>

      <div class="row q-gutter-x-md">
        <q-btn
          push
          type="submit"
          label="Spremi"
          color="primary"
          class="q-mt-md"
          :disable="!validacija()"
        />
        <q-btn
          push
          label="Ažuriraj"
          color="secondary"
          class="q-mt-md"
          @click="azuriraj"
          :disable="!odabraniRedak"
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
      push
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
      row-key="IdDjelatnika"
      v-show="prikaz"
      @row-click="odaberiRedak"
      style="width: 85%; margin: 20px auto"
    />
    <p v-if="prikaz && djelatnici.length === 0">Nema podataka za prikaz.</p>

    <q-btn
      push
      v-show="prikaz"
      @click="ucitajTablicu"
      label="Osvježi"
      color="primary"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "src/api";
import { useQuasar } from "quasar";

const djelatnici = ref([]);
const prikaz = ref(false);
const $q = useQuasar();
const odabraniRedak = ref(null);

// Novi djelatnik
const noviDjelatnik = ref({
  ime: "",
  prezime: "",
  korisnickoIme: "",
  lozinka: "",
});

const imeFormatted = computed({
  get: () => noviDjelatnik.value.ime,
  set: (value) => (noviDjelatnik.value.ime = capitalizeFirstLetter(value)),
});

const prezimeFormatted = computed({
  get: () => noviDjelatnik.value.prezime,
  set: (value) => (noviDjelatnik.value.prezime = capitalizeFirstLetter(value)),
});

// Funkcija za kapitalizaciju prvog slova
const capitalizeFirstLetter = (value) => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

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

// Funkcija za validaciju inputa
const validacija = () => {
  return (
    noviDjelatnik.value.ime &&
    noviDjelatnik.value.prezime &&
    noviDjelatnik.value.korisnickoIme &&
    noviDjelatnik.value.lozinka
  );
};

// Funkcija za učitavanje podataka iz baze
const ucitajTablicu = async () => {
  try {
    const response = await api.getDjelatnici(); // API poziv

    djelatnici.value = response.data;
  } catch (error) {
    console.error("Greška pri dohvaćanju djelatnika: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri dohvaćanju djelatnika.",
    });
  }
};

// Funkcija za spremanje novog djelatnika
const formRef = ref(null);

const spremi = async () => {
  if (!validacija()) {
    $q.notify({ type: "warning", message: "Sva polja moraju biti popunjena!" });
    return;
  }

  try {
    await api.createDjelatnik({
      ImeDjelatnika: noviDjelatnik.value.ime,
      PrezimeDjelatnika: noviDjelatnik.value.prezime,
      korisnickoIme: noviDjelatnik.value.korisnickoIme,
      lozinka: noviDjelatnik.value.lozinka,
    });

    $q.notify({ type: "positive", message: "Djelatnik uspješno spremljen!" });

    // Resetiranje forme
    noviDjelatnik.value = {
      ime: "",
      prezime: "",
      korisnickoIme: "",
      lozinka: "",
    };

    formRef.value.resetValidation(); // Resetiraj validaciju forme

    // Osvježi tablicu
    ucitajTablicu();
  } catch (error) {
    console.error("Greška pri spremanju djelatnika: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri spremanju djelatnika!",
    });
  }
};

// Funkcija za odabir retka
const odaberiRedak = (event, row) => {
  odabraniRedak.value = row;

  // Popunjavanje inputa podacima iz reda
  noviDjelatnik.value = {
    ime: row.ImeDjelatnika,
    prezime: row.PrezimeDjelatnika,
    korisnickoIme: row.korisnickoIme,
    lozinka: row.lozinka,
  };
};

// Ažuriranje djelatnika
const azuriraj = async () => {
  if (!odabraniRedak.value) {
    $q.notify({
      type: "warning",
      message: "Odaberite djelatnika za ažuriranje!",
    });
    return;
  }

  try {
    await api.updateDjelatnik(odabraniRedak.value.IdDjelatnika, {
      ImeDjelatnika: noviDjelatnik.value.ime,
      PrezimeDjelatnika: noviDjelatnik.value.prezime,
      korisnickoIme: noviDjelatnik.value.korisnickoIme,
      lozinka: noviDjelatnik.value.lozinka,
    });

    $q.notify({ type: "positive", message: "Djelatnik uspješno ažuriran!" });
    ucitajTablicu();
    odabraniRedak.value = null;
    noviDjelatnik.value = {
      ime: "",
      prezime: "",
      korisnickoIme: "",
      lozinka: "",
    };
  } catch (error) {
    console.error("Greška pri ažuriranju djelatnika: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri ažuriranju djelatnika!",
    });
  }
};

// Brisanje djelatnika
const obrisi = async () => {
  if (!odabraniRedak.value) {
    $q.notify({
      type: "warning",
      message: "Odaberite djelatnika za brisanje!",
    });
    return;
  }

  $q.dialog({
    title: "Potvrda",
    message: "Jeste li sigurni da želite obrisati ovog djelatnika?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.deleteDjelatnik(odabraniRedak.value.IdDjelatnika);
      $q.notify({ type: "positive", message: "Djelatnik uspješno obrisan!" });
      ucitajTablicu();
      odaberiRedak.value = null;
    } catch (error) {
      console.error("Greška pri brisanju djelatnika: ", error);
      $q.notify({
        type: "negative",
        message: "Greška pri brisanju djelatnika!",
      });
    }
  });
};

// Učitaj tablicu kada se komponenta montira
onMounted(ucitajTablicu);
</script>
