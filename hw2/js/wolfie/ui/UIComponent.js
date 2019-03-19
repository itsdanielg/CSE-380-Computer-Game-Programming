'use strict'

class UIComponent {
    constructor() {}

    init(canvasId, scene) {
        var canvas = document.getElementById(canvasId);
        this.spriteToDrag = null;
        this.dragOffsetX = -1;
        this.dragOffsetY = -1;

        canvas.onmousedown = function(event) {
            var mousePressX = event.clientX;
            var mousePressY = event.clientY;

            var sprite = scene.getFirstSpriteAt(mousePressX, mousePressY);
            if (sprite != null) {
                // START DRAGGING IT
                this.spriteToDrag = sprite;

                this.dragOffsetX = sprite.position.getX() - mousePressX;
                this.dragOffsetY = sprite.position.getY() - mousePressY;
            }
        }

        canvas.onmousemove = function(event) {
            window.wolfie.ui.currentMouseX = event.clientX;
            window.wolfie.ui.currentMouseY = event.clientY;
            if (this.spriteToDrag != null) {
                this.spriteToDrag.position.set(event.clientX + this.dragOffsetX, event.clientY + this.dragOffsetY, this.spriteToDrag.position.getZ(), this.spriteToDrag.position.getW());
                window.wolfie.graphics.renderScene(window.wolfie.scene);
            }
        }

        canvas.onmouseup = function(event) {
            this.spriteToDrag = null;
        }

        canvas.onmouseleave = function(event) {
            this.spriteToDrag = null;
        }

        document.onkeydown = function(event) {
            var collidableObjects = window.wolfie.physics.collidableObjects;
            var player = null;
            for (var i = 0; i < collidableObjects.length; i++) {
                if (collidableObjects[i].sceneObject == scene.player) {
                    player = collidableObjects[i];
                    break;
                }
            }
            if (event.keyCode == 65) {
                player.moveLeftCommand = true;
            }
            else if (event.keyCode == 68) {
                player.moveRightCommand = true;
            }
            else if (event.keyCode == 32) {
                player.jumpCommand = true;
            }
        }

        document.onkeyup = function(event) {
            var collidableObjects = window.wolfie.physics.collidableObjects;
            var player = null;
            for (var i = 0; i < collidableObjects.length; i++) {
                if (collidableObjects[i].sceneObject == scene.player) {
                    player = collidableObjects[i];
                    break;
                }
            }
            if (event.keyCode == 65) {
                player.moveLeftCommand = false;
            }
            else if (event.keyCode == 68) {
                player.moveRightCommand = false;
            }
            else if (event.keyCode == 32) {
                player.jumpCommand = false;
            }
        }

    }
}