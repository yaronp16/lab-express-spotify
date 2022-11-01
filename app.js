require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require ('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res) => {
    res.render("index", {  
    })
})
app.get("/artist-search", async (req, res) => {
    try {   
        const artist = req.query.artist
        const artistResult = await spotifyApi.searchArtists(artist)
        res.render("artist-search-results", {data: artistResult.body.artists.items})
    }  catch (err) {

    }
})

app.get('/albums/:artistId', async (req, res) => {
    try {   
        const artistId = req.params.artistId
        const artistIdResult = await spotifyApi.getArtistAlbums(artistId)
        //console.log(artistIdResult.body.items)
        res.render('albums', artistIdResult.body)
    }  catch (err) {

    }
})

app.get('/tracks/:id', async (req, res) => {
    const {id} = req.params
    try {   
        const tracks = await spotifyApi.getAlbumTracks(id)
        const directtracks = tracks.body.items
        console.log(directtracks)
        
        res.render('tracks', {directtracks})
    }  catch (err) {

    }
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
