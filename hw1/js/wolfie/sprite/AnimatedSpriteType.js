'use strict'

class AnimatedSpriteType {
    constructor(initSpriteSheetTexture, initSpriteWidth, initSpriteHeight) {
        this.spriteSheetTexture = initSpriteSheetTexture;
        this.spriteWidth = initSpriteWidth;
        this.spriteHeight = initSpriteHeight;
        this.animations = new Array();
    }

    addAnimation(state, framesArray) {
        this.animations[state] = framesArray;
    }

    addAnimationFrame(state, index, frameDuration) {
        var framesArray = this.animations[state];
        framesArray.push({
            index: index,
            duration: frameDuration
        });
    }

    getAnimation(state) {
        return this.animations[state];
    }

    getLeft(state, frameIndex) {
        var columns = this.spriteSheetTexture.width / this.spriteWidth;
        var left = (frameIndex % columns) * this.spriteWidth
        return left;
    }

    getTop(state, frameIndex) {
        var columns = this.spriteSheetTexture.width / this.spriteWidth;
        var top = (Math.floor(frameIndex / columns)) * this.spriteHeight;
        return top;
    }
}