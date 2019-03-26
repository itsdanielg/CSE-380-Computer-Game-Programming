'use strict'

class CollidableObject {
    constructor(sceneObject) { 
        // THIS IS THE RENDERED SPRITE, NOTE THAT THIS SHOULD BE UPDATED
        // WHEN THE OBJECT MOVES ALSO NOTE THAT IF IT IS NULL WE ASSUME
        // IT IS A STATIC OBJECT LIKE A WALL THAT WILL NEVER MOVE, WHICH
        // LETS US AVOID INVOLVING IT IN ALL SORTS OF TESTS
        this.sceneObject = sceneObject;

        // THESE ARE USED FOR PHYSICS
        this.boundingVolume = new AABB();
        this.physicalProperties = new PhysicalProperties();

        // WE'RE GOING TO USE AABBs FOR ALL OUR SWEPT SHAPES
        this.sweptShape = new AABB(null, 0, 0, 0, 0);

        // BY DEFAULT OBJECTS ARE NOT WALKING, WHICH WOULD BE FOR
        // WHEN SPRITES AND OTHER THINGS ARE ON STATIC SURFACES
        this.walking = false;

        this.topHit = false;
        this.leftHit = false;
        this.rightHit = false;

        this.moveRightCommand = false;
        this.moveLeftCommand = false;
        this.jumpCommand = false;

        this.botCurrentFrame = 0;

    }

    isStatic() {
        return (this.sceneObject === null);
    }

    isWalking() {
        return this.walking;
    }

    moveTo(x, y) {
        this.boundingVolume.moveTo(x, y);
        if (this.sceneObject != null) {
            this.sceneObject.moveTo(x - this.boundingVolume.width/2, y - this.boundingVolume.height/2);
        }        
    }

    // YOU MUST DEFINE THE move AND sweep METHODS IN THIS CLASS

    /*
     * move - This method moves this CollidableObject from fromTime to toTime, meaning
     *        it must move it according to its current velocity by the time amount
     *        represented by the time shift. Also note that only dynamic objects
     *        can be moved.
     */
    move(fromTime, toTime) {
        if (!(this.isStatic())) {
            var timeToMove = toTime - fromTime;
            var totalXVel = this.physicalProperties.velocityX * timeToMove;
            var totalYVel = this.physicalProperties.velocityY * timeToMove;
            var newX = this.boundingVolume.centerX + totalXVel;
            var newY = this.boundingVolume.centerY + totalYVel;
            this.boundingVolume.moveTo(newX, newY);
            if (this.sceneObject != null) {
                this.sceneObject.moveBy(totalXVel, totalYVel);
            }
            return [totalXVel, totalYVel];
        }
    }

    /*
     * sweep - This method fills in this CollidableObject's swept shape with the area it
     *         is expected to take from the currentTimeInFrame moment until the end of
     *         the frame. Note that the swept shape is an AABB.
     */
    sweep(currentTimeInFrame) {
        var timeExpected = 1 - currentTimeInFrame;
        var adjustedXVel = this.physicalProperties.velocityX * timeExpected;
        var adjustedYVel = this.physicalProperties.velocityY * timeExpected;
        this.sweptShape.width = this.boundingVolume.width + adjustedXVel;
        this.sweptShape.height = this.boundingVolume.height + adjustedYVel;
        this.sweptShape.centerX = this.boundingVolume.getLeft() + (this.sweptShape.width/2);
        this.sweptShape.centerY = this.boundingVolume.getTop() + (this.sweptShape.height/2);
    }
}