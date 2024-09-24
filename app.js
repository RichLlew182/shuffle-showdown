import express, { response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import  querystring from 'querystring';

dotenv.config()

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

// const token = process.env.BEARER_TOKEN;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.get('/', async (req, res) => {

     try {
   
        res.render('index.ejs',);
        
     } catch (error) {
         console.error(error.response ? error.response.data : error.message);
         res.status(500).send(error.message);
        
     }
    
})

const authURL = 'https://accounts.spotify.com/authorize?';
const redirect_uri = 'http://localhost:3000/callback'

app.get('/authorize', async  (req, res) => {

        res.redirect(authURL + querystring.stringify({
        response_type: "code",
        client_id: clientID,
        scope: "",
        redirect_uri: redirect_uri,
        }))
   
})

const tokenURL = 'https://accounts.spotify.com/api/token'

let token = ''

app.get('/callback', async (req, res) => {
    
    const code = req.query.code;

    var body = new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirect_uri,
    })

    try {
        const tokenResponse = await axios.post(tokenURL, body, {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(clientID + ':' + clientSecret).toString('base64'))
        }
    })
    
    // console.log(tokenResponse.data);

    token = tokenResponse.data.access_token;

    res.redirect('/profile')    

    }

    catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send(error.message);
   
}
   
})

const userProfileURL = 'https://api.spotify.com/v1/me'

app.get('/profile', async (req, res) => {
    
    try {

        const getUserProfile = await axios.get(userProfileURL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        const userProfileData = getUserProfile.data;
        console.log(userProfileData)
        res.render('profile.ejs', {userProfileData: userProfileData})
        
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
         res.status(500).send(error.message);
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

        console.log(albums[3].artists)

        const appearsOn = albums.map(album => ({ name: album.name, artists: album.artists[0].name,url: album.external_urls.spotify, image: album.images[0]?.url }));
        
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
    console.log(`Your app is listening on http://localhost:${port}`)
})