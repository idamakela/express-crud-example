const express = require("express");
const router = express.Router();
const mockData = require("../mockData");
const supabase = require("../lib/supabaseClient");

// Ladda initialdata
let characters = mockData;

// Foreign key -> delete cascade.

// Hämta alla karaktärer
// Fetch all characters
router.get("/", async (req, res) => {
  const { data, error, status } = await supabase.from("characters").select("*");
  if (error) {
    return res.status(status).json({ error: error.message });
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
    return res.status(status).json({ error: error.message });
  }

  res.json(data);
});

// Ta bort en karaktär baserat på ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const { error, status } = await supabase
    .from("characters")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(status).json({ error: error.message });
  }
  res.json({ message: "Character has been deleted" });
});

// Skapa ett nytt unikt ID för nya karaktärer
let nextId = 28234;

// Lägg till ny karaktär
router.post("/", async (req, res) => {
  const body = req.body;
  const { data, error, status } = await supabase
    .from("characters")
    .insert(body)
    .select();

  if (error) {
    return res.status(status).json({ error: error.message });
  }

  res.json(data);
});

// Uppdatera en karaktär baserat på ID
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  const { data, error } = await supabase
    .from("characters")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data[0]);
});

module.exports = router;
