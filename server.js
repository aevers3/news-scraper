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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nyt-scraper-db";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/").then(function (response) {

        var $ = cheerio.load(response.data);

        var result = {};

        $("article > div > div > a").each(function (i, element) {
            // Checks for summaries stored in lists and paragraphs, then scrapes accordingly.
            // If neither, the summary will say there is no preview available. In these cases, there generally is not a summary.

            result.title = $(this).children('div').text();

            if ($(this).find('ul').text()) {
                result.summary = $(element).find('ul').text();
            } else if ($(this).find('p').text()) {
                result.summary = $(element).find('p').text();
            } else {
                result.summary = 'No Article Preview Available.'
            }
            // Add the domain, which is excluded from the scraped data
            result.link = 'https://www.nytimes.com/' + $(this).attr('href');
            console.log(result);

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });
        
        // Send a message to the client
        res.send("Scrape Complete");
    });
});


// Route for getting all Articles from the db



// Route for grabbing a specific Article by id, populate it with it's note



// Route for saving/updating an Article's associated Note




// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
