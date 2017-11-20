//start screen
var demo = {};
var text;
var counter = 0;
demo.state0 = function(){};


demo.state0.prototype = {
    
    preload: function(){
         game.load.image('logo', 'assets/death_decimation logo.png');  
         game.load.spritesheet('button', 'assets/sprites/button_sprite_sheet.png', 193, 71);
        game.load.image('background','assets/starfield.jpg');
    },
    
//var button;
//var background;
    
    create: function(){
        game.stage.backgroundColor = '#000000';
        //background = game.add.tileSprite(0, 0, 1280,800, 'background');
        var image = game.add.sprite(game.world.centerX - 95, 400, 'button');


    
        //loading in the logo
        var image = game.add.sprite(game.world.centerX, 225, 'logo');
        image.width = 600;
        image.height = 600;
        image.anchor.set(0.5);

        //  Enables all kind of input actions on this image (click, etc)
        image.inputEnabled = true;

        text = game.add.text(100, 80, '', { fill: '#ffffff' });

        image.events.onInputDown.add(listener, this);
    },
    
    update: function(){
         
        if(game.input.activePointer.isDown){
        game.state.start('state1');
    
        
    }
   /* whenbuttonispressed: function(){
        game.state.start('state1');
    }*/


    
}
};

