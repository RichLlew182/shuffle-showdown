import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

const token = 'BQC0mNHLRIKCPSmb0IJon3xBgjs7lV9rRSgBdZ-scOY1hWuy-UhueyCwBxadfRiGUmTzWGnQ5gRPKs6XOb-KZG0it96hMojSdsv8gMtc2WSe52ebLIw';

const apiURL = 'https://api.spotify.com/v1/browse/categories'


app.get('/', async (req, res) => {

    try {

        const result = await axios(apiURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }, );
    
        // console.log(result.data.categories.items);

        const categories = result.data.categories.items;
        var array = []

        for (let i = 0; i < categories.length; i++) {
            array.push(categories[i].name);
        }

        console.log(array)
    
        res.render('index.ejs', { categories: array });
        
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving data from Spotify.');
        
    }
    
   
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})