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
  var harvardGroup;
  var harvardStudent;
  var lastHarvardStudent;




 	//Establish the game
 	var play = function(game){}

 	play.prototype = {
 		preload:function(){
 			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
 			game.load.image("player", "img/ninja.png");
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
      harvardGroup = game.add.group();
 			topScore = localStorage.getItem("topHarvardSmasherScore")==null?0:localStorage.getItem("topHarvardSmasherScore");
 			scoreText = game.add.text(10,10,"-",{
 				font:"bold 16px Arial"
 			});

 			updateScore();
 			game.stage.backgroundColor = "#87CEEB";
 			game.physics.startSystem(Phaser.Physics.ARCADE);

      player = game.add.sprite(75,365,"player");
      game.physics.arcade.enable(player);
      player.body.gravity.y = 300;
      player.body.collideWorldBounds = true;


      block = game.add.sprite(0,400, "ground");
      block2 = game.add.sprite(block.width, 400,"ground");
      block3 = game.add.sprite(block2.width + 100, 400, "ground");




      blockGroup.add(block);
      blockGroup.add(block2);
      blockGroup.add(block3);

      student = game.add.sprite(200,355,"harvardKid");
      student2 = game.add.sprite(600,355,"harvardKid");
      student.scale.setTo(1.5);
      student2.scale.setTo(1.5);
      harvardGroup.add(student);
      harvardGroup.add(student2);



      game.physics.arcade.enable(cloud);
      game.physics.arcade.enable(blockGroup);
      game.physics.arcade.enable(harvardGroup);

      block.body.velocity.x = -70;
      block2.body.velocity.x = -70;
      block3.body.velocity.x = -70;

      block.body.immovable = true;
      block2.body.immovable = true;
      block3.body.immovable = true;

      student.body.velocity.x = -100;
      student2.body.velocity.x = -100;


      game.camera.follow(player);
      game.physics.arcade.enable(newBlock);

 		},

 		update:function()
    {

      cloud.body.velocity.x = -20;
      player.body.velocity.x = 70;

      if(playerJumping)
      {
        player.body.velocity.x = 0;
      }

      if(cloud.x < -100){
        cloud = game.add.sprite(830,10,"cloud");
        game.physics.arcade.enable(cloud);
        console.log("works");
      }

      lastSeenBlock = blockGroup.children[blockGroup.length - 1];
      lastHarvardStudent = harvardGroup.children[harvardGroup.length - 1];

      if(lastSeenBlock.x < 700)
      {
        newBlock = game.add.sprite(lastSeenBlock.width + 475, 400, "ground");
        game.physics.arcade.enable(newBlock);
        newBlock.body.velocity.x = -70;
        blockGroup.add(newBlock);
        newBlock.body.immovable = true;
      }

      if(lastHarvardStudent.x < 400)
      {
        newStudent = game.add.sprite(lastSeenBlock.width + 475, 355, "harvardKid");
        game.physics.arcade.enable(newStudent);
        newStudent.body.velocity.x = -100;
        harvardGroup.add(newStudent);
        newStudent.scale.setTo(1.5);
      }

      if(game.physics.arcade.collide(player, harvardGroup, collisionCheck)){
        console.log("oh shieet");
      }
      if(game.physics.arcade.collide(player,blockGroup))
      {
        playerJumping = false;
      }

      //Jumps if there is a left click on mouse
      if(game.input.activePointer.isDown && !playerJumping)
      {
        player.body.velocity.y = -250;
        playerJumping = true;
      }

 		}
 	}

 	game.state.add("Play", play);
 	game.state.start("Play");

function updateScore()
{
  scoreText.text = "Score: " + score + "\nBest: " + topScore;
}

function collisionCheck(player, harvard)
{
  if(harvard.body.touching.left){
    player.kill();
  }
  else if(player.y  > harvard.y){
    score += 1;
    updateScore();
    harvard.kill();
  }

}

function die(){
		localStorage.setItem("topFlappyScore",Math.max(score,topScore));
		game.state.start("Play");
	}
}
