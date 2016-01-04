var w = 0, l = 0, s = 0; // wins and losts counters
var tl; // timer
var tfl = 2; // time available until game over

/**
 * This functions generates a random number between min and max
 * @param {number} min
 * @param {number} max
 * @returns {number} A random integer between min (included) and max (not included)
 */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * @description This function initiates a object of class Enemy
 * @constructor
 *
 * This class has no parameter, but some methods :
 * @method {string} sprite - The image of the enemy
 * @method {number} x - x-position of image (initially set to first column)
 * @method {number} y - y-position of image (initially randomly set to 2nd, 3rd or 4th row)
 * @method {number} speed - speed of enemy (pixels per frame)
 * @method {number} maxSpeed - maximum speed of enemy (initially set to 200 pixels per frame)
 */
var Enemy = function () {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = 60 + getRandomNumber(0, 3) * 83;
    this.maxSpeed = 200; // This can be changed to
    this.speed = getRandomNumber(50, this.maxSpeed);
};

/**
 * @description updates the Enemy, i.e. moves the enemy to the right of the board at given speed
 * @param dt a time delta between ticks, ensures speed is consistent across different computers
 */
Enemy.prototype.update = function (dt) {
    this.x = this.x + this.speed * dt;
};

/**
 * @description Renders the enemy, uses resources.js and Resources loaded by engine.js
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * @description This function initiates a object of class Player
 * @constructor
 *
 * This class has no parameter, but some methods :
 * @method {string} sprite - The image of the enemy
 * @method {number} x - x-position of image (initially set to 3rd (middle) column)
 * @method {number} y - y-position of image (initially set to 5th (bottom) row)
 */
var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.x = 2 * 101;
    this.y = 5 * 75;
};

/**
 * @description Updates the player when it reaches the water. Increments wins, calls player.reset() function (see above)
 *
 * note that collisions with enemies and stars are handled by checkCollisions() in engine.js
 */
Player.prototype.update = function () {
    // If you reach the water, you win. And it counts!
    if (this.y == -40) {
        w++;
        this.reset();
    }
};

/**
 * @description Renders the player, uses resources.js and Resources loaded by engine.js
 */
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * @description Handles input by the user and moves the player accordingly
 * @param {string} key - keycode 'left', 'up', 'right' or 'down'
 */
Player.prototype.handleInput = function (key) {
    switch (key) {
        case "right":
            if (this.x < 4 * 101) {
                this.x = this.x + 101;
            }
            break;

        case "left":
            if (this.x > 0) {
                this.x = this.x - 101;
            }
            break;

        case "down":
            if (this.y < 5 * 75) {
                this.y = this.y + 83;
            }
            break;

        case "up":
            if (this.y > 0) {
                this.y = this.y - 83;
            }
            break;
    }
};

Player.prototype.reset = function () {
    this.x = 2 * 101;
    this.y = 5 * 75;

    allEnemies.length = 0;

    allStars.length = 0;
    [1, 2, 3].forEach(function (i) {
        allStars.push(new Star());
    });
};

var Star = function () {
    this.sprite = 'images/Star.png';

    this.x = getRandomNumber(0, 4) * 101;
    this.y = 75 + getRandomNumber(0, 3) * 83;
};

Star.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// creates an array for storing enemies
// Randomly creates new enemies every 500 to 1000 milliseconds. Enemies are added to the above created array.
var allEnemies = [];
setInterval(function () {
    allEnemies.push(new Enemy());
}, getRandomNumber(750, 1000));

var player = new Player(); // Creates a new player object

var allStars = [];

[1, 2, 3].forEach(function (i) {
    allStars.push(new Star());
});

// This listens for key presses and sends the keys to Player.handleInput() method.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
