const express = require("express");
const Contact = require("../models/contact");
const auth = require("../middlewares/auth");

const router = express.Router();

// Отримати всі контакти
router.get("/", auth, async (req, res) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const filter = { owner: req.user._id };
  if (favorite !== undefined) {
    filter.favorite = favorite === "true";
  }

  const contacts = await Contact.find(filter, "", { skip, limit: Number(limit) });
  res.json(contacts);
});

// Додати контакт
router.post("/", auth, async (req, res) => {
  const contact = await Contact.create({ ...req.body, owner: req.user._id });
  res.status(201).json(contact);
});

// Видалити контакт
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findOneAndDelete({ _id: id, owner: req.user._id });
  if (!result) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Contact deleted" });
});

module.exports = router;
