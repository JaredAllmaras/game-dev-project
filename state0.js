//start screen
var demo = {};
var text;
var counter = 0;
demo.state0 = function(){};

demo.state0.prototype = {
    
    preload: function(){
         game.load.image('logo', 'assets/death_decimation logo.png');  
        
    },
    
    create: function(){
        //state0.body.style.backgroundColor = "red";
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
      
    }
    
};

