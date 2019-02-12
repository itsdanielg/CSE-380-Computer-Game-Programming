'use strict'

class SceneComponent {
    constructor() {       
        // THIS WILL STORE THE TEXTURES USED FOR RENDERING SPRITES. NOTE
        // THAT WE WILL ONLY HAVE 8 TEXTURES PER WebGL 1.0 STANDARD LIMITATIONS
        this.textures = new Array();

        // THIS WILL STORE THE SPRITE TYPES THAT HAVE BEEN BUILT
        // AND CAN BE SHARED AMONG SPRITES
        this.spriteTypes = new Array();

        // THIS WILL STORE THE SPRITES THAT ARE IN THE SCENE
        this.sprites = new Array();

        // WE'LL MANAGE ANIMATED SPRITES SEPARATELY
        this.animatedSpriteTypes = new Array();
        this.animatedSprites = new Array();
    }

    step() {
        for (var i = 0; i < this.animatedSprites.length; i++) {
            var animatedSprite = this.animatedSprites[i];
            animatedSprite.step();
        }
    }

    getFirstSpriteAt(sceneX, sceneY) {
        var sprite = this.findSprite(this.sprites, sceneX, sceneY);
        if (sprite === null) {
            sprite = this.findSprite(this.animatedSprites, sceneX, sceneY);
        }
        return sprite;
    }

    findSprite(array, sceneX, sceneY) {
        for (var i = array.length-1; i >= 0; i--) {
            var sprite =array[i];
            var left = sprite.position.getX();
            var right = sprite.position.getX() + sprite.spriteType.spriteWidth;
            var top = sprite.position.getY();
            var bottom = sprite.position.getY() + sprite.spriteType.spriteHeight;

            // FOR (sceneX, sceneY) TO BE INSIDE THE SPRITE BOUNDARIES FOUR THINGS MUST BE TRUE
            if ((left < sceneX) && (sceneX < right) && (top < sceneY) && (sceneY < bottom)) {
                return sprite;
            }
        }    
        return null;    
    }

    addTexture(id, texture) {
        this.textures[id] = texture;
    }

    addSpriteType(id, spriteType) {
        this.spriteTypes[id] = spriteType;
    }

    addSprite(sprite) {
        this.sprites.push(sprite);
    }

    getTexture(id) {
        return this.textures[id];
    }

    getSpriteType(id) {
        return this.spriteTypes[id];
    }

    addAnimatedSpriteType(id, animatedSpriteType) {
        this.animatedSpriteTypes[id] = animatedSpriteType;
    }

    addAnimatedSprite(animatedSprite) {
        this.animatedSprites.push(animatedSprite);
    }

    getAnimatedSpriteType(id) {
        return this.animatedSpriteTypes[id];
    }
}