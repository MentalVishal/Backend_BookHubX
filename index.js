const express = require("express");
const cors = require("cors");
const { Connection } = require("./db");
const { bookModel } = require("./Model/BooksModel");
const { userModel } = require("./Model/UserModel");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.post("/book", async (req, res) => {
  try {
    const book = new bookModel(req.body);
    await book.save();
    res.status(200).json({ msg: "Sucessfully Posted" });
  } catch (error) {
    res.status(400).json({ err: error });
  }
});

app.post("/user", async (req, res) => {
  try {
    const user = new userModel(req.body);
    await user.save();
    res.status(200).json({ msg: "Sucessfully Posted" });
  } catch (error) {
    res.status(400).json({ err: error });
  }
});

app.listen(process.env.port, async () => {
  try {
    await Connection;
    console.log("Connected to Database");
    console.log(`Running at port ${process.env.port}`);
  } catch (error) {
    console.log("Something Went Wrong");
  }
});
