const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  favorite: { type: Boolean, default: false },
  owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
}, { versionKey: false, timestamps: true });

module.exports = model("contact", contactSchema);
