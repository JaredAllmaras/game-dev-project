var game = new Phaser.Game(1131,621, Phaser.AUTO);
//creating the states
game.state.add('state0', demo.state0);
game.state.add('state1', demo.state1);

//sending user to initial state
game.state.start('state0');