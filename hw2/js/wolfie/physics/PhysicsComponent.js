'use strict'

class PhysicsComponent {
    constructor() { 
        this.gravity = 5.0;
        this.windOrCurrent = 0.0;
        this.currentTime = 0.0;

        // WE'LL KEEP OUR COLLIDABLE OBJECTS SORTED BY X-COORDINATE USING THEIR SWEPT SHAPES
        this.collidableObjects = new Array();
        this.collisions = new Array();
        this.recyclableCollisions = new Array();
        for (var i = 0; i < 1000; i++) {
            var recyclableCollision = new Collision();
            this.recyclableCollisions.push(recyclableCollision);
        }
    }

    addCollidableObject(collidableObjectToAdd) {
        this.collidableObjects.push(collidableObjectToAdd);
    }

    removeCollidableObject(collidableObjectToRemove) {
        var indexOfItemToRemove = this.collidableObjects.indexOf(collidableObjectToRemove);
        this.collidableObjects.splice(indexOfItemToRemove, 1);
    }

    getCollidableObject(index) {
        return this.collidableObjects[index];
    }

    // YOU MUST DEFINE THE METHODS BELOW

    // HELPER METHOD FOR BUBBLE SORT
    swap(array, i, j) {
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    /*
     * sortCollidableObjects - this method must sort the collidable objects by their
     *                         swept shape's left edge.
     */
    sortCollidableObjects() {
        // Implements bubble sort
        length = this.collidableObjects.length;
        for (var i = 0; i < length; i++) {
            for (var j = 1; j < length; j++) {
                var currentShape = this.collidableObjects[j].sweptShape;
                var currentLeftEdge = currentShape.getLeft();
                var prevShape = this.collidableObjects[j - 1].sweptShape;
                var prevLeftEdge = prevShape.getLeft();
                if (currentLeftEdge < prevLeftEdge) {
                    this.swap(this.collidableObjects, j - 1, j);
                }
            }
        }
    }

    /*
     * sortCollisions - this method must sort collisions by their time of collision.
     */
    sortCollisions() {
        // Implements bubble sort
        length = this.collisions.length;
        for (var i = 0; i < length; i++) {
            for (var j = 1; j < length; j++) {
                var currentCollision = this.collisions[j];
                var currentTime = currentCollision.timeOfCollision;
                var prevCollision = this.collisions[j - 1];
                var prevTime = prevCollision.timeOfCollision;
                if (currentTime < prevTime) {
                    this.swap(this.collisions, j - 1, j);
                }
            }
        }
    }

    /*
     * moveAll - this method moves all the collidable objects up to the time provided.
     */
    moveAll(time) {
        for (var i = 0; i < this.collidableObjects.length; i++) {
            this.collidableObjects[i].move(this.currentTime, time);
        }
        this.currentTime = time;
    }

    /*
     * calculateTimeOfCollision - this method calculates the time of collision between
     *                            the two collidable objects referenced in the collision
     *                            argument.
     */
    calculateTimeOfCollision(collision) {
        // Assumption that objectOne.getLeft() < objectTwo.getLeft() due to sorting
        var objectOne = collision.collidableObject1;
        var objectTwo = collision.collidableObject2;

        // Collision detection on the x-axis
        var oneLeft = objectOne.boundingVolume.getLeft();
        var oneRight = objectOne.boundingVolume.getRight()
        var oneVelX = objectOne.physicalProperties.velocityX;
        var twoLeft = objectTwo.boundingVolume.getLeft();
        var twoRight = objectTwo.boundingVolume.getRight();
        var twoVelX = objectTwo.physicalProperties.velocityX;
        if (twoLeft > oneRight) {
            var xStartCollision = (twoLeft - oneRight) / (oneVelX - twoVelX);
            var xEndCollision = (twoRight - oneLeft) / (oneVelX - twoVelX);
            collision.startTimeOfCollisionX = xStartCollision;
            collision.endTimeOfCollisionX = xEndCollision;
        }
        else {
            collision.startTimeOfCollisionX = 0;
            collision.endTimeOfCollisionX = (twoRight - oneLeft) / (oneVelX - twoVelX);
        }

        // Collision detection on the y-axis (Let oneBottom < twoBottom; Switch otherwise)
        var oneTop = objectOne.boundingVolume.getTop();
        var oneBottom = objectOne.boundingVolume.getBottom()
        var oneVelY = objectOne.physicalProperties.velocityY;
        var twoTop = objectTwo.boundingVolume.getTop();
        var twoBottom = objectTwo.boundingVolume.getBottom();
        var twoVelY = objectTwo.physicalProperties.velocityY;
        if (oneBottom > twoBottom) {
            twoTop = objectOne.boundingVolume.getTop();
            twoBottom = objectOne.boundingVolume.getBottom()
            twoVelY = objectOne.physicalProperties.velocityY;
            oneTop = objectTwo.boundingVolume.getTop();
            oneBottom = objectTwo.boundingVolume.getBottom();
            oneVelY = objectTwo.physicalProperties.velocityY;
        }
        if (twoTop > oneBottom) {
            var yStartCollision = (twoTop - oneBottom) / (oneVelY - twoVelY);
            var yEndCollision = (twoBottom - oneTop) / (oneVelY - twoVelY);
            collision.startTimeOfCollisionY = yStartCollision;
            collision.endTimeOfCollisionY = yEndCollision;
        }
        else {
            collision.startTimeOfCollisionY = 0;
            collision.endTimeOfCollisionY = (twoBottom - oneTop) / (oneVelY - twoVelY);
        }
        
        // Time of collision calculation
        if (collision.startTimeOfCollisionX > collision.startTimeOfCollisionY) {
            collision.timeOfCollision = collision.startTimeOfCollisionX;
        }
        else {
            collision.timeOfCollision = collision.startTimeOfCollisionY;
        }
        return collision.timeOfCollision;
    }

    /*
     *  step - this method steps the physics system through one time step, meaning one frame.
     *
     *  NOTE, YOU MUST COMPLETE THIS METHOD, IT IS ONLY PARTIALLY DEFINED
     */
    step() {
        // NOTE THAT THIS PHYSICS SYSTEM ASSUMES A FIXED-FRAME RATE, SO ALL VELOCITIES
        // AN ACCELERATIONS USE COORDINATE VALUES THAT ARE CLOCKED PER FRAME. FOR EXAMPLE,
        // A VELOCITY OF 5 WOULD MEAN IT IS MOVING 5 UNITS PER FRAME

        // THE BEGINNING OF THE TIME IS 0.0
        this.currentTime = 0.0;

        // START BY GOING THROUGH EACH OF THE CollidableObjects AND FOR EACH:
            // ADD GRAVITY AND OTHER ACCELERATION
            // UPDATE THEIR SWEPT SHAPE
        for (var i = 0; i < this.collidableObjects.length; i++) {
            // GET THE COLLIDABLE OBJECT
            var collidableObject = this.collidableObjects[i];
            var pp = collidableObject.physicalProperties;

            // APPLY GRAVITY AND WIND/CURRENT AND ALL OTHER ACCELERATION TO THE DYNAMIC SPRITES
            if (!collidableObject.isStatic()) {
                pp.velocityX += pp.accelerationX + this.windOrCurrent;

                // WE ONLY APPLY Y ACCELERATION TO GRAVITY IF THE OBJECT ISN'T WALKING ON A SURFACE,
                // NOTE THAT THIS CREATES AN ISSUE WHERE THE SPRITE WON'T FALL AFTER WALKING OFF
                // OF A PLATFORM, WHICH YOU'LL HAVE TO DEAL WITH
                if (!collidableObject.isWalking()) {
                    pp.velocityY += pp.accelerationY + this.gravity;
                }
                else {
                    console.log("walking objects get no gravity");
                }
            }

            // NOW UPDATE THE SWEPT SHAPE
            collidableObject.sweep(this.currentTime);
        }
        
        // SORT ALL THE SWEPT SHAPES
        this.sortCollidableObjects();

        // DETECT ALL POSSIBLE COLLISIONS
        for (var i = 0; i < this.collidableObjects.length - 1; i++) {
            for (var j = 1; j < this.collidableObjects.length; j++) {
                var recyclableCollision = this.recyclableCollisions.pop();

                var objectOne = this.collidableObjects[i];
                var objectTwo = this.collidableObjects[j];
                recyclableCollision.collidableObject1 = objectOne;
                recyclableCollision.collidableObject2 = objectTwo;
                var check = this.calculateTimeOfCollision(recyclableCollision);
                if (check > 0 && check <= 1.0) {
                    this.collisions.push(recyclableCollision);
                }
                else {
                    this.recyclableCollisions.push(recyclableCollision);
                }
            }
            
        }
        
        // SORT COLLISIONS
        if (this.collisions.length != 0) {
            this.sortCollisions();
            var i = 0;
            while (i < this.collisions.length) {
                var collision = this.collisions[i];
                var objectOne = collision.collidableObject1;
                var objectTwo = collision.collidableObject2;
                objectOne.move(this.currentTime, collision.timeOfCollision);
                objectTwo.move(this.currentTime, collision.timeOfCollision);
                if (!objectOne.isStatic()) {
                    objectOne.walking = true;
                    objectOne.physicalProperties.velocityX = 0;
                    objectOne.physicalProperties.velocityY = 0;
                }
                if (!objectTwo.isStatic()) {
                    objectOne.walking = true;
                    objectTwo.physicalProperties.velocityX = 0;
                    objectTwo.physicalProperties.velocityY = 0;
                }
                this.collisions[i].collidableObject1 = null;
                this.collisions[i].collidableObject2 = null;
                this.recyclableCollisions.push(collision);
                this.collisions.shift();
            }
        }

        // NOW MOVE EVERYTHING UP TO TIME 1.0
        if (this.currentTime < 1.0) {
            this.moveAll(1.0);
        }
    }
}