let threadLinkInput = document.getElementById('threadLink');
let submitLinkButton = document.getElementById('submitLink');
let imagesContainer = document.getElementById('imagesContainer');

submitLinkButton.addEventListener('click', async function() {
    // let threadLink = threadLinkInput.value;
    let threadLink = 'https://2ch.hk/au/res/5437304.html';
    getImagesLinks(threadLink).then(response => {
        // let bases64 = JSON.parse(response);
        // bases64.forEach(function(base64) {
        //     let image = new Image();
        //     image.src = 'data:image/png;base64,' + base64;
        //     document.body.appendChild(image);
        // })
        console.log(response);
    });
});

function addImage(base64) {
    let image = new Image();
    image.src = 'data:image/png;base64,' + base64;
    let imageBlock = document.createElement('div');
    imageBlock.className = "imageBlock";
    imageBlock.appendChild(image);
    imagesContainer.appendChild(imageBlock);
}

async function getImagesLinks(threadLink) {
    let response = await fetch('/links', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({threadLink})
    });
    let imgLinks = await response.text();
    imgLinks = JSON.parse(imgLinks);
    let imagesData = await getImagesData(imgLinks);
    return imagesData;
}

async function getImagesData(imgLinks) {
    let imagesFunc = getImagesFunction(imgLinks);
    let isReady = await seqRunner(imagesFunc).then(function(data) {
        return true;
    })
    return isReady;
}

function getImageData(imgLink) {
    return new Promise(async function(resolve, reject) {
        let response = await fetch('/img', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify({imgLink})
        });
        let imgData = await response.text();
        addImage(imgData);
        resolve();
    })
}

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
            return deed.func(deed.param);
        });
    }, Promise.resolve());
}

