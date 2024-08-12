import { Rectangle } from "./rectangle-class.js";
export class DeadlySolidBlock extends Rectangle{
    constructor(options, type){
        const {pos, size, color} = options
        super(
          {pos, size, color}, type || "Box"
        );
        this.type = type || "Rectangle";
        this.subType = "deadlySolidBlock";
    }
    
     /**
     * will actived by collision and will kill any Entity
     */
    activateTrap(obj){
      if (obj.subType == "Bird"){
        obj.despawn()
      } else {
        obj.health = 0;
      }
    }
}