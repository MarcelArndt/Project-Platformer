import { Level } from "../level.js";
import { Rectangle } from "../objects/rectangle-class.js";
import { Character } from "../objects/main-character-class.js";

let tileSize = 0;
let levelSizeInTiles = 0;
let levelHeighInTiles = 0;

let entityArrayData = [];
let entityArray = [];
let entityArrayForObjects = [];

let tilesArrayData = [];

const collisonBlocks = [];
const lvl2DCollison = [];
let collisionArray = [];

async function loadJson() {
  let response = await fetch("./scripts/levels/level_one.json");
  response = await response.json();
  entityArrayData = await response.layers[0].data;
  collisionArray = await response.layers[1].data;
  tilesArrayData = await response.layers[2].data;
  levelSizeInTiles = await response.width;
  levelHeighInTiles = await response.height;
  tileSize = await response.tileheight;
}

async function init() {
  await loadJson();
  generateCollision();
}

function generateCollision() {
  for (let i = 0; i < collisionArray.length; i += levelSizeInTiles) {
    lvl2DCollison.push(collisionArray.slice(i, i + levelSizeInTiles));
  }
  lvl2DCollison.forEach((row, x) => {
    row.forEach((tile, y) => {
      switch (tile) {
        case 0: break;
        default: collisonBlocks.push(  new Rectangle({ pos: [y * tileSize, x * tileSize], size: [tileSize + 0.5, tileSize + 0.5], color: "rgba(255,255,255,0.0)", type: "Rectangle",})); break;
      }
    });
  });
}

await init();

export const levelOne = new Level({
  size: [levelSizeInTiles * tileSize, levelHeighInTiles * tileSize],
  collisionTiles: collisionArray,
  entityArrayData: entityArrayData,
  levelSizeInTiles: levelSizeInTiles,
  tilesArrayData: tilesArrayData,
  tileSize: tileSize,
  objectofType: {
    Rectangle: [],
    Box: [],
    Player: [],
    Goal: [],
    Entity: [],
    Enemy: [],
  }
});
