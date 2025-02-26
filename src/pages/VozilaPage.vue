<template>
  <q-page class="q-pa-md">
    <h4>Dodaj novo vozilo</h4>
    <q-form ref="formRef" @submit.prevent="spremi">
      <div class="q-gutter-md">
        <q-input
          v-model="novoVozilo.brojSasije"
          style="width: 30%"
          label="Broj šasije"
          filled
          :rules="[
            (val) => !!val || 'Ovo polje je obavezno',
            (val) => val.length === 17 || 'Broj šasije mora imati 17 znamenki',
          ]"
        />
        <q-select
          v-model="selectedMarka"
          style="width: 30%"
          label="Marka vozila"
          filled
          emit-value
          map-options
          :options="
            markaVozila.map((marka) => ({
              label: marka.label,
              value: marka.value,
            }))
          "
          :rules="[(val) => !!val || 'Odaberite marku vozila']"
          @update:model-value="filterModelZaMarku"
        />
        <q-select
          v-model="selectedModel"
          style="width: 30%"
          label="Model vozila"
          filled
          emit-value
          map-options
          :options="modeliZaOdabranuMarku"
          :rules="[(val) => !!val || 'Odaberite model vozila']"
          :disable="!selectedMarka"
        />
        <q-select
          v-model="novoVozilo.oprema"
          style="width: 30%"
          label="Oprema"
          filled
          emit-value
          map-options
          :options="opremaVozila"
          :rules="[(val) => !!val || 'Odaberite opremu vozila']"
        />
        <q-select
          v-model="novoVozilo.boja"
          style="width: 30%"
          label="Boja vozila"
          filled
          emit-value
          map-options
          :options="bojeVozila"
          :rules="[(val) => !!val || 'Odaberite boju vozila']"
        />
        <q-select
          v-model="novoVozilo.felge"
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
          v-model="novoVozilo.vrstaPogona"
          style="width: 30%"
          label="Vrsta pogona"
          filled
          emit-value
          map-options
          :options="pogonaVozila"
          :rules="[(val) => !!val || 'Odaberite vrstu pogona']"
        />
        <q-input
          v-model="novoVozilo.cijena"
          style="width: 30%"
          label="Cijena"
          type="number"
          step="0.001"
          @blur="formatCijena"
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
import { ref, onMounted, watch } from "vue";
import api from "src/api";
import { useQuasar } from "quasar";

const vozila = ref([]);
const prikaz = ref(false);
const $q = useQuasar();
const odabraniRedak = ref(null);

// Novo vozilo
const novoVozilo = ref({
  brojSasije: "",
  oprema: "",
  boja: "",
  felge: "",
  vrstaPogona: "",
  cijena: "",
});

const markaVozila = ref([
  { label: "Audi", value: "Audi", modeli: ["A3", "A4", "A6", "Q5", "Q7"] },
  { label: "BMW", value: "BMW", modeli: ["X1", "X3", "X5", "M3", "M5"] },
  {
    label: "Ford",
    value: "Ford",
    modeli: ["Fiesta", "Focus", "Mondeo", "Kuga", "Mustang"],
  },
  {
    label: "Honda",
    value: "Honda",
    modeli: ["Civic", "Accord", "CR-V", "Jazz", "HR-V"],
  },
  {
    label: "Hyundai",
    value: "Hyundai",
    modeli: ["i10", "i20", "i30", "Tucson", "Santa Fe"],
  },
  {
    label: "Kia",
    value: "Kia",
    modeli: ["Ceed", "Sportage", "Sorrento", "Rio", "Stinger"],
  },
  {
    label: "Mazda",
    value: "Mazda",
    modeli: ["CX-3", "CX-5", "Mazda 3", "Mazda 6", "MX-5"],
  },
  {
    label: "Mercedes-Benz",
    value: "Mercedes-Benz",
    modeli: ["A-Class", "C-Class", "E-Class", "S-Class", "GLE"],
  },
  {
    label: "Nissan",
    value: "Nissan",
    modeli: ["Micra", "Qashqai", "Juke", "X-Trail", "Leaf"],
  },
  {
    label: "Peugeot",
    value: "Peugeot",
    modeli: ["208", "308", "3008", "508", "5008"],
  },
  {
    label: "Renault",
    value: "Renault",
    modeli: ["Clio", "Megane", "Captur", "Kadjar", "Talisman"],
  },
  {
    label: "Seat",
    value: "Seat",
    modeli: ["Ibiza", "Leon", "Ateca", "Arona", "Toledo"],
  },
  {
    label: "Škoda",
    value: "Škoda",
    modeli: ["Fabia", "Octavia", "Superb", "Karoq", "Kodiaq"],
  },
  {
    label: "Toyota",
    value: "Toyota",
    modeli: ["Yaris", "Corolla", "Camry", "RAV4", "Land Cruiser"],
  },
  {
    label: "Tesla",
    value: "Tesla",
    modeli: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
  },
]);

