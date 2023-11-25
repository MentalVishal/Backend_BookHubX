const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { bookModel } = require("../Model/BooksModel");
const { userModel } = require("../Model/UserModel");
const { auth } = require("../Middleware/authMiddleware");
require("dotenv").config();

const bookRoute = express.Router();
bookRoute.use(auth);

bookRoute.get("", async (req, res) => {
  try {
    const AllBook = await bookModel.find();
    res.status(200).json({ AllBook: AllBook });
  } catch (error) {
    res.status(400).json({ err: error });
  }
});

bookRoute.post("/add", async (req, res) => {
  try {
    if (req.body.role == "admin" || req.body.role == "author") {
      const post = new bookModel(req.body);
      await post.save();
      const { userId, title, genre, description } = req.body;

      const book = await userModel.findOne({ _id: userId });
      const AllBook = book.books;
      AllBook.push({ title, genre, description });

      const updateData = await userModel.findByIdAndUpdate(
        { _id: userId },
        { books: AllBook }
      );
      res.status(200).send({ msg: "Book Sucessfully Added" });
    } else {
      res.status(400).send({ error: "you are not authorized!!" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

bookRoute.patch("/update/:bookId", async (req, res) => {
  try {
    if (req.body.role == "admin") {
      const { bookId } = req.params;

      const post = await bookModel.findByIdAndUpdate({ _id: bookId }, req.body);

      if (!post) {
        res.status(400).send({ error: "Book Not Found" });
      } else {
        res.status(200).send({ msg: "Book updated Successfull" });
      }
    } else {
      res.status(400).send({ error: "you are not authorized!!" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

bookRoute.post("/review/:bookId", async (req, res) => {
  const allData = req.body;
  try {
    const { bookId } = req.params;
    const { userId, userName, text } = req.body;
    const book = await bookModel.findOne({ _id: bookId });
    allReview = book.review;
    allReview.push({ userId: userId, name: userName, text: text });
    const post = await bookModel.findByIdAndUpdate(
      { _id: bookId },
      { review: allReview }
    );
    res.status(200).json({ msg: "Review Sucessfull" });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

bookRoute.delete("/delete/:bookId", async (req, res) => {
  try {
    if (req.body.role == "admin") {
      const { bookId } = req.params;

      const post = await bookModel.findByIdAndDelete({ _id: bookId });
      if (!post) {
        res.status(400).send({ error: "Book Not Found" });
      } else {
        res.status(200).send({ msg: "Book Deleted Successfull" });
      }
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
