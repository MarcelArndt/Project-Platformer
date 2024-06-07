import { Level } from "../level.js";
import { Background } from "../background-class.js";
import { Rectangle } from "../objects/rectangle-class.js";
import { Box } from "../objects/box-class.js";
import { Coin} from "../objects/coin-class.js";
import { Character} from "../objects/main-character-class.js";
import { Goal } from "../objects/goal-class.js";
import { Skelett } from "../objects/skelett-class.js";
import { Tileset } from "../tileset.js";
import { Bird } from "../objects/bird-class.js";

let initIsLoadet = false;
const tileSize = 36;
const levelSizeInTiles = 130;
const levelHeighInTiles = 35;

let newTilesetImage = new Image();
    newTilesetImage.src = "./assets/oak_woods_tileset-36x36_acd_tx_village_props.png";

const tileset = new Tileset({
    image: newTilesetImage,
    size: tileSize,
    });


const background = new Background({});

let entityArrayData = [];
let entityArray = [];
let entityArrayForObjects = []

let tilesArrayData = [];
let tilesetArray = [];

const collisonBlocks = [];
const lvl2DCollison = [];
let collisionArray = [];



async function loadJson(){
    let response = await fetch("./scripts/levels/level_one.json")
    response  = await response.json()
    entityArrayData = await response.layers[0].data
    collisionArray = await response.layers[1].data
    tilesArrayData =  await response.layers[2].data
}


async function init(){
        await loadJson();
        generateCollision();
        generateTiles();
        generateEntity();
}


function generateCollision(){
for (let i=0; i < collisionArray.length; i += levelSizeInTiles){
    lvl2DCollison.push(collisionArray.slice(i, i + levelSizeInTiles))
    }
    lvl2DCollison.forEach((row, x) => {
        row.forEach(((tile, y) => {
            switch (tile) {
                case 0: break;
                default:  collisonBlocks.push(new Rectangle({
                          pos: [y * tileSize , x * tileSize],
                          size: [tileSize + 0.5 ,tileSize + 0.5],
                          color:'rgba(255,255,255,0.0)',
                          type: "Rectangle"
                    }));  break;
                }
            })); 
        });
}



function generateTiles(){
    for (let i=0; i < tilesArrayData.length; i += levelSizeInTiles){
        tilesetArray.push(tilesArrayData.slice(i, i + levelSizeInTiles))
    }
    tilesetArray.forEach((row, y) => {
        row.forEach(((tileNumber, x) => {
            
            switch (tileNumber) {
                case 0:  break;
                default: tileset.createTile(x, y, tileNumber); break;
            }
        })); 
    });
}

function generateEntity(){
    for (let i=0; i < entityArrayData.length; i += levelSizeInTiles){
        entityArray.push(entityArrayData.slice(i, i + levelSizeInTiles))
    }
    entityArray.forEach((row, y) => {
        row.forEach(((tileNumber, x) => {
            switch (tileNumber) {
                case 0: break;
                case 635: entityArrayForObjects.push(new Character({pos: [x * tileSize , y * tileSize],size: [36,67],color:'edff2b',type: "Player"})); break;
                case 636: entityArrayForObjects.push(new Coin({pos: [x * tileSize , y * tileSize], size: [24, 24], color: "#FFD53D" })); break;
                case 637: entityArrayForObjects.push(new Skelett({pos: [x * tileSize , y * tileSize], size: [44, 100], color: "#FFD53D" })); break;
                case 639: entityArrayForObjects.push(new Bird({pos: [x * tileSize , y * tileSize], size: [32, 32],})); break;
                case 640:entityArrayForObjects.push(new Box({pos: [x * tileSize , y * tileSize], size: [36, 36], color:"brown"})); break;
            }
        })); 
    });
}



init();


export const levelOne = new Level({
    size: [levelSizeInTiles * tileSize , levelHeighInTiles * tileSize],
    background: background,
    objects: entityArrayForObjects,
    tileset: tileset,
    collisionTiles: collisonBlocks,
});
