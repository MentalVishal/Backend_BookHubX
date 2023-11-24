const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { bookModel } = require("../Model/BooksModel");
const { userModel } = require("../Model/UserModel");
const { auth } = require("../Middleware/authMiddleware");
require("dotenv").config();

const bookRoute = express.Router();
bookRoute.use(auth);

bookRoute.post("/add", async (req, res) => {
  try {
    if (req.body.role == "admin" || req.body.role == "author") {
      const post = new bookModel(req.body);
      await post.save();
      const { userId, title, genre, description } = req.body;
      const updateData = await userModel.findByIdAndUpdate(
        { _id: userId },
        { books: { title, genre, description } }
      );
      res.status(200).send({ msg: "Book Sucessfully Added" });
    } else {
      res.status(400).send({ error: "you are not authorized!!" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = {
  bookRoute,
};
