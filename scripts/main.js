import {Rectangle} from "./objects/rectangle.js";
import {Box} from "./objects/box.js";
import {Player} from "./objects/player-class.js";
import {timer} from "./timer.js";
import {clearCanvas} from "./canvas.js";


const player = new Player({
    pos: [50,980],
    size: [23,43],
    color:'#354f52'
 });


const platfromOne = new Rectangle({
        pos: [300, 930 ],
        size: [50, 70],
        color: "#354f52"
})

const platfromTwo = new Rectangle({
        pos: [450, 900 ],
        size: [50, 20],
        color: "#354f52"
})


const platfromThree = new Rectangle({
        pos: [650, 900],
        size: [250, 20],
        color: "#354f52"
})

const platfromfour = new Rectangle({
        pos: [850, 825],
        size: [100, 20],
        color: "#354f52"
})

const platfromfive = new Rectangle({
        pos: [950, 775],
        size: [100, 20],
        color: "#354f52"
})

const platfromsix = new Rectangle({
        pos: [750, 690],
        size: [100, 20],
        color: "#354f52"
})

const BoxOne = new Box({
        pos: [550, 1000],
        size: [50, 50],
        color: "#f7b94f"
})



const levelObj = [player, platfromOne, platfromTwo, platfromThree, platfromfour, platfromfive, platfromsix, BoxOne];


timer.update = (deltaTime) => {
        clearCanvas();
        for(let i = 0; i < levelObj.length; i++){
            levelObj[i].update(deltaTime, levelObj);
            levelObj[i].draw();
        }
}

timer.start();

