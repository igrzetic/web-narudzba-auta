<template>
  <q-page class="q-pa-md">
    <h4>Dodaj novo vozilo</h4>
    <q-form ref="formRef" @submit.prevent="spremi">
      <div class="q-gutter-md">
        <q-input
          v-model="novoVozilo.brojSasije"
          style="width: 30%"
          label="Broj šasije"
          outlined
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="markaFormatted"
          style="width: 30%"
          label="Marka vozila"
          outlined
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="modelFormatted"
          style="width: 30%"
          label="Model vozila"
          outlined
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novoVozilo.oprema"
          style="width: 30%"
          label="Oprema"
          outlined
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novoVozilo.boja"
          style="width: 30%"
          label="Boja vozila"
          outlined
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novoVozilo.felge"
          style="width: 30%"
          label="Felge vozila"
          outlined
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novoVozilo.motor"
          style="width: 30%"
          label="Motor vozila"
          outlined
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novoVozilo.vrstaGoriva"
          style="width: 30%"
          label="Vrsta goriva"
          outlined
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novoVozilo.vrstaPogona"
          style="width: 30%"
          label="Vrsta pogona"
          outlined
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
      :label="prikaz ? 'Sakrij vozila' : 'Prikaži vozila'"
      class="q-mb-md"
      color="primary"
      @click="prikaziTablicu"
      id="prikaziTablicuBtn"
    />

    <q-table
      title="Vozila"
      :rows="vozila"
      :columns="columns"
      row-key="BrojSasije"
      v-show="prikaz"
      @row-click="odaberiRedak"
      style="width: 85%; margin: 20px auto"
    />
    <p v-if="prikaz && vozila.length === 0">Nema podataka za prikaz.</p>

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

const vozila = ref([]);
const prikaz = ref(false);
const $q = useQuasar();
const odabraniRedak = ref(null);

// Novo vozilo
const novoVozilo = ref({
  brojSasije: "",
  marka: "",
  model: "",
  oprema: "",
  boja: "",
  felge: "",
  motor: "",
  vrstaGoriva: "",
  vrstaPogona: "",
});

const markaFormatted = computed({
  get: () => novoVozilo.value.marka,
  set: (value) => (novoVozilo.value.marka = capitalizeFirstLetter(value)),
});

const modelFormatted = computed({
  get: () => novoVozilo.value.model,
  set: (value) => (novoVozilo.value.model = capitalizeFirstLetter(value)),
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
    name: "BrojSasije",
    required: true,
    label: "Broj šasije",
    align: "left",
    field: (row) => row.BrojSasije,
  },
  {
    name: "Marka",
    required: true,
    label: "Marka",
    align: "left",
    field: (row) => row.Marka,
  },
  {
    name: "Model",
    required: true,
    label: "Model",
    align: "left",
    field: (row) => row.Model,
  },
  {
    name: "Paket",
    required: true,
    label: "Oprema",
    align: "left",
    field: (row) => row.Paket,
  },
  {
    name: "Boja",
    required: true,
    label: "Boja",
    align: "left",
    field: (row) => row.Boja,
  },
  {
    name: "Felge",
    required: true,
    label: "Felge",
    align: "left",
    field: (row) => row.Felge,
  },
  {
    name: "Motor",
    required: true,
    label: "Motor",
    align: "left",
    field: (row) => row.Motor,
  },
  {
    name: "VrstaGoriva",
    required: true,
    label: "Gorivo",
    align: "left",
    field: (row) => row.VrstaGoriva,
  },
  {
    name: "VrstaPogona",
    required: true,
    label: "Pogon",
    align: "left",
    field: (row) => row.VrstaPogona,
  },
];

// Funkcija za validaciju inputa
const validacija = () => {
  return (
    novoVozilo.value.brojSasije &&
    novoVozilo.value.marka &&
    novoVozilo.value.model &&
    novoVozilo.value.oprema &&
    novoVozilo.value.boja &&
    novoVozilo.value.felge &&
    novoVozilo.value.motor &&
    novoVozilo.value.vrstaGoriva &&
    novoVozilo.value.vrstaPogona
  );
};

