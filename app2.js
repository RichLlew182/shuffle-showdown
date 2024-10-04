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

        res.render('quiz.ejs',);

    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.message);

    }

})

const authURL = 'https://accounts.spotify.com/authorize?';
const redirect_uri = process.env.REDIRECT_URI

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

        res.redirect('/questions')

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
    // console.log({ data });

    return data
}


app.get('/questions', async (req, res) => {

    try {

        const userInfo = await getData('/me');

        let likedSongsLength = await getData(`/me/tracks?limit=1`);

        likedSongsLength = likedSongsLength.total;

        console.log({ likedSongsLength })

        // Take length of liked songs then divide by 5 to get the maximum offset value, meaning songs are always received

        let offsetMax = Math.floor(likedSongsLength / 5);

        // Create random number then times by the max offset value to get a random block of 5 arists

        let offset = Math.floor(Math.random() * offsetMax)

        console.log({ offset })

        // call getData function to retrieve a block of 5 tracks using the random offset value

        const likedSongs = await getData(`/me/tracks?limit=10&offset=${offset}`);

        console.log(likedSongs.items)

        // Generate random number between 1 and 5 to be used to pick 1 of the 5 artists we receive

        const randomInt = Math.floor(Math.random() * 5);

        console.log({ randomInt })

        // Choose artist/track using the random int

        const artist = likedSongs.items[randomInt].track.artists[0].name;

        console.log({ artist })

        // store artist ID and preview of the track

        const artistID = likedSongs.items[randomInt].track.artists[0]?.id;
        const preview = likedSongs.items[randomInt].track.preview_url;

        // retrieve related artists using the artist ID, these will be used as the incorrect answers

        const relatedArtists = await getData(`/artists/${artistID}/related-artists`);

        // create array 

        const artistArray = [{ name: artist, answer: 'correct' }];

        for (let i = 0; i < 3; i++) {
            artistArray.push({ name: relatedArtists.artists[i].name, answer: 'incorrect' });
        }

        console.log({ artistArray })

        //* Shuffle Answers Array

        const shuffledArray = artistArray.sort(() => Math.random() - 0.5);

        // console.log({ artistID });

        // console.log(relatedArtists.artists)

        // console.log(likedSongs.items[0].track)

        res.render('questions.ejs', { userInfo: userInfo, preview: preview, answers: shuffledArray })



    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.message);
    }

})


app.listen(port, () => {
    console.log(`Your app is listening on http://localhost:${port}`)
})
