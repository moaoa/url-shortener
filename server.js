const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ShortUrl = require("./models/ShortUrl");
const methodOverride = require("method-override");
const shortId = require("shortid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/urlShortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls });
});

app.post("/shortUrl", async (req, res) => {
  try {
    const fullUrl = req.body.full;
    await ShortUrl.create({ full: fullUrl });
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.get("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) res.sendStatus(404);
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
  } catch (error) {
    console.error(error);
  }
});

app.delete("/:short", async (req, res) => {
  const short = req.params.short;
  let urlToDelete;
  urlToDelete = await ShortUrl.findOne({ short: short });
  await urlToDelete.remove();
  res.redirect("/");
});

app.put("/reset/:short", async (req, res) => {
  const url = await ShortUrl.findOne({ short: req.params.short });
  url.clicks = 0;
  await url.save();
  res.redirect("/");
});

app.listen(process.env.PORT || 5000);
