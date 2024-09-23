import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;



const token = 'BQCjgQvJFUUagd3qI5WS5bAGxwsSuVV8l5BrPOLPZ_hDBRBcyVJUCN0P-p-YXimt4iSaEjIcWUKNjf4JXMBHtHbnxJaOXCWIuFcR7WXSfcQKonYrtdg';

const searchURL = 'https://api.spotify.com/v1/search';

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get('/', async (req, res) => {

    // try {

    //     const result = await axios(apiURL, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         }
    //     }, );
    
    //     // console.log(result.data.categories.items);
        
    //     console.log(result.data.categories.items[0].icons);

    //     const categories = result.data.categories.items;
    //     var array = [];

    //     categories.forEach(category => {
    //         array.push({ name: category.name });
    //         category.icons.forEach(icon => {
    //             array.push({
    //                 height: icon.height,
    //                     url: icon.url,
    //                 width: icon.width,

    //             })
    //         })
            
    //     });

    //     console.log(array)
        res.render('index.ejs',);
        
    // } catch (error) {
    //     console.error(error.response ? error.response.data : error.message);
    //     res.status(500).send('Error retrieving data from Spotify.');
        
    // }
    
})

app.post('/search-artist', async (req, res) => {

    const artistName = req.body.artistName;
    // console.log(artistName)

    try {

        const firstResult = await axios.get(searchURL, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: artistName,
                type: "artist",
                limit: '1'
            }
        },)

        const artistInfo = firstResult.data.artists.items[0];

        const artistImage = firstResult.data.artists.items[0].images[0].url;

        const artistId = firstResult.data.artists.items[0].id;

        const secondResult = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        },)

         console.log(secondResult.data);

        const topTracks = secondResult.data.tracks;

         console.log(topTracks)

        const limit = 5;

        const topTrackInfo = topTracks.slice(0, limit).map(track => ({ name: track.name, duration_ms: track.duration_ms, url: track.external_urls.spotify, image: track.album.images[0]?.url   }))

       console.log(topTrackInfo)

        res.render('index.ejs', { artistInfo: artistInfo, image: artistImage, topTracks: topTrackInfo })
        
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.message);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})