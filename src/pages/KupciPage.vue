<template>
  <q-page class="q-pa-md">
    <h4 style="margin: 2% 10%">Dodaj novog kupca</h4>
    <q-card
      class="q-pa-lg shadow-3"
      style="
        width: 50%;
        max-width: 90%;
        border-radius: 15px;
        margin: 0 10%;
        background-color: #dedede;
      "
    >
      <q-form ref="formRef" @submit.prevent="spremi" style="padding: 5%">
        <div class="q-gutter-md">
          <q-input
            outlined
            v-model="noviKupac.oib"
            label="OIB kupca"
            type="text"
            :rules="[
              (val) => val.length === 11 || 'OIB mora imati 11 znamenki',
            ]"
          />
          <q-input
            outlined
            v-model="imeFormatted"
            label="Ime kupca"
            type="text"
            :rules="[(val) => !!val || 'Ovo polje je obavezno']"
          />
          <q-input
            v-model="prezimeFormatted"
            label="Prezime kupca"
            outlined
            type="text"
            :rules="[(val) => !!val || 'Ovo polje je obavezno']"
          />
          <q-input
            v-model="noviKupac.adresa"
            label="Adresa kupca"
            outlined
            type="text"
            :rules="[(val) => !!val || 'Ovo polje je obavezno']"
          />
          <q-input
            v-model="noviKupac.email"
            label="Email kupca"
            outlined
            type="email"
            :rules="[
              (val) => /.+@.+\..+/.test(val) || 'Unesite ispravan email',
            ]"
          />
          <q-input
            v-model="noviKupac.brojTelefona"
            label="Broj telefona"
            outlined
            type="text"
            :rules="[
              (val) =>
                /^\d{9,10}$/.test(val) || 'Unesite ispravan broj telefona',
            ]"
          />
          <q-select
            v-model="noviKupac.tipKupca"
            label="Tip
          kupca"
            outlined
            :options="tipoviKupca"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Odaberite tip kupca']"
            @update:model-value="logTipPodatka"
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
    </q-card>

    <div class="flex justify-center">
      <q-separator
        class="q-my-lg"
        style="width: 90%; height: 3px; border-radius: 100px; margin: 5%"
      />
    </div>

    <q-btn
      push
      :label="prikaz ? 'Sakrij kupce' : 'Prikaži kupce'"
      class="q-mb-md"
      color="primary"
      @click="prikaziTablicu"
      id="prikaziTablicuBtn"
      style="margin: 0 10%; margin-bottom: 3%"
    />

    <q-table
      title="Kupci"
      :rows="kupci"
      :columns="columns"
      row-key="IdKupca"
      v-show="prikaz"
      @row-click="odaberiRedak"
      style="width: 85%; margin: 20px auto; border-radius: 15px"
      class="shadow-3"
    />

    <q-btn
      push
      v-show="prikaz"
      @click="ucitajTablicu"
      label="Osvježi"
      color="primary"
      style="margin: 2% 10%"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "src/api";
import { useQuasar } from "quasar";

const kupci = ref([]);
const prikaz = ref(false);
const $q = useQuasar();
const odabraniRedak = ref(null);
const formRef = ref(null);

// Novi kupac
const noviKupac = ref({
  oib: "",
  ime: "",
  prezime: "",
  adresa: "",
  email: "",
  brojTelefona: "",
  tipKupca: "",
});

const imeFormatted = computed({
  get: () => noviKupac.value.ime,
  set: (value) => (noviKupac.value.ime = capitalizeFirstLetter(value)),
});

const prezimeFormatted = computed({
  get: () => noviKupac.value.prezime,
  set: (value) => (noviKupac.value.prezime = capitalizeFirstLetter(value)),
});

const tipoviKupca = ref([
  { label: "Fizička osoba", value: "Fizička osoba" },
  { label: "Pravna osoba", value: "Pravna osoba" },
]);

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
    name: "IdKupca",
    required: true,
    label: "ID",
    align: "left",
    field: (row) => row.IdKupca,
  },
  {
    name: "OIB",
    required: true,
    label: "OIB",
    align: "left",
    field: (row) => row.OIB,
  },
  {
    name: "ImeKupca",
    required: true,
    label: "Ime",
    align: "left",
    field: (row) => row.ImeKupca,
  },
  {
    name: "PrezimeKupca",
    required: true,
    label: "Prezime",
    align: "left",
    field: (row) => row.PrezimeKupca,
  },
  {
    name: "AdresaKupca",
    required: true,
    label: "Adresa",
    align: "left",
    field: (row) => row.AdresaKupca,
  },
  {
    name: "Email",
    required: true,
    label: "Email",
    align: "left",
    field: (row) => row.Email,
  },
  {
    name: "BrojTelefona",
    required: true,
    label: "Broj telefona",
    align: "left",
    field: (row) => row.BrojTelefona,
  },
  {
    name: "TipKupca",
    required: true,
    label: "Tip kupca",
    align: "left",
    field: (row) => row.TipKupca,
  },
];

