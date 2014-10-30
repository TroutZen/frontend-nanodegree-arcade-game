
// used to jump in and out of animation loop
var gameReady = false;


// Rocks that can be climbed on
var Rock = function(x, direction, row, rate, url) {
        this.direction = direction;
        this.x = x;
        this.y = row * 32;
        this.rate = rate;
        this.sprite = Resources.get(url);
}

Rock.prototype.update = function(dt) {
    Enemy.prototype.update.call(this, dt);
    // needs to be able to increment player.x and player.y by the same incredmental rate*dt as the rock
    // only if player is on top of that particular rock...
}

Rock.prototype.render = function() {
    ctx.drawImage(this.sprite, this.x, this.y);
}

function instantiateRocks() {
    var rocksRow0 = [
        new Rock(0, 'right', 2, 60, 'images/Rock-quad.png'),
        new Rock(175, 'right', 2, 60, 'images/Rock-quad.png'),
        new Rock(350, 'right', 2, 60, 'images/Rock-quad.png')
    ];

    var rocksRow1 = [
        new Rock(550, 'left', 3, 50, 'images/Rock-double-brown.png'),
        new Rock(450, 'left', 3, 50, 'images/Rock-double-brown.png'),
        new Rock(350, 'left', 3, 50, 'images/Rock-double-brown.png'),
        new Rock(250, 'left', 3, 50, 'images/Rock-double-brown.png'),
        new Rock(150, 'left', 3, 50, 'images/Rock-double-brown.png')
    ];

    var rocksRow2 = [
        new Rock(-100, 'right', 4, 75, 'images/Rock-six.png'),
        new Rock(450, 'right', 4, 75, 'images/Rock-double.png'),
        new Rock(300, 'right', 4, 75, 'images/Rock-six.png')
    ];

    var rocksRow3 = [
        new Rock(100, 'left', 5, 40, 'images/Rock-double-brown.png'),
        new Rock(225, 'left', 5, 40, 'images/Rock-double-brown.png'),
        new Rock(400, 'left', 5, 40, 'images/Rock-double-brown.png')
    ];

    var rocksRow4 = [
        new Rock(475, 'right', 6, 50, 'images/Rock-triple.png'),
        new Rock(300, 'right', 6, 50, 'images/Rock-triple.png'),
        new Rock(125, 'right', 6, 50, 'images/Rock-triple.png'),
        new Rock(-50, 'right', 6, 50, 'images/Rock-triple.png')
    ];

   window.allRocks = [].concat(rocksRow0, rocksRow1, rocksRow2, rocksRow3, rocksRow4);

}

// Enemies the player must avoid
var Enemy = function(x, direction, row, url) {
        this.direction = direction;
        this.row = row;
        this.x = x;
        this.y = row * 32;
        this.sprite = Resources.get(url);
};

Enemy.prototype.rate = 50;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    // enemies will be able to travel 'off' canvas by the defined # of pixels so they don't start wrapping
    // as soon as they exit on side
    var offCanvasLength = 100;
    var spriteWidth = this.sprite.width;


    // if movement would be out of bounds,
    // wrap to next side


    if ( this.direction === 'left' ) {
        if ( this.x > - offCanvasLength) {
            this.x -= this.rate * dt;
        } else {
            this.x = canvas.width + offCanvasLength;
            this.x -= this.rate * dt;
        }

    }

    if ( this.direction === 'right') {
        if ( this.x < canvas.width + offCanvasLength ) {
            this.x += this.rate * dt;
        } else {
            this.x = - ( offCanvasLength + spriteWidth );
            this.x += this.rate * dt;
        }

    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(this.sprite, this.x, this.y);
};



function instantiateEnemies() {
// Define Enemy Instances;
    var enemy1_row9 = new Enemy(400, 'left', 8, 'images/enemy-bug-left-Length3.png');
    var enemy2_row9 = new Enemy(200, 'left', 8, 'images/enemy-bug-left-Length3.png');
    var enemy3_row9 = new Enemy(0, 'left', 8, 'images/enemy-bug-left-Length3.png');

    var enemy1_row10 = new Enemy(50, 'right', 9, 'images/enemy-bug-right-Length1.png');
    var enemy2_row10 = new Enemy(175, 'right', 9, 'images/enemy-bug-right-Length1.png');
    var enemy3_row10 = new Enemy(300, 'right', 9, 'images/enemy-bug-right-Length1.png');
    var enemy4_row10 = new Enemy(425, 'right', 9, 'images/enemy-bug-right-Length1.png');

    var enemy1_row11 = new Enemy(400, 'left', 10, 'images/enemy-bug-left-Length1.png');
    var enemy2_row11 = new Enemy(275, 'left', 10, 'images/enemy-bug-left-Length1.png');
    var enemy3_row11 = new Enemy(150, 'left', 10, 'images/enemy-bug-left-Length1.png');
    var enemy4_row11 = new Enemy(0, 'left', 10, 'images/enemy-bug-left-Length1.png');


    var enemy1_row12 = new Enemy(0, 'right', 11, 'images/enemy-bug-right-Length1.png');
    var enemy2_row12 = new Enemy(150, 'right', 11, 'images/enemy-bug-right-Length1.png');
    var enemy3_row12 = new Enemy(300, 'right', 11, 'images/enemy-bug-right-Length1.png');
    var enemy4_row12 = new Enemy(450, 'right', 11, 'images/enemy-bug-right-Length1.png');

    var enemy1_row13 = new Enemy(450, 'left', 12, 'images/enemy-bug-left-Length1.png');
    var enemy2_row13 = new Enemy(300, 'left', 12, 'images/enemy-bug-left-Length1.png');
    var enemy3_row13 = new Enemy(150, 'left', 12, 'images/enemy-bug-left-Length1.png');

    
    // [refactor:] this is a bit cumbersone, not very maintainable...adding new enemies requires a bit of manual updating of the array
    // an easier way would be to start by defining an array for each row, and then pushing each array into the allEnemies array
    window.allEnemies = [
        [enemy1_row9, enemy2_row9, enemy3_row9],
        [enemy1_row10, enemy2_row10, enemy3_row10, enemy4_row10], 
        [enemy1_row11, enemy2_row11, enemy3_row11],
        [enemy1_row12, enemy2_row12, enemy3_row12, enemy4_row11],
        [enemy1_row13, enemy2_row13, enemy3_row13]
    ]

}





// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 224;
    this.y = 416;

    this.score = 0;
    this.numLives = 3;

    //fetches player selected imgUrl and stores imgObj on this.sprite
    this.sprite = Resources.get(Resources.playerChoice);

}

Player.prototype.update = function() {
    // might not need dt? incremental movement?
    // not sure why I need an update
}

Player.prototype.render = function() {
    ctx.drawImage(this.sprite, this.x, this.y);
}

Player.prototype.hasKey = function() {

if (player.y === 32) {
    if  (
        (player.x >= key.x && player.x <= key.x + key.sprite.width) 
        || 
        (player.x + player.sprite.width >= key.x && player.x + player.sprite.width  <= key.x + key.sprite.width)
        )
        {
            console.log("player has the key");
            return true;
        }
    }
}

Player.prototype.updateAfterScore = function() {
    var now = Math.floor(Date.now() / 1000);

    // this.lastUpdated - now != 0, is a workout to prevent this from running 60 times/second
    // current not working the way I want nor intuitive, I need score to only register once, not every loop of the animation frame
    if ( player.hasKey() && this.lastUpdated - now != 0  ) { 
        this.score += 100;
        setTimeout(function() {
        player.x = 224;
        player.y = 416;    
    }, 300);
        
        this.lastUpdated = now;
        increaseGameRate();
    }
}

Player.prototype.handleInput = function(pressedKey) {
    switch (pressedKey) {
        case 'left':
            if (this.x - 1 >= 0) {
                this.x -= 32;
            }
            break;
        case 'up':
            if (this.y - 1 >= 0) {
                this.y -= 32;
            }
            break;
        case 'right':
            if (this.x + 33 < canvas.width) {
                this.x += 32;
            }
            break;
        case 'down':
            if (this.y + 33 < canvas.height - 2 * 32) {
                this.y += 32;    
            }
            break;
    }
}

Player.prototype.reset = function() {
    this.x = 224;
    this.y = 416;
    this.score = 0;
    this.numLives = 3;

    //this needs to be uddated to be able to handle different player choices...
    // this.sprite = Resources.get("images/char-boy-dead.png");
}

Player.prototype.isDead = false;

Player.prototype.lastUpdated;

Player.prototype.updateAfterDeath = function() {
    var originalSpriteWidth = this.sprite.width;
    var deadCharImgUrl = Resources.playerChoice.slice(0, -4) + "-dead.png";

    this.isDead = true;

    this.sprite = Resources.get(deadCharImgUrl);

    // this adjusts for the different size of the sprites, so that it renders in the correct 'adjusted' position
    this.x -= (this.sprite.width - originalSpriteWidth) / 2;
    this.render();

    // delays the 'reset'
    // code getting spaghetti, need to refactor and abstract into other functions

    // [solved:] why does the this context change within setTimeout? (b/c setTimeout itself is a property on window so by calling this becomes the window)
    setTimeout(function() {
        player.isDead = false;
        player.x = 224;
        player.y = 416;
        player.sprite = Resources.get(Resources.playerChoice);        
    }, 400);    
}


// Place the player object in a variable called player
function createPlayer() {
    window.player = new Player(); 
}


function Key() {
    this.x = 0;
    this.y = 32;
    this.sprite = Resources.get('images/Key.png');
    this.lastUpdated;

    this.update = function() {
        var now = Math.floor(Date.now() / 1000); //integer # of seconds (relative)

        // updates every 10 seconds, moves to random location; this.lastUpdated - now != 0 prevents it from running 60times/second instead only does once/second
        if ( now % 10 === 0 && this.lastUpdated - now != 0) {
            console.log("moved key");
            this.x = Math.floor(Math.random() * 14) * 32;
            this.lastUpdated = now;
            
        }
    };

    this.render = function() {
       ctx.drawImage(this.sprite, this.x, this.y); 
    };


}

function createKey() {
    window.key = new Key();
}


function PointsBubble() {
    this.y = 0;
    this.sprite = Resources.get("images/100Points.png");
    this.render = function() {
        if ( player.hasKey() ) {
            ctx.drawImage(this.sprite, player.x + player.sprite.width, this.y);    
        }  
    };
}

function createPointsBubble() {
    window.pointsBubble = new PointsBubble();
}


function increaseGameRate() {
    var ratePercentIncrease = 1.03;

    allEnemies.forEach(function(row) {
        row.forEach(function(enemy) {
            enemy.rate *= ratePercentIncrease;
        });
    });

    allRocks.forEach(function(rock) {
        rock.rate *= ratePercentIncrease;
    });
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
function addKeydownEventListener() {
    document.addEventListener('keydown', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    });

}

