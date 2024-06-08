

let imageIsToLoading = {
    character: "./assets/character-animation-atlas.png",
    bluejayBird: "./assets/bird_1_bluejay.png",
    whiteBird:  "./assets/bird_2_white.png",
    robinBird:  "./assets/bird_3_robin.png",
    skeleton: "./assets/skelet-animation-atlas.png",
    tileset: "./assets/oak_woods_tileset-36x36_acd_tx_village_props.png",
    backgroundOne : "./assets/background/background_layer_1.png",
    backgroundTwo : "./assets/background/background_layer_2.png",
    backgroundThree : "./assets/background/background_layer_3.png",
}


let loadingNewImage = (receivingImgPath) => {
    return new Promise(((resolve, reject) => {
        let newImg = new Image();
        newImg.src = receivingImgPath;
        newImg.onload = () => {
            resolve(newImg);
        }
        newImg.onerror = (e) => {
            reject(e);
        }
    }));
}

/**
 *  Key = Key of imageIsToLoading
 *  Value = current Image
 */
export let imageIsloadet = {


}

// Object.keys(imageIsToLoading)[i] == Name from Key
// imageIsToLoading[Object.keys(imageIsToLoading)[i]] => zurgriff auf die Keys
export async function loadAllImages(){
    for (let i = 0; i < Object.keys(imageIsToLoading).length; i++){
        let imagePath = imageIsToLoading[Object.keys(imageIsToLoading)[i]]
        try {
            let currentImage = await loadingNewImage(imagePath);
            imageIsloadet[Object.keys(imageIsToLoading)[i]] = currentImage;
        } catch (e){
            console.error(e);
        }
    }
}