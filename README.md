All the News That's Fit to Scrape

Overview
In this assignment, you'll create a web app that lets users view and leave comments on the latest news. But you're not going to actually write any articles; instead, you'll flex your Mongoose and Cheerio muscles to scrape news from another site.

Before You Begin


Create a GitHub repo for this assignment and clone it to your computer. Any name will do -- just make sure it's related to this project in some fashion.


Run npm init. When that's finished, install and save these npm packages:

express
express-handlebars
mongoose
cheerio
axios

NOTE: If you want to earn complete credit for your work, you must use all five of these packages in your assignment.

In order to deploy your project to Heroku, you must set up an mLab provision. mLab is remote MongoDB database that Heroku supports natively. Follow these steps to get it running:

Create a Heroku app in your project directory.

Run this command in your Terminal/Bash window:
heroku addons:create mongolab

This command will add the free mLab provision to your project.
When you go to connect your mongo database to mongoose, do so the following way:

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

This code should connect mongoose to your remote mongolab database if deployed, but otherwise will connect to the local mongoHeadlines database on your computer.

Watch this demo of a possible submission. See the deployed demo application here.

Your site doesn't need to match the demo's style, but feel free to attempt something similar if you'd like. Otherwise, just be creative!


This assignment must be deployed. * Please submit both the deployed Heroku link to your homework AND the link to the Github Repository!

Instructions
Create an app that accomplishes the following:

1) the app should scrape stories from a news outlet of your choice and display them for the user. 
2) Each scraped article should be saved to your application database. 
    a) Headline - the title of the article
    b) Summary - a short summary of the article
    c) URL - the url to the original article
3) Users should also be able to leave comments on the articles displayed and revisit them later. 
    a) The comments should be saved to the database associated with their articles. 
    b) Users should also be able to delete comments left on articles. 
    c) All stored comments should be visible to every user.

Beyond these requirements, be creative and have fun with this!

Tips

Go back to Saturday's activities if you need a refresher on how to partner one model with another.

Whenever you scrape a site for stories, make sure an article isn't already represented in your database before saving it; Do not save any duplicate entries.

Don't just clear out your database and populate it with scraped articles whenever a user accesses your site.

If your app deletes stories every time someone visits, your users won't be able to see any comments except the ones that they post.

Helpful Links

MongoDB Documentation
Mongoose Documentation
Cheerio Documentation

Reminder: Submission on BCS
