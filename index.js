const express = require("express");
const cors = require("cors");
const { Connection } = require("./db");
const { bookModel } = require("./Model/BooksModel");
const { userModel } = require("./Model/UserModel");
const { userRoute } = require("./Routes/userRoutes");
const { bookRoute } = require("./Routes/bookRoutes");
const { discussionRoute } = require("./Routes/discussionRoute");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoute);
app.use("/book", bookRoute);
app.use("/discussion", discussionRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the Backend of BookHubX");
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
