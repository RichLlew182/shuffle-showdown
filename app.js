import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import querystring from 'querystring'

dotenv.config()

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

const token = process.env.BEARER_TOKEN;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }
  
const codeVerifier = generateRandomString(64);

app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';
  
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: clientID,
        scope: scope,
        redirect_uri: 'http://localhost:3000/callback',
        state: state
      }));
});

app.get('/', async (req, res) => {

     try {
   
        res.render('index.ejs',);
        
     } catch (error) {
         console.error(error.response ? error.response.data : error.message);
         res.status(500).send('Error retrieving data from Spotify.');
        
     }
    
})

app.get('/callback', async (req, res) => {

    try {
  
       res.render('index.ejs',);
       
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving data from Spotify.');
       
    }
   
})

const searchURL = 'https://api.spotify.com/v1/search';

app.post('/search-artist', async (req, res) => {

    const artistName = req.body.artistName;
    // console.log(artistName)

    try {

        const searchArtist = await axios.get(searchURL, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: artistName,
                type: "artist",
                limit: '1'
            }
        },)

        const artistInfo = {
            name: searchArtist.data.artists.items[0].name,
            image: searchArtist.data.artists.items[0].images[0].url,
            id: searchArtist.data.artists.items[0].id,
            followers: searchArtist.data.artists.items[0].followers.total,
            popularity: searchArtist.data.artists.items[0].popularity
        }

        const searchTopTracks = await axios.get(`https://api.spotify.com/v1/artists/${artistInfo.id}/top-tracks`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        },)

        //  console.log(searchTopTracks.data);

        const topTracks = searchTopTracks.data.tracks;

        //  console.log(topTracks)

        const trackLimit = 5;

        const topTrackInfo = topTracks.slice(0, trackLimit).map(track => ({ name: track.name, duration_ms: track.duration_ms, url: track.external_urls.spotify, image: track.album.images[0]?.url   }))

        // console.log(topTrackInfo);

        const searchAppearsOn = await axios.get(`https://api.spotify.com/v1/artists/${artistInfo.id}/albums`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                limit: 5,

            }
        },)

        
        const albums = searchAppearsOn.data.items;
        const appearsOn = albums.map(album => ({ name: album.name, url: album.external_urls.spotify, image: album.images[0]?.url }));
        
        const searchRelatedArtists = await axios.get(`https://api.spotify.com/v1/artists/${artistInfo.id}/related-artists`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            
        },)
        
        const artistLimit = 10;

        const relatedArtistData = searchRelatedArtists.data.artists;

        const relatedArtists = relatedArtistData.slice(0, artistLimit).map(artist => ({ name: artist.name, url: artist.external_urls.spotify, image: artist.images[0]?.url }));

        res.render('result.ejs', { artistInfo: artistInfo, topTrackInfo: topTrackInfo, appearsOn: appearsOn, relatedArtists: relatedArtists })
        
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.message);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})