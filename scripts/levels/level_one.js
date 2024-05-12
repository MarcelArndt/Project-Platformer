import { Level } from "../level.js";
import { Player } from "../objects/player-class.js";
import { Rectangle } from "../objects/rectangle.js";
import { Box } from "../objects/box-class.js";
import { Enemy } from "../objects/enemy-class.js";
import { Coin} from "../objects/coin-class.js";

export const levelOne = new Level({
    size: [1200,1000],
    objects: [new Player({
        pos: [50,940],
        size: [23,43],
        color:'#354f52'
     }),

     new Enemy({
        pos: [450,900],
        size: [23,43],
        color:'#C90202'
     }),
    
    new Rectangle({
            pos: [360, 940 ],
            size: [50, 70],
            color: "#354f52"
    }),
    
    new Rectangle({
            pos: [475, 900 ],
            size: [50, 20],
            color: "#354f52"
    }),
    
    
    new Rectangle({
            pos: [650, 900],
            size: [250, 20],
            color: "#354f52"
    }),
    
    new Rectangle({
            pos: [850, 825],
            size: [100, 20],
            color: "#354f52"
    }),
    
    new Rectangle({
            pos: [950, 775],
            size: [100, 20],
            color: "#354f52"
    }),
    
    new Rectangle({
            pos: [750, 690],
            size: [100, 20],
            color: "#354f52"
    }),
    
    new Box({
            pos: [480, 800],
            size: [40, 40],
            color: "#f7b94f"
    }),
    new Coin({
        pos: [980, 950],
        size: [24, 24],
        color: "#FFD53D"
    }),    
    new Coin({
        pos: [180, 950],
        size: [24, 24],
        color: "#FFD53D"
    }),

        ]
})