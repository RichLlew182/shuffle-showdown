import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

const token = 'BQB7A5ph5qOYadEVyWbdrBLrJBXvl0nADeGvzM-8GA1Lw9qkFlI8vEYlJy3_GA1Aqy5dqbIMZWaZz7gMSSdAbYTEFYFhxZyibxEW_B0k0TgomTm-s9o';

const apiURL = 'https://api.spotify.com/v1/search';

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

        const result = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: artistName,
                type: "artist",
                limit: '1'
            }
        },)

        const artistInfo = result.data.artists.items[0];

        console.log(artistInfo)

        const artistImage = result.data.artists.items[0].images[0].url;


        const artistId = result.data.artists.items[0].id;

        console.log(artistId)


        res.render('index.ejs', { artistInfo: artistInfo, image: artistImage })
        
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.message);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})