// Sortiranje abecednim redom po 'label'
markaVozila.value.sort((a, b) => a.label.localeCompare(b.label));

const selectedMarka = ref(""); // Odabrana marka
const selectedModel = ref(""); // Odabrani model
const modeliZaOdabranuMarku = ref([]); // Filtrirani modeli za odabranu marku

// Funkcija koja filtrira modele na temelju odabrane marke
function filterModelZaMarku() {
  const marka = markaVozila.value.find((m) => m.value === selectedMarka.value);
  if (marka) {
    modeliZaOdabranuMarku.value = marka.modeli;
  } else {
    modeliZaOdabranuMarku.value = [];
  }
}

// Initialize model options on mounted if a brand is already selected
onMounted(() => {
  if (selectedMarka.value) {
    filterModelZaMarku();
  }
});

// Pokrećemo funkciju odmah na početku kad se stranica učita
watch(selectedMarka, () => {
  filterModelZaMarku();
});

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

const pogonaVozila = ref([
  { label: "Prednji pogon (FWD)", value: "Prednji pogon (FWD)" },
  { label: "Stražnji pogon (RWD)", value: "Stražnji pogon (RWD)" },
  { label: "Pogon na sve kotače (AWD)", value: "Pogon na sve kotače (AWD)" },
  { label: "4x4 pogon", value: "4x4 pogon" },
]);

const formatCijena = () => {
  if (this.novoVozilo.cijena) {
    this.novoVozilo.cijena = parseFloat(
      parseFloat(this.novoVozilo.cijena).toFixed(3)
    );
  }
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
    name: "Cijena",
    required: true,
    label: "Cijena (€)",
    align: "left",
    field: (row) => row.Cijena,
  },
];

// Funkcija za validaciju inputa
const validacija = () => {
  return (
    novoVozilo.value.brojSasije &&
    selectedMarka &&
    selectedModel &&
    novoVozilo.value.oprema &&
    novoVozilo.value.boja &&
    novoVozilo.value.felge &&
    selectedGorivo &&
    selectedMotor &&
    novoVozilo.value.vrstaPogona &&
    novoVozilo.value.cijena
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
      BrojSasije: novoVozilo.value.brojSasije,
      Marka: selectedMarka.value,
      Model: selectedModel.value,
      Oprema: novoVozilo.value.oprema,
      Boja: novoVozilo.value.boja,
      Felge: novoVozilo.value.felge,
      Motor: selectedMotor.value,
      VrstaGoriva: selectedGorivo.value,
      VrstaPogona: novoVozilo.value.vrstaPogona,
      Cijena: novoVozilo.value.cijena,
    });

    $q.notify({ type: "positive", message: "Vozilo uspješno spremljeno!" });

    // Resetiranje forme
    novoVozilo.value = {
      brojSasije: "",
      selectedMarka: "",
      selectedModel: "",
      oprema: "",
      boja: "",
      felge: "",
      selectedMotor: "",
      selectedGorivo: "",
      vrstaPogona: "",
      cijena: "",
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

  // Popunjavanje inputa podacima iz reda
  novoVozilo.value = {
    brojSasije: row.BrojSasije,
    selectedMarka: row.Marka,
    selectedModel: row.Model,
    oprema: row.oprema,
    boja: row.Boja,
    felge: row.Felge,
    selectedMotor: row.Motor,
    selectedGorivo: row.VrstaGoriva,
    vrstaPogona: row.VrstaPogona,
    cijena: row.Cijena,
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
      BrojSasije: novoVozilo.value.brojSasije,
      Marka: selectedMarka.value,
      Model: selectedModel.value,
      Oprema: novoVozilo.value.oprema,
      Boja: novoVozilo.value.boja,
      Felge: novoVozilo.value.felge,
      Motor: selectedMotor.value,
      VrstaGoriva: selectedGorivo.value,
      VrstaPogona: novoVozilo.value.vrstaPogona,
      Cijena: novoVozilo.value.cijena,
    });

    $q.notify({ type: "positive", message: "Vozilo uspješno ažurirano!" });
    ucitajTablicu();
    odabraniRedak.value = null;
    novoVozilo.value = {
      brojSasije: "",
      selectedMarka: "",
      selectedModel: "",
      oprema: "",
      boja: "",
      felge: "",
      selectedMotor: "",
      selectedGorivo: "",
      vrstaPogona: "",
      cijena: "",
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
