<template>
  <q-page class="q-pa-md">
    <h4>Dodaj novu narudžbu</h4>
    <q-form ref="formRef" @submit.prevent="spremi">
      <div class="q-gutter-md">
        <q-select
          v-model="novaNarudzba.voziloNaNarudzbi"
          style="width: 30%"
          label="Vozilo na narudžbi"
          filled
          emit-value
          map-options
          :options="vozilaNaNarudzbi"
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-select
          v-model="novaNarudzba.oprema"
          style="width: 30%"
          label="Oprema"
          filled
          emit-value
          map-options
          :options="opremaVozila"
          :rules="[(val) => !!val || 'Odaberite opremu vozila']"
        />
        <q-select
          v-model="novaNarudzba.boja"
          style="width: 30%"
          label="Boja vozila"
          filled
          emit-value
          map-options
          :options="bojeVozila"
          :rules="[(val) => !!val || 'Odaberite boju vozila']"
        />
        <q-select
          v-model="novaNarudzba.felge"
          style="width: 30%"
          label="Felge vozila"
          filled
          emit-value
          map-options
          :options="felgeVozila"
          :rules="[(val) => !!val || 'Odaberite felge vozila']"
        />
        <q-select
          v-model="selectedGorivo"
          style="width: 30%"
          label="Vrsta goriva"
          filled
          emit-value
          map-options
          :options="gorivoVozila"
          :rules="[(val) => !!val || 'Odaberite vrstu goriva']"
        />
        <q-select
          v-model="selectedMotor"
          style="width: 30%"
          label="Motor vozila"
          filled
          emit-value
          map-options
          :options="motoriZaOdabranoGorivo"
          :rules="[(val) => !!val || 'Odaberite motor vozila']"
          :disable="!selectedGorivo"
        />
        <q-select
          v-model="novaNarudzba.vrstaPogona"
          style="width: 30%"
          label="Vrsta pogona"
          filled
          emit-value
          map-options
          :options="pogonVozila"
          :rules="[(val) => !!val || 'Odaberite vrstu pogona']"
        />
        <q-input
          v-model="novaNarudzba.kolicina"
          style="width: 30%"
          label="Količina"
          type="number"
          filled
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-select
          v-model="novaNarudzba.OIBKupca"
          style="width: 30%"
          label="OIB kupca"
          filled
          emit-value
          map-options
          :options="oibOpcije"
          :rules="[(val) => !!val || 'Ovo polje je obavezno']"
        />
        <q-select
          v-model="novaNarudzba.idDjelatnika"
          style="width: 30%"
          label="ID Djelatnika"
          filled
          emit-value
          map-options
          :options="idDjelatnikaOpcije"
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
import { ref, onMounted, watch } from "vue";
import api from "src/api";
import { useQuasar } from "quasar";
import axios from "axios";

const narudzbe = ref([]);
const prikaz = ref(false);
const $q = useQuasar();
const odabraniRedak = ref(null);
const vozilaNaNarudzbi = ref([]);
const oibOpcije = ref([]);
const idDjelatnikaOpcije = ref([]);

// Nova narudžba
const novaNarudzba = ref({
  brojNarudzbe: "",
  datumNarudzbe: "",
  voziloNaNarudzbi: "",
  oprema: "",
  boja: "",
  felge: "",
  vrstaPogona: "",
  kolicina: "",
  OIBKupca: "",
  idDjelatnika: "",
});

const dohvatiVozila = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/vozila");
    vozilaNaNarudzbi.value = response.data.map((vozilo) => ({
      label: `${vozilo.Marka} ${vozilo.Model}`,
      value: `${vozilo.Marka} ${vozilo.Model}`,
    }));
  } catch (error) {
    console.error("Greška pri dohvaćanju vozila:", error);
  }
};

onMounted(dohvatiVozila);

let cijena = 0;
let brojSasije = "";

const dohvatiCijene = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/vozila");

    const odabranoVozilo = response.data.find(
      (vozilo) =>
        `${vozilo.Marka} ${vozilo.Model}`.trim() ===
        `${novaNarudzba.value.voziloNaNarudzbi}`.trim()
    );

    if (odabranoVozilo) {
      cijena = odabranoVozilo.Cijena;
      brojSasije = odabranoVozilo.BrojSasije;
      console.log(
        `Broj šasije: ${odabranoVozilo.BrojSasije}, Cijena: ${odabranoVozilo.Cijena}`
      );
    } else {
      console.log("Vozilo nije pronađeno!");
    }
  } catch (error) {
    console.error("Greška pri dohvaćanju cijena:", error);
  }
};

watch(
  () => novaNarudzba.value.voziloNaNarudzbi,
  () => {
    dohvatiCijene();
  }
);

const dohvatiOib = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/kupci");

    // Mapiraj sve OIB-ove u opcije za q-select
    oibOpcije.value = response.data.map((kupac) => ({
      label: kupac.OIB, // OIB će biti prikazan kao labela
      value: kupac.OIB, // OIB će biti postavljen kao vrijednost
    }));
  } catch (error) {
    console.error("Greška pri dohvaćanju OIB-ova kupaca:", error);
  }
};

