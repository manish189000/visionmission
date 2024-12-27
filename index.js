require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using the URI from the .env file
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Schema and Model
const contentSchema = new mongoose.Schema({
  visionTitle: String,
  visionHeading: String,
  visionText: String,
  missionTitle: String,
  missionHeading: String,
  missionText: String,
});

const Content = mongoose.model("Content", contentSchema);

// Routes

// Get the content
app.get("/content", async (req, res) => {
  const content = await Content.findOne();
  res.json(content);
});

// Update the content
app.post("/content", async (req, res) => {
  let content = await Content.findOne();
  if (!content) {
    content = new Content(req.body);
  } else {
    Object.assign(content, req.body);
  }
  await content.save();
  res.json({ message: "Content updated successfully", content });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
