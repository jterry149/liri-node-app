# Liri-Node-App

## Purpose

This is a CLI App that is a Language Interpretation and Recognition interface (LIRI) using Spotify, Bands in Town and OMDB API's. 

## Technologies Used

* Javascript
* Node

# Before You Begin

You will be required to install a few things in order for this CLI App to work.

## 1. NPM Modules Required
 
* [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)
* [Request](https://www.npmjs.com/package/request)
* [Moment](https://www.npmjs.com/package/moment)
* [DotEnv](https://www.npmjs.com/package/dotenv)

## 2. (.env) File Setup

You will need to setup and create an .env file with your api keys for Soptify, Bands in Town, and OMDB. The file should be setup using the following format.

```
SPOTIFY_ID=*Your key goes here*
SPOTIFY_SECRET=*Your key goes here*

OMDB_ID=*Your key goes here*

BANDSINTOWN_ID=*Your key goes here*
```