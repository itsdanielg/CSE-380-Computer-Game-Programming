'use strict'

class AnimatedSprite {
    constructor(initSpriteType, initState) {
        this.spriteType = initSpriteType;
        this.state = initState;
        this.animationFrameIndex = 0;
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

    step() {
        var animationState = this.spriteType.getAnimation(this.state);
        this.frameCounter++;
        if (this.frameCounter >= animationState[this.animationFrameIndex].duration) {
            this.frameCounter = 0;
            this.animationFrameIndex++;
            if (this.animationFrameIndex >= animationState.length) {
                this.animationFrameIndex = 0;
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