// Funkcija za učitavanje podataka iz baze
const ucitajTablicu = async () => {
  try {
    const response = await api.getVozila(); // API poziv

    vozila.value = response.data;
  } catch (error) {
    console.error("Greška pri dohvaćanju vozila: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri dohvaćanju vozila.",
    });
  }
};

// Funkcija za spremanje novog vozila
const formRef = ref(null);

const spremi = async () => {
  if (!validacija()) {
    $q.notify({ type: "warning", message: "Sva polja moraju biti popunjena!" });
    return;
  }

  try {
    await api.createVozilo({
      brojSasije: novoVozilo.value.brojSasije,
      marka: novoVozilo.value.marka,
      model: novoVozilo.value.model,
      oprema: novoVozilo.value.oprema,
      boja: novoVozilo.value.boja,
      felge: novoVozilo.value.felge,
      motor: novoVozilo.value.motor,
      vrstaGoriva: novoVozilo.value.vrstaGoriva,
      vrstaPogona: novoVozilo.value.vrstaPogona,
    });

    $q.notify({ type: "positive", message: "Vozilo uspješno spremljeno!" });

    // Resetiranje forme
    novoVozilo.value = {
      brojSasije: "",
      marka: "",
      model: "",
      oprema: "",
      boja: "",
      felge: "",
      motor: "",
      vrstaGoriva: "",
      vrstaPogona: "",
    };

    formRef.value.resetValidation(); // Resetiraj validaciju forme

    // Osvježi tablicu
    ucitajTablicu();
  } catch (error) {
    console.error("Greška pri spremanju vozila: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri spremanju vozila!",
    });
  }
};

// Funkcija za odabir retka
const odaberiRedak = (event, row) => {
  odabraniRedak.value = row;
  // Object.assign(novoVozilo.value, row);

  // Popunjavanje inputa podacima iz reda
  novoVozilo.value = {
    brojSasije: row.BrojSasije,
    marka: row.Marka,
    model: row.Model,
    oprema: row.Paket,
    boja: row.Boja,
    felge: row.Felge,
    motor: row.Motor,
    vrstaGoriva: row.VrstaGoriva,
    vrstaPogona: row.VrstaPogona,
  };
};

// Ažuriranje vozila
const azuriraj = async () => {
  if (!odabraniRedak.value) {
    $q.notify({
      type: "warning",
      message: "Odaberite vozilo za ažuriranje!",
    });
    return;
  }

  try {
    await api.updateVozilo(odabraniRedak.value.BrojSasije, {
      marka: novoVozilo.value.marka,
      model: novoVozilo.value.model,
      oprema: novoVozilo.value.oprema,
      boja: novoVozilo.value.boja,
      felge: novoVozilo.value.felge,
      motor: novoVozilo.value.motor,
      vrstaGoriva: novoVozilo.value.vrstaGoriva,
      vrstaPogona: novoVozilo.value.vrstaPogona,
    });

    $q.notify({ type: "positive", message: "Vozilo uspješno ažurirano!" });
    ucitajTablicu();
    odabraniRedak.value = null;
    novoVozilo.value = {
      brojSasije: "",
      marka: "",
      model: "",
      oprema: "",
      boja: "",
      felge: "",
      motor: "",
      vrstaGoriva: "",
      vrstaPogona: "",
    };
  } catch (error) {
    console.error("Greška pri ažuriranju vozila: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri ažuriranju vozila!",
    });
  }
};

// Brisanje vozila
const obrisi = async () => {
  if (!odabraniRedak.value) {
    $q.notify({
      type: "warning",
      message: "Odaberite vozilo za brisanje!",
    });
    return;
  }

  $q.dialog({
    title: "Potvrda",
    message: "Jeste li sigurni da želite obrisati ovo vozilo?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.deleteVozilo(odabraniRedak.value.BrojSasije);
      $q.notify({ type: "positive", message: "Vozilo uspješno obrisano!" });
      ucitajTablicu();
      odaberiRedak.value = null;
    } catch (error) {
      console.error("Greška pri brisanju vozila: ", error);
      $q.notify({
        type: "negative",
        message: "Greška pri brisanju vozila!",
      });
    }
  });
};

// Učitaj tablicu kada se komponenta montira
onMounted(ucitajTablicu);
</script>
