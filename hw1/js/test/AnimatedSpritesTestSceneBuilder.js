'use strict'

// UPDATE THIS TO USE YOUR OWN SPRITE
var TestConstants = {
    RED_CIRCLE_MAN_SPRITE_TYPE: 'Red Circle Man',
    FORWARD_STATE: "FORWARD",
    REVERSE_STATE: "REVERSE"
};

class AnimatedSpritesTestSceneBuilder {
    constructor() { }

    buildScene(graphics, scene, callback) {
        var texturePaths = ["resources/images/RedCircleMan.png"];
        var builder = this;
        graphics.loadTextures(scene, texturePaths, function () {
            builder.buildAnimatedSpriteTypes(scene, function() {
                builder.buildAnimatedSprites(scene);
                builder.buildText(graphics);
                callback();
            });
        });
    }

    buildAnimatedSpriteTypes(scene, callback) {
        // IN THIS EXAMPLE WE WILL BUILD 4 SPRITE TYPES,
        // TWO FOR EACH TEXTURE. NOTE THAT THEY WILL
        // ALL SHARE THE SAME GEOMETRY
        var wolfieFileManager = new WolfieFileManager();
        wolfieFileManager.loadSpriteType(scene, "resources/animated_sprites/RedCircleMan.json", callback);
    }

    buildAnimatedSprites(scene) {
        var animatedSpriteType = scene.getAnimatedSpriteType(TestConstants.RED_CIRCLE_MAN_SPRITE_TYPE);
        this.sprite0 = new AnimatedSprite(animatedSpriteType, TestConstants.FORWARD_STATE);
        this.sprite0.position.set(100.0, 100.0, 0.0, 1.0);
        scene.addAnimatedSprite(this.sprite0);
        this.sprite1 = new AnimatedSprite(animatedSpriteType, TestConstants.REVERSE_STATE);
        this.sprite1.position.set(500.0, 500.0, 0.0, 1.0);
        scene.addAnimatedSprite(this.sprite1);
    }

    buildText(graphics) {
        var text = graphics.textRenderer;
        var builder = this;
        var sprite0Text = new TextToRender("Sprite0", "", 20, 50, function () { sprite0Text.text = builder.buildSpriteSummary("Sprite0", builder.sprite0)});
        var sprite1Text = new TextToRender("Sprite1", "", 20, 80, function () { sprite1Text.text = builder.buildSpriteSummary("Sprite1", builder.sprite1)});
        text.addTextToRender(sprite0Text);
        text.addTextToRender(sprite1Text);
    }

    buildSpriteSummary(spriteName, sprite) {
        var summary = spriteName + ": { position: ("
            + sprite.position.getX() + ", " + sprite.position.getY() + ") "
            + "(state: " + sprite.state + ") "
            + "(animationFrameIndex: " + sprite.animationFrameIndex + ") "
            + "(frameCounter: " + sprite.frameCounter + ") "
            + "(duration: " + sprite.spriteType.animations[sprite.state][sprite.animationFrameIndex].duration + ")";
        return summary;
    }
}