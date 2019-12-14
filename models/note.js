var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: String,
  body: String
});

var note = mongoose.model("note", NoteSchema);

// Export the Note model
module.exports = note;