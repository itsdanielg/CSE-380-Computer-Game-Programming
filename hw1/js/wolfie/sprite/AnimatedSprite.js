'use strict'

class AnimatedSprite {
    constructor(initSpriteType, initState) {
        this.spriteType = initSpriteType;
        this.state = initState;
        this.animationFrameIndex = initSpriteType.states[initState].firstFrameIndex;
        this.frameCounter = 0;

        // NOTE THAT THESE VALUES USE WORLD COORDINATES, WHICH WOULD CORRESPOND TO PIXEL COORDINATES
        var math = window.wolfie.math;
        this.position = math.createPositionVector();
        this.rotation = math.createRotationVector();
        this.scale = math.createPositionVector();

        // CLEAR ALL VALUES
        this.position.set(0.0, 0.0, 0.0, 1.0);
        this.rotation.set(0.0, 0.0, 0.0, 1.0);
        this.scale.set(1.0, 1.0, 1.0, 1.0);
    }

    setState(initState) {
        this.state = initState;
    }

    moveToNextState() {
        var nextState = this.spriteType.states[this.state].next;
        this.state = nextState;
        this.animationFrameIndex = this.spriteType.states[nextState].firstFrameIndex;
        this.frameCounter = 0;
    }

    step() {
        var animationState = this.spriteType.getAnimation(this.state);
        this.frameCounter++;
        if (this.frameCounter >= animationState[this.animationFrameIndex].duration) {
            if (this.spriteType.states[this.state].repeat == false && 
                this.animationFrameIndex == this.spriteType.states[this.state].lastFrameIndex) {
                this.moveToNextState();
            }
            else {
                this.frameCounter = 0;
                this.animationFrameIndex = animationState[this.animationFrameIndex].nextFrameIndex;
            }
        }
        
    }

    getLeft() {
        return this.spriteType.getLeft(this.state, this.animationFrameIndex);
    }

    getTop() {
        return this.spriteType.getTop(this.state, this.animationFrameIndex);
    }
}