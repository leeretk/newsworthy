// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append(
       "<p data-id='" + data[i]._id + "'>"   
       + data[i].date_author + " | " + "'>"
       + data[i].title + " | " + "'>"
       + data[i].teaser + " | " + "<br />" 
       + data[i].link + " || "+ "'>"  
       + "</p>"
      );
  }
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function(data) {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).then(function(data) {
 
      if (data.date_author && data.title) {
      // The title of the article
      $("#notes").append("<h4>" + data.date_author + " | " + data.title + "</h4>");
  
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>"+ "<br />");

      //A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'> Save Note </button>");

      //A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'> Delete Note </button>");

      if (data.note) {
      $("#bodyinput").val(data.note.body);
      };
    };
    })});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#bodyinput").val("");
});


// When you click the savenote button
$(document).on("click", "#deletenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#bodyinput").val("")
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#bodyinput").val("");
});