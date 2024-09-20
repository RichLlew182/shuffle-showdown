import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.render('index.ejs', { hello: 'Hello World!' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})