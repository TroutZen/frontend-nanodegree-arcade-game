/* 
Notes:
- some sloppy reuse of code, especially in images, should load master list and make copies/slice as needed
- some of the functions can be refactored, including isContained in, perhaps can be moved to collision


*/

// [question:] why do we run the IIFE in a variable?
var Engine = (function(global) {
	


	$(document).ready(function() {

		var win = global.window,
			doc = global.document,
			canvas = $('#canvas-game')[0],
			ctx = canvas.getContext('2d'),
			canvasBackground = $('#canvas-background')[0],
			ctxBackground = canvasBackground.getContext('2d'),
			startX = 208,
			startY = 100,

			patterns = {},
			unitLength = 32,
			lastTime;

			
		var imgs = [
			"images/char-boy.png",
			"images/char-cat-girl.png",
			"images/char-horn-girl.png",
			"images/char-pink-girl.png",
			"images/char-princess-girl.png",
			"images/selectPlayer.png",
			"images/playerSelector.png"
		];

		var chars = imgs.slice(0, 5);

		
		function wireEventHandlers() {

			$('#canvas-game').on({
				mouseenter: function() {
					$(this).css('cursor', 'pointer');
				},

				mousemove: function(e) {
					renderSelector(e);
				},

				click: function(e) {

					// initiates game if clicked a valid option
					validateChoice(e);
					
					// changes game state so animation loop can begin.
					gameReady = true;	
					
					//kicks off game, after player is chosen
					init();


				}
			});
		}

		function removeEventHandlers() {
			// removes event handlers required for player select, but not required for rest of game
			$('#canvas-game').off("click mousemove mouseenter");
		}


		function renderCharSelectScreen() {
			// canvas.clearRect(0,0, canvas.width, canvas.height);			
			var currX = startX;
			var currY = startY;

			// renders "Select Player"
			ctx.drawImage(Resources.get(imgs[5]), (canvas.width - Resources.get(imgs[5]).width) / 2, 20);

			// renders character models
			for (var i = 0; i < chars.length; i++) {
				ctx.drawImage(Resources.get(chars[i]), currX, currY);
				currY += 32 + 20;
			}
		}


		// renders the green selector on the CharSelectScreen
		function renderSelector(e) {
			
			var unitWidth = 32,
				unitHeight = 52,
				xOffset = 208 - unitWidth, // definition is very 'hacky', there is a more simple and intuitive way
				yStart = 85, 				// definition is very 'hacky', there is a simpler and better way
				selectorImgUrl = "images/playerSelector.png";

			function clearRect() {
				ctx.clearRect(208 - unitWidth, 100, unitWidth, unitHeight * 5);
			}

			function drawSelector(imgUrl, xpos, ypos) {
				ctx.drawImage(Resources.get(imgUrl), xpos, ypos);
			}

			// Check if outside of selection bounds, clear selector image area if it is	
			if (e.clientY < 100 || e.clientY > 100 + 5 * unitHeight) {
				clearRect();
			}

			// Detect which character the person is hovering around
			else if (e.clientY >= 100 && e.clientY < 100 + 1 * unitHeight) {
				clearRect();
				drawSelector(selectorImgUrl, xOffset, yStart + unitWidth / 2 );
			}

			else if (e.clientY >= 100 + 1 * unitHeight && e.clientY < 100 + 2 * unitHeight) {
				clearRect();
				drawSelector(selectorImgUrl, xOffset, yStart + unitHeight + unitWidth / 2);
			}

			else if (e.clientY >= 100 + 2 * unitHeight && e.clientY < 100 + 3 * unitHeight) {
				clearRect();
				drawSelector(selectorImgUrl, xOffset, yStart + unitHeight * 2 + unitWidth / 2);
			}

			else if (e.clientY >= 100 + 3 * unitHeight && e.clientY < 100 + 4 * unitHeight) {
				clearRect();
				drawSelector(selectorImgUrl, xOffset, yStart + unitHeight * 3 + unitWidth / 2);
			}

			else if (e.clientY >= 100 + 4 * unitHeight && e.clientY < 100 + 5 * unitHeight) {
				clearRect();
				drawSelector(selectorImgUrl, xOffset, yStart + unitHeight * 4 + unitWidth / 2);
			}
		}



		function validateChoice(e) {
			// [refactor:] DRY, these are repeated in other function
			var unitWidth = 32,
				unitHeight = 52;

			// mapping a particular player choice to an area on the screen, used to deduce selection
			var playerCharLocation = {
				"images/char-boy.png": startY,
				"images/char-cat-girl.png": startY + unitHeight,
				"images/char-horn-girl.png": startY + 2 * unitHeight,
				"images/char-pink-girl.png": startY + 3 * unitHeight,
				"images/char-princess-girl.png": startY + 4 * unitHeight
			};

			for (var key in playerCharLocation) {
				if (e.clientY > playerCharLocation[key] && e.clientY <= playerCharLocation[key] + unitHeight) {
					// alert("Player chose: " + key);
					Resources.playerChoice = key;
					break;
				}
			}

		}


		// Main animation loop
		function main() {
			
			// if player is alive and player doesn't have the key, keep updating/rendering...
			if ( gameReady === true && !player.isDead ) {		
		        var now = Date.now(),                   // # of ms since time 0
		            dt = (now - lastTime) / 1000.0;     // a delta t in seconds

		        lastTime = now;

		        update(dt); // this needs to update all the data that will be necessary for the next rendering loop (x,y,time, etc.)                           
		        render();
	        }

	        win.requestAnimationFrame(main);
    	};


    	// Game initialization, called once to trigger main
    	function init() {

    		// removes handlers needed for player selection screen
    		removeEventHandlers();

    		// render background canvas;
    		renderBackgroundCanvas();

    		// creates event listener for player keydown
    		addKeydownEventListener();

    		// instantiates the key object
    		createKey();

    		// instantiates the bubble object to be used when needed
    		createPointsBubble();

    		// instantiates a new player instance in global scope
    		createPlayer();

	        lastTime = Date.now();
	        main();

	    }


    	// update is called every animation frame, checks for s, and updates state of enemy and player
	    function update(dt) {
	        checkCollisions();

	        checkForScore();
	        

	        key.update();
	        updateEntities(dt);
	    }

	    // checks whether there is a scoring event (player has Key)
	    function checkForScore() {
	    	if ( player.hasKey() ) {
	    		player.updateAfterScore();
	    	}
	    }

	    function checkCollisions() {

	    	if ( player.y >= 64 && player.y <= 192 ) {
	    		if ( !allRocks.some(function(rock) { return isOnTopOf(rock) }) ) {
	    			player.numLives--;
	    			if (player.numLives < 1) {
	    				window.location.reload(true);
	    				// reset();
	    			} else {

	    				console.log("Player drowned");
	    				updateAfterDeath();
	    			}
	    		}

	    		// kills player if he is out of bounds in the rock rows
	    		if ( player.x < 0 || player.x > canvas.width ) {
	    			updateAfterDeath();
	    		}
	    	}


	    	if ( player.y <= 384 && player.y >= 256) {
		    	allEnemies.forEach(function (row) {
		    		row.forEach(function(enemy) {	    			

	    				if ( isContainedIn(enemy) ) {
	    					player.numLives--;    				
	    					if (player.numLives < 1) {
	    						window.location.reload(true);
	    						// reset();

	    					} else {
		    					//just reset position of player
								updateAfterDeath();

	    					}
	    				}
		    		});
		    	});
		    }

		    // if player doesn't have key and he's in the key row --> dead
		    if ( player.y === 32) {		    	
		    	if ( !player.hasKey() ) {
		    		player.numLives--; 
		    		updateAfterDeath();
		    		if (player.numLives < 1) {
    					reset();
					} else {
    					//just reset position of player
						updateAfterDeath();
					}
		    	} 
		    	
		    }

	    }



	    function updateEntities(dt) {
	    	// dynamic attributes need to be updated after each loop (position, time etc.)

	    	// not working the way I want too...
	    	allRocks.forEach(function(rock) {
	    		rock.update(dt);

	    		if (isOnTopOf(rock)) {
	    			switch(rock.direction) {
	    				case 'left':
	    					player.x -= rock.rate * dt;
	    					break;
    					case 'right':
    						player.x += rock.rate * dt;
    						break;
	    			}
	    		}
	    	});

	    	// don't think this does anything
	        player.update();


	        for (var i = 0; i < allEnemies.length; i++) {
	        	for (var j = 0; j < allEnemies[i].length; j++) {
	        		allEnemies[i][j].update(dt);
	        	}
	        }
	        
	    }



	    function render() {

	        ctx.clearRect(0,0, canvas.width, canvas.height);
	        
	        // number of lives player has left - displayed in the lower panel
	        renderNumLives();
	        renderScore();


			renderRocks();
	        key.render();
	        pointsBubble.render();
	        renderEntities(); //this must be rendered last b/c player must be rendered on top of all elements
	    }


	    // this will be rendered once, on init() b/c they are static elements.
	    function renderBackgroundCanvas() {
	    	var canvas = $('#canvas-background')[0];
	    	var ctx = canvas.getContext('2d');

	    	var rowImages = [
	            "images/test_images/grass-block-top.png",
	            "images/test_images/grass-block.png",
	            "images/test_images/water-block.png",
	            "images/test_images/road-block-2.png",
	            "images/test_images/stone-block-middle.png",
	            "images/test_images/stone-block.png",
	            "images/test_images/water-block.png",
	            "images/test_images/water-block-full.png",
	            "images/test_images/grass-block-full.png"
	        ],
	        numRows = 16,
	        numCols = 14,
	        row, col;
	        

	        function renderBackground(imgObj, startRow, numRows) {
	            for (row = startRow; row < startRow + numRows; row++) {
	                for (col = 0; col < numCols; col++) {
	                    var _img = imgObj;
	                    ctx.drawImage(_img, col * unitLength, row * unitLength);
	                }
	            }

	        }


	        ctx.drawImage(Resources.get(rowImages[7]), 0, 64);
	        ctx.drawImage(Resources.get(rowImages[7]), 0, 8 * 32);
	        renderBackground(Resources.get(rowImages[1]), 1, 1);
	        renderBackground(Resources.get(rowImages[0]), 0, 1);	        
	        renderBackground(Resources.get(rowImages[5]), 13, 1);
	        renderBackground(Resources.get(rowImages[4]), 7, 1);
	    }


	    function renderRocks() {

	    	allRocks.forEach(function(rock) {
	    		rock.render();
	    	});

	    }

 
 		// Entities rendered on each loop of main()
	    function renderEntities() {
	        

	        allEnemies.forEach(function(row) {
	            row.forEach(function(enemy) {
	            	enemy.render();
	            })
	        });

	        player.render();
	        
	    }

	    function renderNumLives () {
	    	var numLives = +player.numLives;

	    	ctx.font="20px Arial";
	    	ctx.fillStyle = 'yellow';
	    	ctx.fillText(numLives, 100 + 70, 493);
	    }

	    function renderScore () {
	    	var score = +player.score;

	    	ctx.fillText(score, 375, 493);

	    }


	    // noop stands for no-operation. Not sure if it is being used here in that context. 
	    // http://stackoverflow.com/questions/21634886/what-is-the-javascript-convention-for-no-operation
	    // "intended to prevent code from crashing by providing a default function in place of undefined"
	    function reset() {
	        gameReady = false;
	        console.log("the whole game should reset");	
	        
	        // clearing the appropriate canvases is not working as intended. 
	        ctxBackground.clearRect(0, 0, canvasBackground.width, canvasBackground.height);
	        ctx.clearRect(0,0, canvas.width, canvas.height);

	        renderCharSelectScreen();
	        wireEventHandlers();

	        // reset all objects and go back to char select screen
	        // player.reset();
	    }

	    function updateAfterDeath() {
	    	player.updateAfterDeath();
	    }


	    //[question: meta] is there an advantage/disadv to nesting functions in other functions i.e. this is only called within one function, checkCollision, could it go there?
	    function isContainedIn(enemy) {
	    	var collisionTolerance = 8;
	    		enemy_lowerX = enemy.x + collisionTolerance,
	    		enemy_upperX = enemy.x - collisionTolerance + enemy.sprite.width,
	    		enemy_lowerY = enemy.y + collisionTolerance,
	    		enemy_upperY = enemy.y - collisionTolerance + enemy.sprite.height,
	    		player_lowerX = player.x,
	    		player_upperX = player.x + player.sprite.width,
	    		player_lowerY = player.y + collisionTolerance,
	    		player_upperY = player.y - collisionTolerance + player.sprite.height;


	    	if ( 

	    		(
	    		(player_lowerX >= enemy_lowerX && player_lowerX <= enemy_upperX) ||
	    		(player_upperX >= enemy_lowerX && player_upperX <= enemy_upperX) 
	    		)
	    		&&
	    		(
	    		(player_lowerY >= enemy_lowerY && player_lowerY <= enemy_upperY) ||
	    		(player_upperY >= enemy_lowerY && player_upperY <= enemy_upperY)
	    		)
	    	) {
	    		return true;
	    	}		   
	    } 


	  	function isOnTopOf(rock) {
	  		var p = player,
	  			r = rock;

	  			
			var playerMidpointX = pMX = p.x + (p.sprite.width / 2);
			var playerMidpointY = pMY = p.y + (p.sprite.height / 2);                
			
			// if the midpoint is bounded by rock
			if ( pMX >= r.x && pMX <= r.x + r.sprite.width && pMY >= r.y && pMY <= r.y + r.sprite.height ) {
				return true;
			}
	    }


		Resources.load(imgs);
		Resources.load([
	            "images/test_images/grass-block-top.png",
	            "images/test_images/grass-block.png",
	            "images/test_images/water-block.png",
	            "images/test_images/road-block-2.png",
	            "images/test_images/stone-block-middle.png",
	            "images/test_images/stone-block.png",
	            "images/test_images/water-block.png",
	            "images/test_images/water-block-full.png",
	            "images/test_images/grass-block-full.png",
	            'images/enemy-bug-left-Length3.png',
	            'images/enemy-bug-right-Length1.png',
	            'images/enemy-bug-left-Length1.png',
	            'images/char-boy-dead.png',
	            'images/char-cat-girl-dead.png',
	            'images/char-horn-girl-dead.png',
	            'images/char-pink-girl-dead.png',
	            'images/char-princess-girl-dead.png',
	            'images/Rock.png',
	            'images/Rock-double.png',
	            'images/Rock-triple.png',
	            'images/Rock-quad.png',
	            'images/Rock-six.png',
	            'images/Rock-double-brown.png',
	            'images/Key.png',
	            'images/100Points.png'
	        ]);

		Resources.onReady(renderCharSelectScreen);
		Resources.onReady(wireEventHandlers);
		Resources.onReady(instantiateEnemies);
		Resources.onReady(instantiateRocks);		

		global.canvas = canvas;
		global.ctx = ctx;
	});

})(this);