var express = require("express");
var download = require("download-file");

// Including different models
const Playlist = require("../models/Playlist.js");
const default_playlist = require("../utils/default_playlist.js").PLAYLIST;
const download_directory = require("../keys").PLAYLIST_DOWNLOAD_DIRECTORY;
const getPlaylistData = require("../utils/getPlaylist.js");

var router = express.Router();
var mongoose = require("mongoose");

// Adam Playlist route.
router.get("/adamPlaylist", async function(req, res) {
  //console.log("getting playlist");
  console.log(req.query);

  let start = parseInt(req.query.start);
  let limit = parseInt(req.query.limit);
  let prevStart = parseInt(req.query.prevStart);
  let askForNew = req.query.askForNew === "true";
  let query = { creative_id: { $gte: start } };
  let data = {};
  let playlist = [];

  if (askForNew) {
    query = { creative_id: { $gte: prevStart } };

    playlist = await getPlaylistData.getPlaylist(query, limit);

    if (playlist.length == 0) {
      // -----------------------**************---------------------------------
      // Internally Call evePlaylistRenew api to update the playlist
      // -----------------------**************---------------------------------

      // If no new assets to display or internet error or any other issues start repeating the playlist

      query = { creative_id: { $gte: start } };
      playlist = await getPlaylistData.getPlaylist(query, limit);

      if (playlist.length == 0) {
        console.log("inside 1");
        //prevStart=start;
        start = 1;
        query = { creative_id: { $gte: start } };
        playlist = await getPlaylistData.getPlaylist(query, limit);

        data = {
          playlist: playlist,
          askForNew: true,
          prevStart: prevStart,
          start: start
        };
      } else {
        console.log("inside 2");
        data = {
          playlist: playlist,
          askForNew: true,
          prevStart: prevStart,
          start: start + limit
        };
      }
      console.log("\n---------------\n");
      res.status(200).json(data);
    } else {
      console.log("inside not 3");
      data = {
        playlist: playlist,
        askForNew: false,
        prevStart: prevStart,
        start: prevStart + limit
      };
      console.log("\n---------------\n");
      res.status(200).json(data);
    }
  } else {
    playlist = await getPlaylistData.getPlaylist(query, limit);
    //console.log("processing fetched playlist  of length " + playlist.length);

    if (playlist.length == 0) {
      console.log("inside not 4");
      prevStart = start;
      start = 1;
      query = { creative_id: { $gte: start } };
      playlist = await getPlaylistData.getPlaylist(query, limit);

      data = {
        playlist: playlist,
        askForNew: true,
        prevStart: prevStart,
        start: start
      };
    } else {
      console.log("inside not 5");
      data = {
        playlist: playlist,
        askForNew: false,
        prevStart: start,
        start: start + limit
      };
    }
    console.log("\n---------------\n");
    res.status(200).json(data);
  }
});

// Eve Playlist Renew Route.
router.get("/evePlaylistRenew", async function(req, res) {
  // -----------------------**************---------------------------------
  // Logic to get updated playlist from external api call.
  // -----------------------**************---------------------------------

  // Using Default playlist for now
  //let curr_dir = process.cwd();
  default_playlist.playlist.forEach(item => {
    var url = item.file.src;
    var options = {
      directory: download_directory,
      filename:
        item.file.asset_name.split(".")[0] +
        "-" +
        item.file.timestamp +
        "-" +
        item.creative_id +
        "-" +
        item.advertiser_id +
        "." +
        item.file.asset_name.split(".")[1]
    };

    download(url, options, async function(err) {
      if (err) throw err;

      let file_det = item.file;
      file_det["asset_name"] = options.filename;
      //console.log(file_det);

      const new_item = new Playlist({
        advertiser_id: item.advertiser_id,
        creative_id: item.creative_id,
        duration: parseInt(item.duration),
        file_details: file_det,
        file_path: download_directory + options.filename
      });
      try {
        await new_item.save();
        console.log("updated playlist");
      } catch (err) {
        console.log(err);
        console.log("error updating playlist");
      }
    });
  });

  res.status(200).json({
    status: "200",
    message: "Playlist Will Be Updated Soon!!"
  });
});

module.exports = router;
