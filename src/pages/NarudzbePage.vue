<template>
  <q-page class="q-pa-md">
    <h4>Dodaj novu narudžbu</h4>
    <q-form ref="formRef" @submit.prevent="spremi">
      <div class="q-gutter-md">
        <q-input
          v-model="novaNarudzba.brojNarudzbe"
          style="width: 30%"
          label="Broj narudžbe"
          filled
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novaNarudzba.datumNarudzbe"
          style="width: 30%"
          label="Datum narudžbe"
          filled
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novaNarudzba.voziloNaNarudzbi"
          style="width: 30%"
          label="Vozilo na narudžbi"
          filled
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novaNarudzba.kolicina"
          style="width: 30%"
          label="Količina"
          filled
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novaNarudzba.cijena"
          style="width: 30%"
          label="Cijena"
          filled
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novaNarudzba.OIBKupca"
          style="width: 30%"
          label="OIB kupca"
          filled
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novaNarudzba.brojSasije"
          style="width: 30%"
          label="Broj šasije"
          filled
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-input
          v-model="novaNarudzba.idDjelatnika"
          style="width: 30%"
          label="ID Djelatnika"
          filled
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
      row-key="BrojNarudzbe"
      v-show="prikaz"
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
import { ref, onMounted } from "vue";
import api from "src/api";
import { useQuasar } from "quasar";

const narudzbe = ref([]);
const prikaz = ref(false);
const $q = useQuasar();
const odabraniRedak = ref(null);

// Nova narudžba
const novaNarudzba = ref({
  brojNarudzbe: "",
  datumNarudzbe: "",
  voziloNaNarudzbi: "",
  kolicina: "",
  cijena: "",
  OIBKupca: "",
  brojSasije: "",
  idDjelatnika: "",
});

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
    name: "OIBKupca",
    required: true,
    label: "OIB Kupca",
    align: "left",
    field: (row) => row.OIBKupca,
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

// Funkcija za validaciju inputa
const validacija = () => {
  return (
    novaNarudzba.value.brojNarudzbe &&
    novaNarudzba.value.datumNarudzbe &&
    novaNarudzba.value.voziloNaNarudzbi &&
    novaNarudzba.value.kolicina &&
    novaNarudzba.value.cijena &&
    novaNarudzba.value.OIBKupca &&
    novaNarudzba.value.brojSasije &&
    novaNarudzba.value.idDjelatnika
  );
};

// Funkcija za učitavanje podataka iz baze
const ucitajTablicu = async () => {
  try {
    const response = await api.getNarudzbe(); // API poziv
    // console.log("Api response: ", response.data);

    // Obrada datuma
    narudzbe.value = response.data.map((narudzba) => {
      return {
        ...narudzba,
        DatumNarudzbe: formatDate(narudzba.DatumNarudzbe),
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

// Funkcija za spremanje nove narudžbe
const formRef = ref(null);

const spremi = async () => {
  if (!validacija()) {
    $q.notify({ type: "warning", message: "Sva polja moraju biti popunjena!" });
    return;
  }

  try {
    await api.createNarudzba({
      BrojNarudzbe: novaNarudzba.value.brojNarudzbe,
      DatumNarudzbe: novaNarudzba.value.datumNarudzbe,
      VoziloNaNarudzbi: novaNarudzba.value.voziloNaNarudzbi,
      Kolicina: novaNarudzba.value.kolicina,
      Cijena: novaNarudzba.value.cijena,
      OIBKupca: novaNarudzba.value.OIBKupca,
      BrojSasije: novaNarudzba.value.brojSasije,
      IdDjelatnika: novaNarudzba.value.idDjelatnika,
    });

    $q.notify({ type: "positive", message: "Narudžba uspješno spremljena!" });

    // Resetiranje forme
    novaNarudzba.value = {
      brojNarudzbe: "",
      datumNarudzbe: "",
      voziloNaNarudzbi: "",
      kolicina: "",
      cijena: "",
      OIBKupca: "",
      brojSasije: "",
      idDjelatnika: "",
    };

    formRef.value.resetValidation(); // Resetiraj validaciju forme

    // Osvježi tablicu
    ucitajTablicu();
  } catch (error) {
    console.error("Greška pri spremanju narudžbe: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri spremanju narudžbe!",
    });
  }
};

// Funkcija za odabir retka
const odaberiRedak = (event, row) => {
  odabraniRedak.value = row;

  // Popunjavanje inputa podacima iz reda
  novaNarudzba.value = {
    brojNarudzbe: row.BrojNarudzbe,
    datumNarudzbe: row.DatumNarudzbe,
    voziloNaNarudzbi: row.VoziloNaNarudzbi,
    kolicina: row.Kolicina,
    cijena: row.Cijena,
    OIBKupca: row.OIBKupca,
    brojSasije: row.BrojSasije,
    idDjelatnika: row.IdDjelatnika,
  };
};

// Funkcija za ažuriranje podataka
const azuriraj = async () => {
  if (!odabraniRedak.value) {
    $q.notify({
      type: "warning",
      message: "Odaberite narudžbu za ažuriranje!",
    });
    return;
  }

  try {
    await api.updateNarudzba(odabraniRedak.value.BrojNarudzbe, {
      BrojNarudzbe: novaNarudzba.value.brojNarudzbe,
      DatumNarudzbe: novaNarudzba.value.datumNarudzbe,
      VoziloNaNarudzbi: novaNarudzba.value.voziloNaNarudzbi,
      Kolicina: novaNarudzba.value.kolicina,
      Cijena: novaNarudzba.value.cijena,
      OIBKupca: novaNarudzba.value.OIBKupca,
      BrojSasije: novaNarudzba.value.brojSasije,
      IdDjelatnika: novaNarudzba.value.idDjelatnika,
    });

    $q.notify({ type: "positive", message: "Narudžba uspješno ažurirana!" });
    ucitajTablicu();
    odabraniRedak.value = null;
    novaNarudzba.value = {
      brojNarudzbe: "",
      datumNarudzbe: "",
      voziloNaNarudzbi: "",
      kolicina: "",
      cijena: "",
      OIBKupca: "",
      brojSasije: "",
      idDjelatnika: "",
    };
  } catch (error) {
    console.error("Greška pri ažuriranju narudžbe: ", error);
    $q.notify({
      type: "negative",
      message: "Greška pri ažuriranju narudžbe!",
    });
  }
};

// Funkcija za brisanje podataka
const obrisi = async () => {
  if (!odabraniRedak.value) {
    $q.notify({
      type: "warning",
      message: "Odaberite narudžbu za brisanje!",
    });
    return;
  }

  $q.dialog({
    title: "Potvrda",
    message: "Jeste li sigurni da želite obrisati narudžbu?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.deleteNarudzba(odabraniRedak.value.BrojNarudzbe);
      $q.notify({ type: "positive", message: "Narudžba uspješno obrisana!" });
      ucitajTablicu();
      odaberiRedak.value = null;
    } catch (error) {
      console.error("Greška pri brisanju narudžbe: ", error);
      $q.notify({
        type: "negative",
        message: "Greška pri brisanju narudžbe!",
      });
    }
  });
};

// Učitaj tablicu kada se komponenta montira
onMounted(ucitajTablicu);
</script>
