//start screen
var demo = {};
var text1;
var text2;
var text3;
var startgame;
var counter = 0;
demo.state0 = function(){};


demo.state0.prototype = {
    
    preload: function(){
         game.load.image('logo', 'assets/death_decimation logo.png');  
         game.load.image('hunter', 'assets/tilemaps/hunter.png');
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

        //enables input actions
        image.inputEnabled = true;
        
        //adding all text
        text1 = game.add.text(50, 330, 'DIRECTIONS:', { font: '50px Arial', fill: '#ffffff' } );

        text2 = game.add.text(50, 410, 'Use wasd controls to move.\nUse your cursor to shoot zombies.\nHealth and home boosters will\nincrease health\nProtect yourself and your home\nat all costs.', { font: '25px Arial', fill: '#ffffff' });
        
        text3 = game.add.text(700, 330, 'YOUR HUNTER:', { font: '50px Arial', fill: '#ffffff' } );
        
        startgame = game.add.text(game.world.centerX,700,'CLICK ANYWHERE TO START', { font: '50px Arial', fill: '#ffffff' });
        startgame.anchor.set(0.5);
        
        
        //adding hunter image
        var hunterimg = game.add.sprite(810,430,'hunter');
        hunterimg.width = 200;
        hunterimg.height = 200;
        

        image.events.onInputDown.add(listener, this);
        
      
    },
    
    update: function(){
         
        if(game.input.activePointer.isDown){
        game.state.start('state1');
    
        
    }


    
}
};

