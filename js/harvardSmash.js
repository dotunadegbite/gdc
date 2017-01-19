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

 	
 	//Establish the game
 	var play = function(game){}

 	play.prototype = {
 		preload:function(){
 			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
 			game.load.image("player", "img/playerDefault.png");
 			game.load.image("ground", "img/ground.png");
 			game.load.image("background", "img/background.png");
 			game.load.image("lava","img/lava.png");
 		},
 		

 		create:function(){
 			/*playerJumping = false;
 			playerFalling = false;*/
 			score = 0;
 			/*placedBlocks = 0;
 			blockGroup = game.add.group();
 			topScore = localStorage.getItem("topHarvardSmasherScore")==null?0:localStorage.getItem("topHarvardSmasherScore");
 			scoreText = game.add.text(10,10,"-",{
 				font:"bold 16px Arial"
 			});
 			updateScore();*/
 			game.stage.backgroundColor = "#87CEEB";
 			/*game.physics.startSystem(Phaser.Physics.ARCADE);
 			player = game.add.sprite(80,0,"player");
 			player.anchor.set(0.5);
 			player.lastBlock = 1;
 			game.physics.arcade.enable(player);
 			player.body.gravity.y = playerGravity;
 			game.input.onDown.add(prepareToJump, this);
 			addBlock(80);

 			lava = game.add.sprite(0,game.world.height - 45,"lava");
 			lava.scale.setTo(1,.1);*/

 		},

 		update:function(){
 			/*game.physics.arcade.collide(player, blockGroup, checkLanding);
 			game.physics.arcade.collide(player, lava);
 			if(player.y > lava.y)
 				die();*/
 		}
 	}

 	game.state.add("Play", play);
 	game.state.start("Play");


 		function updateScore(){
 			scoreText.text = "Score: " + score + "\nBest: " + topScore;
 		}

 		function prepareToJump(){
 			if(ninja.body.velocity == 0){
 				game.inpt.onDown.remove(prepareToJump, this);
 				game.input.onUp.add(jump, this);
 			}
 		}

 		function jump(){
 			player.body.velocity.y = 4;
 			playerJumping = true;
 			game.input.onUp.remove(jump,this);
 		}

 		function addNewBlocks(){
 			var maxBlockX = 0;
 			blockGroup.forEach(function(item){
 				maxBlockX = Math.max(item.x, maxBlockX)
 			});
 			var nextBlockPosition = maxBlockX + game.rnd.between(minBlockGap, maxBlockGap);
 			addBlock(nextBlockPosition);
 		}

 		function addBlock(blockX){
 			if(blockX < 5){
 				placedBlocks++;
 				var block = new Block(game,blockX,game.rnd.between(100,150));
 				block.scale.setTo(3,3);
 				game.add.existing(block);
 				block.anchor.set(0.5,0);
 				blockGroup.add(block);
 				var nextBlockPosition = blockX + game.rnd.between(minBlockGap, maxBlockX);
 				addBlock(nextBlockPosition);

 			}

 		}


 		function die(){
 			localStorage.setItem("topHarvardSmasherScore", Math.max(score,topScore));
 			game.state.start("Play");
 		}

 		function checkLanding(player,block){
 			if(block.y >= player.y+player.height/2){
 				var border = player.x = block.x;
 				if(Math.abs(border) > 20){
 					player.body.velocity.x = border*2;
 					player.body.veloctiy.y = -200;
 				}
 				
 				var blockDiff = block.blockNumber - player.lastBlock;
 				if(blockDiff > 0){
 					score += Math.pow(2,blockDiff);
 					updateScore();
 					player.lastBlock = block.blockNumber;
 				}
 				if(playerJumping){
 					playerJumping = false;
 					game.input.onDown.add(prepareToJump, this);
 				}
 			}
 				else{
 					playerFalling = true;
 					blockGroup.forEach(function(item){
 						item.body.velocity.x = 0;
 					});
 				}
 		}

 		Block = function(game, x, y){
 			Phaser.Sprite.call(this, game,x,y,"pole");
 			game.physics.enable(this, Phaser.Physics.ARCADE);
 			this.body.immovable = true;
 			this.blockNumber = placedBlocks;
 		};
 		Block.prototype = Object.create(Phaser.Sprite.prototype);
 		Block.prototype.constructor = Block;
 		Block.prototype.update = function(){
 			this.body.velocity.x = 10;
 			if(this.x < -this.width){
 				this.destroy();
 				addNewBlocks();
 			}
 		}
 	}


 
 	