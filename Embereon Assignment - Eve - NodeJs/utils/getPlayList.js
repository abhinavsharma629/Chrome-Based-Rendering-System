// Including different models
const Playlist = require("../models/Playlist.js");

// Save Form
const getPlaylist = async (query, limit) => {
  let playlist = await Playlist.find(query, {
    advertiser_id: 1,
    creative_id: 1,
    duration: 1,
    file_details: 1,
    file_path: 1
  })
    .limit(parseInt(limit))
    .then(playlist => {
      console.log("got playlist");
      return playlist;
    });
  console.log("returning playlist");
  //console.log(playlist)
  return playlist;
};

exports.getPlaylist = getPlaylist;
