window.onload = function()
{
  // Makes sure the game is responsive
  var innerWidth = $('#game').width();
  var innerHeight = $('#game').height();
  var gameRatio = innerWidth/innerHeight;
  // Initialize the game
  var game = new Phaser.Game(Math.floor(480*gameRatio), 480, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update});

  // Variables needed for the game
  var player;
  var platforms;
  var harvardStudents;



  //preload all of the assets needed for the game
  function preload()
  {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.load.spritesheet("player", "img/playerSpriteSheet.png",86,175,5);
    game.load.image("ground", "img/marioGround.png");
    game.load.image("background", "img/background.png");
    game.load.image("lava","img/lava.png");
    game.load.image("cloud", "img/cloud.png");
    game.load.image("harvardKid","img/harvardKid.png");
  }

  //Runs when the game first starts
  function create()
  {
    //Use the arcade physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //Set the background color
    game.stage.backgroundColor = "#87CEEB";
    //The platforms group will contain all of the ground
    platforms = game.add.group();
    platforms.enableBody = true;

    // Create the ground platforms
    var ground = platforms.create(0,400,'ground');
    ground = platforms.create(ground.width,400,'ground');
    ground.immovable = true;

    // Init player
    player = game.add.sprite(32, 400,'player');
    player.scale.setTo(0.25);
    game.physics.arcade.enable(player);

    //Player Physics properties

    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //Animations for walking right
    player.animations.add('right', [1,2,3,4],'true');

    //generate the harvard enemies
    generateHarvard();
  }

  //Runs every frame of the game
  function update()
  {
    //Collide the player with the platforms
    //var hitPlatform = game.physics.p2.collide(player, platforms);

    //has player move right and plays animation as well
    player.body.velocity.x = 150;
    player.animations.play('right');

    //Jumps if there is a left click on mouse
    if(game.input.activePointer.isDown)
    {
      player.body.velocity.y = -150;
    }

  }

  function generateHarvard()
  {
      harvardStudents = game.add.group();

      harvardStudents.enableBody = true;

      var numOfHarvardStudents = game.rnd.integerInRange(0,5);
      var harvardStudent;

      for(var i =0; i < numOfHarvardStudents; i++)
      {
        var x = game.rnd.integerInRange(game.width, game.world.width - game.width);
        harvardStudent = harvardStudents.create(x, 435,'harvardKid');
        harvardStudent.body.velocity.x = 0;
        harvardStudent.body.immovable = true;
        harvardStudent.collideWorldBounds = false;
      }
  }


}
