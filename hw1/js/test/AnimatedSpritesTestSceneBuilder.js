'use strict'

// UPDATE THIS TO USE YOUR OWN SPRITE
var TestConstants = {
    RED_CIRCLE_MAN_SPRITE_TYPE: 'Red Circle Man',
    FORWARD_STATE: "FORWARD",
    REVERSE_STATE: "REVERSE",
    NAGINI_SPRITE_TYPE: 'Nagini',
    MOVE_LEFT_STATE: "MOVE LEFT",
    ATTACK_LEFT_STATE: "ATTACK LEFT",
    MOVE_RIGHT_STATE: "MOVE RIGHT",
    ATTACK_RIGHT_STATE: "ATTACK RIGHT",
    IDLE_STATE: "IDLE",
    DYING_STATE: "DYING",
    DEAD_STATE: "DEAD",
    DANCE_STATE: "DANCE"
};

class AnimatedSpritesTestSceneBuilder {
    constructor() { }

    buildScene(graphics, scene, callback) {
        this.spriteCounter = 0;
        var texturePaths = ["resources/images/RedCircleMan.png", "resources/images/NaginiSpriteSheet.png"];
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
        wolfieFileManager.loadSpriteType(scene, "resources/animated_sprites/Nagini.json", callback);
    }

    buildAnimatedSprites(scene) {
        scene.animatedSprites.length = 0;
        var circleSpriteType = scene.getAnimatedSpriteType(TestConstants.RED_CIRCLE_MAN_SPRITE_TYPE);
        if (circleSpriteType != null) {
            this.circleSprite0 = new AnimatedSprite(circleSpriteType, TestConstants.FORWARD_STATE);
            this.circleSprite0.position.set(100.0, 400.0, 0.0, 1.0);
            scene.addAnimatedSprite(this.circleSprite0);
            this.circleSprite1 = new AnimatedSprite(circleSpriteType, TestConstants.REVERSE_STATE);
            this.circleSprite1.position.set(400.0, 400.0, 0.0, 1.0);
            scene.addAnimatedSprite(this.circleSprite1);
            this.circleSprite2 = new AnimatedSprite(circleSpriteType, TestConstants.FORWARD_STATE);
            this.circleSprite2.position.set(700.0, 400.0, 0.0, 1.0);
            scene.addAnimatedSprite(this.circleSprite2);
            this.circleSprite3 = new AnimatedSprite(circleSpriteType, TestConstants.REVERSE_STATE);
            this.circleSprite3.position.set(1000.0, 400.0, 0.0, 1.0);
            scene.addAnimatedSprite(this.circleSprite3);
            this.circleSprite4 = new AnimatedSprite(circleSpriteType, TestConstants.FORWARD_STATE);
            this.circleSprite4.position.set(1300.0, 400.0, 0.0, 1.0);
            scene.addAnimatedSprite(this.circleSprite4);
        }
        var naginiSpriteType = scene.getAnimatedSpriteType(TestConstants.NAGINI_SPRITE_TYPE);
        if (naginiSpriteType != null) {
            this.naginiSprite0 = new AnimatedSprite(naginiSpriteType, TestConstants.MOVE_LEFT_STATE);
            this.naginiSprite0.position.set(100.0, 700.0, 0.0, 1.0);
            scene.addAnimatedSprite(this.naginiSprite0);
            this.naginiSprite1 = new AnimatedSprite(naginiSpriteType, TestConstants.ATTACK_RIGHT_STATE);
            this.naginiSprite1.position.set(400.0, 700.0, 0.0, 1.0);
            scene.addAnimatedSprite(this.naginiSprite1);
            this.naginiSprite2 = new AnimatedSprite(naginiSpriteType, TestConstants.IDLE_STATE);
            this.naginiSprite2.position.set(700.0, 700.0, 0.0, 1.0);
            scene.addAnimatedSprite(this.naginiSprite2);
            this.naginiSprite3 = new AnimatedSprite(naginiSpriteType, TestConstants.DYING_STATE);
            this.naginiSprite3.position.set(1000.0, 700.0, 0.0, 1.0);
            scene.addAnimatedSprite(this.naginiSprite3);
            this.naginiSprite4 = new AnimatedSprite(naginiSpriteType, TestConstants.DANCE_STATE);
            this.naginiSprite4.position.set(1300.0, 700.0, 0.0, 1.0);
            scene.addAnimatedSprite(this.naginiSprite4);
        }
    }

    buildText(graphics) {
        var text = graphics.textRenderer;
        text.clear();
        var builder = this;
        var circleSprite0Text = new TextToRender("CircleSprite0", "", 20, 50, function () { circleSprite0Text.text = builder.buildSpriteSummary("CircleSprite0", builder.circleSprite0)});
        var circleSprite1Text = new TextToRender("CircleSprite1", "", 20, 80, function () { circleSprite1Text.text = builder.buildSpriteSummary("CircleSprite1", builder.circleSprite1)});
        var circleSprite2Text = new TextToRender("CircleSprite2", "", 20, 110, function () { circleSprite2Text.text = builder.buildSpriteSummary("CircleSprite2", builder.circleSprite2)});
        var circleSprite3Text = new TextToRender("CircleSprite3", "", 20, 140, function () { circleSprite3Text.text = builder.buildSpriteSummary("CircleSprite3", builder.circleSprite3)});
        var circleSprite4Text = new TextToRender("CircleSprite4", "", 20, 170, function () { circleSprite4Text.text = builder.buildSpriteSummary("CircleSprite4", builder.circleSprite4)});
        text.addTextToRender(circleSprite0Text);
        text.addTextToRender(circleSprite1Text);
        text.addTextToRender(circleSprite2Text);
        text.addTextToRender(circleSprite3Text);
        text.addTextToRender(circleSprite4Text);
        var naginiSprite0Text = new TextToRender("NaginiSprite0", "", 20, 200, function () { naginiSprite0Text.text = builder.buildSpriteSummary("NaginiSprite0", builder.naginiSprite0)});
        var naginiSprite1Text = new TextToRender("NaginiSprite1", "", 20, 230, function () { naginiSprite1Text.text = builder.buildSpriteSummary("NaginiSprite1", builder.naginiSprite1)});
        var naginiSprite2Text = new TextToRender("NaginiSprite2", "", 20, 260, function () { naginiSprite2Text.text = builder.buildSpriteSummary("NaginiSprite2", builder.naginiSprite2)});
        var naginiSprite3Text = new TextToRender("NaginiSprite3", "", 20, 290, function () { naginiSprite3Text.text = builder.buildSpriteSummary("NaginiSprite3", builder.naginiSprite3)});
        var naginiSprite4Text = new TextToRender("NaginiSprite4", "", 20, 320, function () { naginiSprite4Text.text = builder.buildSpriteSummary("NaginiSprite4", builder.naginiSprite4)});
        text.addTextToRender(naginiSprite0Text);
        text.addTextToRender(naginiSprite1Text);
        text.addTextToRender(naginiSprite2Text);
        text.addTextToRender(naginiSprite3Text);
        text.addTextToRender(naginiSprite4Text);
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