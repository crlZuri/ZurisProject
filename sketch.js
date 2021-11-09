var PLAY = 1;
var END = 0;
var gameState = PLAY;



var robber, robber_running, robber_collided;
var ground, invisibleGround, groundImage;

var coinsGroup, coin, coinImg
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var coinCount=0;

var score=0;

var gameOver, restart;


function preload(){
  robber_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  robber_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  coinImg = loadImage("coin.jpg");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3"); 
}

function setup() {
  createCanvas(600, 200);
  
  robber = createSprite(50,180,20,50);
  robber.addAnimation("running", robber_running);
  robber.addAnimation("collided", robber_collided);
  robber.scale = 0.5;
  
  //coin = createSprite(600,200,20,20);

  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  coinsGroup = [];
  obstaclesGroup = new Group();
  
  //robber.debug = true;
 
}

function draw() {
  background(255);
  text("Score: "+ score, 500,50);
  text("Coins: "+ coinCount, 500,40)
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    
  
    if(keyDown("space") && robber.y >= 159) {
      jumpSound.play();
      robber.velocityY = -14;
    }
    spawnCoins();
    
    
    if (coinsGroup.pop().isTouching()) {
   // coinsGroup.destroyEach();
      coinsGroup.pop().destroy();
      coinCount = coinCount + 1;
      console.log(coinCount,"hi")
      coinsGroup.remove(coin)

    }
    robber.velocityY = robber.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    robber.collide(invisibleGround);
    //spawnCoins();
    spawnObstacles();
    
    if (score>0 && score%100 === 0){
      checkPointSound.play();
    }

    
  
  
    if(obstaclesGroup.isTouching(robber)){
      dieSound.play();  
      gameState = END;
        
    }
  }
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    robber.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    
    //change the trex animation
    robber.changeAnimation("collided",robber_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    

    if(mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}

function spawnCoins() {
  //write code here to spawn the coins
  if (frameCount % 80 === 0) {
    coin = createSprite(600,120,40,10);
    coin.y = Math.round(random(80,120));
    coin.addImage(coinImg);
    coin.scale = 0.08;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = robber.depth;
    robber.depth = robber.depth + 1;
    
    //add each coin to the group

  coinsGroup.push(coin);
  
}
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  ground.velocityX = -(6 + 3*score/100);
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinsGroup.destroyEach();
  
  robber.changeAnimation("running",robber_running);
  
  score = 0;
  
}

