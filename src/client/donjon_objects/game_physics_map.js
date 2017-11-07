/**
 *
 */
class GamePhysicsMap extends GameMap {

  constructor() {
    super();

    this.physics = new p2.World();

    let circleShape = new p2.Box({
      width: 2, height: 1
    });

    this.rigidbody = new p2.Body({
      mass: 1,
      position: [0, 100],
    });

    this.rigidbody.addShape(circleShape);
    this.physics.addBody(this.rigidbody);

  }

  update(sceneActive) {
    super.update(sceneActive);
    this.physics.step(1 / 60.0);
    console.log(this.rigidbody.position[1]);
  }


}