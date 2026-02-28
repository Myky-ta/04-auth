const express = require("express");
const Contact = require("../models/contact");
const auth = require("../middlewares/auth");

const router = express.Router();

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

module.exports = router;
