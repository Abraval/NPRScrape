var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var exphbs = require("express-handlebars");
var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
var routes = require("./controllers/scraperControllers.js");

app.use(routes);

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/nprScraper";

mongoose.connect(MONGODB_URI);


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
