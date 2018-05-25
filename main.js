var game = new Phaser.Game(2000, 300, Phaser.AUTO, 'game', { preload: preload, create: create, update: update});

function preload() {
  game.load.tilemap('objects', 'assets/map1-1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/items2.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('mario', 'assets/marioSmall.png', 34, 34, 7);
  game.load.spritesheet('buttons','assets/stopbutton.png',73,73)
  game.load.spritesheet('startbuttons','assets/startbutton.png',73,73)
  game.load.spritesheet('coin', 'assets/coin.png', 32, 32);

}

var map;
var layer;
var cursors;
var jumpButton;
var runButton;
var result;
var coins;
var score;
var scoreText;
var button;
var button1;
var Time;
var TimeText;
var stars;
var count=0;
var mario = {
  sprite: undefined,
  direction: 'right',
  doNothing: true
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
 
  //game.add.sprite(70, 50, 'star');
  game.physics.arcade.checkCollision.down = false;
  game.stage.backgroundColor = '#5C94FC';

  map = game.add.tilemap('objects');
  map.addTilesetImage('items', 'tiles');
  layer = map.createLayer('pavan');
  layer.resizeWorld();
  layer.wrap = true;
  map.setCollisionBetween(14, 16);
  map.setCollisionBetween(21, 22);
  map.setCollisionBetween(27, 28);
  map.setCollisionBetween(34, 10);
  //map.setCollisionBetween(1,12);
 // map.setCollisionByIndex(1);
  map.setCollisionByIndex(10);
  map.setCollisionByIndex(13);
  map.setCollisionByIndex(17);
  map.setCollisionByIndex(40);
 // map.setTileIndexCallback(1,game.getCoin,game);

  //game.physics.p2.convertTilemap(map, layer);
  //game.physics.p2.gravity.y = 300;
  //game.physics.p2.friction = 5;
  scoreText= game.add.text(16, 16, "score:0", { fontSize: '32px', fill: '#000' });
  scoreText.fixedToCamera=true;

  TimeText = game.add.text(170,16,'Time:00:00', { fontSize: '32px', fill :'#000'});
  TimeText.fixedToCamera=true;

  map.setTileIndexCallback(12,getCoin,this);
  map.setTileIndexCallback(19,getstar,this);

  //map.setTileIndexCallback(40,resetplayer,this);
  //map.setTileIndexCallback(40,this.getCoin,this);

  mario.sprite = game.add.sprite(50, 50, 'mario');
  mario.sprite.scale.setTo(0.47, 0.47);
  mario.sprite.anchor.x=0.5;
  mario.sprite.anchor.y=0.5;
  mario.sprite.animations.add('walk');

  game.physics.enable(mario.sprite);  
  game.physics.arcade.gravity.y = 700;
  mario.sprite.body.bounce.y = 0;
  mario.sprite.body.linearDamping = 1;
  mario.sprite.body.collideWorldBounds = true;
  mario.sprite.body.bounce.set(1);
  //mario.sprite.body.acceleration.x = 120;

  mario.sprite.animations.add('left', [2,4,5], 10, true);
  mario.sprite.animations.add('wait', [0], 10, true);
  mario.sprite.animations.add('jump', [6], 10, true);
  
  mario.sprite.body.fixedRotation = true;
  //mario.sprite.body.onBeginContact.add(blockHit, this);
  
  game.camera.follow(mario.sprite);
  
  //monsterTimer=game.time.events.loop(Phaser.Timer.SECOND, this.addMonster, this);
   //  Here we create our coins group
  /*coins = game.add.group();
  coins.enableBody = true;

    //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
  map.createFromObjects('layer', 34, 'coin', 0, true, false, coins);

    //  Add animations to all of the coin sprites
  coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
  coins.callAll('animations.play', 'animations', 'spin');
*/
  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  runButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  //button=game.add.button(1040,game.world.centerY-125,"buttons",this.resetplayer,this,0,1,0);
  //button.anchor.set(0.5,0.5);ret
  button=game.add.button(game.world.centerY-135,50,"startbuttons",startGame,this,0,1,0);



// new EnemyBird(0,game,mario.sprite.x+400,mario.sprite.y-200);
}
 
  



function update(){
  game.physics.arcade.collide(mario.sprite, layer);
  mario.doNothing = true;
  if (cursors.left.isDown){
    //mario.sprite.body.acceleration.x = -120;
    if(mario.direction!='left'){
      mario.sprite.scale.x *= -1;
      mario.direction = 'left';
    }
    if(mario.sprite.body.velocity.x==0 ||
      (mario.sprite.animations.currentAnim.name!='left' && mario.sprite.body.onFloor())){
      mario.sprite.animations.play('left', 10, true);
    }

    mario.sprite.body.velocity.x -= 5;
    if(runButton.isDown){
      if(mario.sprite.body.velocity.x<-200){
        mario.sprite.body.velocity.x = -200;
      }
    }else{
      if(mario.sprite.body.velocity.x<-120){
        mario.sprite.body.velocity.x = -120;
      }
    }
    mario.doNothing = false;
  }else if (cursors.right.isDown){
    if(mario.direction!='right'){
      mario.sprite.scale.x *= -1;
      mario.direction = 'right';
    }
    if(mario.sprite.body.velocity.x==0 ||
      (mario.sprite.animations.currentAnim.name!='left' && mario.sprite.body.onFloor())){
      mario.sprite.animations.play('left', 10, true);
    }
    mario.sprite.body.velocity.x += 5;
    if(runButton.isDown){
      if(mario.sprite.body.velocity.x>200){
        mario.sprite.body.velocity.x = 200;
      }
    }else{
      if(mario.sprite.body.velocity.x>120){
        mario.sprite.body.velocity.x = 120;
      }
    }
    mario.doNothing = false;
  }
  if (cursors.up.justDown){
    if(mario.sprite.body.onFloor()){
      mario.sprite.body.velocity.y = -310;
      mario.sprite.animations.play('jump', 20, true);
      mario.doNothing = false;
    }
  }
  if(mario.doNothing){
    if(mario.sprite.body.velocity.x>10){
      //mario.sprite.body.acceleration.x = 10;
      mario.sprite.body.velocity.x -= 10;
    }else if(mario.sprite.body.velocity.x<-10){
      //mario.sprite.body.acceleration.x = -10;
      mario.sprite.body.velocity.x += 10;
    }else{
      //mario.sprite.body.acceleration.x = 0;
      mario.sprite.body.velocity.x = 0;
    }
    if(mario.sprite.body.onFloor()){
      mario.sprite.animations.play('wait', 20, true);
    }
  }
  stars = game.add.group();
  stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
   //for (var i = 0; i < 100; i++)
    //{
        //var star = stars.create(i * 70, 0, 'star');
     //  game.add.si*70,0, 'star');
        //  Let gravity do its thing
       //game.body.gravity.y = 6;

        //  This just gives each star a slightly random bounce value
       //game.body.bounce.y = 0.7 + Math.random() * 0.2;
    //}

}

/*function collectCoin(player, coin) {

    coin.kill();

}*/
function getCoin()
{
  map.putTile(-1,layer.getTileX(mario.sprite.x),layer.getTileY(mario.sprite.y))
  updateText();
  
}
function getstar()
{
  map.putTile(-1,layer.getTileX(mario.sprite.x),layer.getTileY(mario.sprite.y))
  updateText1();
  
}
 
function resetplayer()
  {
  
  game.state.restart();
  //mario.sprite.reset(50,50)
  }
/*
function getCoin()
{
  map.putTile(-1,layer.getTileX(mario.sprite.x),layer.getTileY(mario.sprite.y))
  console.log("ok")
}*/
function startGame() {
    button.destroy();
    mario.sprite.body.velocity.set(150, -150);
    playing = true;
    mario.sprite.body.bounce.set(0);
    button=game.add.button(1040,game.world.centerY-125,"buttons",resetplayer,this,0,1,0);
    button.fixedToCamera=true;
    game.startTime = new Date();
    gameTimer = game.time.events.loop(100, function(){
    updateTimer();
      });


}
function updateText()
  {
    count++;
    scoreText.setText("score:"+ Math.round(count/6));
  }
  function updateText1()
  {
    count=count+2;
    scoreText.setText("score:"+ Math.round(count/6));
  }

function updateTimer()
{
  var currentTime=new Date();
  //if(!(0.5-mario.sprite.body.onFloor()))
  if(mario.sprite.body.y >250 || mario.sprite.body.x>2683)

  {
   resetplayer();
  }
  var timeDifference = game.startTime.getTime() - currentTime.getTime();
  var timeElapsed = Math.abs(timeDifference / 1000);
  var minutes = Math.floor(timeElapsed/ 60);
  var seconds = Math.floor(timeElapsed) - (60 * minutes);
  var result = (minutes < 10) ? "0" + minutes : minutes;
  result += (seconds < 10) ? ":0" + seconds : ":" + seconds;
  TimeText.setText("Time:"+ result);
}