onMounted(dohvatiOib);

const dohvatiIdDjelatnika = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/djelatnici");

    // Mapiraj sve ID u opcije za q-select
    idDjelatnikaOpcije.value = response.data.map((djelatnik) => ({
      label: djelatnik.IdDjelatnika, // OIB će biti prikazan kao labela
      value: djelatnik.IdDjelatnika, // OIB će biti postavljen kao vrijednost
    }));
  } catch (error) {
    console.error("Greška pri dohvaćanju ID djelatnika:", error);
  }
};

onMounted(dohvatiIdDjelatnika);

let idKupca = 0;

const dohvatiIdKupca = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/kupci");

    const odabraniOib = response.data.find(
      (kupac) => `${kupac.OIB}` === `${novaNarudzba.value.OIBKupca}`
    );

    if (odabraniOib) {
      idKupca = odabraniOib.IdKupca;
      console.log(`Id kupca: ${odabraniOib.IdKupca}`);
    } else {
      console.log("Kupac nije pronađen!");
    }
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka:", error);
  }
};

// Reaktivno promatranje promjena na OIB kupca
watch(
  () => novaNarudzba.value.OIBKupca,
  () => {
    dohvatiIdKupca();
  }
);

const opremaVozila = ref([
  { label: "Sport", value: "Sport" },
  { label: "Klasik", value: "Klasik" },
  { label: "Ekonomik", value: "Ekonomik" },
  { label: "Luxury", value: "Luxury" },
]);

const bojeVozila = ref([
  { label: "Crna", value: "Crna" },
  { label: "Bijela", value: "Bijela" },
  { label: "Siva", value: "Siva" },
  { label: "Plava", value: "Plava" },
  { label: "Crvena", value: "Crvena" },
  { label: "Zelena", value: "Zelena" },
]);

const felgeVozila = ref([
  { label: "Čelične 15''", value: "Čelične 15''" },
  { label: "Čelične 16''", value: "Čelične 16''" },
  { label: "Čelične 17''", value: "Čelične 17''" },
  { label: "Aluminijske 17''", value: "Aluminijske 17''" },
  { label: "Aluminijske 18''", value: "Aluminijske 18''" },
  { label: "Aluminijske 19''", value: "Aluminijske 19''" },
  { label: "Aluminijske 20''", value: "Aluminijske 20''" },
]);

const gorivoVozila = ref([
  {
    label: "Benzin",
    value: "Benzin",
    konfiguracijaMotora: ["1.5L 150KS", "2.0L 200KS", "3.0L 300KS"],
  },
  {
    label: "Dizel",
    value: "Dizel",
    konfiguracijaMotora: ["1.6L 130KS", "2.0L 180KS", "3.0L 250KS"],
  },
  {
    label: "Hibrid (benzin/struja)",
    value: "Hibrid (benzin/struja)",
    konfiguracijaMotora: ["1.5L 180KS", "2.0L 220KS", "3.0L 300KS"],
  },
  {
    label: "Hibrid (dizel/struja)",
    value: "Hibrid (dizel/struja)",
    konfiguracijaMotora: ["2.0L 200KS", "3.0L 280KS"],
  },
  {
    label: "Električni pogon",
    value: "Električni pogon",
    konfiguracijaMotora: ["150kW (204KS)", "200kW (272KS)", "250kW (340KS)"],
  },
  {
    label: "Plin (LPG)",
    value: "Plin (LPG)",
    konfiguracijaMotora: ["1.4L 120KS", "1.8L 150KS", "2.0L 180KS"],
  },
]);

const selectedGorivo = ref(""); // Odabrano gorivo
const selectedMotor = ref(""); // Odabrani motor
const motoriZaOdabranoGorivo = ref([]); // Filtrirani motori za odabrano gorivo

// Funkcija koja filtrira motore na temelju odabranog goriva
function filterMotoriZaGorivo() {
  const gorivo = gorivoVozila.value.find(
    (g) => g.value === selectedGorivo.value
  );
  if (gorivo) {
    motoriZaOdabranoGorivo.value = gorivo.konfiguracijaMotora;
  } else {
    motoriZaOdabranoGorivo.value = [];
  }
}

// Initialize motor options on mounted if a fuel type is already selected
onMounted(() => {
  if (selectedGorivo.value) {
    filterMotoriZaGorivo();
  }
});

// Pokrećemo funkciju odmah na početku kad se stranica učita
watch(selectedGorivo, () => {
  filterMotoriZaGorivo();
});

// Funkcija za prikaz tablice
const prikaziTablicu = () => {
  prikaz.value = !prikaz.value;
  if (prikaz.value) {
    ucitajTablicu();
  }
};

