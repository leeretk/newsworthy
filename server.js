// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");

// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
require("dotenv").config();

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;


// Initialize Express
var app = express();

//        Configure middleware            //
//****************************************//

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/Article", { useNewUrlParser: true });

//Shows all unsaved articles on homepage
app.get("/", function (req, res) {
  db.Article.find({ "saved": false }).then(function (dbArticle) {
    // from the database as the value in an object
    res.json(db.Article);
  }).catch(function (err) { 
    res.json(err) });
});


//           SCRAPE DATA                  //
//****************************************//

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {
  // Make a request via axios to grab the HTML body from the site of your choice
  axios.get("https://www.healthcarefinancenews.com/directory/supply-chain/news").then(function (response) {

    // Load the HTML into cheerio and save it to a variable
    var $ = cheerio.load(response.data);

    // Select each element in the HTML body from which you want information. span.field-content
    $("div.-right-content").each(function (i, element) {
      // Save an empty result object
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.date_author = $(this).find(".date_author").text();
      result.teaser = $(this).find(".teaser").text();
      result.link = $(this).find("a").attr("href");
      result.title = $(this).find(".title").text();

           // Create a new Article using the `result` object built from scraping
           db.Article.create(result)
           .then(function(dbArticle) {
             // View the added result in the console
             console.log(dbArticle);
           })
           .catch(function(err) {
             // If an error occurred, log it
             console.log(err);
           });
       });
  });
  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

//           ROUTES                       //
//****************************************//


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});


