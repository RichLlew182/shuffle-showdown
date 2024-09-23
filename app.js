import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

const token = 'BQB7A5ph5qOYadEVyWbdrBLrJBXvl0nADeGvzM-8GA1Lw9qkFlI8vEYlJy3_GA1Aqy5dqbIMZWaZz7gMSSdAbYTEFYFhxZyibxEW_B0k0TgomTm-s9o';

const searchURL = 'https://api.spotify.com/v1/search';

app.use(express.urlencoded({ extended: true }));

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

        // console.log(secondResult.data);

        const topTracks = secondResult.data.tracks;

        // console.log(topTracks)

        const songNames = topTracks.map(track => track.name)

       console.log(songNames)

        res.render('index.ejs', { artistInfo: artistInfo, image: artistImage, topTracks: songNames })
        
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.message);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})