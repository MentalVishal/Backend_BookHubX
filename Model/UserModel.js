const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    books: Array,
    role: String,
  },
  { versionKey: false }
);

const userModel = mongoose.model("user", userSchema);

module.exports = {
  userModel,
};
