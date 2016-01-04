/**
 * @description game engine
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var Engine;
Engine = (function (global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        timer = 0,
        lastTime,
        req;

    canvas.width = 505;
    canvas.height = 636;
    doc.body.appendChild(canvas);

    /**
     * @description This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        timer = timer + 1;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        req = win.requestAnimationFrame(main);

        /* This is a bit of a hack. A could not find any other way of
         * killing requestAnimationFrame.
         */
        if (tl == 0) {
            win.cancelAnimationFrame(req);
            reset();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = 'bold 64px Impact';
            ctx.fillStyle = 'black';
            ctx.fillText('TIME OVER', canvas.width / 2, canvas.height / 2)

            document.getElementById('restart').style.display = 'block';
        }
    }

    /**
     * @description This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        tl = tfl; // (Re)set timer to maximum time
        document.getElementById('restart').style.display = 'none'; // hide restart button (in case it is not the first game)

        lastTime = Date.now();
        main();
    }

    /**
     * @description This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. It also calls the checkCollisions()
     * function used to check for collisions with other objects.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /**
     * @description This function is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. There is no update method for the player since the only updates are
     * moves handled by the handleInput method (app.js).
     */
    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
    }

    /**
     * @description Checks if the player collides with a bug, or colects a star, or reaches the water.
     */
    function checkCollisions() {
        /* this sets the precision around the player.
         * Too big and its impossible to win. Too small and it's impossible to lose.
         */
        var fuzzy = 50;

        // If you collide with a bug, you lose (counter incremented). But try again!
        allEnemies.forEach(function (e) {
            if (player.x > (e.x - fuzzy) && player.x < (e.x + fuzzy)
                && player.y > (e.y - fuzzy) && player.y < (e.y + fuzzy)) {
                player.reset();
                l++;
            }
        });

        // If you collect a star, it moves out of the way and the counter is incremented.
        allStars.forEach(function (e) {
            if (player.x > (e.x - fuzzy) && player.x < (e.x + fuzzy)
                && player.y > (e.y - fuzzy) && player.y < (e.y + fuzzy)) {
                s++;
                e.x = -100;
                e.y = -100;
            }
        })

        // If you reach the water, you win. And it counts!
        if (player.y == -40) {
            w++;
            player.reset();
        }
    }

    /**
     * @description This function initially draws the "game level", it will then call
     * the renderEntities function.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        /* Render scores on top
         * two digits formatting found here : http://stackoverflow.com/questions/8043026/javascript-format-number-to-have-2-digit
         * TODO: if time left is bigger than 59 seconds (tfl or tl > 59), then the timer does not work
         */
        ctx.clearRect(0, 0, canvas.width, 80); // clear upper rectangle to avoid overwriting text
        ctx.textAlign = 'center';
        ctx.font = 'bold 36px Impact';
        ctx.strokeStyle = 'red';
        ctx.strokeText('WON ' + w + ' LOST ' + l + ' STARS ' + s, canvas.width / 2, 50);

        ctx.clearRect(0, 600, canvas.width, 80); // clear upper rectangle to avoid overwriting text
        ctx.strokeText('TIME LEFT 0:' + ('0' + tl).slice(-2), canvas.width / 2, 630);
        if (timer % 60 == 0) {
            tl = tl - 1;
            ctx.clearRect(0, 600, canvas.width, 80); // clear upper rectangle to avoid overwriting text
            ctx.strokeText('TIME LEFT 0:' + ('0' + tl).slice(-2), canvas.width / 2, 630);
        }

        renderEntities();
    }

    /**
     * @description This function is called by the render function and is called on each game
     * tick. Its purpose is to call the render functions for
     * enemies, stars and player within app.js
     */
    function renderEntities() {

        allStars.forEach(function (star) {
            star.render();
        });

        allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        player.render();
    }

    /**
     * @description This function resets all the game: enemies restart from the beginning,
     * stars get back and player gets back to bottom. Counters are reset.
     */
    function reset() {
        allEnemies.length = 0;
        allStars.length = 0;
        player.reset();
        w = 0;
        l = 0;
        s = 0;
    }

    // Load all of the images needed. When all of these images are properly loaded the game will start.
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Star.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;

    // When restart is clicked, the init function is called (restarts the game).
    document.getElementById('restart').onclick = function () {
        init();
    };
})(this);
