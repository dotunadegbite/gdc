window.onload = function() {
	var innerWidth = $('#game').width()//window.innerWidth;
	var innerHeight = $('#game').height()//window.innerHeight;
	var gameRatio = innerWidth/innerHeight;	
	var game = new Phaser.Game(Math.floor(480*gameRatio), 480, Phaser.CANVAS,'game');

	//Setup
	var ninja;
	var ninjaGravity = 800;
	var ninjaJumpPower;    
	var score=0;
	var scoreText;
	var topScore;
	var powerBar;
	var powerTween;
	var placedPoles;
	var poleGroup; 
	var minPoleGap = 100;
	var maxPoleGap = 300; 
	var ninjaJumping;
	var ninjaFallingDown;     
	var lava;

	//play actions
  var play = function(game){}     
  play.prototype = {
		preload:function(){
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.load.image("ninja", "img/ninja.png"); 
			game.load.image("pole", "img/harvardKid.png");
      game.load.image("powerbar", "img/powerbar.png");
      game.load.image("lava","img/lava.png");
		},
		create:function(){
			ninjaJumping = false;
			ninjaFallingDown = false;
			score = 0;
			placedPoles = 0;
			poleGroup = game.add.group();
			topScore = localStorage.getItem("topFlappyScore")==null?0:localStorage.getItem("topFlappyScore");
			scoreText = game.add.text(10,10,"-",{
				font:"bold 16px Arial"
			});
			updateScore();
			game.stage.backgroundColor = "#87CEEB";
			game.physics.startSystem(Phaser.Physics.ARCADE);
			ninja = game.add.sprite(80,0,"ninja");
			ninja.anchor.set(0.5);
			ninja.lastPole = 1;
			game.physics.arcade.enable(ninja);              
			ninja.body.gravity.y = ninjaGravity;
			game.input.onDown.add(prepareToJump, this);
			addPole(80);

			lava = game.add.sprite(0,game.world.height - 45 ,"lava");
			lava.scale.setTo(1,.1);
		},
		update:function(){
			//console.log("updating")
			game.physics.arcade.collide(ninja, poleGroup, checkLanding);
			game.physics.arcade.collide(ninja,lava);
			if(ninja.y> lava.y){
				die();
			}
		}
	}     
  game.state.add("Play",play);
  game.state.start("Play");

 

	function updateScore(){
		scoreText.text = "Score: "+score+"\nBest: "+topScore;	
	}     

	function prepareToJump(){
		if(ninja.body.velocity.y==0){
	          powerBar = game.add.sprite(ninja.x,ninja.y-50,"powerbar");
	          powerBar.width = 0;
	          powerTween = game.add.tween(powerBar).to({
			   width:100
			}, 1000, "Linear",true); 
	          game.input.onDown.remove(prepareToJump, this);
	          game.input.onUp.add(jump, this);
          }        	
	}     

	function jump(){
    ninjaJumpPower= -powerBar.width*3-100
    powerBar.destroy();
    game.tweens.removeAll();
    ninja.body.velocity.y = ninjaJumpPower*2;
    ninjaJumping = true;
    powerTween.stop();
    game.input.onUp.remove(jump, this);
	}    

	function addNewPoles(){
		var maxPoleX = 0;
		poleGroup.forEach(function(item) {
			maxPoleX = Math.max(item.x,maxPoleX)			
		});
		var nextPolePosition = maxPoleX + game.rnd.between(minPoleGap,maxPoleGap);
		addPole(nextPolePosition);			
	}

	function addPole(poleX){
		if(poleX<game.width*2){
			placedPoles++;
			var pole = new Pole(game,poleX,game.rnd.between(100,game.world.height - 100));
			pole.scale.setTo(3,3);
			game.add.existing(pole);
	    pole.anchor.set(0.5,0);
			poleGroup.add(pole);
			var nextPolePosition = poleX + game.rnd.between(minPoleGap,maxPoleGap);
			addPole(nextPolePosition);
		}
	}

	function die(){
		localStorage.setItem("topFlappyScore",Math.max(score,topScore));	
		game.state.start("Play");
	}

	function checkLanding(n,p){
		if(p.y>=n.y+n.height/2){
			var border = n.x-p.x
			if(Math.abs(border)>20){
				n.body.velocity.x=border*2;
				n.body.velocity.y=-200;	
			}
			var poleDiff = p.poleNumber-n.lastPole;
			if(poleDiff>0){
				score+= Math.pow(2,poleDiff);
				updateScore();	
				n.lastPole= p.poleNumber;
			}
			if(ninjaJumping){
               	ninjaJumping = false;              
               	game.input.onDown.add(prepareToJump, this);
          	}
		}
		else{
			ninjaFallingDown = true;
			poleGroup.forEach(function(item) {
				item.body.velocity.x = 0;			
			});
		}			
	}
	Pole = function (game, x, y) {
		Phaser.Sprite.call(this, game, x, y, "pole");
		game.physics.enable(this, Phaser.Physics.ARCADE);
          this.body.immovable = true;
          this.poleNumber = placedPoles;
	};
	Pole.prototype = Object.create(Phaser.Sprite.prototype);
	Pole.prototype.constructor = Pole;
	Pole.prototype.update = function() {
          if(ninjaJumping && !ninjaFallingDown){
               this.body.velocity.x = ninjaJumpPower;
          }
          else{
               this.body.velocity.x = 0
          }
		if(this.x<-this.width){
			this.destroy();
			addNewPoles();
		}
	}	
}