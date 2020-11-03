const needle = require('needle');

async function getImagesLinks(threadLink) {
        let html = await getHtmlThread(threadLink);
        let imgLinks = parseHtml(html);
        return imgLinks;
}

function getHtmlThread(threadLink) {
    return new Promise(function (resolve) {
        needle.get(threadLink, (err, res) => {
            if (err) throw err;
            resolve(res.body);
        });
    });
}

function parseHtml(html) {
    let links = html.match(/\/au\/src\/\d*\/\d*.jpg/g);
    if (!links) {
        return 1;
    }
    links = links.map(l => 'https://2ch.hk' + l);
    links = links.reduce((arr, cur) => {
        if (!arr.includes(cur)) {
            arr.push(cur);
        }
        return arr;
    }, []);
    return links;
}

function getImageData(link) {
    return new Promise(function(resolve) {
        needle(link, (err, res) => {
            if (err) throw err;
            let base64 = Buffer.from(res.body).toString('base64');
            resolve(base64);
        })
    })
}

module.exports = { getImagesLinks, getImageData }