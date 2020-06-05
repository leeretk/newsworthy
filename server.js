// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request via axios to grab the HTML body from the site of your choice
  axios.get("https://www.healthcarefinancenews.com/directory/supply-chain/news").then(function(response) {

  // Load the HTML into cheerio and save it to a variable
  var $ = cheerio.load(response.data);

      // An empty array to save the data that we'll scrape
      var results = [];

      // var childGroup = $().children();   
      // Select each element in the HTML body from which you want information. span.field-content

      $("div.-right-content").each(function(i, element) {
          
          var date_author = $(element).find(".date_author").text();
          console.log("date author" + date_author)
          
            var teaser = $(element).find(".teaser").text();

          var link = $(element).find("a").attr("href");

          var title = $(element).find(".title").text();
        
        // If this found element had both a title and a link
        if (title && link) {
       // Insert the data in the scrapedData db
    db.scrapedData.insert({
      date_author: date_author,
      teaser: teaser,
      title: title,
      link: link,
      },

      function(err, inserted) {
              if (err) {
                // Log the error if one is encountered during the query
                console.log(err);
              }
              else {
                // Otherwise, log the inserted data
                console.log(inserted);
              }
            });
          }
          });
         });


  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

app.get("/", function(req, res) {
  res.send("Newsworthy is Connected");
});

app.get("/all", function(req, res) {
  // Query: In our database, go to the articles collection, then "find" everything
  db.mongodb.find({}, function(err, data) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    else {
      // Otherwise, send the result of this query to the browser
      res.json(data);
    }
  });
});


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
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
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

// Route for retrieving all Notes from the db
app.get("/notes", function(req, res) {
  // Find all Notes
  db.Note.find({})
    .then(function(dbNote) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
});

// Route for saving a new Note to the db and associating it with a User
app.post("/submit", function(req, res) {
  // Create a new Note in the db
  db.Article.create(req.body)
    .then(function(dbArticle) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.User.findOneAndUpdate({}, { $push: { articles: dbArticle._id } }, { new: true });
      
    })
    .then(function(dbUser) {
      // If the User was updated successfully, send it back to the client
      res.json(dbUser);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
