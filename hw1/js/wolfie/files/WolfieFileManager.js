'use strict'

class WolfieFileManager {
    constructor() {}

    loadSpriteType(scene, jsonFilePath, callback) {
        $.getJSON(jsonFilePath, function(data) {
            var name = data.name;
            var spriteSheetImage = data.spriteSheetImage;
            var spriteWidth = data.spriteWidth;
            var spriteHeight = data.spriteHeight;
            var leftBuffer = data.leftBuffer;
            var rightBuffer = data.rightBuffer;
            var topBuffer = data.topBuffer;
            var bottomBuffer = data.bottomBuffer;
            var animations = data.animations;
            var spriteTexture = scene.textures[spriteSheetImage];
            scene.addAnimatedSpriteType(name, new AnimatedSpriteType(spriteTexture, spriteWidth, spriteHeight));
            var spriteType = scene.getAnimatedSpriteType(name);
            for (var i = 0; i < animations.length; i++) {
                var state = animations[i].name;
                var framesArray = new Array();
                var repeat = animations[i].repeat;
                var next = animations[i].next;
                if (next == null) {
                    if (i == animations.length - 1) {
                        next = animations[0].name;
                    }
                    else {
                        next = animations[i+1].name;
                    }
                }
                spriteType.addAnimation(state, framesArray, i, repeat, next);
                var frames = animations[i].frames;
                for (var j = 0; j < frames.length; j++) {
                    var index = frames[j].index;
                    var nextFrameIndex;
                    if (j == frames.length - 1) {
                        nextFrameIndex = frames[0].index;
                    }
                    else {
                        nextFrameIndex = frames[j+1].index;
                    }
                    var frameDuration = frames[j].duration;
                    spriteType.addAnimationFrame(state, index, frameDuration, nextFrameIndex);
                    if (j == 0) {
                        spriteType.setFirstFrameIndex(state, index);
                    }
                    if (j == frames.length - 1) {
                        spriteType.setLastFrameIndex(state, index);
                    }
                }
            }
            for (var state in spriteType.animations) {
                var totalFrames = 0;
                for (var frame in spriteType.animations[state]) {
                    totalFrames++;
                }
                spriteType.states[state].totalFrames = totalFrames;
            }
            callback();
        })
    }
}