var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/").then(function (response) {

        var $ = cheerio.load(response.data);

        var results = [];

        $("article > div > div > a").each(function (i, element) {
            var title = $(element).children('div').text();

            // Checks for summaries stored in lists and paragraphs, then scrapes accordingly.
            // If neither, the summary will say there is no preview available. In these cases, there generally is not a summary.
            if ($(element).find('li').text()) {
                var summary = $(element).find('ul').text();
            } else if ($(element).find('p').text()) {
                var summary = $(element).find('p').text();
            } else {
                var summary = 'No Article Preview Available.'
            }

            results.push({
                title: title,
                summary: summary
            });
        });

        console.log(results);
    });
});


// Route for getting all Articles from the db



// Route for grabbing a specific Article by id, populate it with it's note



// Route for saving/updating an Article's associated Note




// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
