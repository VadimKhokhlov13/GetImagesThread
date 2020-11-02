const needle = require('needle');

async function getImagesLinks(threadLink) {
    if(validateLink(threadLink)) {
        let html = await getHtmlThread(threadLink);
        let links = parseHtml(html);
        console.log(links);
        // let data = await getImagesData(links);
        return links;
    } else {
        return 'Неправильная ссылка';
    }
}

function getImageData(imageLink) {
    return new Promise(function (resolve, reject) {
        needle.get(imageLink, async (err, res) => {
            if (err) throw err;
            resolve(res.body);
        });
    });
}

function validateLink(threadLink) {
    return true;
}

function getHtmlThread(threadLink) {
    return new Promise(function (resolve, reject) {
        needle.get(threadLink, async (err, res) => {
            if (err) throw err;

            // let base64 = Buffer.from(res.body).toString('base64');
            // resolve(base64);
        });
    });
}

function parseHtml(html) {
    let links = html.match(/\/gg\/src\/\d*\/\d*.jpg/g);
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

async function getImagesData(links) {
    let imagesFunc = getImagesFunction(links);
    let dataImg = await seqRunner(imagesFunc).then(function(data) {
        return data;
    })
    return dataImg;
}

// function getImageData(link, data = []) {
//     return new Promise(function(resolve, reject) {
//         needle(link, (err, res) => {
//             if (err) throw err;
//             let base64 = Buffer.from(res.body).toString('base64');
//             data.push(base64);
//             resolve(data);
//         })
//     })
// }

function getImagesFunction(links) {
    let deeds = [];
    links.forEach(function(link) {
        deeds.push({func: getImageData, param: link})
    });
    return deeds;
}

function seqRunner(deeds) {
    return deeds.reduce(function(p, deed) {
        return p.then(function(data) {
            return deed.func(deed.param, data);
        });
    }, Promise.resolve());
}

module.exports = { getImagesLinks }