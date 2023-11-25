const express = require("express");
const cors = require("cors");
const { Connection } = require("./db");
const { bookModel } = require("./Model/BooksModel");
const { userModel } = require("./Model/UserModel");
const { userRoute } = require("./Routes/userRoutes");
const { bookRoute } = require("./Routes/bookRoutes");
const { discussionRoute } = require("./Routes/discussionRoute");
require("dotenv").config();
const OpenAI = require("openai");
const { auth } = require("./Middleware/authMiddleware");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoute);
app.use("/book", bookRoute);
app.use("/discussion", discussionRoute);

const openai = new OpenAI({ key: process.env.OPENAI_API_KEY });

const allMessage = [];

app.post("/chat", auth, async (req, res) => {
  try {
    const { input } = req.body;
    allMessage.push(input);

    const response = await main(input);

    let data = response[0].message.content;
    allMessage.push(data);
    res.json(allMessage);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

async function main(input) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `act as a Integrate a chatbot for book and author recommendations and chat with user
    based on above data here is the prompt ,  
    user text ${input} output should be less then 30 words `,
      },
    ],
    model: "gpt-3.5-turbo", //it will be costly to use
    // model:'GPT-3',
  });

  return chatCompletion.choices;
}

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
