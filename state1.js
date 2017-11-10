//Start of gameplay
var cursors, vel = 200, pathFinder, gameWidth, gameHeight, tileSize = 32, crosshair, collisions, grass, player, zombie, zombieTwo, houseZombies, zombies, barrelX, barrelY ,bullet, bullets, fireRate = 100, nextFire = 200, toggleCrateDelay = 500, nextToggle, house, healthBar, path, pathFinder, grid, gridBackup, healthBoosts, healthBoost, music, uiBar, statusBar, placeCrateTimer ,gameBar, zombieCount, isPlaceCrate = false, gunshot, zoneX, zoneY, randomX, randomY;

//player movement controls
var spaceBar, w, a, s, d;


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
		game.load.image('health-boost', 'assets/sprites/health-icon.png');
        game.load.image('crate', 'assets/Tilemaps/crate.png');
        game.load.spritesheet('hunter', 'assets/sprites/hunterSprites.png', 58, 69);
        game.load.spritesheet('zombie','assets/sprites/zombieSprites.png', 52, 67);
        game.load.spritesheet('bloodSplatter', 'assets/sprites/bloodSpritesheet.png', 170, 120);
        game.load.json('gameMap', 'assets/Tilemaps/singleHouseMap.json');
        game.load.audio('theme','assets/sounds/theme.mp3');
        game.load.audio('gunshot', 'assets/sounds/gunshot.mp3');
        game.load.image('statBar','assets/sprites/health-Bar.png');
        game.load.image('uiBar','assets/sprites/whiteBar.png');
        game.load.image('house-boost','assets/sprites/home.png');
        game.load.image('crosshair', 'assets/sprites/crosshair.png');
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
        map = game.add.tilemap('field');
        map.addTilesetImage('collision', 'collision');
        map.addTilesetImage('grass', 'grass');
        map.addTilesetImage('dirt', 'dirt');
        map.addTilesetImage('fenceUp', 'fenceUp');
        map.addTilesetImage('fence', 'fence');
        map.addTilesetImage('house', 'house');
        map.addTilesetImage('crate', 'crate');
        collisions = map.createLayer('collisions');
        grass = map.createLayer('grass');
        dirt = map.createLayer('dirt');
        
        map.setCollision(157, true, 'collisions');
        map.setCollision(158, true, 'fence');

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
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.scale.setTo(0.7, 0.7);
        player.anchor.setTo(0.5, 0.5);
        player.body.setSize(32, 32, 12, 32);
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
		player.maxHealth = 100;
        player.damage = 10;
        
	    
        

        /////////////////////////////////////////////////
		//CODE FOR ZOMBIES
		////////////////////////////////////////////////
        //Create a group of Zombies 
        zombies = game.add.group();
        zombies.enableBody = true;       
		zombies.damageAmount = 0.1;
        
        houseZombies = game.add.group();
        houseZombies.enableBody = true;       
		houseZombies.damageAmount = 0.01;	

        ////////////////////////////////////
        //DISPLAY HOUSE
		//CREATES TOP LAYER OF THE MAP, RENDERED ABOVE ALL ELSE
		////////////////////////////////////
		house = game.add.sprite(1938,1279,'house');
		house.health = 100;
        
        

        //Spawns 50 zombie (25 targetting)
        for ( var i = 0; i < 25; i++)
        {
            //generates random integer 
            zoneX = game.rnd.integerInRange(100,300);
            zoneY = game.rnd.integerInRange(100,300);
            
            //spawns zombies in top left corner
            zombie = new Zombie(game, zoneX, zoneY, player);
            gridBackup = grid.clone();
            path = pathFinder.findPath(Math.floor(zombie.x / 32), Math.floor(zombie.y / 32), Math.floor(player.x / 32), Math.floor(player.y / 32), gridBackup);
            zombie.setPath(path);
            zombies.add(zombie);
         
            //generate random integer
            zoneX = game.rnd.integerInRange(100, 300);
            zoneY = game.rnd.integerInRange(100, 300);
            
            //spawns zombies in top left corner
            zombieTwo = new Zombie(game, zoneX, zoneY, house);
            gridBackup = grid.clone();
            path = pathFinder.findPath(Math.floor(zombieTwo.x / 32),Math.floor(zombieTwo.y / 32), Math.floor(house.x / 32), Math.floor(house.y / 32), gridBackup);
            zombieTwo.setPath(path);
            houseZombies.add(zombieTwo);
        }	
        //ZOMBIE COUNT
        /*
		zombieCount = game.add.text(game.world.width - 150,10,'ZOMBIES: ' + zombie.count +'%', {font:'20px Cambria', fill: '#3add71'});
		zombieCount.style.backgroundColor = '#b20000'
		zombieCount.style.fontWeight = 'bold'
		zombieCount.render = function(){
		zombieCount.text = 'HOUSE : '+ Math.round(house.health) +'%';    
		};
        */

        ////////////////////////////////
		//HEALTH BOOST
		///////////////////////////////
        //healthBoosts = game.add.sprite(1500, 1780,'health-boost');
        healthBoosts = game.add.physicsGroup();

		//healthBoosts.enableBody = true;
		//create health boost in random places 

		for (var i =0; i<10; i++){
			healthBoost = healthBoosts.create(game.world.randomX, game.world.randomY, 'health-boost');
			
			healthBoost.anchor.setTo(0.5,0.5);
			healthBoost.scale.setTo(0.3,0.3);
			healthBoost.alive = true;
			healthBoost.health = 0;
			
			
		}
        healthBoost.body.immovable = true;
		healthBoost.body.moves = false;
        
        houseBoosts = game.add.physicsGroup();

        for (var i=0; i<15; i++){
			houseBoost = houseBoosts.create(game.world.randomX, game.world.randomY, 'house-boost');
			
			houseBoost.anchor.setTo(0.5,0.5);
			houseBoost.scale.setTo(0.3,0.3);
			houseBoost.alive = true;
			houseBoost.health = 0;
			
        } 
        houseBoost.body.immovable = true;
		houseBoost.body.moves = false;
           
        
        
        //////////////
        //UI BAR
        //////////////
        uiBar = game.add.sprite(1500,1780,'uiBar');
        uiBar.fixedToCamera = true;
        uiBar.width = 2000;
        uiBar.cameraOffset.setTo(-650,660);
        //console.log(uiBar.inWorld);
        
        

		

		//House Health Text Bar
		houseHealth = game.add.text(game.world.width - 150,10,'HOUSE: ' + Math.round(house.health) +'%', {font:'20px Cambria', fill: '#3add71'});
		houseHealth.style.backgroundColor = '#b20000'
		houseHealth.style.fontWeight = 'bold'
		houseHealth.render = function(){
		  houseHealth.text = 'HOUSE : '+ Math.round(house.health) +'%';    
		};
		
		houseHealth.fixedToCamera = true;
		houseHealth.cameraOffset.setTo(150,750);
        
        //House Anchoring
        game.physics.enable(house);		
		house.anchor.setTo(.5,1.0);
        house.body.setSize(440, 140, 22, 120);
		house.enableBody = true;
		house.body.immovable = true;
		house.body.moves = false;
		

		
		zombies.forEach(function(self) {
            gridBackup = grid.clone();
            //console.log(gridBackup);
            path = pathFinder.findPath(Math.floor(self.x / 32),Math.floor(self.y / 32), Math.floor(house.x / 32), Math.floor(house.y / 32), gridBackup);
            self.setPath(path);
        }, game.physics.arcade, false);

		houseZombies.forEach(function(self) {
            gridBackup = grid.clone();
            path = pathFinder.findPath(Math.floor(self.x / 32),Math.floor(self.y / 32), Math.floor(house.x / 32), Math.floor(house.y / 32), gridBackup);
            self.setPath(path);
        },game.physics.arcade, false); 


        
        /*//Point Bar
        pointVal = game.add.text(game.world.width + 100, 200, 'POINTS: ' + timer.duration.toFixed(0), {font:'20px Cambria', fill: '#fa0a0a'});
        pointVal.render = function(){
		pointVal.text = 'POINTS: ' + timer.duration.toFixed(0);    
		};
        pointVal.fixedToCamera = true;
		pointVal.cameraOffset.setTo(1000,10);*/
    		        	
		
				
		//DISPLAY HEALTH
		healthBar = game.add.text(game.world.width - 150,10,'HEALTH: ' + Math.round(player.health) +'%', {font:'20px Cambria', fill: '#ab2001'});
		healthBar.style.backgroundColor = '#ea9a89';
		healthBar.style.fontWeight ='bold';

		healthBar.render = function(){

		healthBar.text = 'HEALTH : '+ Math.round(player.health) +'%';  
		};
		healthBar.fixedToCamera = true;
		healthBar.cameraOffset.setTo(2,750);
        
        
        /*
        gameBar = new Phaser.Graphics(game,190,game.world.centerY);
        gameBar.beginFill('#ffffff');
        gameBar.drawRoundedRect(game.world.centerX,game.world.centerY,game.world.width,50,1);
        gameBar.endFill(); 
        gameBar.fixedToCamera = true;
        gameBar.cameraOffset.setTo(0,750);
        console.log(gameBar.getLocalBounds);
        */    
        
        //CREATE HEALTH STATUS BAR
        /*
        statusBar = new StatusBar();
        statusBar.x = gameWidth/2;
        statusBar.y = gameHeight/2;
        statusBar.setPrecent(100);
        */


        marker = game.add.graphics();
        marker.lineStyle(2, 0x32cd32, 1);
        marker.drawRect(0, 0, 32, 32);
        
        
        crosshair = game.add.sprite(0, 0, 'crosshair');        
        
        //adding WASD movement Controls
        w = game.input.keyboard.addKey(Phaser.Keyboard.W);
        a = game.input.keyboard.addKey(Phaser.Keyboard.A);
        s = game.input.keyboard.addKey(Phaser.Keyboard.S);
        d = game.input.keyboard.addKey(Phaser.Keyboard.D);
        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
        //MUSIC
        music = game.add.audio('theme');
        music.play();
        //music.play(1,'true',true);
        
        gunshot = game.add.audio('gunshot');

        //game.sound.setDecodedCallback(music,start,this);
        
        
        
    
    },
    
    update: function() {

        var zoneX = new Phaser.RandomDataGenerator(50);
        var zoneY = new Phaser.RandomDataGenerator();
        zoneX.between(0,3)*100;
        zoneY.between(0,3)*100;
        //IF STATEMENT FOR ENDING THE GAME - "If point value hits 0"
        
        if(spaceBar.isDown) {
            marker.x = dirt.getTileX(game.input.activePointer.worldX)
            
        }

        //IF STATEMENT FOR ENDING THE GAME - "If point value hits 0"   
        if (player.health <= 0 || house.health <= 0) {
            player.kill();
            game.state.start('state2');
        }
        
        if(isPlaceCrate == true) {
            crosshair.visible = false;
            marker.visible = true;
            marker.x = collisions.getTileX(game.input.activePointer.worldX) * 32;
            marker.y = collisions.getTileY(game.input.activePointer.worldY) * 32;
        } 
        else {
            marker.visible = false;
            crosshair.visible = true;
            crosshair.x = (game.input.activePointer.worldX);
            crosshair.y = (game.input.activePointer.worldY);
        }
        
        if(spaceBar.downDuration(500)) {
            this.togglePlaceCrate();
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
        

		// get value of distance from player to zombie 
		houseDistance = game.physics.arcade.distanceBetween(zombie, house, true)
		
		//get value of distance from house to zombie 
		playerDistance = game.physics.arcade.distanceBetween(zombie, player, false)
		
        //checks zombieAngle between zombies and player and adjusts animation accordingly
        //angle measured in radians and range normalized to [0,2pi]
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

  

        //houseZombies.forEach(game.physics.arcade.moveToObject, game.physics.arcade, false, house, 50);
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
        if(cursors.up.isDown || w.isDown) {
            player.body.velocity.y = -vel;
        }
        else if(cursors.down.isDown || s.isDown) {
            player.body.velocity.y = vel;
        }
        else{
            player.body.velocity.y = 0;
        }
        if(cursors.left.isDown || a.isDown) {
            player.body.velocity.x = -vel;
        }
        else if(cursors.right.isDown || d.isDown) {
            player.body.velocity.x = vel;
        }
        else{
            player.body.velocity.x = 0;
            if ((!cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) || (!w.isDown && !a.isDown && !s.isDown && !d.isDown)) {
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
        if (player.alive == true && game.input.activePointer.isDown && isPlaceCrate == false) {
            this.fire(barrelX, barrelY);
    	}
        else if (player.alive == true && game.input.activePointer.isDown && isPlaceCrate == true) {
            this.placeCrate(dirt.getTileX(marker.x), dirt.getTileY(marker.y));
        }
        if (music.isPlaying == false){
            music.play();
        }
        //console.log(music.isPlaying);
        //console.log(music.currentTime);
        //console.log(gameBar.inCamera);
        //console.log(gameBar.inWorld);
        
        game.physics.arcade.collide(zombies, zombies);
        game.physics.arcade.collide(houseZombies, houseZombies);
        game.physics.arcade.collide(houseZombies, zombies);
        //game.physics.arcade.collide(zombies, house, this.collideHouse);
        //game.physics.arcade.collide(houseZombies, house, this.collideHouse);
        game.physics.arcade.collide(zombies, collisions);
        game.physics.arcade.collide(player, collisions);  
        game.physics.arcade.collide(player, fence);
        game.physics.arcade.collide(zombies, fence);
        game.physics.arcade.collide(houseZombies, fence);
		//game.physics.arcade.collide(healthBoosts, player);
		//game.physics.arcade.collide(player,healthBoosts);

        game.physics.arcade.overlap(zombies, bullets, this.hitGroup);
        game.physics.arcade.overlap(houseZombies, bullets, this.hitGroup);
		game.physics.arcade.overlap(player, zombies, this.collidePlayer);
        game.physics.arcade.overlap(player, houseZombies, this.collidePlayer);
		game.physics.arcade.overlap(house, houseZombies, this.collideHouse);
        game.physics.arcade.overlap(house, bullets, this.hitHouse);
        //game.physics.arcade.overlap(bullet, fence, this.hitCrate);

        
        
		if(game.physics.arcade.collide(player,healthBoosts, this.collideHealth,this.processHandler,this ))
            {
                console.log('hit');
            }
        //console.log(zombieCount);
        
		if(game.physics.arcade.collide(player,houseBoosts, this.collideHouseHealth,this.processHandler,this ))
            {
                console.log('hit house');
            }



    },  
	
	render: function() {
        //hitbox for debugging
        //game.debug.body(zombie);
        //game.debug.body(house);
        //game.debug.body(player);
        //game.debug.text('Time until event: ' + timer.duration.toFixed(0), 32, 32);
		//game.debug.body(healthBoosts);
        //game.debug.soundInfo(music,20,32);
	},

    fire: function(barrelX, barrelY) {

        if (game.time.now > nextFire && bullets.countDead() > 0)
        {
            nextFire = game.time.now + fireRate;

            bullet = bullets.getFirstDead();
            game.physics.enable(bullet);

            bullet.reset(barrelX, barrelY);

            //bulletVelocity = 300 + Phaser.Math.abs(playerVelocity);
            game.physics.arcade.moveToPointer(bullet, 1200);
            bullet.rotation = game.physics.arcade.angleToPointer(bullet);
            gunshot.play();
        }
    },
    
    togglePlaceCrate: function() {

            if (!this.isPlaceCrate) {
                this.isPlaceCrate = true;
            }
            else {
                this.isPlaceCrate = false;
            }
        
        console.log(isPlaceCrate);
    },

    //give hunter health and other game objects health
	collidePlayer: function(player, zombie) {
		healthBar.render();
        player.health-= 0.1;
	},
    

    collideHouse: function(house,zombie) {
		
		houseHealth.render();
		house.health -=0.001;
		
	},
    
    hitHouse: function(house, bullet) {
        bullet.kill()
    },
    
    hitCrate: function(bullet, layer) {
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
        zombieCount-=1
    },
	
    
	collideHealth: function( sprite, healthBoosters) {
		if ((sprite.health) < (sprite.maxHealth)){
			var playerHealth = sprite.health 			
            if ((100-playerHealth)<10){
				sprite.health = sprite.maxHealth
			}
			else{
				sprite.health +=10
                healthBoosters.kill();
			}
		}
        healthBar.render();
        healthBoosters.kill();

		
	},
    
    collideHouseHealth: function(sprite, houseBoosters) {
        
        if ((house.health) < (house.maxHealth)){
            var homeHealth = house.health 			
            if ((100-homeHealth)<10){
				house.health = house.maxHealth
			}
			else{
				house.health +=10
                houseBoosters.kill();
			}
		}
        houseHealth.render();
        houseBoosters.kill();

		  
        
    },

    processHandler(sprite, healthBoosters)
    {
      return true;  
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
    
    placeCrate: function(tileX, tileY) {
        map.putTile(158, tileX, tileY, fence);
        
        grid.setWalkableAt(tileX, tileY, false);

        /*
        zombies.forEach(function(self) {
		gridBackup = grid.clone();
		console.log(gridBackup);
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
        */
    },
    
    start: function(music) {
        music.play();
        if (music.isPlaying == false){
            music.play();
        }
        
    }
    /*
    hasLooped: function(sound){
        
        loopCount++;

        sounds.shift();
        music.loopFull(0.6);
        

        if (loopCount === 1)
        {
            sounds.shift();
            music.loopFull(0.6);
        }
        else if (loopCount === 2)
        {
            current = game.rnd.pick(sounds);
            current.loopFull();
        }
        else if (loopCount > 2)
        {
            current.stop();
            current = game.rnd.pick(sounds);
            current.loopFull();
            text.text = current.key;
        }

 
    },
    */
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
        