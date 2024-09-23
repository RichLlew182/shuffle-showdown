import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

const token = 'BQAlb3t5u-K2ixua1Q-JSbCQ-74aNMAynFu0Qjlzd0-Vslt-Pcq8i5V950pxg-gth3sGZur1J85eCXPP95KCh_IH_GZsxJBmE5ip1DcJ991-ay2T2A0';

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

app.post('/search-artist', (req, res) => {


    try {
        const artistName = req.body.artistName;
        res.render('index.ejs', {artistName : JSON.stringify(artistName)})
        
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(error.message);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})