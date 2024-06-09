export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
export const canvasScalingFactor = 1.45;

export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
ctx.scale(canvasScalingFactor, canvasScalingFactor);
