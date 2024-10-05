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

        res.render('login.ejs',);

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

    return data
}

const generateQuizData = async () => {

    const userInfo = await getData('/me');

    let likedSongsLength = await getData(`/me/tracks?limit=1`);

    likedSongsLength = likedSongsLength.total;

    //Calculcate offset Max by dividing number of liked songs by 5

    let offsetMax = likedSongsLength -5

    // Generate random offset value by muliplying random number between 0 and 1 by offset max

    let offset = Math.floor(Math.random() * offsetMax);

    console.log({offset})

    // Fetch songs with this offset value

    const likedSongs = await getData(`/me/tracks?limit=5&offset=${offset}`);

    // generate number between 1 and 5

    const randomInt = Math.floor(Math.random() * 5);

    // Use random number to pick an artist randomly from the 5 retrieved artists, then store the ID and preview link

    const artist = likedSongs.items[randomInt].track.artists[0].name;
    const artistID = likedSongs.items[randomInt].track.artists[0]?.id;
    const preview = likedSongs.items[randomInt].track.preview_url;

    console.log({preview})

    // fetch related artists using artist ID

    let relatedArtists = await getData(`/artists/${artistID}/related-artists`);
    relatedArtists = relatedArtists.artists;

    // Shuffle this array so the related artists aren't so close to the original artist

    const shuffledArtists = relatedArtists.sort(() => Math.random() - 0.5);

    // Add original artist to array as the correct answer

    const artistArray = [{ name: artist, correct: 'true' }];

    // Add 3 related artists to the artist array

    for (let i = 0; i < 3; i++) {
        artistArray.push({ name: shuffledArtists[i].name, correct: 'false' });
    }

    // Shuffle the Artist array so the correct answer isn't always first

    const shuffledArray = artistArray.sort(() => Math.random() - 0.5);

    // return preview url and shuffled array

    return { preview, shuffledArray };
};

app.get('/questions', async (req, res) => {
    try {
        res.render('questions.ejs');
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.message);
    }
});

app.get('/questions/data', async (req, res) => {
    try {
        const { preview, shuffledArray } = await generateQuizData();
        res.json({ preview, answers: shuffledArray });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.message);
    }
});


app.listen(port, () => {
    console.log(`Your app is listening on http://localhost:${port}`)
})
