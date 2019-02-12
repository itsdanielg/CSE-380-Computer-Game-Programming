'use strict'

// IN THIS EXAMPLE WE'LL HAVE 4 SpriteTypes
var TestSceneSpriteTypes = {
    BLOCKS1_SPRITE_TYPE: 'BLOCKS1_SPRITE_TYPE',
    BLOCKS2_SPRITE_TYPE: 'BLOCKS2_SPRITE_TYPE',
    CIRCLES1_SPRITE_TYPE: 'CIRCLES1_SPRITE_TYPE',
    CIRCLES2_SPRITE_TYPE: 'CIRCLES2_SPRITE_TYPE'
};

class StaticSpritesTestSceneBuilder {
    constructor() { }

    buildScene(graphics, scene, callback) {
        var texturePaths = ["resources/images/EightBlocks.png", "resources/images/RedCircleMan.png"];
        var builder = this;
        graphics.loadTextures(scene, texturePaths, function () { 
            builder.buildSpriteTypes(graphics, scene); 
            builder.buildSprites(scene);
            builder.buildText(graphics);
            callback();
        });
    }

    buildSpriteTypes(graphics, scene) {
        // IN THIS EXAMPLE WE WILL BUILD 4 SPRITE TYPES,
        // TWO FOR EACH TEXTURE. NOTE THAT THEY WILL
        // ALL SHARE THE SAME GEOMETRY
        var textureId0 = "resources/images/EightBlocks.png", textureId1 = "resources/images/RedCircleMan.png";
        var texture0 = scene.textures[textureId0], texture1 = scene.textures[textureId1];
        scene.addSpriteType(TestSceneSpriteTypes.BLOCKS1_SPRITE_TYPE, new StaticSpriteType(texture0, 256, 256, 512, 256));
        scene.addSpriteType(TestSceneSpriteTypes.BLOCKS2_SPRITE_TYPE, new StaticSpriteType(texture0, 256, 512, 256, 0));
        scene.addSpriteType(TestSceneSpriteTypes.CIRCLES1_SPRITE_TYPE, new StaticSpriteType(texture1, 256, 256, 768, 256));
        scene.addSpriteType(TestSceneSpriteTypes.CIRCLES2_SPRITE_TYPE, new StaticSpriteType(texture1, 512, 256, 0, 256));
    }

    buildSprites(scene) {
        var spriteType0 = scene.getSpriteType(TestSceneSpriteTypes.BLOCKS1_SPRITE_TYPE);
        var spriteType1 = scene.getSpriteType(TestSceneSpriteTypes.BLOCKS2_SPRITE_TYPE);
        var spriteType2 = scene.getSpriteType(TestSceneSpriteTypes.CIRCLES1_SPRITE_TYPE);
        var spriteType3 = scene.getSpriteType(TestSceneSpriteTypes.CIRCLES2_SPRITE_TYPE);
        scene.addSprite(new Sprite(spriteType0));   scene.sprites[0].position.set(100, 100);
        scene.addSprite(new Sprite(spriteType0));   scene.sprites[1].position.set(500, 100);
        scene.addSprite(new Sprite(spriteType1));   scene.sprites[2].position.set(900, 100);
        scene.addSprite(new Sprite(spriteType1));   scene.sprites[3].position.set(1300, 100);
        scene.addSprite(new Sprite(spriteType2));   scene.sprites[4].position.set(100, 600);
        scene.addSprite(new Sprite(spriteType2));   scene.sprites[5].position.set(500, 600);
        scene.addSprite(new Sprite(spriteType3));   scene.sprites[6].position.set(900, 600);
        scene.addSprite(new Sprite(spriteType3));   scene.sprites[7].position.set(1300, 600);
    }

    buildText(graphics) {
        var text = graphics.textRenderer;
        var ui = window.wolfie.ui;
        var newText = new TextToRender("Mouse Position", "", 20, 20, function() {
            newText.text = "Mouse (x, y): (" 
                    + ui.currentMouseX + ", "
                    + ui.currentMouseY + ")";
        });
        text.addTextToRender(newText);
    }
}