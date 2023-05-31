const express = require("express");
const router = express.Router();
const supabase = require("../lib/supabaseClient");

// Hämta alla karaktärer
router.get("/", async (req, res) => {
  const { data, error, status } = await supabase.from("characters").select(`*`);

  if (error) {
    res.status(status).json({ error });
  }
  res.json(data);
});

// Hämta en specifik karaktär baserat på ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const { data, error, status } = await supabase
    .from("characters")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    res.status(status).json({ error });
  }

  res.json(data);
});

// Ta bort en karaktär baserat på ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const { error, status, data } = await supabase
    .from("characters")
    .delete()
    .select()
    .single()
    .eq("id", id);

  if (error) {
    res.status(status).json({ error });
  }

  res.json({ message: "Karaktären har blivit borttagen!", data });
});

// Lägg till ny karaktär
router.post("/", async (req, res) => {
  const character = req.body.character;

  const { data, error, status } = await supabase
    .from("characters")
    .insert(character)
    .select()
    .single();

  if (error) {
    res.status(status).json({ error });
  }
  res.json(data);
});

// Uppdatera en karaktär baserat på ID
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const character = req.body.character;

  const { data, error, status } = await supabase
    .from("characters")
    .update(character)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    res.status(status).json({ error });
  }

  res.json(data);
});

module.exports = router;
