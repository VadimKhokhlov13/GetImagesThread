const express = require('express');
const { getImagesLinks, getImageData } = require('./parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(express.static(__dirname + '/public/'));
app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/links', async (req, res) => {
    let threadLink = req.body.threadLink;
    let imgLinks = await getImagesLinks(threadLink);
    res.send(JSON.stringify(imgLinks));
});

app.post('/img', async (req, res) => {
    let imgLink = req.body.imgLink;
    let imgData = await getImageData(imgLink);
    res.send(imgData);
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});