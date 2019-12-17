const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

let app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleScehma = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleScehma);

const insert = new Article({
  title: "Front End",
  content: "Dealing with client side code"
});

// insert.save();

app.get("/", (req, res) => {
  res.send("HELLO WORLD");
});

// REQUESTS TARGETING ALL ARTICLES
app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, results) => {
      if (err) res.send(err);
      else res.send(results);
    });
  })
  .post((req, res) => {
    const art = new Article({
      title: req.body.title,
      content: req.body.content
    });

    art.save(err => {
      err ? res.send(err) : res.send("no error");
    });
  })
  .delete((req, res) => {
    Article.deleteMany(err => {
      err ? res.send(err) : res.send("deleted all articles");
    });
  });

// REQUEST TARGETTING A SPECIFIC ARTICLE
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, results) => {
      err ? res.send(err) : res.send(results);
    });
  })
  .put((req, res) => {
    console.log("putting");
    console.log(req.params.articleTitle);
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
    
      (err) => {
        err ? res.send(err) : res.send("Succesfully updated");
      }
    )
  })
  .patch((req,res)=>{
      Article.update(
        { title: req.params.articleTitle },
        { $set: req.body },
      
        (err) => {
          err ? res.send(err) : res.send("Succesfully updated");
        }
      )
  })
  .delete((req,res)=>{
      Article.deleteOne({title:req.params.articleTitle}, err=>{
        err ? res.send(err) : res.send("Deleted");
      })
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`connected to port ${port}`);
});
