var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PodcastSchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  link: String,
  teaser: String,
  img: String,
  saved: {
    type: Boolean,
    default: false
  },
  note: 
    {
      type: Schema.Types.ObjectId,
      ref: "note"
    }
});

var Podcast = mongoose.model("Podcast", PodcastSchema);


module.exports = Podcast;
