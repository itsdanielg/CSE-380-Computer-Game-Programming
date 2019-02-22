'use strict'

class AnimatedSpriteType {
    constructor(initSpriteSheetTexture, initSpriteWidth, initSpriteHeight) {
        this.spriteSheetTexture = initSpriteSheetTexture;
        this.spriteWidth = initSpriteWidth;
        this.spriteHeight = initSpriteHeight;
        this.animations = new Array();
        this.states = new Array();
    }

    addAnimation(state, framesArray, stateIndex, repeat, next) {
        this.animations[state] = framesArray;
        this.states[state] = {
            stateIndex: stateIndex,
            repeat: repeat,
            next: next,
            totalFrames: 0,
            firstFrameIndex: 0,
            lastFrameIndex: 0
        };
    }

    addAnimationFrame(state, index, frameDuration, nextFrameIndex) {
        var framesArray = this.animations[state];
        framesArray[index] = {
            nextFrameIndex: nextFrameIndex,
            duration: frameDuration
        };
    }

    setFirstFrameIndex(state, firstFrameIndex) {
        this.states[state].firstFrameIndex = firstFrameIndex;
    }

    setLastFrameIndex(state, lastFrameIndex) {
        this.states[state].lastFrameIndex = lastFrameIndex;
    }

    getAnimation(state) {
        return this.animations[state];
    }

    getLeft(state, frameIndex) {
        var columns = this.spriteSheetTexture.width / this.spriteWidth;
        var left = (frameIndex % columns) * this.spriteWidth;
        return left;
    }

    getTop(state, frameIndex) {
        var columns = this.spriteSheetTexture.width / this.spriteWidth;
        var rowIndex = Math.floor(frameIndex / columns);
        var top = rowIndex  * this.spriteHeight;
        return top;
    }
}