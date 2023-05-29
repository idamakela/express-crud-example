const express = require("express");
const router = express.Router();
const mockData = require("../mockData");
const supabase = require("../lib/supabaseClient");

// Ladda initialdata
let characters = mockData;

// Hämta alla karaktärer
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("characters").select(`
  name,
  id,
  powers (
    id,
    power
  )
  `);

  // const { data, error } = await supabase
  // .from('users')
  // .select(`
  //   name,
  //   teams (
  //     name
  //   )
  // `)

  res.json(data);
});

// Hämta en specifik karaktär baserat på ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const numberId = parseInt(id);
  const character = characters.find((char) => char.id === numberId);

  if (!character) {
    return res
      .status(404)
      .json({ message: "Ingen karaktär med det idt kunde hittas!" });
  }

  res.json(character);
});

// Ta bort en karaktär baserat på ID
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const numberId = parseInt(id);

  const character = characters.find((char) => char.id === numberId);

  if (!character) {
    return res
      .status(404)
      .json({ message: "Ingen karaktär med det idt kunde hittas!" });
  }
  const newData = characters.filter((char) => char.id !== numberId);
  characters = newData;

  res.json({ message: "Karaktären har blivit borttagen!" });
});

// Skapa ett nytt unikt ID för nya karaktärer
let nextId = 28234;

// Lägg till ny karaktär
router.post("/", (req, res) => {
  const character = req.body.character;
  const newCharacter = {
    ...character,
    id: nextId,
  };

  nextId++;

  characters.push(newCharacter);
  res.json(newCharacter);
});

// Uppdatera en karaktär baserat på ID
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const numberId = parseInt(id);
  const character = req.body.character;

  const index = characters.findIndex((char) => char.id === numberId);

  if (index === -1) {
    return res
      .status(404)
      .json({ message: "Inget id matchar någon befintlig karaktär" });
  }

  const updatedCharacter = { ...characters[index], ...character };
  characters[index] = updatedCharacter;

  res.json(updatedCharacter);
});

module.exports = router;
