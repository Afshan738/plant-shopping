const express = require("express");
const router = express.Router();
const Plant = require("../model/plant");
const { protect, admin } = require("../middleware/Authmiddleware");
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find({}).populate("category", "name");
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (plant) {
      res.json(plant);
    } else {
      res.status(404).json({ message: "Plant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.post("/", protect, admin, async (req, res) => {
  try {
    const plant = new Plant({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      category: req.body.category,
      sizes: req.body.sizes,
      inStock: req.body.inStock,
    });
    const createdPlant = await plant.save();
    res.status(201).json(createdPlant);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, sizes, inStock } =
      req.body;
    const plant = await Plant.findById(req.params.id);

    if (plant) {
      plant.name = name || plant.name;
      plant.description = description || plant.description;
      plant.price = price || plant.price;
      plant.imageUrl = imageUrl || plant.imageUrl;
      plant.category = category || plant.category;
      plant.sizes = sizes || plant.sizes;
      plant.inStock = inStock !== undefined ? inStock : plant.inStock;

      const updatedPlant = await plant.save();
      res.json(updatedPlant);
    } else {
      res.status(404).json({ message: "Plant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);

    if (plant) {
      await plant.remove();
      res.json({ message: "Plant removed" });
    } else {
      res.status(404).json({ message: "Plant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
