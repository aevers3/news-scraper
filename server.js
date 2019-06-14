var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");



var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Set up mongo for heroku deployment
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nyt-scraper-db";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/scrapeController.js");

app.use(routes);


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
