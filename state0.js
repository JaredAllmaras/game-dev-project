//start screen
var demo = {};
var text1;
var text2;
var counter = 0;
demo.state0 = function(){};


demo.state0.prototype = {
    
    preload: function(){
         game.load.image('logo', 'assets/death_decimation logo.png');  
        
    },
    
//var button;
//var background;
    
    create: function(){
        game.stage.backgroundColor = '#000000';
        
        //loading in the logo
        var image = game.add.sprite(game.world.centerX, 225, 'logo');
        image.width = 600;
        image.height = 600;
        image.anchor.set(0.5);

        //  Enables all kind of input actions on this image (click, etc)
        image.inputEnabled = true;

        text1 = game.add.text(50, 350, 'DIRECTIONS:', { fill: '#ffffff' });
        text2 = game.add.text(50, 400, 'Use wasd controls to move.\nUse your cursor to shoot zombies.\nProtect yourself and your home at all costs.', { fill: '#ffffff' });
        

        image.events.onInputDown.add(listener, this);
    },
    
    update: function(){
         
        if(game.input.activePointer.isDown){
        game.state.start('state1');
    
        
    }


    
}
};

