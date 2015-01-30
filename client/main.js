// Define our main state
var board, tiles, zone, posDragStart = {}, posDragStop = {}, tileMap = {};

var game = new Phaser.Game(300, 470, Phaser.AUTO, 'mathCrush', { preload: preload, create: create, update: update });




function preload() {
  board = new Board();

  // Tribute to Andrew! You really don't need jQuery for everything...
  document.getElementById('target').innerHTML = board.target;
  document.getElementById('operation').innerHTML = board.opName;
  // document.getElementById('message').innerHTML = swappable;
}

function create() { 
  tiles = game.add.group();
  board._iterate(function(tuple) {
    var x = 15 + tuple[1] * 50;
    var y = 15 + tuple[0] * 37.5;
    var v = board._get(tuple);
    var text = game.add.text(x,y,v + '', {fill: "green"}, tiles);
    text.tuple = tuple;
    tileMap[JSON.stringify(tuple)] = text;
    text.inputEnabled=true;
    text.input.enableDrag();
    text.events.onDragStart.add(function(text, pointer){
      posDragStart.x = text.position.x;
      posDragStart.y = text.position.y;
    }, this);
    text.events.onDragStop.add(function(text, pointer){
      var n = board._getNeighbors(text.tuple);
      n = n.map(function(e) {return tileMap[JSON.stringify(e)]})
      n.forEach(function(e) {
        checkOverlap(text, e) ? intendedSwap(text, e) : defaultify(text);
      });
    }, this);
    // text.events.onMouseOver.add(function(){console.log(arguments);}, this);
    // text.input.mouserOverCallback
  })
  console.log(tiles);
}

function update(eve) {
  if (checkOverlap(tiles.children[0], tiles.children[1])) {
    console.log("yay")
  };
}

function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);

}

function defaultify(sprite) {
    sprite.position.x = posDragStart.x;
    sprite.position.y = posDragStart.y;
}

function intendedSwap(spriteA, spriteB) {
    var swappable = board.isValidSwap(spriteA.tuple, spriteB.tuple);
    var falseMsg = "Sorry you cannot make that swap";
    var trueMsg = "Well done!"
    document.getElementById('message').innerHTML = swappable?trueMsg:falseMsg;

    if (swappable) {
      var temp = spriteA.fill;
      spriteA.fill = spriteB.fill;
      spriteB.fill = temp;
      temp = [];
      board = board.swap(spriteA.tuple, spriteB.tuple, function(swappedOut) {
        temp = swappedOut;
        temp.forEach(function(e) {
          console.log(board._get(e), JSON.stringify(e));
        })
      });
      temp.forEach(function(e) {
        text = tileMap[JSON.stringify(e)];
        text.fill = "blue";
      })
      temp.indexOf(spriteB.tuple) < 0?temp.push(spriteB.tuple):null;
      temp.indexOf(spriteA.tuple) < 0?temp.push(spriteA.tuple):null;
      console.log(temp);
      temp.forEach(function(e) {
        text = tileMap[JSON.stringify(e)];
        text.setText(board._get(e));
        text.fill = text.fill === "blue"?"blue":"green";
      })
      document.getElementById('score').innerHTML = board.score;
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