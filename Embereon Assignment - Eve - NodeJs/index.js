const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Including Routes
const playlistRoutes = require("./routes/handlePlaylist.js");

/*
  ------------------------------------------Configuring App---------------------------------------------------------------------
*/

const app = express();

//Allow Request Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Using Routes
app.use("/api/playlist", playlistRoutes);

/*
  ---------------------------------------------------------------------------------------------------------------
*/

// Including different models
const Playlist = require("./models/Playlist.js");

//DB Config
const db = require("./keys").mongoURI;
//Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

//Selecting and running app on port
const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there

// Runnig the server on port
const server = app.listen(port, () =>
  console.log(`Server up and running on port ${port} !`)
);
