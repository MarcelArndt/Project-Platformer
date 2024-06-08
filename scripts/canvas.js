export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

export function clearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
ctx.scale(1.45, 1.45);