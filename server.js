// Dependencies
var express = require("express");
var mongoose = require("mongoose");
// Require axios and cheerio. This makes the scraping possible. Also requiring models.
var axios = require("axios");
var cheerio = require("cheerio");
var Post = require("./models/Post");

// Initialize Express
var app = express();
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/animeScraper";
mongoose.connect(MONGODB_URI);

// app.get("/", function(req, res) {
//     Post.all(function(data) {
//         var hbsObject = {
//           title: data,
//           content: data,
//           url: data
//         };
//         console.log(hbsObject);
//         res.render("index", hbsObject);
//     });
//   });

app.get("/scraped", function(req, res) {
    axios.get("https://aminoapps.com/c/anime/home/").then(function(response){
        // console.log(response.data);
        var $ = cheerio.load(response.data);
        $(".list-item").each(function(i, element){
            // console.log("I found something!")
            var title = $(element).find("h3").text();
            // console.log(title);
            var content = $(element).find(".content").text();
            // console.log(content);
            var url = $(element).find(".block").attr("href");
            // console.log(url);
            var postAdd = {
                title,
                content,
                url
            };
            
            Post.create(postAdd);
    });

    });

    
});

app.get("/api/posts", function(req, res){
    Post.find({}, function(err, results){
        if(err){
            console.log(err);
        };

        res.json(results);
    });
});


// Listen on port 3000
app.listen(8080, function() {
    console.log("App running on port 8080!");
  });


  