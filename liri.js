require("dotenv").config();

// Requires
var keys = require("./keys.js");
var request = require("request");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var fs= require("fs");

// Grab the API keys from the API's
var spotify = new Spotify(keys.spotify);
var bandInTown = keys.bit.id;
var ombd = keys.omdb.id;

// function to play song
function spotifySong(song)
{
    spotify.search({ type: 'track', query: song}, function(error, data){
      if(!error){
        for(var i = 0; i < data.tracks.items.length; i++){
          var songData = data.tracks.items[i];
          //artist
          console.log("Artist: " + songData.artists[0].name);
          //song name
          console.log("Song: " + songData.name);
          //spotify preview link
          console.log("Preview URL: " + songData.preview_url);
          //album name
          console.log("Album: " + songData.album.name);
          console.log("-----------------------");
          
          //adds text to log.txt
          fs.appendFile('log.txt', songData.artists[0].name);
          fs.appendFile('log.txt', songData.name);
          fs.appendFile('log.txt', songData.preview_url);
          fs.appendFile('log.txt', songData.album.name);
          fs.appendFile('log.txt', "-----------------------");
        }
      } else{
        console.log('Error occurred.');
      }
    });
  }
  