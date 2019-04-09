var config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 607.5,
    pixelArt: true,
    backgroundColor: "#ff0000",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var map, player, backgroundLayer;
var playerSpeed = 256;
var playerIsMoving = false;
var destX, destY;
var path = [];
var nodeGrid = [];
var showPath = false;

function preload() {

    this.load.image('tiles', 'assets/images/tiles2d.png');
    this.load.tilemapTiledJSON("map", "assets/tilemaps/tiles2d.json");
    this.load.spritesheet('mantis', 'assets/images/praying_mantis.png',
        { frameWidth: 128, frameHeight: 128 }
    );

}

function create() {
    
    // TILE MAP
    map = this.make.tilemap({ key: 'map' });
    var tileSet = map.addTilesetImage("tiles2dtileset", 'tiles');
    backgroundLayer = map.createDynamicLayer("Background", tileSet, 0, 0).setDepth(-1);
    var collisionLayer = map.createStaticLayer("Collision", tileSet, 0, 0);
    
    // PLAYER
    player = this.physics.add.sprite(96, 96, 'mantis');
    this.anims.create({
        key: 'move',
        frames: this.anims.generateFrameNumbers('mantis', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: [ { key: 'mantis', frame: 0 } ],
        frameRate: 1
    });

    // PATHFINDER
    setupNodeGrid();

    // COLLISIONS
    this.physics.add.collider(player, collisionLayer);
    collisionLayer.setCollisionByProperty({collides:true});

    // SCALING
    // backgroundLayer.setScale(0.5);
    // collisionLayer.setScale(0.5);
    // player.setScale(0.25);

    // CAMERA
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    // DISPLAY TEXT
    readMeText = this.add.text(624, 440, readMe(), {
        fontSize: '24px',
        fill: '#eaf50f'
    });
    readMeText.setScrollFactor(0);
    readMeText.setStroke('black', 3);

    // KEYBOARD INPUTS
    this.input.keyboard.on('keydown-' + 'M', function (event) {
        if (playerSpeed < 500) {
            playerSpeed += 1;
        }
    });
    this.input.keyboard.on('keydown-' + 'N', function (event) {
        if (playerSpeed > 1) {
            playerSpeed -= 1;
        }
    });
    this.input.keyboard.on('keydown-' + 'S', function (event) {
        player.body.setVelocity(0);
        playerIsMoving = false;
        player.anims.play('idle', true);
        path.length = 0;
    });
    this.input.keyboard.on('keydown-' + 'L', function (event) {
        showPath = !showPath;
        if (!showPath) {
            for (var y = 0; y < map.height; y++) {
                for (var x = 0; x < map.width; x++) {
                    backgroundLayer.getTileAt(x, y).setVisible(true);
                }
            }
        }
        else {
            for (var i = 0; i < path.length; i++) {
                var tileX = path[i].tileX;
                var tileY = path[i].tileY;
                backgroundLayer.getTileAt(tileX, tileY).setVisible(false);
            }
        }
    });

    
}

function update() {
    
    playerX = Math.round(player.x);
    playerY = Math.round(player.y);
    if (this.input.mousePointer.isDown) {
        destX = Math.round(this.input.x + this.cameras.main.scrollX);
        destY = Math.round(this.input.y + this.cameras.main.scrollY);
        findPath(playerX, playerY, destX, destY);
        if (showPath) {
            for (var i = 0; i < path.length; i++) {
                var node = path[i];
                var tile = backgroundLayer.getTileAt(node.tileX, node.tileY);
                if (tile != null) {
                    tile.setVisible(!showPath);
                }
            }
        }
    }
    if (path.length > 0) {
        var playerTileIndexX = Math.floor(playerX/32);
        var playerTileIndexY = Math.floor(playerY/32);
        if (path[0].tileX == playerTileIndexX && path[0].tileY == playerTileIndexY) {
            path.shift();
        }
        if (path.length == 0) {
            player.body.setVelocity(0);
            playerIsMoving = false;
            player.anims.play('idle', true);
        }
        else {
            player.anims.play('move', true);
            playerIsMoving = true;
            var dx = path[0].tileX * 32;
            var dy = path[0].tileY * 32;
            var radians = Phaser.Math.Angle.Between(player.getCenter().x, player.getCenter().y, dx, dy) + (90 * Math.PI/180);
            player.setRotation(radians);    
            this.physics.moveTo(player, dx, dy, playerSpeed);
        }
    }
    else {
        player.body.setVelocity(0);
        playerIsMoving = false;
        player.anims.play('idle', true);
    }

    readMeText.setText(readMe());

}

function readMe() {
    var instructions = "Press \"M\" to increase velocity\n" + "Press \"N\" to decrease velocity\n" + "Press \"S\" to stop moving\n" + "Press \"L\" to show paths: " + showPath + "\n"
    var playerVel = "Player Velocity: " + playerSpeed;
    return instructions + playerVel;
}

var node = {
    gCost: 0,
    hCost: 0,
    fCost: 0,
    tileX: 0,
    tileY: 0,
    collidable: false,
    parentNode: null
}

function setupNodeGrid() {
    for(var y = 0; y < map.height; y++) {
        var row = [];
        for(var x = 0; x < map.width; x++) {
            var newNode = Object.create(node);
            var tile = map.getTileAt(x, y);
            newNode.gCost = 0;
            newNode.hCost = 0;
            newNode.fCost = 0;
            newNode.tileX = x;
            newNode.tileY = y;
            if (tile != null) {
                newNode.collidable = true;
            }
            else {
                newNode.collidable = false;
            }
            newNode.parentNode = null;
            row.push(newNode);
        }
        nodeGrid.push(row);
    }
}

var openNodes = [];
var closedNodes = [];

function findPath(playerX, playerY, destX, destY) {
    openNodes.length = 0;
    closedNodes.length = 0;
    path.length = 0;
    var playerTileIndexX = Math.floor(playerX/32);
    var playerTileIndexY = Math.floor(playerY/32);
    var destTileIndexX = Math.floor(destX/32);
    var destTileIndexY = Math.floor(destY/32);
    var playerNode = nodeGrid[playerTileIndexY][playerTileIndexX];
    var destNode = nodeGrid[destTileIndexY][destTileIndexX];
    for (var y = 0; y < map.height; y++) {
        for (var x = 0; x < map.width; x++) {
            var currentNode = nodeGrid[y][x];
            currentNode.parentNode = null;
            currentNode.gCost = 0;
            currentNode.fCost = 0;
            calculateHCost(x, y, currentNode, destTileIndexX, destTileIndexY);
            backgroundLayer.getTileAt(x, y).setVisible(true);
        }
    }
    playerNode.gCost = 0;
    playerNode.fCost = 0;
    openNodes.push(playerNode);
    while (1) {
        sortOpenByFCost();
        var currentNode = openNodes.shift();
        closedNodes.push(currentNode);
        if (currentNode === destNode) {
            break;
        }
        var neighborNode = null;
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var yIndex = currentNode.tileY + i;
                if (yIndex < 0 || yIndex > map.height) {
                    continue;
                }
                var xIndex = currentNode.tileX + j;
                if (xIndex < 0 || xIndex > map.width) {
                    continue;
                }
                neighborNode = nodeGrid[yIndex][xIndex];
                if (neighborNode.collidable || isInClosed(neighborNode)) {
                    continue;
                }
                //
                if (Math.abs(i) + Math.abs(j) == 2) {
                    continue;
                }
                //
                if (!isInOpen(neighborNode) /* || newpath is short */) {
                    var increaseCost = 0;
                    if (Math.abs(i) + Math.abs(j) == 2) {
                        increaseCost = 14;
                    }
                    else {
                        increaseCost = 10;
                    }
                    neighborNode.gCost = currentNode.gCost + increaseCost;
                    neighborNode.fCost = neighborNode.gCost + neighborNode.hCost;
                    neighborNode.parentNode = currentNode;
                    if (!isInOpen(neighborNode)) {
                        openNodes.push(neighborNode);
                    }
                }
            }
        }
        if (openNodes.length == 0) {
            break;
        }
    }
    var currentNode = destNode;
    while (currentNode.parentNode != null) {
        path.unshift(currentNode);
        currentNode = currentNode.parentNode;
    }
}

