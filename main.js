var game = new Phaser.Game(1131,621, Phaser.AUTO);
game.state.add('state0', demo.state0);
game.state.add('state1', demo.state1);
game.state.start('state1');