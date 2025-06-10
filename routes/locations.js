// routes/locations.js

import express from "express";
import { ObjectId } from "mongodb";
const router = express.Router();

router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const { name, latitude, longitude, category } = req.body;

  if (!name || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.collection("locations").insertOne({
      name,
      latitude,
      longitude,
      category: category || "Uncategorized",
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Location added", id: result.insertedId });
  } catch (err) {
    console.error("Insert failed:", err);
    res.status(500).json({ error: "Failed to add location" });
  }
});

router.get("/", async (req, res) => {
  const db = req.app.locals.db;

  try {
    const locations = await db.collection("locations").find().toArray();
    res.json(locations);
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

router.delete("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const result = await db
      .collection("locations")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json({ message: "Location deleted" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ error: "Failed to delete location" });
  }
});

export default router;
