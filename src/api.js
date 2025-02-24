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

  // Dohvati jednu narudžbu po ID-u
  getNarudzba(id) {
    return api.get(`/narudzbe/${id}`);
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

  // Dohvati jedno vozilo po ID-u
  getVozilo(id) {
    return api.get(`/vozila/${id}`);
  },

  // Dodaj novo vozilo
  createVozilo(vozilo) {
    return api.post("/vozila", vozilo);
  },

  // Ažuriraj postojeće vozilo
  updateVozilo(id, vozilo) {
    return api.put(`/vozila/${id}`, vozilo);
  },

  // Obriši narudžbu
  deleteVozilo(id) {
    return api.delete(`/vozilo/${id}`);
  },
  // ---------------------------------------------------------

  // TABLICA DJELATNIK
  // Dohvati sve djelatnike
  getDjelatnici() {
    return api.get("/djelatnici");
  },

  // Dohvati jednog djelatnika po ID-u
  getDjelatnik(id) {
    return api.get(`/djelatnici/${id}`);
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
