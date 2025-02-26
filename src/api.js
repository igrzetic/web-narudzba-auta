import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export default {
  // TABLICA NARUDŽBE
  // Dohvati sve narudžbe
  getNarudzbe() {
    return api.get("/narudzbe");
  },

  // Dodaj novu narudžbu
  createNarudzba(narudzba) {
    return api.post("/narudzbe", narudzba);
  },

  // Ažuriraj postojeću narudžbu
  updateNarudzba(id, narudzba) {
    return api.put(`/narudzbe/${id}`, narudzba);
  },

  // Obriši narudžbu
  deleteNarudzba(id) {
    return api.delete(`/narudzbe/${id}`);
  },
  // ---------------------------------------------------------

  // TABLICA VOZILA
  // Dohvati sva vozila
  getVozila() {
    return api.get("/vozila");
  },

  // Dodaj novo vozilo
  createVozilo(vozilo) {
    return api.post("/vozila", vozilo);
  },

  // Ažuriraj postojeće vozilo
  updateVozilo(id, vozilo) {
    console.log("Podaci za slanje: ", vozilo);
    return api
      .put(`/vozila/${id}`, vozilo)
      .then((response) => console.log("Uspjeh: ", response))
      .catch((error) => {
        console.error("Greška: ", error);
        if (error.response) {
          // Ako server vrati odgovor (greška sa status kodom)
          console.error("Podaci odgovora servera: ", error.response.data);
          console.error("Status kod: ", error.response.status);
          console.error("Glavni razlog greške: ", error.response.statusText);
        } else if (error.request) {
          // Ako nije bilo odgovora od servera
          console.error("Nema odgovora od servera: ", error.request);
        } else {
          // Greška u postavkama zahtjeva
          console.error("Greška u postavkama zahtjeva: ", error.message);
        }
      });
  },

  // Obriši vozilo
  deleteVozilo(id) {
    return api.delete(`/vozila/${id}`);
  },
  // ---------------------------------------------------------

  // TABLICA KUPCI
  // Dohvati sve kupce
  getKupci() {
    return api.get("/kupci");
  },

  // Dodaj novog kupca
  createKupac(kupac) {
    return api
      .post("/kupci", kupac)
      .then((response) => console.log("Uspjeh: ", response))
      .catch((error) => {
        console.error("Greška: ", error);
        if (error.response) {
          // Ako server vrati odgovor (greška sa status kodom)
          console.error("Podaci odgovora servera: ", error.response.data);
          console.error("Status kod: ", error.response.status);
          console.error("Glavni razlog greške: ", error.response.statusText);
        } else if (error.request) {
          // Ako nije bilo odgovora od servera
          console.error("Nema odgovora od servera: ", error.request);
        } else {
          // Greška u postavkama zahtjeva
          console.error("Greška u postavkama zahtjeva: ", error.message);
        }
      });
  },

  // Ažuriraj postojećeg kupca
  updateKupac(id, kupac) {
    return api.put(`/kupci/${id}`, kupac);
  },

  // Obriši kupca
  deleteKupac(id) {
    return api.delete(`/kupci/${id}`);
  },
  // ---------------------------------------------------------

  // TABLICA RACUNI
  // Dohvati sve račune
  getRacuni() {
    return api.get("/racuni");
  },

  // Dodaj novi račun
  createRacun(racun) {
    return api.post("/racuni", racun);
  },

  // Ažuriraj postojeći račun
  updateRacun(id, racun) {
    return api.put(`/racuni/${id}`, racun);
  },

  // Obriši račun
  deleteRacun(id) {
    return api.delete(`/racuni/${id}`);
  },
  // ---------------------------------------------------------

  // TABLICA DJELATNIK
  // Dohvati sve djelatnike
  getDjelatnici() {
    return api.get("/djelatnici");
  },

  // Dodaj novog djelatnika
  createDjelatnik(djelatnik) {
    return api.post("/djelatnici", djelatnik);
  },

  // Ažuriraj postojećeg djelatnika
  updateDjelatnik(id, djelatnik) {
    return api.put(`/djelatnici/${id}`, djelatnik);
  },

  // Obriši djelatnika
  deleteDjelatnik(id) {
    return api.delete(`/djelatnici/${id}`);
  },
  // ---------------------------------------------------------
};
