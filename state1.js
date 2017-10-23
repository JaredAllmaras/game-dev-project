//Start of gameplay
var cursors, vel = 200, pathFinder, gameWidth, gameHeight, tileSize = 32, collisions, grass, player, zombie, zombieTwo, houseZombies, zombies, barrelX, barrelY ,bullet, bullets, fireRate = 100, nextFire = 200, house, healthBar, path, pathFinder, grid, gridBackup;

/*var timer;
var total = 0;*/

demo.state1 = function(){};

demo.state1.prototype = {    
    preload: function() {
        game.load.tilemap('field', 'assets/Tilemaps/singleHouseMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('grass', 'assets/Tilemaps/grass.png');
        game.load.image('dirt', 'assets/Tilemaps/dirtTile.png');
        game.load.image('house', 'assets/Tilemaps/house.png');
        game.load.image('fence', 'assets/Tilemaps/fence.png');
        game.load.image('fenceUp', 'assets/Tilemaps/fenceUp.png');
		game.load.image('bullet', 'assets/sprites/bullet.png');
        game.load.image('collision', 'assets/Tilemaps/collision.png');
        game.load.spritesheet('hunter', 'assets/sprites/hunterSprites.png', 58, 69);
        game.load.spritesheet('zombie','assets/sprites/zombieSprites.png', 52, 67);
        game.load.spritesheet('bloodSplatter', 'assets/sprites/bloodSpritesheet.png', 170, 120);
        game.load.json('gameMap', 'assets/Tilemaps/singleHouseMap.json');
    },

    create: function() {
     /*   //creating the timer
        timer = game.time.create(false);
        //  Set a TimerEvent to occur after 2 seconds (?)
        timer.loop(2000, updateCounter, this);
        //start the timer
        timer.start();*/
        //establishing physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //display settings for screen
        game.stage.backgroundColor = '#DDDDDD';
        game.world.setBounds(0, 0, 4000, 3200);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.renderer.renderSession.roundPixels = true;
        
        //Loads a copy of of the collision layer
        var collisionLayer = game.cache.getJSON('gameMap');
        var mapCopy = collisionLayer.layers[0].data;
        var mapCopyWidth = mapCopy.length;
        
        for (var i = 0; i < mapCopyWidth; i++) {
            if ((mapCopy[i] != 1 ) && (mapCopy[i] != 0)) { 
                mapCopy[i] = 1;
            }
        }
        
        
        var mapMatrix = this.listToMatrix(mapCopy, 125);
        grid = new PF.Grid(mapMatrix);
        pathFinder = new PF.AStarFinder();
        
        //LOADING MAP ASSETS AND MAP LAYERS
        var map = game.add.tilemap('field');
        map.addTilesetImage('collision', 'collision');
        map.addTilesetImage('grass', 'grass');
        map.addTilesetImage('dirt', 'dirt');
        map.addTilesetImage('fenceUp', 'fenceUp');
        map.addTilesetImage('fence', 'fence');
        map.addTilesetImage('house', 'house');
        collisions = map.createLayer('collisions');
        grass = map.createLayer('grass');
        dirt = map.createLayer('dirt');
        
        map.setCollision(157, true, 'collisions');
		
			        
        //Create Bullets and the group
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		
		bullets.createMultiple(50, 'bullet');
		bullets.setAll('checkWorldBounds',true);
		bullets.setAll('outOfBoundsKill', true);
        bullets.damage = 10;
		
        
        //creates a listener for keyboard input
        cursors = game.input.keyboard.createCursorKeys();
        
        //CREATES ANOTHER MAP LAYER RENDERED ON TOP OF BULLETS 
        fence = map.createLayer('fence');
        
        /////////////////////////////////////////////////////
        //CODE FOR PLAYER
		/////////////////////////////////////////////////////
        //enables physics to player and sets player settings
        player = game.add.sprite(1938,1279, 'hunter');
        game.physics.enable(player);
        player.body.collideWorldBounds = true;
        player.scale.setTo(0.7, 0.7);
        player.anchor.setTo(0.5, 0.5);
        game.camera.follow(player);
        
        player.animations.add('upRight', [0, 1, 2, 3], 9, true);
        player.animations.add('upLeft', [4, 5, 6, 7], 9, true);
        player.animations.add('right', [8, 9, 10, 11], 9, true);
        player.animations.add('left', [12, 13, 14, 15], 9, true);
        player.animations.add('downRight', [16, 17, 18, 19], 9, true);
        player.animations.add('downLeft', [20, 21, 22, 23], 9, true);
        player.animations.add('up', [24, 25, 26,27], 9, true);
        player.animations.add('down', [28, 29, 30, 31], 9, true);
        player.health = 100;
        player.damage = 10;
        
	

        /////////////////////////////////////////////////
		//CODE FOR ZOMBIES
		////////////////////////////////////////////////
        //Create a group of Zombies 
        zombies = game.add.group();
        zombies.enableBody = true;       
		zombies.damageAmount = 10;
        
        houseZombies = game.add.group();
        houseZombies.enableBody = true;       
		houseZombies.damageAmount = 10;	
		
        //DISPLAY HOUSE
		//CREATES TOP LAYER OF THE MAP, RENDERED ABOVE ALL ELSE
		house = game.add.sprite(1938,1279,'house');
		house.health = 10000;
        
        //create zombies 
        for ( var i = 0; i<50; i++)
        {
 
            var randomX = game.world.randomX;
            var randomY = game.world.randomY;
            zombie = new Zombie(game, randomX, randomY, player);
            
            //path = pathFinder.findPath(zombie.x, zombie.y, player.x, player.y, gridBackup);
            //zombie.setPath(path);
            zombies.add(zombie);

            randomX = game.world.randomX;
            randomY = game.world.randomY;

            gridBackup = grid.clone();
            randomX = game.world.randomX;
            randomY = game.world.randomY;
            zombieTwo = new Zombie(game, randomX, randomY, house);
            //path = pathFinder.findPath(zombieTwo.x, zombieTwo.y, house.x, house.y, gridBackup);
            //zombieTwo.setPath(path);
            houseZombies.add(zombieTwo);
            
        }
        
        zombies.forEach(function(self) {
            gridBackup = grid.clone();
            path = pathFinder.findPath(Math.floor(self.x / 32),Math.floor(self.y / 32), Math.floor(house.x / 32), Math.floor(house.y / 32), gridBackup);
            self.setPath(path);
        },
            game.physics.arcade, false);
        
        houseZombies.forEach(function(self) {
            gridBackup = grid.clone();
            path = pathFinder.findPath(Math.floor(self.x / 32),Math.floor(self.y / 32), Math.floor(house.x / 32), Math.floor(house.y / 32), gridBackup);
            self.setPath(path);
        },
            game.physics.arcade, false);
        
        
        //DISPLAY HEALTH
		healthBar = game.add.text(game.world.width - 150,10,'HEALTH: ' + player.health +'%', {font:'20px Cambria', fill: '#fa0a0a'});
		healthBar.render = function(){
		healthBar.text = 'HEALTH : '+ player.health +'%';    
		};
		healthBar.fixedToCamera = true;
		healthBar.cameraOffset.setTo(2,5);

		//House Health Text Bar
		houseHealth = game.add.text(game.world.width - 150,10,'HOUSE: ' + house.health +'%', {font:'20px Cambria', fill: '#fa0a0a'});
		houseHealth.render = function(){
		houseHealth.text = 'HOUSE : '+ house.health +'%';    
		};
		houseHealth.fixedToCamera = true;
		houseHealth.cameraOffset.setTo(2,30);
        
        //House Anchoring
        game.physics.enable(house);
		house.anchor.setTo(.5,1.0);
        house.body.setSize(480, 160, 0, 128);
		house.enableBody = true;
		house.body.immovable = true;
		house.body.moves = false;
        
        /*//Point Bar
        pointVal = game.add.text(game.world.width + 100, 200, 'POINTS: ' + timer.duration.toFixed(0), {font:'20px Cambria', fill: '#fa0a0a'});
        pointVal.render = function(){
		pointVal.text = 'POINTS: ' + timer.duration.toFixed(0);    
		};
        pointVal.fixedToCamera = true;
		pointVal.cameraOffset.setTo(1000,10);*/
    		        	
    },
    
    update: function() {
        //IF STATEMENT FOR ENDING THE GAME - "If point value hits 0"
        
        if (player.health <= 0 || house.health <= 0) {
            player.kill();
            game.state.start('state2');
        }
        
        //causes zombies to constantly move towards player
		//IF STATEMENT TO MOVE CLOSER TO HOUSE OR PLAYER
        zombies.forEachAlive(function(self) {
            if (self.path[0] != [] && self.path[0] != undefined) {
                var currentX = Math.floor(self.x / 32)
                var currentY = Math.floor(self.y / 32)
                var currentXGoal = self.path[0][0];            
                var currentYGoal = self.path[0][1];
                var pathLength = self.path.length;
                var finalGoalX = self.path[pathLength - 1][0];
                var finalGoalY = self.path[pathLength - 1][1];
                
                if (Math.abs(Phaser.Math.distance(self.x, self.y, currentXGoal, currentYGoal)) > Math.abs(Phaser.Math.distance(self.x, self.y, player.x, player.y))) {
                    
                    self.path = [];
                    game.physics.arcade.moveToObject(self, player);
                    /*gridBackup = grid.clone();
                    path = pathFinder.findPath(Math.floor(self.x / 32),Math.floor(self.y / 32), Math.floor(house.x / 32), Math.floor(house.y / 32), gridBackup);
                    self.setPath(path); */
                } 

                if (currentX != currentXGoal && currentY != currentYGoal) {                
                    game.physics.arcade.moveToXY(self, Math.floor(currentXGoal * 32), Math.floor(currentYGoal * 32), 50);
                }
                /*else if (Phaser.Math.distance(self.x, self.y, Math.floor(finalGoalX * 32), Math.floor(finalGoalY * 32)) >  game.physics.arcade.distanceBetween(self, player)) {
                    gridBackup = grid.clone();
                    path = pathFinder.findPath(Math.floor(self.x / 32),Math.floor(self.y / 32), Math.floor(player.x / 32), Math.floor(player.y / 32), gridBackup);
                    self.setPath(path);
                }*/
                else {                
                    self.path.shift();
                }        
            }
            else if (Math.abs(Math.floor(self.body.velocity.x)) < 40 && Math.abs(Math.floor(self.body.velocity.y)) < 40) {
                gridBackup = grid.clone();
                path = pathFinder.findPath(Math.floor(self.x / 32),Math.floor(self.y / 32), Math.floor(player.x / 32), Math.floor(player.y / 32), gridBackup);
                self.setPath(path);
            }
            
            else {
                game.physics.arcade.moveToObject(self, player, 50);
            }
        }, game.physics.arcade, false);
        
        houseZombies.forEach(function(self) {
            if (self.path[0] != undefined) {
                var currentX = Math.floor(self.x / 32)
                var currentY = Math.floor(self.y / 32)
                var currentXGoal = self.path[0][0];            
                var currentYGoal = self.path[0][1];
                
                if (currentX != currentXGoal && currentY != currentYGoal) {                
                    game.physics.arcade.moveToXY(self, Math.floor(currentXGoal * 32), Math.floor(currentYGoal * 32), 50);
                } 
                else {                
                    self.path.shift();
                }        
            }
            else if (Math.abs(self.body.velocity.x) < 1 && Math.abs(self.body.velocity.y) < 1) {
                gridBackup = grid.clone();
                path = pathFinder.findPath(Math.floor(self.x / 32),Math.floor(self.y / 32), Math.floor(house.x / 32), Math.floor(house.y / 32), gridBackup);
                self.setPath(path);
            }
            else {
                game.physics.arcade.moveToObject(self, house, 50)
            }
        }, game.physics.arcade, false);
        
        //causes zombies to constantly move towards player

        game.physics.arcade.collide(zombies, zombies);
        game.physics.arcade.collide(houseZombies, houseZombies);
        //game.physics.arcade.collide(houseZombies, zombies);
        //game.physics.arcade.collide(zombies, collisions);
        game.physics.arcade.collide(player, collisions);
                
        //checks zombieAngle between zombies and player and adjusts animation accordingly
        //angle measured in radians and range normalized to [0,2pi]

		//zombies.forEach(game.physics.arcade.moveToObject, game.physics.arcade, false, player, 100);
			
		zombies.forEach(function(self) {
            zombieAngle = (Phaser.Math.normalizeAngle(game.physics.arcade.angleBetween(self, player)))
            
            if(zombieAngle >= 0 && zombieAngle <= 1.5708) {
                self.animations.play('downRight');
            }
            if(zombieAngle > 1.5708 && zombieAngle <= 3.14159) {
                self.animations.play('downLeft');
            }
            if(zombieAngle > 3.14159 && zombieAngle <= 4.71239) {
                self.animations.play('upLeft');
            }
            if(zombieAngle > 4.71239 && zombieAngle <= 6.28319) {
                self.animations.play('upRight');
            }},
           	 game.physics.arcade, false);


        //houseZombies.forEach(game.physics.arcade.moveToObject, game.physics.arcade, false, house, 200);
        
        houseZombies.forEach(function(self) {
            var houseZombieAngle = (Phaser.Math.normalizeAngle(game.physics.arcade.angleBetween(self, house)))
            
            if(houseZombieAngle >= 0 && houseZombieAngle <= 1.5708) {
                self.animations.play('downRight');
            }
            if(houseZombieAngle > 1.5708 && houseZombieAngle <= 3.14159) {
                self.animations.play('downLeft');
            }
            if(houseZombieAngle > 3.14159 && houseZombieAngle <= 4.71239) {
                self.animations.play('upLeft');
            }
            if(houseZombieAngle > 4.71239 && houseZombieAngle <= 6.28319) {
                self.animations.play('upRight');
            }},
           	 game.physics.arcade, false);

        //game controls for player
        if(cursors.up.isDown){
            player.body.velocity.y = -vel;
        }
        else if(cursors.down.isDown){
            player.body.velocity.y = vel;
        }
        else{
            player.body.velocity.y = 0;
        }
        if(cursors.left.isDown){
            player.body.velocity.x = -vel;
        }
        else if(cursors.right.isDown){
            player.body.velocity.x = vel;
        }
        else{
            player.body.velocity.x = 0;
            if (!cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
                player.animations.stop(null, true);
            }
        }
        
        //controls direction player is facing
        playerAngle = Phaser.Math.normalizeAngle(game.physics.arcade.angleToPointer(player));
    
        //These statements determine the offset x,y coordinates of the gun determined by their animation and angle to
        //mouse pointer
        if((playerAngle >= 0 && playerAngle <= 0.4472) || playerAngle >= 5.58505){
            player.animations.play('right');
            barrelX = player.centerX + 14;
            barrelY = player.centerY - 14;
        }
        if(playerAngle >= 0.4472 && playerAngle < 1.39626) {
            player.animations.play('downRight');
            barrelX = player.centerX + 26;
            barrelY = player.centerY + 8;
        }
        if(playerAngle >= 1.39626 && playerAngle < 1.91986) {
            player.animations.play('down');
            barrelX = player.centerX + 28;
            barrelY = player.centerY + 24;
        }
        if(playerAngle >= 1.91986 && playerAngle < 2.61799 ) {
            player.animations.play('downLeft');
            barrelX = player.centerX + 4;
            barrelY = player.centerY + 28;
        }
        if(playerAngle >= 2.61799 && playerAngle < 3.66519) {
            player.animations.play('left');
            barrelX = player.centerX - 12;
            barrelY = player.centerY + 24;
        }
        if(playerAngle >= 3.66519 && playerAngle < 4.53786) {
            player.animations.play('upLeft');
            barrelX = player.centerX - 30;
            barrelY = player.centerY - 4;
        }
        if(playerAngle >= 4.53786 && playerAngle < 4.88692) {
            player.animations.play('up');
            barrelX = player.centerX - 28;
            barrelY = player.centerY - 24;
        }
        if(playerAngle >= 4.88692 && playerAngle < 5.58505) {
            player.animations.play('upRight');
            barrelX = player.centerX + 8;
            barrelY = player.centerY - 30;
        }
		
		//FIRE BULLETS 
        if (player.alive = true && game.input.activePointer.isDown) {
            this.fire(player.velocity, barrelX, barrelY);
    	}
        
        game.physics.arcade.overlap(zombies, bullets, this.hitGroup);
        game.physics.arcade.overlap(houseZombies, bullets, this.hitGroup);
		game.physics.arcade.overlap(player, zombies, this.collidePlayer);
        game.physics.arcade.overlap(player, houseZombies, this.collidePlayer);
		game.physics.arcade.overlap(house, houseZombies, this.collideHouse);
        game.physics.arcade.overlap(collisions[0], bullets, this.hitHouse);
    },  
	
	render: function(){
        //hitbox for debugging
        game.debug.body(zombie);
        game.debug.body(house);
        
        //game.debug.text('Time until event: ' + timer.duration.toFixed(0), 32, 32);
	},

    fire: function(playerSpeed, barrelX, barrelY) {

        if (game.time.now > nextFire && bullets.countDead() > 0)
        {
            nextFire = game.time.now + fireRate;

            bullet = bullets.getFirstDead();
            game.physics.enable(bullet);
            bullet.body.setSize(20, 20);

            bullet.reset(barrelX, barrelY);

            //bulletVelocity = 300 + Phaser.Math.abs(playerVelocity);
            game.physics.arcade.moveToPointer(bullet, 800);
            bullet.rotation = game.physics.arcade.angleToPointer(bullet);
        }
    },
   	collideHouse: function(house,zombie)
	{
		houseHealth.render();
		house.health-=10;
		
	},
    
    //give hunter health and other game objects health
	collidePlayer: function(player, zombie)
	{
		healthBar.render();
		player.health-= 10;

	},
    

    collideHouse: function(house,zombie) {
		houseHealth.render();
		house.health-=10;
    },
    
    hitHouse: function(house, bullet) {
      bullet.kill()
    },
    
    hitGroup: function(enemy, bullet) {
        bullet.kill();
        enemy.damage(20);
        var blood = game.add.sprite(enemy.x, enemy.y, 'bloodSplatter');
        blood.scale.setTo(0.3, 0.3);
        blood.anchor.setTo(0.5, 0.5);
        blood.animations.add('bloodSplatter');
        blood.play('bloodSplatter', 15, false, true);
    },
    
    listToMatrix: function(list, size) {
        var matrix = [], i, k;

            for (i = 0, k = -1; i < list.length; i++) {
                if (i % size === 0) {
                    k++;
                    matrix[k] = [];
                }
            matrix[k].push(list[i]);
        }
        return matrix;
    },
    
    //placeCrate: function(tile, )
    /*
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element){
          if(element.properties.type === type) {
            //Phaser uses top left, Tiled bottom left so we have to adjust
            //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
            //so they might not be placed in the exact position as in Tiled
            element.y -= map.tileHeight;
            result.push(element);
          }      
        });
        return result;
      }
      */
};
        