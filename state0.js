//MAIN MENU
var demo = {};
var text;
var counter = 0;
demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
         game.load.image('logo', 'assets/death_and_decimation_logo2.png');
    },
    create: function(){
        //  This creates a simple sprite that is using our loaded image and
        //  displays it on-screen and assign it to a variable
        var image = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');

        //  Moves the image anchor to the middle, so it centers inside the game properly
        image.anchor.set(0.5);

        //  Enables all kind of input actions on this image (click, etc)
        image.inputEnabled = true;

        text = game.add.text(100, 80, '', { fill: '#ffffff' });

        image.events.onInputDown.add(listener, this);

    },
    update: function(){
         //counter++;
        if(game.input.activePointer.isDown){
        game.state.start('state1');
        
        }
        text.text = "WELCOME TO DEATH & DECIMATION. CLICK TO START PLAYING";
    }
    
    /*listener: function(){
    counter++;
    text.text = "You clicked " + counter + " times!";
    
    }*/
};

//game.state.start('state1');

/*
var text;
var counter = 0;

function preload () {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('bullet', 'assets/sprites/bullet.png');

}

function create() {

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen and assign it to a variable
    var image = game.add.sprite(game.world.centerX, game.world.centerY, 'bullet');

    //  Moves the image anchor to the middle, so it centers inside the game properly
    image.anchor.set(0.5);

    //  Enables all kind of input actions on this image (click, etc)
    image.inputEnabled = true;

    text = game.add.text(250, 16, '', { fill: '#ffffff' });

    image.events.onInputDown.add(listener, this);

}

function listener () {

    counter++;
    text.text = "You clicked " + counter + " times!";

}*/