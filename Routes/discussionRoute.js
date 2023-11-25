const express = require("express");
const { auth } = require("../Middleware/authMiddleware");
const discussionModel = require("../Model/DiscussionModel");

const discussionRoute = express.Router();

discussionRoute.use(auth);

discussionRoute.get("", async (req, res) => {
  try {
    const AllDiscussion = await discussionModel.find();
    res.status(200).json({ AllDiscussion: AllDiscussion });
  } catch (error) {
    res.status(400).json({ err: error });
  }
});

discussionRoute.post("/create", async (req, res) => {
  try {
    const { userId, userName, title, content } = req.body;
    const post = new discussionModel({
      title,
      content,
      userId: userId,
      userName: userName,
    });
    await post.save();
    res.status(200).json({ msg: "Discussion Created Sucessfull" });
  } catch (error) {
    res.status(400).json({ err: error });
  }
});

discussionRoute.post("/message/:discussionId", async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { userId, userName, text } = req.body;
    const allMessage = await discussionModel.findOne({ _id: discussionId });
    const AddMessage = allMessage.message;
    AddMessage.push({ userId: userId, userName: userName, text: text });
    const post = await discussionModel.findByIdAndUpdate(
      { _id: discussionId },
      { message: AddMessage }
    );
    res.status(200).json({ msg: "Message sucessfull" });
  } catch (error) {
    res.status(400).json({ err: error });
  }
});

discussionRoute.patch("/update/:discussionId", async (req, res) => {
  try {
    if (req.body.role == "admin") {
      const { discussionId } = req.params;

      const post = await discussionModel.findByIdAndUpdate(
        { _id: discussionId },
        req.body
      );

      if (!post) {
        res.status(400).send({ error: "Discussion Not Found" });
      } else {
        res.status(200).send({ msg: "Discussion updated Successfull" });
      }
    } else {
      res.status(400).send({ error: "you are not authorized!!" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

discussionRoute.delete("/delete/:discussionId", async (req, res) => {
  try {
    if (req.body.role == "admin") {
      const { discussionId } = req.params;

      const post = await discussionModel.findByIdAndDelete({
        _id: discussionId,
      });
      if (!post) {
        res.status(400).send({ error: "Discussion Not Found" });
      } else {
        res.status(200).send({ msg: "Discussion Deleted Successfull" });
      }
    } else {
      res.status(400).send({ error: "you are not authorized!!" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = {
  discussionRoute,
};
