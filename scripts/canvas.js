export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
export const canvasScalingFactor = 1.8;


/**
* to clean the Canvas and prevent ghosting/schlieren. 
*/
export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

  /**
  * to keep the "Pixel-Style" by upscaling the graphic"
  */
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
ctx.scale(canvasScalingFactor, canvasScalingFactor);
