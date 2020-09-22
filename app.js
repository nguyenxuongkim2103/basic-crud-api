const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);
/////////////////////////////////////////////////////Requests Targetting All Articles///////////////////////////////////////////////////////////
app.route("/articles")
.get(function(req, res){
  Article.find(function(err, foundAriticles){
    if(!err){
      res.send(foundAriticles);
    }else{
      res.send(err);
    }
  });
})
.post(function(req, res){
  const newArticle = new Article({//Create new object
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){//save object to database
    if(!err){
      res.send("Successfully added a new articles.");
    }else {
      res.send(err);
    }
  });
})
.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles.");
    }else{
      res.send(err);
    }
  });
})
/////////////////////////////////////////////////////Requests Targetting A Single Article///////////////////////////////////////////////////////////
app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title:req.params.articleTitle}, function(err, foundAriticle){
    if(foundAriticle){
      res.send(foundAriticle);
    }else{
      res.send("No article matching that title was found.");
    }
  });
})
.put(function(req, res){//Entirely replaces the resource
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      }else{
        res.send(err);
      }
    }
  );
})
.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      }else{
        res.send(err);
      }
    }
  );
})
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully delete the article!");
      }else{
        res.send(err);
      }
    }
  );
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
})
