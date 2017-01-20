 window.onload = function()
 {
 	var innerWidth = $('#game').width();
 	var innerHeight = $('#game').height();
 	var gameRatio = innerWidth/innerHeight;

 	var game = new Phaser.Game(Math.floor(480*gameRatio), 480, Phaser.CANVAS, 'game');

 	//Initialize the variables
 	var player;
 	var playerSpeed;
 	var playerGravity = 100;
 	var score=0;
 	var scoreText;
 	var topScore;
 	var placedBlocks;
 	var blockGroup;
 	var minBlockGap = 1;
 	var maxBlockGap = 10;
 	var playerJumping;
 	var playerFalling;
  var numberOfBlocks;
  var lastSeenBlock;
  var newBlock;
  var newBlock2;
  var harvardPeople;
  var harvardStudent;


 	//Establish the game
 	var play = function(game){}

 	play.prototype = {
 		preload:function(){
 			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
 			game.load.image("player", "img/playerDefault.png");
 			game.load.image("ground", "img/marioGround.png");
 			game.load.image("background", "img/background.png");
 			game.load.image("lava","img/lava.png");
      game.load.image("cloud", "img/cloud.png");
      game.load.image("harvardKid","img/harvardKid.png");
 		},


 		create:function(){

 			score = 0;
      cloud = game.add.sprite(200, 10,"cloud");

 			blockGroup = game.add.group();
 			topScore = localStorage.getItem("topHarvardSmasherScore")==null?0:localStorage.getItem("topHarvardSmasherScore");
 			scoreText = game.add.text(10,10,"-",{
 				font:"bold 16px Arial"
 			});

 			updateScore();
 			game.stage.backgroundColor = "#87CEEB";
 			game.physics.startSystem(Phaser.Physics.ARCADE);

      block = game.add.sprite(0,400, "ground");
      block2 = game.add.sprite(block.width, 400,"ground");
      blockGroup.add(block);
      blockGroup.add(block2);



      game.physics.arcade.enable(cloud);
      game.physics.arcade.enable(blockGroup);

      block.body.velocity.x = -70;
      block2.body.velocity.x = -70;

      game.camera.follow(blockGroup);
      game.physics.arcade.enable(newBlock);

      harvardPeople = game.add.group();
      harvardPeople.enableBody = true;
      harvardPeople.physicsBodyType = Phaser.Physics.ARCADE;


      harvardStudent = game.add.sprite(0, 0, "harvardKid");
      harvardPeople.add(harvardStudent);
      harvardStudent.body.velocity.x = -70;






 		},

 		update:function()
    {

      cloud.body.velocity.x = -20;
      if(cloud.x < -100){
        cloud = game.add.sprite(830,10,"cloud");
        game.physics.arcade.enable(cloud);
        console.log("works");
      }

      lastSeenBlock = blockGroup.children[blockGroup.length - 1];

      if(lastSeenBlock.x < 700)
      {
        newBlock = game.add.sprite(lastSeenBlock.width + 475, 400, "ground");
        game.physics.arcade.enable(newBlock);
        newBlock.body.velocity.x = -70;
        blockGroup.add(newBlock);
      }

      //spawnHarvard();
 		}
 	}

 	game.state.add("Play", play);
 	game.state.start("Play");

function updateScore()
{
  scoreText.text = "Score: " + score + "\nBest: " + topScore;
}

function spawnHarvard()
{
  console.log("true");
  for(var x = 0; x < 10; x++)
    {
    harvardStudent = game.add.sprite(x * 48, 432, 'harvardKid');
    harvardPeople.add(harvardStudent);
    harvardStudent.body.immovable = true;
    }

    }


Block = function(game, x, y)
{
 	Phaser.Sprite.call(this, game,x,y,"pole");
 	game.physics.enable(this, Phaser.Physics.ARCADE);
 	this.body.immovable = true;
 	this.blockNumber = placedBlocks;
};


Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;
Block.prototype.update = function()
{
  this.body.velocity.x = 10;
 	if(this.x < -this.width)
  {
 		this.destroy();
 		addNewBlocks();
 	}
}
}
