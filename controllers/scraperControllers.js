var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

///////PODCAST ROUTES SECTION//////
router.get("/", (req, res) => {
  db.Podcast.find({ saved: false })
    .sort({ _id: 0 })
    .then(podcasts => res.render("index", { podcasts }))
    .catch(err => res.json(err));
});

router.get("/scrape", function(req, res) {
  axios
    .get("https://www.npr.org/podcasts/510310/npr-politics-podcast")
    .then(function(response) {
      var $ = cheerio.load(response.data);

      $(".item-info").each(function(i, element) {
        var result = {};
        result.title = $(this)
          .find("a")
          .eq(0)
          .text();
        result.link = $(this)
          .find("a")
          .attr("href");
        result.teaser = $(this)
          .find(".teaser")
          .text();
        result.img = $(this)
          .prev()
          .find("img")
          .attr("src");
        console.log(result);
        db.Podcast.create(result)
          .then(function(dbPodcast) {
            console.log(dbPodcast);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      res.send("Scrape Complete");
    });
});

router.get("/podcasts", function(req, res) {
  db.Podcast.find({})
    .sort({ _id: 0 })
    .populate("note")
    .then(function(dbPodcast) {
      res.json(dbPodcast);
    })
    .catch(function(err) {
      res.json(err);
    });
});


//SAVE ARTICLES
router.put("/podcasts/:id", function(req, res) {
  console.log(req.params.id);
  db.Podcast.findOneAndUpdate(
    {
      _id: req.params.id
    },
    { $set: { saved: req.body.saved } }
  )
    .populate("note")
    .then(function(dbPodcast) {
      res.json(dbPodcast);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/podcasts/:id", function(req, res) {
  db.note.create(req.body).then(function(dbNote) {
    return db.Podcast.findOne(
      {
        _id: req.params.id
      },
      { $push: { note: dbNote._id } },
      { new: true }
    )
      .then(function(dbPodcast) {
        res.json(dbPodcast);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
});
router.delete("/scrape", function(req, res) {
  db.Podcast.remove({})
    .then(function() {
      return db.note.remove({});
    })
    .then(function() {
      res.redirect("/");
    });
});

router.get("/saved", function(req, res) {
  db.Podcast.find({ saved: true })
    .populate("note")
    .then(podcasts => {
      // console.log(podcasts)
      res.render("saved", { podcasts });
    })
    .catch(function(err) {
      res.json(err);
    });
});

//////////NOTES SECTION//////////
// Route for saving/updating an Podcast's associated Note
router.post("/podcasts/:id", function(req, res) {
  // console.log(req.params.id)
  // console.log(req.body)
  db.note.create(req.body).then(function(dbNote) {
    return db.Podcast.findOneAndUpdate(
      {
        _id: req.params.id
      },
      { $push: { note: dbNote._id } },
      { new: true }
    )
      .then(function(dbPodcast) {
        console.log(dbPodcast);
        res.json(dbPodcast);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
});
// Route for grabbing a specific Podcast by id populate it with it's note
router.get("/api/podcasts/:id", function(req, res) {
  console.log("-------------------------------");
  console.log(req.params.id);
  db.Podcast.find({
    _id: req.params.id
  })
    .populate("note")
    .then(function(dbPodcast) {
      //  res.json(dbPodcast)
      res.render("saved", { dbPodcast });
      // location.reload();
      console.log("THIS IS DATA: ", dbPodcast);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//////////////////////////////////////
// Route for deleting a note
router.delete("/podcasts/:podId/note/:noteId", function(req, res) {
  db.note
    .deleteOne({ _id: req.params.noteId })
    .then(function() {
      return db.Podcat.update(
        { _id: req.params.podId },
        { $pull: { comments: req.params.commentId } }
      );
    })
    .then(function(dbPodcast) {
      res.json(dbPodcast);
    })
    .catch(function(err) {
      res.json(err);
    });
});
module.exports = router;
