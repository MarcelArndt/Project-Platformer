import {soundIsloadet, imageIsloadet} from "../assets.js";
import { Level } from "../level.js";
import { Tileset } from "../tileset.js";

let ambientMusic = soundIsloadet.forestAmbient;
let levelMusic = soundIsloadet.musicPixelDayDream;
let tileSetImage = imageIsloadet.tileset;

let tileset = null
let tileSize = 0;
let levelSizeInTiles = 0;
let levelHeighInTiles = 0;
let entityArrayData = [];
let tilesArrayData = [];
let collisionArray = [];

async function loadJson() {
  let response = await fetch("./scripts/levels/level_one.json");
  response = await response.json();
  entityArrayData = await response.layers[2].data;
  collisionArray = await response.layers[1].data;
  tilesArrayData = await response.layers[0].data;
  levelSizeInTiles = await response.width;
  levelHeighInTiles = await response.height;
  tileSize = await response.tileheight;
}

function generateTileset(){
  tileset = new Tileset({
    image: tileSetImage,
    size: tileSize,
    levelSizeInTiles: levelSizeInTiles,
    entityArrayData: entityArrayData,
    tilesArrayData: tilesArrayData,
    collisionArray: collisionArray,
  });
}

async function init() {
  await loadJson();
  generateTileset();
}

await init();

export const levelOne = new Level({
  size: [levelSizeInTiles * tileSize, levelHeighInTiles * tileSize],
  tileset: tileset,
  collisionTiles: collisionArray,
  entityArrayData: entityArrayData,
  levelSizeInTiles: levelSizeInTiles,
  tilesArrayData: tilesArrayData,
  tileSize: tileSize,
  currentLevelMusic: levelMusic,
  currentAmbient: ambientMusic,
  objectofType: {
    Rectangle: [],
    Box: [],
    Player: [],
    Goal: [],
    Entity: [],
    Enemy: [],
  }
});
