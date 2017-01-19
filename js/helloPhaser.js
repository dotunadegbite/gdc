window.onload = function() {

  //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
  //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
  //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

  var game = new Phaser.Game($('#game').width(), $('#game').height(), Phaser.AUTO, 'game', { preload: preload, create: create,upload:upload });

  var preload = function() {

      game.load.image('logo', 'img/phaser.png');

  }

  var create = function() {

      var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
      logo.anchor.setTo(0.5, 0.5);

  }

  var update = function(){

  }
};