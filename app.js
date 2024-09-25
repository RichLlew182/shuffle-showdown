import express, { response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import querystring from 'querystring';

dotenv.config()

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

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
const redirect_uri = 'https://spotify-project-w77q.onrender.com/callback'

const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-library-read'
].join(' ');

app.get('/authorize', async (req, res) => {

    res.redirect(authURL + querystring.stringify({
        response_type: "code",
        client_id: clientID,
        scope: scopes,
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

        token = tokenResponse.data.access_token;

        res.redirect('/dashboard')

    }

    catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.message);

    }

})

const spotifyAPI = 'https://api.spotify.com/v1';

async function getData(endpoint) {

    const response = await axios.get(spotifyAPI + endpoint, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = response.data;
    console.log(data);

    return data
}

app.get('/dashboard', async (req, res) => {

    try {

        const userInfo = await getData('/me');
        const topTracks = await getData('/me/top/tracks?time_range=long_term&limit=10')

        const topTracksData = topTracks.items.map(track => ({ artist: track.artists[0].name, name: track.name, duration_ms: track.duration_ms, url: track.external_urls.spotify, image: track.album.images[0]?.url }))

        res.render('dashboard.ejs', { user: userInfo, tracks: topTracksData })

    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.message);
    }

})

app.listen(port, () => {
    console.log(`Your app is listening on http://localhost:${port}`)
})