function calculateHCost(x, y, currentNode, destTileIndexX, destTileIndexY) {
    if (!currentNode.collidable) {
        var xDistance = Math.abs(destTileIndexX - x);
        var yDistance = Math.abs(destTileIndexY - y);
        var tempHCost = Math.min(xDistance, yDistance) * 14 + Math.abs(xDistance - yDistance) * 10;
        currentNode.hCost = tempHCost;
        return tempHCost;
    }
}

function sortOpenByFCost() {
    // Implements bubble sort
    for (var i = 0; i < openNodes.length; i++) {
        for (var j = 1; j < openNodes.length; j++) {
            var currentNode = openNodes[j];
            var currentFCost = currentNode.fCost;
            var prevNode = openNodes[j - 1];
            var prevFCost = prevNode.fCost;
            if (currentFCost < prevFCost) {
                this.swap(openNodes, j - 1, j);
            }
        }
    }
}

function swap(array, i, j) {
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

function isInOpen(node) {
    for (var i = 0; i< openNodes.length; i++) {
        if (openNodes[i] === node) {
            return true;
        }
    }
    return false;
}

function isInClosed(node) {
    for (var i = 0; i< closedNodes.length; i++) {
        if (closedNodes[i] === node) {
            return true;
        }
    }
    return false;
}