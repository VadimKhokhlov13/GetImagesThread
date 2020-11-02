let threadLinkInput = document.getElementById('threadLink');
let submitLinkButton = document.getElementById('submitLink');

submitLinkButton.addEventListener('click', async function() {
    // let threadLink = threadLinkInput.value;
    let threadLink = 'https://2ch.hk/gg/res/871611.html';
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

async function getImagesLinks(threadLink) {
    let response = await fetch('/links', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({threadLink})
    });
    let imgLinks = await response.text();
    let imgData = await getImageData(imgLinks[0]);
    return imgData;
}

async function getImageData(imgLink) {
    let response = await fetch('/img', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: imgLink
    });
    let imgData = await response.text();
    return imgData;
}

