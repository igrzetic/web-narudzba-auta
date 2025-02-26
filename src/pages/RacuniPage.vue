<template>
  <q-page class="q-pa-md">
    <q-select
      v-model="izabranaNarudzba"
      style="width: 30%"
      label="Odaberi narudžbu"
      filled
      emit-value
      map-options
      :options="brojNarudzbe"
    />
    <q-btn
      push
      @click="stvoriRacun"
      label="Izradi račun"
      color="primary"
      class="q-mt-md"
    />

    <q-separator class="q-my-md" />

    <q-btn
      push
      :label="prikaz ? 'Sakrij račune' : 'Prikaži račune'"
      class="q-mb-md"
      color="primary"
      @click="prikaziTablicu"
    />

    <q-table
      title="Računi"
      :rows="racuni"
      :columns="columns"
      row-key="BrojRacuna"
      v-show="prikaz"
      class="q-mt-md"
      @row-click="odaberiRedak"
      style="width: 85%; margin: 20px auto"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            @click.stop="obrisi(props.row.BrojRacuna)"
            color="red"
            icon="delete"
            dense
            flat
          />
        </q-td>
      </template>
    </q-table>

    <q-btn
      push
      v-show="prikaz"
      @click="ucitajTablicu"
      label="Osvježi"
      color="primary"
    />
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import api from "src/api";
import { useQuasar } from "quasar";

export default {
  setup() {
    const izabranaNarudzba = ref(null);
    const brojNarudzbe = ref([]);
    const racuni = ref([]);
    const prikaz = ref(false);
    const odabraniRedak = ref(null);
    const $q = useQuasar();

    const columns = [
      {
        name: "BrojRacuna",
        label: "Broj računa",
        field: "BrojRacuna",
        align: "left",
      },
      {
        name: "DatumRacuna",
        label: "Datum",
        field: "DatumRačuna",
        align: "left",
      },
      {
        name: "IdDjelatnika",
        label: "ID Djelatnika",
        field: "IdDjelatnika",
        align: "left",
      },
      {
        name: "VoziloNaNarudzbi",
        label: "Vozilo",
        field: "VoziloNaNarudzbi",
        align: "left",
      },
      { name: "Kolicina", label: "Količina", field: "Kolicina", align: "left" },
      {
        name: "IznosRacuna",
        label: "Iznos",
        field: "IznosRacuna",
        align: "left",
      },
      {
        name: "NacinPlacanja",
        label: "Način plaćanja",
        field: "NacinPlacanja",
        align: "left",
      },
      { name: "actions", label: "Akcije", field: "actions", align: "right" },
    ];

    const prikaziTablicu = () => {
      prikaz.value = !prikaz.value;
      if (prikaz.value) {
        ucitajTablicu();
      }
    };

    const ucitajTablicu = async () => {
      try {
        const response = await api.getRacuni();
        racuni.value = response.data;
      } catch (error) {
        console.error("Greška pri dohvaćanju računa:", error);
        $q.notify({
          type: "negative",
          message: "Greška pri dohvaćanju računa.",
        });
      }
    };

    const dohvatiNarudzbe = async () => {
      try {
        const response = await api.getNarudzbe();
        brojNarudzbe.value = response.data.map((narudzba) => ({
          label: narudzba.BrojNarudzbe,
          value: narudzba.BrojNarudzbe,
        }));
      } catch (error) {
        console.error("Greška pri dohvaćanju narudžbi:", error);
        $q.notify({
          type: "negative",
          message: "Greška pri dohvaćanju narudžbi.",
        });
      }
    };

    const stvoriRacun = async () => {
      if (!izabranaNarudzba.value) {
        $q.notify({ type: "negative", message: "Morate odabrati narudžbu." });
        return;
      }

      try {
        await api.createRacun(izabranaNarudzba.value);
        ucitajTablicu();
      } catch (error) {
        console.error("Greška pri stvaranju računa:", error);
        $q.notify({
          type: "negative",
          message: "Greška pri stvaranju računa.",
        });
      }
    };

    const obrisi = async (brojRacuna) => {
      try {
        await api.deleteRacun(brojRacuna);
        ucitajTablicu();
      } catch (error) {
        console.error("Greška pri brisanju računa:", error);
        $q.notify({ type: "negative", message: "Greška pri brisanju računa." });
      }
    };

    const odaberiRedak = (event, row) => {
      odabraniRedak.value = row;
    };

    onMounted(() => {
      dohvatiNarudzbe();
      ucitajTablicu();
    });

    return {
      izabranaNarudzba,
      brojNarudzbe,
      racuni,
      columns,
      prikaziTablicu,
      ucitajTablicu,
      stvoriRacun,
      obrisi,
      odaberiRedak,
      odabraniRedak,
      prikaz,
    };
  },
};
</script>
