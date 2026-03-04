const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const contactsRouter = require("./routes/contacts");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/users", usersRouter);
app.use("/contacts", contactsRouter);

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => {
    console.error("Database connection error:", error.message);
    process.exit(1);
  });
