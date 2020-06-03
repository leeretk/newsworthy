// Main route (simple Hello World Message)
app.get("/", function(req, res) {
    res.send("Hello world");
  });
  
  // TODO: make two more routes
  
  // Route 1
  // =======
  // This route will retrieve all of the data
  // from the scrapedData collection as a json (this will be populated
  // by the data you scrape using the next route)
  app.get("/", function(req, res) {
    res.send("Hello world");
  });
  
  
  // Route 2
  // =======
  // When you visit this route, the server will
  // scrape data from the site of your choice, and save it to
  // MongoDB.
  // TIP: Think back to how you pushed website data
  // into an empty array in the last class. How do you
  // push it into a MongoDB collection instead?
  app.get("/all", function(req, res) {
    // Query: In our database, go to the animals collection, then "find" everything
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
  
  app.get("/article", function(req, res) {
    // Query: In our database, go to the animals collection, then "find" everything
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
  
  module.exports(....)

  //star wars or projec 2 starter.