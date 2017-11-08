'use strict';

var Zombie = function(game, x, y, target) {
    
    Phaser.Sprite.call(this, game, x, y, 'zombie');
    
    this.path = [];
    this.target = target
    this.next_positionX = 0;
    this.next_positionY = 0;
    this.scale.setTo(0.7, 0.7);
    this.anchor.setTo(0.5, 0.5);
    this.alive = true;
    this.health = 100;
    game.physics.enable(this);
    game.add.existing(this);
    
    this.animations.add('upLeft', [4, 5, 6, 7], 8, true);
    this.animations.add('upRight', [0, 1, 2, 3], 8, true);
    this.animations.add('downLeft', [12, 13, 14, 15], 8, true);
    this.animations.add('downRight', [8, 9, 10, 11], 8, true);
    this.animations.add('bloodSplatter' [0, 1, 2, 3, 4, 5, 6], 16, true);
    
};

Zombie.prototype = Object.create(Phaser.Sprite.prototype);
Zombie.prototype.constructor = Zombie;


Zombie.prototype.update = function() {
    //this.followPath(game);
   
};

Zombie.prototype.setPath = function(path) {
    this.path = path;
};

Zombie.prototype.followPath = function(game) {
                 
};
