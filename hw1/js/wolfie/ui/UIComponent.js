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

        canvas.ondblclick = function(event) {
            var mousePressX = event.clientX;
            var mousePressY = event.clientY;

            var sprite = scene.getFirstSpriteAt(mousePressX, mousePressY);
            if (sprite != null) {
                if (sprite instanceof AnimatedSprite) {
                    sprite.moveToNextState();
                }
            }
        }

        document.onkeydown = function(event) {
            if (event.keyCode == 84) {
                var textCanvas = document.getElementById("text_canvas");
                console.log(textCanvas.style.display);
                if (textCanvas.style.display == "") {
                    textCanvas.style.display = "none";
                }
                else {
                    textCanvas.style.display = "";
                }
            }
        }

    }
}