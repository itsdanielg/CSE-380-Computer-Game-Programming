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
                spriteType.addAnimation(state, framesArray);
                var frames = animations[i].frames;
                for (var j = 0; j < frames.length; j++) {
                    var index = frames[j].index;
                    var frameDuration = frames[j].duration;
                    spriteType.addAnimationFrame(state, index, frameDuration);
                }
            }
            callback();
        })
    }
}