const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ShortUrl = require("./models/ShortUrl");

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/urlShortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls });
});

app.listen(process.env.PORT || 5000);
