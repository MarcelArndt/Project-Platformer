import { Level } from "../level.js";
import { Background } from "../background-class.js";
import { Rectangle } from "../objects/rectangle-class.js";
import { Box } from "../objects/box-class.js";
import { Coin} from "../objects/coin-class.js";
import { Character} from "../objects/main-character-class.js";
import { Goal } from "../objects/goal-class.js";
import { Skelett } from "../objects/skelett-class.js";
import { Tileset } from "../tileset.js";


const tileSize = 36;
const levelSizeInTiles = 130;
const tileset = new Tileset({
    src: "./assets/oak_woods_tileset-36x36.png",
    size: tileSize,
});
const background = new Background({});

let TilesArrayData = [];
let TilesetArray = [];

const collisonBlocks = [];
const lvl2DCollison = [];
let collisionArray = [];


async function loadJson(){
    let response = fetch("./scripts/levels/level_one.json")
    response  = await (await response).json()
    collisionArray = await response.layers[1].data
    TilesArrayData =  await response.layers[0].data
}


async function init(){
    await loadJson();
    generateCollision();
    generateTiles();
}


function generateCollision(){
for (let i=0; i < collisionArray.length; i += levelSizeInTiles){
    lvl2DCollison.push(collisionArray.slice(i, i + levelSizeInTiles))
    lvl2DCollison.forEach((row, x) => {
        row.forEach(((tile, y) => {
            switch (tile) {
                case 316: 
                    collisonBlocks.push(new Rectangle({
                        pos: [y * tileSize , x * tileSize],
                        size: [tileSize + 0.5 ,tileSize + 0.5],
                        color:'#354f52',
                        type: "Rectangle"
                    }));  break;
                }
            })); 
        });
    }
}



function generateTiles(){
    for (let i=0; i < TilesArrayData.length; i += levelSizeInTiles){
        TilesetArray.push(TilesArrayData.slice(i, i + levelSizeInTiles))
        TilesetArray.forEach((row, y) => {
            row.forEach(((tile, x) => {
                if(tile != 0){
                    tileset.createTile(x, y, tile);
                }
            })); 
        });
    }
}

init();


export const levelOne = new Level({
    size: [levelSizeInTiles * tileSize ,1260],
    background: background,
    objects: [  

        new Character({
        pos: [250,900],
        size: [36,67],
        color:'edff2b',
        type: "Player"
        }),

        new Skelett ({
            pos: [2850, 900],
            size: [44,100],
            color:'#000'
            }), 
    ],
    tileset: tileset,
    collisionTiles: collisonBlocks,
})
