var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cherrio");
var request = require("request");
var db = require("./models");

var PORT = 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoosel.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res){
    request("https://www.wired.com/most-recent/", function(error, response, html) {
        var $ = cheerio.load(html);
        var prelimResults = [];
        var results = [];
        $("a.archive-item-component__link").each(function(i, element){
            var link = $(element).attr("href");
            var title = $(element).children("h2").text();
             var summary = $(element).children("p").text();
      
            //Need to push to prelimResults array first because there are duplicate "a" tags with the same href data and each one is indexed, messing up the order of the data in the array of objexts. Creating a new results array from this preliminary results array fixes this problem
            prelimResults.push({
                link: "https://www.wired.com/" + link,
                title: title,
                summary: summary,
          });
        });

        prelimResults.forEach(function(element, i) {
            if (i % 2 !== 0) {
                db.Article.create(element[i])
                    .then(function(dbArticle){
                        console.log(db.Article);
                    })
                    .catch(function(err){
                        return res.json(err);
                    })
                results.push(element);
            }
          }); 
          res.send("Scrape Complete");

    });
});

app.get("/articles", function(req, res){
    db.Article.find({})
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        })
});

app.get("articles/:id", function(req, res){
    db.Article.findOne({id: req.params.id})
    .populate("comment")
    .then(function(dbArticle){
        res.json(dbArticle)
    })
    .catch(function(err){
        res.json(err);
    })
});

app.post("/articles/:id", function(req, res){
    db.Comment.create(req.body)
        .then(function(dbComment){
            return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true});
        })
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        })
});

app.listen(PORT, function(){
    console.log("App running on port " + PORT + "!");
});