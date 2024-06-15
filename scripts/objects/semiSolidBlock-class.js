import { Rectangle } from "./rectangle-class.js";
export class SemiSolidBlock extends Rectangle{
    constructor(options, type){
        const {pos, size, color} = options
        super(
          {pos, size, color}, type || "Box"
        );
        this.type = type || "Rectangle";
        this.subType = "SemiSolidBlock";
    }
    
    update(deltaTime){
        super.update(deltaTime);
    }
}