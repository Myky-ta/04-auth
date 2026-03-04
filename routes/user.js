const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/user");
const auth = require("../middlewares/auth");

const router = express.Router();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Реєстрація
router.post("/register", async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: "Email in use" });

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashPassword });

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
});

// Логін
router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Email or password is wrong" });

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) return res.status(401).json({ message: "Email or password is wrong" });

  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
});

// Логаут
router.post("/logout", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: null });
  res.status(204).send();
});

// Поточний користувач
router.get("/current", auth, async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
});

// Оновлення підписки
router.patch("/", auth, async (req, res) => {
  const { subscription } = req.body;
  const allowed = ["starter", "pro", "business"];
  if (!allowed.includes(subscription)) {
    return res.status(400).json({ message: "Invalid subscription type" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { subscription },
    { new: true }
  );

  res.json({ email: updatedUser.email, subscription: updatedUser.subscription });
});

module.exports = router;
