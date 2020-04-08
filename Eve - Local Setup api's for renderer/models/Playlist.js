const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
  advertiser_id: {
    type: String,
    required: true
  },
  creative_id: {
    type: String,
    required: true,
    unique: true
  },
  duration: {
    type: Number,
    required: true
  },
  file_details: {
    type: Object,
    required: true
  },
  file_path: {
    type: String,
    required: true
  }
});
module.exports = Playlist = mongoose.model("Playlist", PlaylistSchema);
