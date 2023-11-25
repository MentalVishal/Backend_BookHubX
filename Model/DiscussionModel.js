// models/discussionModel.js
const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    userName: String,
    user: String,
    message: [{ userId: String, userName: String, text: String }],
  },
  { versionKey: false }
);

const discussionModel = mongoose.model("Discussion", discussionSchema);

module.exports = discussionModel;
