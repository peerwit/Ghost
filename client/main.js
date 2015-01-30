// Simple Game implementation by Pranay
  // v 0.0.1 (01/30/15)

// Define our main state
var xboard, tiles, zone, posDragStart = {}, posDragStop = {}, tileMap = {};

var game = new Phaser.Game(300, 470, Phaser.AUTO, 'mathCrush', { preload: preload, create: create, update: update });




function preload() {
  xboard = new Board();
  xboard._render = render;
  xboard.__render = true;
  
  // Tribute to Andrew! You really don't need jQuery for everything...
  document.getElementById('target').innerHTML = xboard.target;
  document.getElementById('operation').innerHTML = xboard.opName;
  // document.getElementById('message').innerHTML = swappable;
}

function create() { 
  tiles = game.add.group();
  xboard._iterate(function(tuple) {
    var x = 15 + tuple[1] * 50;
    var y = 15 + tuple[0] * 37.5;
    var v = xboard._get(tuple);
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
      var n = xboard._getNeighbors(text.tuple);
      n = n.map(function(e) {return tileMap[JSON.stringify(e)]})
      n.forEach(function(e) {
        checkOverlap(text, e) ? intendedSwap(text, e) : defaultify(text);
      });
    }, this);
    // text.events.onMouseOver.add(function(){console.log(arguments);}, this);
    // text.input.mouserOverCallback
  })
}

function render () {
  xboard._iterate(function(tuple) {
    var x = 15 + tuple[1] * 50;
    var y = 15 + tuple[0] * 37.5;
    var v = xboard._get(tuple);
    text = tileMap[JSON.stringify(tuple)];
    text.text = v;
    // text.events.onMouseOver.add(function(){console.log(arguments);}, this);
    // text.input.mouserOverCallback
  })
}
function update(eve) {
  if (checkOverlap(tiles.children[0], tiles.children[1])) {
  };
}

function Auto(){
  xboard.autoSwapper(function(t1, t2) {
    intendedSwap(tileMap[JSON.stringify(t1)], tileMap[JSON.stringify(t2)]);
  });
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
    var swappable = xboard.isValidSwap(spriteA.tuple, spriteB.tuple);
    var falseMsg = "Sorry you cannot make that swap";
    var trueMsg = "Well done!"
    document.getElementById('message').innerHTML = swappable?trueMsg:falseMsg;

    if (swappable) {
      var temp = spriteA.fill;
      spriteA.fill = spriteB.fill;
      spriteB.fill = temp;
      temp = [];
      xboard = xboard.swap(spriteA.tuple, spriteB.tuple, function(swappedOut) {
        temp = swappedOut;
        temp.forEach(function(e) {
        })
      });
      temp.forEach(function(e) {
        text = tileMap[JSON.stringify(e)];
        text.fill = "blue";
      })
      temp.indexOf(spriteB.tuple) < 0?temp.push(spriteB.tuple):null;
      temp.indexOf(spriteA.tuple) < 0?temp.push(spriteA.tuple):null;
      temp.forEach(function(e) {
        text = tileMap[JSON.stringify(e)];
        text.setText(xboard._get(e));
        text.fill = text.fill === "blue"?"blue":"green";
      })
      document.getElementById('score').innerHTML = xboard.score;
      render();
    }
    else {
      console.log(spriteA.tuple, spriteB.tuple, xboard.state);
    }
    // render();

}