const pogonVozila = ref([
  { label: "Prednji pogon (FWD)", value: "Prednji pogon (FWD)" },
  { label: "Stražnji pogon (RWD)", value: "Stražnji pogon (RWD)" },
  { label: "Pogon na sve kotače (AWD)", value: "Pogon na sve kotače (AWD)" },
  { label: "4x4 pogon", value: "4x4 pogon" },
]);

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
    name: "Oprema",
    required: true,
    label: "Oprema",
    align: "left",
    field: (row) => row.Oprema,
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
  {
    name: "Kolicina",
    required: true,
    label: "Količina",
    align: "left",
    field: (row) => row.Kolicina,
  },
  {
    name: "OIBKupca",
    required: true,
    label: "OIB Kupca",
    align: "left",
    field: (row) => row.OIBKupca,
  },
  {
    name: "Cijena",
    required: true,
    label: "Cijena (€)",
    align: "left",
    field: (row) => row.Cijena,
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
    novaNarudzba.value.voziloNaNarudzbi &&
    novaNarudzba.value.oprema &&
    novaNarudzba.value.boja &&
    novaNarudzba.value.felge &&
    selectedGorivo &&
    selectedMotor &&
    novaNarudzba.value.vrstaPogona &&
    novaNarudzba.value.kolicina &&
    novaNarudzba.value.OIBKupca &&
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

  const ukupnaCijena = cijena * parseInt(novaNarudzba.value.kolicina, 10);

  await dohvatiCijene();

  if (cijena === 0) {
    $q.notify({ type: "warning", message: "Cijena vozila nije pronađena!" });
    return;
  }

  try {
    await api.createNarudzba({
      VoziloNaNarudzbi: novaNarudzba.value.voziloNaNarudzbi,
      Oprema: novaNarudzba.value.oprema,
      Boja: novaNarudzba.value.boja,
      Felge: novaNarudzba.value.felge,
      Motor: selectedMotor.value,
      VrstaGoriva: selectedGorivo.value,
      VrstaPogona: novaNarudzba.value.vrstaPogona,
      Kolicina: novaNarudzba.value.kolicina,
      OIBKupca: novaNarudzba.value.OIBKupca,
      Cijena: ukupnaCijena,
      IdKupca: idKupca,
      BrojSasije: brojSasije,
      IdDjelatnika: novaNarudzba.value.idDjelatnika,
    });

    $q.notify({ type: "positive", message: "Narudžba uspješno spremljena!" });

    // Resetiranje forme
    novaNarudzba.value = {
      brojNarudzbe: "",
      datumNarudzbe: "",
      voziloNaNarudzbi: "",
      oprema: "",
      boja: "",
      felge: "",
      selectedMotor: "",
      selectedGorivo: "",
      vrstaPogona: "",
      kolicina: "",
      OIBKupca: "",
      cijena: "",
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
    voziloNaNarudzbi: row.VoziloNaNarudzbi,
    oprema: row.Oprema,
    boja: row.Boja,
    felge: row.Felge,
    selectedMotor: row.Motor,
    selectedGorivo: row.VrstaGoriva,
    vrstaPogona: row.VrstaPogona,
    kolicina: row.Kolicina,
    OIBKupca: row.OIBKupca,
    cijena: row.Cijena,
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

  const ukupnaCijena = cijena * parseInt(novaNarudzba.value.kolicina, 10);

  await dohvatiCijene();

  if (cijena === 0) {
    $q.notify({ type: "warning", message: "Cijena vozila nije pronađena!" });
    return;
  }

  try {
    await api.updateNarudzba(odabraniRedak.value.BrojNarudzbe, {
      BrojNarudzbe: novaNarudzba.value.brojNarudzbe,
      DatumNarudzbe: novaNarudzba.value.datumNarudzbe,
      VoziloNaNarudzbi: novaNarudzba.value.voziloNaNarudzbi,
      Oprema: novaNarudzba.value.oprema,
      Boja: novaNarudzba.value.boja,
      Felge: novaNarudzba.value.felge,
      Motor: selectedMotor.value,
      VrstaGoriva: selectedGorivo.value,
      VrstaPogona: novaNarudzba.value.vrstaPogona,
      Kolicina: novaNarudzba.value.kolicina,
      OIBKupca: novaNarudzba.value.OIBKupca,
      Cijena: ukupnaCijena,
      IdKupca: idKupca,
      BrojSasije: brojSasije,
      IdDjelatnika: novaNarudzba.value.idDjelatnika,
    });

    $q.notify({ type: "positive", message: "Narudžba uspješno ažurirana!" });
    ucitajTablicu();
    odabraniRedak.value = null;
    novaNarudzba.value = {
      brojNarudzbe: "",
      datumNarudzbe: "",
      voziloNaNarudzbi: "",
      oprema: "",
      boja: "",
      felge: "",
      selectedMotor: "",
      selectedGorivo: "",
      vrstaPogona: "",
      kolicina: "",
      OIBKupca: "",
      cijena: "",
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
