import { Level } from "../level.js";
import { Player } from "../objects/player-class.js";
import { Rectangle } from "../objects/rectangle.js";
import { Box } from "../objects/box.js";

export const levelOne = new Level({
    size: [1200,1000],
    objects: [new Player({
        pos: [50,540],
        size: [23,43],
        color:'#354f52'
     }),
    
    
    new Rectangle({
            pos: [0, 430 ],
            size: [50, 70],
            color: "#354f52"
    }),
    
    new Rectangle({
            pos: [450, 900 ],
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
            pos: [550, 1000],
            size: [50, 50],
            color: "#f7b94f"
    })]
})