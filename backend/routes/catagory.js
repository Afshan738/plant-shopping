const express = require("express");
const router = express.Router();
const Category = require("../model/catagory");
const { protect, admin } = require("../middleware/Authmiddleware");
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.description = description || category.description;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(444).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await category.remove();
      res.json({ message: "Category removed" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
