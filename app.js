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
    
        console.log(result.data)
    
        res.render('index.ejs', { hello: 'Hello World!' });
        
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving data from Spotify.');
        
    }
    
   
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})