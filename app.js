const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const contactsRouter = require("./routes/contacts");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/users", usersRouter);
app.use("/contacts", contactsRouter);

// DB + Server
const { DB_HOST, PORT = 3000 } = process.env;

mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Database connection error:", error.message);
    process.exit(1);
  });
