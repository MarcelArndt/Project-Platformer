import { Level } from "../level.js";
import { Rectangle } from "../objects/rectangle-class.js";
import { Box } from "../objects/box-class.js";
import { Enemy } from "../objects/enemy-class.js";
import { Coin } from "../objects/coin-class.js";
import { Character } from "../objects/main-character-class.js";
import { Goal } from "../objects/goal-class.js";
import { Skelett } from "../objects/skelett-class.js";

export const levelTwo = new Level({
  size: [2900, 1300],
  objects: [
    new Character({
      pos: [50, 1000],
      size: [36, 67],
      color: "edff2b",
      type: "Player",
    }),

    new Skelett({
      pos: [1945, 950],
      size: [44, 100],
      color: "#000",
    }),

    new Rectangle({
      pos: [0, 1125],
      size: [960, 225],
      color: "#354f52",
    }),

    new Rectangle({
      pos: [650, 885],
      size: [150, 32],
      color: "#354f52",
    }),

    new Rectangle({
      pos: [560, 0],
      size: [160, 1045],
      color: "#354f52",
    }),

    new Rectangle({
      pos: [1300, 0],
      size: [80, 800],
      color: "#354f52",
    }),

    new Rectangle({
      pos: [1380, 0],
      size: [500, 732],
      color: "#354f52",
    }),

    new Rectangle({
      pos: [1800, 0],
      size: [80, 980],
      color: "#354f52",
    }),

    new Rectangle({
      pos: [1736, 884],
      size: [64, 16],
      color: "#354f52",
    }),

    new Rectangle({
      pos: [1300, 900],
      size: [560, 80],
      color: "#354f52",
    }),

    new Rectangle({
      pos: [1348, 1145],
      size: [525, 1045],
      color: "#354f52",
    }),

    new Rectangle({
      pos: [1675, 1100],
      size: [208, 180],
      color: "#354f52",
    }),

    new Rectangle({
      pos: [1848, 1245],
      size: [600, 1045],
      color: "#354f52",
    }),

    new Rectangle({
      pos: [2375, 1150],
      size: [208, 400],
      color: "#354f52",
    }),

    new Rectangle({
      pos: [2475, 1250],
      size: [508, 400],
      color: "#354f52",
    }),

    new Coin({
      pos: [1415, 845],
      size: [24, 24],
      color: "#FFD53D",
    }),

    new Coin({
      pos: [1367, 845],
      size: [24, 24],
      color: "#FFD53D",
    }),

    new Coin({
      pos: [1319, 845],
      size: [24, 24],
      color: "#FFD53D",
    }),

    new Coin({
      pos: [1271, 845],
      size: [24, 24],
      color: "#FFD53D",
    }),

    new Box({
      pos: [1670, 700],
      size: [64, 64],
      color: "#f7b94f",
    }),

    new Rectangle({
      pos: [915, 975],
      size: [260, 450],
      color: "#354f52",
    }),

    new Box({
      pos: [500, 900],
      size: [64, 64],
      color: "#f7b94f",
    }),
    new Coin({
      pos: [745, 835],
      size: [24, 24],
      color: "#FFD53D",
    }),

    new Goal({
      pos: [2876, 975],
      size: [24, 600],
      color: "#9cb6b7",
    }),
  ],
});
