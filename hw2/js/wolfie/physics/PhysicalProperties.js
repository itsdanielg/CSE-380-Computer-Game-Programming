'use strict'

class PhysicalProperties {
    constructor() { 
        this.velocityX = 0.0;
        this.velocityY = 0.0;
        this.accelerationX = 0.0;
        this.accelerationY = 0.0;
        this.buoyancy = 1.0;
        this.elasticity = 0.5;
        this.mass = 1.0;
    }

    reset() {
        this.timeOfCollision = 2.0;
        this.startTimeOfCollisionX = 2.0;
        this.startTimeOfCollisionY = 2.0;
        this.endTimeOfCollisionX = 2.0;
        this.endTimeOfCollisionY = 2.0;
    }
}