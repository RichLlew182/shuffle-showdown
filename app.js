import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

const token = process.env.BEARER_TOKEN

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

const searchURL = 'https://api.spotify.com/v1/search';

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

        //  console.log(secondResult.data);

        const topTracks = secondResult.data.tracks;

        //  console.log(topTracks)

        const limit = 5;

        const topTrackInfo = topTracks.slice(0, limit).map(track => ({ name: track.name, duration_ms: track.duration_ms, url: track.external_urls.spotify, image: track.album.images[0]?.url   }))

        // console.log(topTrackInfo);

        const thirdResult = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                limit: 5,

            }
        },)

        const albums = thirdResult.data.items;
        const appearsOn = albums.map(album => ({ name: album.name, url: album.external_urls.spotify, image: album.images[0]?.url }));
        
        const fourthResult = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            
        },)

        console.log(fourthResult.data.artists);

        const relatedArtistData = fourthResult.data.artists;

        const relatedArtists = relatedArtistData.map(artist => ({ name: artist.name, url: artist.external_urls.spotify, image: artist.images[0]?.url }));

        console.log(relatedArtists)

        res.render('result.ejs', { artistInfo: artistInfo, image: artistImage, topTracks: topTrackInfo, appearsOn: appearsOn, relatedArtists: relatedArtists })
        
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.message);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})