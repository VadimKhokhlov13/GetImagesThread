let threadLinkInput = document.getElementById('threadLink');
let submitLinkButton = document.getElementById('submitLink');
let imagesContainer = document.getElementById('imagesContainer');

submitLinkButton.addEventListener('click', async function() {
    // let threadLink = threadLinkInput.value;
    let threadLink = 'https://2ch.hk/au/res/5437304.html';
    getImagesLinks(threadLink).then(response => {
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
    for (let i = 0; i < imgLinks.length; i++) {
        await getImageData(imgLinks[i]);   
    }
    return true;
}

function getImageData(imgLink) {
    return new Promise(async function(resolve) {
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
