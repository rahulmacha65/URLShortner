const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shotUrls");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/urlshotner", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  });
//ejs engine for views
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

//Router
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl === null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

//listener
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running at ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
