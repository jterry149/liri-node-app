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

// variable to store arguments to log
var stored =[];

// This function displays the concerts using the Bands in Town API
function concertThis(artist,call) 
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
                if(data[i] != undefined) 
                {
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
                if(data[i] === undefined && i===0) 
                {
                    console.log("\nSorry we don't see any concerts. Try entering another place. :(")
                    stored.push("Sorry we don't see any concerts. :(");
                }
            }
        }
        call();
    });
    
}

// function to search the spotify API
function spotifyThisSong(song, call)
{
    // Default a song if no song chosen
    if(song == undefined)
        song="\"The+Sign\"%20NOT%20times";
    
    else
        // search exact song
        song = "\""+song+"\"";   
    
        spotify.search({ type: 'track', query: song }, function(err, data) 
        {
            if (err) 
            {
              return console.log('Error occurred: ' + err);
            }
            console.log("\nArtist(s):");
            for(let i=0; i <data.tracks.items[0].artists.length;i++) 
            {
                console.log(data.tracks.items[0].artists[i].name);
                stored.push(data.tracks.items[0].artists[i].name);
            }
            console.log("\nSong Name:")
            console.log(data.tracks.items[0].name+"\n");
            console.log("Preview Link:")
            console.log(data.tracks.items[0].preview_url+"\n");
            console.log("Song Album:")
            console.log(data.tracks.items[0].album.name);
            stored.push(...[data.tracks.items[0].name,data.tracks.items[0].preview_url,data.tracks.items[0].album.name]);
            call();
        });
    }

function movieThis(title, call)
{
    // If statement if no title is defined show this movie title
    if (!title)
    {
        title = "Mr. Nobody";
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");

    }
    // A variable to call the movie API
    var omdbURL = "http://www.omdbapi.com/?t="+"\""+ title +"\"" + "&y=&plot=short&type=movie&tomatoes=true&apikey=" + omdb;
  
    request(omdbURL, function (error, response, body){
        if(!error && response.statusCode == 200)
        {
            var parse = JSON.parse(body);

            // Displays movie information
            console.log("\nMovie Title: "+ parse.Title);
            console.log("\nYear Released: "+ parse.Year);
            console.log("\nIMDB Rating: "+ parse.Ratings[0].Value);
            console.log("\nRotten Tomatoes Rating: "+parse.Ratings[1].Value);
            console.log("\nCountry Produced: "+parse.Country );
            console.log("\nMovie Language(s): "+parse.Language);
            console.log("\nMovie plot: "+parse.Plot);
            console.log("\nMovie Actors: "+parse.Actors);
        }
            //adds text to log.txt
            stored.push(...[parse.Title,parse.Year,parse.Ratings[0].Value,parse.Ratings[1].Value,parse.Country,parse.Language,parse.Plot,parse.Actors]);
        call();
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
        console.log('\ncommand has been stored into the file.')

    });
}

// Function to handle the user commands
function selectCommand(command,nodeArg) 
{
    // grab function name
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
            console.log("Invalid command. Please try again. Commands are: concert-this, movie-this, spotify-this-song, and do-what-it-says.");
        break;
    }  
}

//Stored User argument's array
var command = process.argv[2];
var nodeArg = process.argv[3];

// A function call 
selectCommand(command,nodeArg);
  