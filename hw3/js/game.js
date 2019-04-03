var config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 607.5,
    pixelArt: true,
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
var map, player;
var playerSpeed = 256;
var playerIsMoving = false;
var destX, destY;

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
    var backgroundLayer = map.createStaticLayer("Background", tileSet, 0, 0).setDepth(-1);
    var collisionLayer = map.createStaticLayer("Collision", tileSet, 0, 0);
    

    // PLAYER
    player = this.physics.add.sprite(48, 48, 'mantis');
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

    // COLLISIONS
    this.physics.add.collider(player, collisionLayer);
    collisionLayer.setCollisionByProperty({collides:true});

    // SCALING
    backgroundLayer.setScale(0.5);
    collisionLayer.setScale(0.5);
    player.setScale(0.5);

    // CAMERA
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    // DISPLAY TEXT
    readMeText = this.add.text(624, 480, readMe(), {
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
    this.input.keyboard.on('keydown-' + 'L', function (event) {
        // Show path
    });

    
}

function update() {
    
    if (this.input.mousePointer.isDown) {
        var radians = Phaser.Math.Angle.Between(player.getCenter().x, player.getCenter().y, this.input.x, this.input.y) + (90 * Math.PI/180);
        player.setRotation(radians);
        player.anims.play('move', true);
        playerIsMoving = true;
        destX = Math.round(this.input.x);
        destY = Math.round(this.input.y);

        this.physics.moveTo(player, destX + this.cameras.main.scrollX, destY + this.cameras.main.scrollY, playerSpeed);
    }
    playerX = Math.round(player.x);
    playerY = Math.round(player.y);
    if (destX == playerX && destY == playerY) {
        player.body.setVelocity(0);
        playerIsMoving = false;
        player.anims.play('idle', true);
    }

    readMeText.setText(readMe());

}

function readMe() {
    var instructions = "Press \"M\" to increase velocity\n" + "Press \"N\" to decrease velocity\n" + "Press \"L\" to show paths\n"
    var playerVel = "Player Velocity: " + playerSpeed;
    return instructions + playerVel;
}