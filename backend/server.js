require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Povezivanje na MySQL bazu podataka
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database");
});

// Test ruta
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// === CRUD operacije za Narudzba_oot === //

// Dohvati sve narudžbe
app.get("/api/narudzbe", (req, res) => {
  db.query("SELECT * FROM Narudzba_oot", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Dohvati jednu narudžbu po ID-u
app.get("/api/narudzbe/:id", (req, res) => {
  db.query(
    "SELECT * FROM Narudzba_oot WHERE BrojNarudzbe = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ error: "Narudžba nije pronađena" });
      res.json(results[0]);
    }
  );
});

// Dodaj novu narudžbu
app.post("/api/narudzbe", (req, res) => {
  const {
    DatumNarudzbe,
    VoziloNaNarudzbi,
    Kolicina,
    Cijena,
    IdKupca,
    BrojSasije,
    IdDjelatnika,
  } = req.body;
  db.query(
    "INSERT INTO Narudzba_oot (DatumNarudzbe, VoziloNaNarudzbi, Kolicina, Cijena, IdKupca, BrojSasije, IdDjelatnika) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      DatumNarudzbe,
      VoziloNaNarudzbi,
      Kolicina,
      Cijena,
      IdKupca,
      BrojSasije,
      IdDjelatnika,
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Narudžba dodana", id: results.insertId });
    }
  );
});

// Ažuriraj postojeću narudžbu
app.put("/api/narudzbe/:id", (req, res) => {
  const {
    DatumNarudzbe,
    VoziloNaNarudzbi,
    Kolicina,
    Cijena,
    IdKupca,
    BrojSasije,
    IdDjelatnika,
  } = req.body;
  db.query(
    "UPDATE Narudzba_oot SET DatumNarudzbe = ?, VoziloNaNarudzbi = ?, Kolicina = ?, Cijena = ?, IdKupca = ?, BrojSasije = ?, IdDjelatnika = ? WHERE BrojNarudzbe = ?",
    [
      DatumNarudzbe,
      VoziloNaNarudzbi,
      Kolicina,
      Cijena,
      IdKupca,
      BrojSasije,
      IdDjelatnika,
      req.params.id,
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0)
        return res.status(404).json({ error: "Narudžba nije pronađena" });
      res.json({ message: "Narudžba ažurirana" });
    }
  );
});

// Obriši narudžbu
app.delete("/api/narudzbe/:id", (req, res) => {
  db.query(
    "DELETE FROM Narudzba_oot WHERE BrojNarudzbe = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0)
        return res.status(404).json({ error: "Narudžba nije pronađena" });
      res.json({ message: "Narudžba obrisana" });
    }
  );
});

// === CRUD operacije za Vozilo_oot === //

// Dohvati sva vozila
app.get("/api/vozila", (req, res) => {
  db.query("SELECT * FROM Vozilo_oot", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Dohvati jedno vozilo po ID-u
app.get("/api/vozila/:id", (req, res) => {
  db.query(
    "SELECT * FROM Vozilo_oot WHERE BrojSasije = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ error: "Vozilo nije pronađeno" });
      res.json(results[0]);
    }
  );
});

// Dodaj novo vozilo
app.post("/api/vozila", (req, res) => {
  const {
    BrojSasije,
    Marka,
    Model,
    Paket,
    Boja,
    Felge,
    Motor,
    VrstaGoriva,
    VrstaPogona,
  } = req.body;
  db.query(
    "INSERT INTO Vozilo_oot (BrojSasije, Marka, Model, Paket, Boja, Felge, Motor, VrstaGoriva, VrstaPogona) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      BrojSasije,
      Marka,
      Model,
      Paket,
      Boja,
      Felge,
      Motor,
      VrstaGoriva,
      VrstaPogona,
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Vozilo dodano", id: results.insertId });
    }
  );
});

// Ažuriraj postojeće vozilo
app.put("/api/vozila/:id", (req, res) => {
  const {
    BrojSasije,
    Marka,
    Model,
    Paket,
    Boja,
    Felge,
    Motor,
    VrstaGoriva,
    VrstaPogona,
  } = req.body;
  db.query(
    "UPDATE Vozilo_oot SET Marka = ?, Model = ?, Paket = ?, Boja = ?, Felge = ?, Motor = ?, VrstaGoriva = ?, VrstaPogona = ? WHERE BrojSasije = ?",
    [
      BrojSasije,
      Marka,
      Model,
      Paket,
      Boja,
      Felge,
      Motor,
      VrstaGoriva,
      VrstaPogona,
      req.params.id,
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0)
        return res.status(404).json({ error: "Vozilo nije pronađeno" });
      res.json({ message: "Vozilo ažurirano" });
    }
  );
});

// Obriši vozilo
app.delete("/api/vozila/:id", (req, res) => {
  db.query(
    "DELETE FROM Vozilo_oot WHERE BrojSasije = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0)
        return res.status(404).json({ error: "Vozilo nije pronađeno" });
      res.json({ message: "Vozilo obrisano" });
    }
  );
});

// === CRUD operacije za Djelatnik_oot === //

// Dohvati sve djelatnike
app.get("/api/djelatnici", (req, res) => {
  db.query("SELECT * FROM Djelatnik_oot", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Dohvati jednog djelatnika po ID-u
app.get("/api/djelatnici/:id", (req, res) => {
  db.query(
    "SELECT * FROM Djelatnik_oot WHERE IdDjelatnika = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ error: "Djelatnik nije pronađen" });
      res.json(results[0]);
    }
  );
});

// Dodaj novog djelatnika
app.post("/api/djelatnici", (req, res) => {
  const { ImeDjelatnika, PrezimeDjelatnika, korisnickoIme, lozinka } = req.body;
  db.query(
    "INSERT INTO Djelatnik_oot (ImeDjelatnika, PrezimeDjelatnika, korisnickoIme, lozinka) VALUES (?, ?, ?, ?)",
    [ImeDjelatnika, PrezimeDjelatnika, korisnickoIme, lozinka],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Djelatnik dodan", id: results.insertId });
    }
  );
});

// Ažuriraj postojećeg djelatnika
app.put("/api/djelatnici/:id", (req, res) => {
  const { ImeDjelatnika, PrezimeDjelatnika, korisnickoIme, lozinka } = req.body;
  db.query(
    "UPDATE Djelatnik_oot SET ImeDjelatnika = ?, PrezimeDjelatnika = ?, korisnickoIme = ?, lozinka = ? WHERE IdDjelatnika = ?",
    [ImeDjelatnika, PrezimeDjelatnika, korisnickoIme, lozinka, req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0)
        return res.status(404).json({ error: "Djelatnik nije pronađen" });
      res.json({ message: "Djelatnik ažuriran" });
    }
  );
});

// Obriši djelatnika
app.delete("/api/djelatnici/:id", (req, res) => {
  db.query(
    "DELETE FROM Djelatnik_oot WHERE IdDjelatnika = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0)
        return res.status(404).json({ error: "Djelatnik nije pronađen" });
      res.json({ message: "Djelatnik obrisan" });
    }
  );
});

// Pokretanje servera
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
