const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    image: String,
    title: String,
    author: String,
    genre: String,
    description: String,
    review: [{ userId: String, name: String, text: String }],
    rating: { type: Number, default: 4 },
    price: Number,
  },
  { versionKey: false }
);

const bookModel = mongoose.model("Book", bookSchema);

module.exports = {
  bookModel,
};
