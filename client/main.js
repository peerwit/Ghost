// Define our main state

var game = new Phaser.Game(300, 600, Phaser.AUTO, 'mathCrush', { preload: preload, create: create, update: update });

var board, tiles, zone;



function preload() {
  board = new Board();
}

function create() { 
  tiles = game.add.group();
  board._iterate(function(tuple) {
    var x = 15 + tuple[1] * 50;
    var y = 15 + tuple[0] * 50;
    var v = board._get(tuple);
    game.add.text(x,y,v + '', {fill: "green"}, tiles);
  })
  console.log(tiles);
}

function update(eve) {
  if (game.input.activePointer.isDown) {
    console.log('hello', game.input.activePointer.position.x)
  }
}

// var main = {

//   update: function() {
//     // Make the paddle and the ball collide
//     game.physics.arcade.collide(this.paddle, this.ball);

//     // Call the 'hit' function when the ball hit a brick
//     game.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);

//     // If the right arrow is pressed, move the paddle to the right
//     if (this.cursor.right.isDown) 
//       this.paddle.body.velocity.x = 350;

//     // If the left arrow if pressed, move left
//     else if (this.cursor.left.isDown) 
//       this.paddle.body.velocity.x = -350;

//     // If no arrow is pressed, stop moving
//     else 
//       this.paddle.body.velocity.x = 0;  
//   },
//   hit: function(ball, brick) {
//     // When the ball hits a brick, kill the brick
//     brick.kill();
//   }
// };

// // // Initialize Phaser, and start our 'main' state 
// // var game = new Phaser.Game(400, 450, Phaser.AUTO, 'gameDiv');
// // game.state.add('main', main);
// // game.state.start('main');