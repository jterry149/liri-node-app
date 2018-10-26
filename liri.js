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
var omdb = keys.omdb.id;

var stored =[];

// This function displays the concerts using the Bands in Town API
function concertThis(artist,callback) 
{

    // Varaible to call API 
    var bandsInTownURL = "https://rest.bandsintown.com/artists/"+ artist+"/events?app_id="+ bandInTown;
    
    // Variable for the date 
    var datetime;

    // Call the API
    request(bandsInTownURL, function(error, response, body) 
    {
        // If statement for a correct response
        if (!error && response.statusCode === 200) 
        {
            var data = JSON.parse(body);
        
            // loop through all concert venues
            for (var i = 0;i < body.length; i++) 
            {

                // Retrieve  data
                if(data[i] != undefined) {
                    console.log("\nVenue: "+data[i].venue.name);
                    if(data[i].venue.city != '')
                        console.log("\nCity: "+data[i].venue.city);
                    if(data[i].venue.region != '')
                        console.log("\nRegion: "+data[i].venue.region);
                    if(data[i].venue.country != '')
                        console.log("\nCountry: "+data[i].venue.country);
                    datetime = moment(data[i].datetime,"YYYY-MM-DDtHH:mm:ss").format("MM/DD/YYYY");
                    console.log("\nDate: "+ datetime+"\n");
                    stored.push(...[data[i].venue.name,data[i].venue.city,data[i].venue.region,data[i].venue.country,datetime]);
                }
                if(data[i] === undefined && i===0) {
                    console.log("\nSorry we don't see any concerts. :(")
                    stored.push("Sorry we don't see any concerts. :(");
                }
            }
        }
        callback();
    });
    
}

// function to play song
function spotifyThisSong(song, callback)
{
    // Default a song if no song chosen
    if(song == undefined)
        song="\"The+Sign\"%20NOT%20times";
    
    else
        // search exact song
        song= "\""+song+"\"";   
    
    spotify.search({ type: 'track', query: song}, function(error, data)
    {
      if(!error)
      {
        for(var i = 0; i < data.tracks.items.length; i++)
        {
          var songData = data.tracks.items[i];
          
          // artist
          console.log("Artist: " + songData.artists[0].name);
          // song name
          console.log("Song: " + songData.name);
          // spotify preview link
          console.log("Preview URL: " + songData.preview_url);
          // album name
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
    callback();
    });
}

function movieThis(title, callback)
{
    // If statement if no title is defined show this movie title
    if (!title)
    {
        title = "Mr. Nobody";
    }
    var omdbURL = "http://www.omdbapi.com/?t="+"\""+title+"\""+"&y=&plot=short&type=movie&tomatoes=true&apikey="+ omdb;
  
    request(omdbURL, function (error, response, body){
        if(!error && response.statusCode == 200)
        {
            var body = JSON.parse(body);

            // Displays movie information
            console.log("\nMovie Title: "+ body.Title);
            console.log("\nYear Released: "+ body.Year);
            console.log("\nIMDB Rating: "+ body.Ratings[0].Value);
            console.log("\nRotten Tomatoes Rating: "+body.Ratings[1].Value);
            console.log("\nCountry Produced: "+body.Country );
            console.log("\nMovie Language(s): "+body.Language);
            console.log("\nMovie plot: "+body.Plot);
            console.log("\nMovie Actors: "+body.Actors);
  
        //adds text to log.txt
            fs.appendFile('log.txt', "Title: " + body.Title);
            fs.appendFile('log.txt', "Year Released: " + body.Year);
            fs.appendFile('log.txt', "IMDB Rating: " + body.imdbRating);
            fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
            fs.appendFile('log.txt', "Country Produced: " + body.Country);
            fs.appendFile('log.txt', " Movie Language: " + body.Language);
            fs.appendFile('log.txt', "Movie Plot: " + body.Plot);
            fs.appendFile('log.txt', "Movie Actors: " + body.Actors);

        } 
        else
        {
            console.log('Error occurred.')
        }
        if(title === "Mr. Nobody")
        {
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
  
            //adds text to log.txt
            fs.appendFile('log.txt', "-----------------------");
            fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            fs.appendFile('log.txt', "It's on Netflix!");
        }
    callback();
    });
  
}

//This function reads the random.txt file and passes arguments
function doThing() 
{

    fs.readFile("random.txt","utf8",function(error,data)
    {
        if (error) 
        {
            return console.log(error);
        }

        //if no error lets split whats in the file and take it out
        var argv = data.split(",");

        // Call the function and pass arguments
        selectCommand(argv[0],argv[1]);
    });

}

//This function logs the data and command to a log.txt file
function storeInfo() 
{
    stored.push('');
    fs.appendFile("log.txt",stored,function (err) 
    {
        if (err) 
        {
            return console.log(error);
        }
        console.log('\ncommand has been stored.')

    });
}

// Function to handle the user commands
function selectCommand(command,nodeArg) 
{
    //grab function name
    stored.push(command)
    if(nodeArg)
        stored.push(nodeArg);
   
    // Switch statement to go through the cases for the searches and request from the user
    switch(command)
    {
        case "concert-this":
            concertThis(nodeArg,function()
            {
                storeInfo();
            });
            break;
        case "spotify-this-song":
            spotifyThisSong(nodeArg,function()
            {
                storeInfo();
            });
            break;
        case "movie-this":
            movieThis(nodeArg,function() 
            {
                storeInfo();
            });
            break;
        case "do-what-it-says":
            doThing();
            break;
        default:
            console.log("Invalid command. Please try again.");
        break;
    }  
}

//Stored User argument's array
var nodeArg = process.argv[2];
var command = process.argv[3];

// A function call 
selectCommand(command,nodeArg);
  