// Funkcija za validaciju inputa
const validacija = () => {
  return (
    noviKupac.value.oib &&
    noviKupac.value.ime &&
    noviKupac.value.prezime &&
    noviKupac.value.adresa &&
    noviKupac.value.email &&
    noviKupac.value.brojTelefona &&
    noviKupac.value.tipKupca
  );
};

// Funkcija za učitavanje podataka iz baze
const ucitajTablicu = async () => {
  try {
    const response = await api.getKupci(); // API poziv
    kupci.value = response.data;
  } catch (error) {
    console.error("Greška pri dohvaćanju Kupca: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri dohvaćanju Kupca.",
    });
  }
};

// Funkcija za spremanje novog kupca
const spremi = async () => {
  if (!validacija()) {
    $q.notify({ type: "warning", message: "Sva polja moraju biti popunjena!" });
    return;
  }

  try {
    const response = await api.getKupci();
    const postojiOib = response.data.some(
      (kupac) => kupac.OIB === noviKupac.value.oib
    );

    if (postojiOib) {
      $q.notify({ type: "negative", message: "OIB već postoji u bazi!" });
      return;
    }

    await api.createKupac({
      OIB: noviKupac.value.oib,
      ImeKupca: noviKupac.value.ime,
      PrezimeKupca: noviKupac.value.prezime,
      AdresaKupca: noviKupac.value.adresa,
      Email: noviKupac.value.email,
      BrojTelefona: noviKupac.value.brojTelefona,
      TipKupca: noviKupac.value.tipKupca,
    });

    $q.notify({ type: "positive", message: "Kupac uspješno spremljen!" });

    // Resetiranje forme
    noviKupac.value = {
      oib: "",
      ime: "",
      prezime: "",
      adresa: "",
      email: "",
      brojTelefona: "",
      tipKupca: "",
    };

    formRef.value.resetValidation(); // Resetiraj validaciju forme

    // Osvježi tablicu
    ucitajTablicu();
  } catch (error) {
    console.error("Greška pri spremanju kupca: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri spremanju kupca.",
    });
  }
};

// Funkcija za odabir retka
const odaberiRedak = (event, row) => {
  odabraniRedak.value = row;

  // Popunjavanje inputa podacima iz reda
  noviKupac.value = {
    oib: row.OIB,
    ime: row.ImeKupca,
    prezime: row.PrezimeKupca,
    adresa: row.AdresaKupca,
    email: row.Email,
    brojTelefona: row.BrojTelefona,
    tipKupca: row.TipKupca,
  };
};

// Funkcija za ažuriranje kupca
const azuriraj = async () => {
  if (!odabraniRedak.value) {
    $q.notify({
      type: "warning",
      message: "Odaberite kupca za ažuriranje!",
    });
    return;
  }

  try {
    await api.updateKupac(odabraniRedak.value.IdKupca, {
      OIB: noviKupac.value.oib,
      ImeKupca: noviKupac.value.ime,
      PrezimeKupca: noviKupac.value.prezime,
      AdresaKupca: noviKupac.value.adresa,
      Email: noviKupac.value.email,
      BrojTelefona: noviKupac.value.brojTelefona,
      TipKupca: noviKupac.value.tipKupca,
    });

    $q.notify({ type: "positive", message: "Kupac uspješno ažuriran!" });
    ucitajTablicu();
    odabraniRedak.value = null;
    noviKupac.value = {
      oib: "",
      ime: "",
      prezime: "",
      adresa: "",
      email: "",
      brojTelefona: "",
      tipKupca: "",
    };
  } catch (error) {
    console.error("Greška pri ažuriranju kupca: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri ažuriranju kupca.",
    });
  }
};

// Funkcija za brisanje kupca
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
    message: "Jeste li sigurni da želite obrisati ovog kupca?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.deleteKupac(odabraniRedak.value.IdKupca);
      $q.notify({ type: "positive", message: "Kupac uspješno obrisan!" });
      ucitajTablicu();
      odabraniRedak.value = null;
    } catch (error) {
      console.error("Greška pri brisanju kupca: ", error);
      $q.notify({
        type: "negative",
        message: "Greška pri brisanju kupca.",
      });
    }
  });
};

// Funkcija za ispisivanje tipa podatka koji vraća q-select

const logTipPodatka = (value) => {
  console.log("Tip podatka koji vraća q-select:", typeof value);
};

// Učitaj tablicu kada se komponenta montira
onMounted(() => {
  ucitajTablicu();
});
</script>
