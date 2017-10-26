var app = new PIXI.Application();


// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

// load the texture we need
PIXI.loader.add('bunny', 'img/pictures/bunny.png').load(function(loader, resources) {

  // This creates a texture from a 'bunny.png' image.
  var bunnyTexture = PIXI.Texture.fromImage("img/pictures/bunny.png");
  var bunny = new PIXI.Sprite(bunnyTexture);

  // Setup the position of the bunny
  bunny.x = app.renderer.width / 2;
  bunny.y = app.renderer.height / 2;

  // Rotate around the center
  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;

  // Add the bunny to the scene we are building.
  app.stage.addChild(bunny);

  // Listen for frame updates
  app.ticker.add(function() {
    // each frame we spin the bunny around a bit
    bunny.rotation += 0.01;
  });
});

console.log(Donjon);
console.log(Donjon.GameObject);
console.log(Donjon.Collider);
console.log(Donjon.Rigidbody);

// var obj = new GameObject.default("FUUUUUUUUUUUUUUUCKKKK");
// console.log(obj);