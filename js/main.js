// JavaScript source code for Space Invaders Game

var game = new Phaser.Game(500, 400, Phaser.AUTO, null, {
    preload: preload,
    create: create,
    update: update
});

var ship;
var bulletInfo = false;
var bulletTime = 0;
var alien;
var alienInfo;
var newAlien; 
var score = 0;
var scoreText;
var lives = 3;
var livesText;

function preload() {
    //scale object
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = 'black';

    //load image of the ship
    game.load.image('ship', 'img/ship2.png');

    //load image of bullet
    game.load.image('bullet', 'img/bullet.png');

    //load image of the alien
    game.load.image('alien', 'img/alien2.png');

}

function create() {
    //initialize the Arcade Physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //create the group of bullets using the group factory
    bullet = game.add.group();
    //to move the sprites bullet on, we have to enable the body
    bullet.enableBody = true;
    //only ARCADE physics, because don't need any advanced physics
    bullet.physicsBodyType = Phaser.Physics.ARCADE;
    //create 30 sprites and add it to the stage, byt they are inactive
    //and invisible. We'll clean and reset they're off the screen
    bullet.createMultiple(30, 'bullet');
    //setting for every bullet
    bullet.setAll('anchor.x', 0.5);
    bullet.setAll('anchor.y', 1);
    bullet.setAll('outOfBoundsKill', true);
    bullet.setAll('checkWorldBounds', true);

    //create the ship
    ship = game.add.sprite(game.world.width * 0.5, game.world.height - 40, 'ship');
    ship.anchor.set(0.5);
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.collideWorldBounds = true;

    //create the alien
    alien = game.add.group();
    alien.enableBody = true;
    alien.physicsBodyType = Phaser.Physics.ARCADE;
    initAliens();

    //score text
    scoreText = game.add.text(5, 5, 'Points: 0', { font: '18px Verdana', fill: 'white' });
}

function update() {
    cursors = game.input.keyboard.addKeys({
        'shot': Phaser.Keyboard.SPACEBAR,
        'left': Phaser.Keyboard.LEFT,
        'right': Phaser.Keyboard.RIGHT
    });
    if (cursors.left.isDown) {
        ship.body.velocity.x = -150;
    }
    else if (cursors.right.isDown) {
        ship.body.velocity.x = 150;
    }
    else if (cursors.shot.isDown) {
        shootBullet();
    }
    else {
        ship.body.velocity.x = 0;
    }

    game.physics.arcade.collide(bullet, alien, bulletHitAlien);
}

function shootBullet() {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime) {
        //  Grab the first bullet we can from the pool
       bullets = bullet.getFirstExists(false);

        if (bullets) {
            //  And fire it
            bullets.reset(ship.x, ship.y + 8);
            bullets.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }
}

function initAliens() {
    aliensInfo = {
        width: 50,
        height: 20,
        count: {
            row: 7,
            col: 4
        },
        offset: {
            top: 50,
            left: 20
        },
        padding: 10
    };

    for (c = 0; c < aliensInfo.count.col; c++) {
        for (r = 0; r < aliensInfo.count.row; r++) {
            var alienX = (r * (aliensInfo.width + aliensInfo.padding)) + aliensInfo.offset.left;
            var alienY = (c * (aliensInfo.height + aliensInfo.padding)) + aliensInfo.offset.top;

            newAlien = alien.create(alienX, alienY, 'alien');
            newAlien.body.immovable = true;
            newAlien.anchor.setTo(0.5, 0.5);
        }
    }

    var tween = game.add.tween(alien).to({
        x: 100
    }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
}

function bulletHitAlien(bullet, alien) {
    alien.kill();
    bullet.kill();
    score += 10;
    scoreText.setText('Points: ' + score);
}