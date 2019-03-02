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
            this.sceneObject.moveTo(x, y);
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
        // YOU MUST DEFINE THIS METHOD
    }

    /*
     * sweep - This method fills in this CollidableObject's swept shape with the area it
     *         is expected to take from the currentTimeInFrame moment until the end of
     *         the frame. Note that the swept shape is an AABB.
     */
    sweep(currentTimeInFrame) {
        // YOU MUST DEFINE THIS METHOD
    }
}