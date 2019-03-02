'use strict'

class PhysicsTests {
    constructor(initPhysics, initTextRenderer) { 
        this.physics = initPhysics;
        this.textRenderer = initTextRenderer;
        this.tests = new Array();
        this.currentTest = -1;

        // GET ALL THE TEST METHOD NAMES
        var thisPrototype = Object.getPrototypeOf(this);
        var testFunctions = Object.getOwnPropertyNames(thisPrototype);
        for (var i = 0; i < testFunctions.length; i++) {
            var functionName = testFunctions[i];
            if (functionName.startsWith("test")) {
                this.tests.push(functionName);
            }
        }

        console.log("PhysicsTests - Test Method Names:\n");
        for (var i = 0; i < this.tests.length; i++) {
            console.log("\t" + this.tests[i] + "\n");
        }

        // WE'LL SETUP 15 LINES OF TEXT FOR OUTPUT
        var textX = 50;
        var textY = 50;
        for (var i = 0; i < 30; i++) {
            var id = "id (" + i + ")";
            var text =  "";
            var textToRender = new TextToRender(id, text, textX, textY, function() {

            });
            this.textRenderer.addTextToRender(textToRender);
            textY += 30;
        }
    }

    runPreviousTest() {
        this.currentTest--;
        if (this.currentTest < 0) {
            this.currentTEst = this.currentTest.length-1;
        }
        this.runTest();
    }

    runNextTest() {
        this.currentTest++;
        if (this.currentTest == this.tests.length) {
            this.currentTest = 0;
        }
        this.runTest();
    }

    runTest() {
        // FIRST CLEAR THE OLD TEXT
        this.clearOldText();

        // FIRST GET THE METHOD
        var testMethodName = this.tests[this.currentTest];

        // THE FIRST LINE OF TEXT ALWAYS SHOWS THE NAME OF THE TEST
        this.textRenderer.textToRender[0].text = testMethodName;


        this[testMethodName]();

        this.textRenderer.render();
    }

    clearOldText() {
        for (var i = 0; i < this.textRenderer.textToRender.length; i++) {
            var textToRender = this.textRenderer.textToRender[i];
            textToRender.text = "";
        }
    }

/*    testAddCollidableObject() {

    }

    testRemoveCollidableObject() {

    }

    testResolveCollision() {

    }

    testResolveCollisionAABBtoCircle() {

    }

    testResolveCollisionCircleToCircle() {

    }

    testSortCollidableObjects() {

    }

    testSortCollisions() {

    }
*/

    makeCollidableObject(centerX, centerY, width, height, velocityX, velocityY) {
        var collidableObject = new CollidableObject(null);
        var aabb = collidableObject.boundingVolume;
        aabb.centerX = centerX;
        aabb.centerY = centerY;
        aabb.width = width;
        aabb.height = height;
        var pp = collidableObject.physicalProperties;
        pp.velocityX = velocityX;
        pp.velocityY = velocityY;
        return collidableObject;
    }

    testSweptShapeForAABB() {
        // FIRST TEST
        var collidableObject = this.makeCollidableObject(20, 25, 100, 200, 15, 30);
        var aabb = collidableObject.boundingVolume;
        var pp = collidableObject.physicalProperties;
        var sweptShape = collidableObject.sweptShape;
        collidableObject.sweep(0.0);
        this.printSweptShapeForAABB("-Swept Shape for Positive Vx and Vy", aabb, sweptShape, pp, 2);
    }

    testTimeOfCollision() {
        var a = this.makeCollidableObject(0, 0, 100, 200, 10, 0);
        var b = this.makeCollidableObject(110, 0, 100, 200, -10, 0);
        var collision = new Collision();
        collision.collidableObject1 = a;
        collision.collidableObject2 = b;
        this.physics.calculateTimeOfCollision(collision);
        this.printAABB("--aabb A: ", a.boundingVolume, a.physicalProperties, 1);
        this.printAABB("--aabb B: ", b.boundingVolume, b.physicalProperties, 2);
        this.textRenderer.textToRender[3].text = "--timeOfCollision: " + collision.timeOfCollision;
    }

    printSweptShape(title, aabb, i) {
        var tTR = this.textRenderer.textToRender;
        tTR[i].text = " --" + title + ": (" + aabb.centerX + ", " + aabb.centerY + ")"
                    + ", width: " + aabb.width + ", height: " + aabb.height;
    }

    printAABB(title, aabb, pp, i) {
        var tTR = this.textRenderer.textToRender;
        tTR[i].text = " --" + title + ": (" + aabb.centerX + ", " + aabb.centerY + ")"
                    + ", width: " + aabb.width + ", height: " + aabb.height
                    + ", velocityX: " + pp.velocityX + ", velocityY: " + pp.velocityY;
    }

    printSweptShapeForAABB(title, aabb, sweptShape, pp, i) {
        var tTR = this.textRenderer.textToRender;
        tTR[i].text = title;
        this.printAABB(" --aabb: ", aabb, pp, i+1);
        this.printSweptShape(" --sweptShape: ", sweptShape, i+2);
    }

/*
    testTimeOfCollisionAABBtoCircle() {

    }

    testTimeOfCollisionCircleToAABB() {

    }

    testTimeOfCollisionCircleToCircle() {

    }
    */
}