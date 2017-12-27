import p2 from 'p2';
import EventEmitter from '../core/event_emitter';
import Manager from './manager';
import Input from '../core/input';
import Component from '../components/component';

export default class Physics extends Manager {

  constructor() {
    super();
    this.world = null;
    this.addedComps = [];
    this.addedBody = [];
  }

  initializeListeners() {
    let self = this;
    EventEmitter.addListener('onUnitSpawn', (unit) => {
      self.onUnitSpawn(unit)
    })
  }

  /**
   * Construct p2.Body from RigidbodyComponent
   *
   * @param rigidbody {Rigidbody}
   */
  addRigidbody(rigidbody) {
    const owner = rigidbody.getOwner();

    let body = new p2.Body({
      mass: rigidbody.mass,
      position: owner.getTransform().position,
      type: rigidbody.bodyType,
      fixedRotation: true,
    });

    let collider = owner.getComponent(Component.CIRCLE_COLLIDER);
    if (collider) {
      body.addShape(new p2.Circle({
        radius: collider.radius
      }));
    }

    collider = owner.getComponent(Component.BOX_COLLIDER);
    if (collider) {
      body.addShape(new p2.Box({
        width: collider.width,
        height: collider.height,
      }));
    }

    rigidbody.setBody(body);
    this.addedComps.push(rigidbody);
    this.addedBody.push(body);
    this.world.addBody(body);
  }

  /* ----------------------------Game Flow----------------------------------- */

  create() {
    this.world = new p2.World({
      gravity: [0, 0],
    });
  }

  start() {

  }

  tick(dt) {
    /* internal step */
    this.world.step(dt);

    /* manually update game object's position */
    this.addedComps.forEach(rigidbody =>
      rigidbody.updateBodyEuler()
    );

    /*---------------temp*/
    let speed = 4;
    let dx = Input.dirVic[0] * speed;
    let dy = Input.dirVic[1] * speed;

    const player = this.addedBody[0];
    player.velocity[0] = dx;
    player.velocity[1] = dy;
    // console.log(`${player.velocity[0]}, ${player.velocity[1]}`)

    /*------------------------------*/

  }

  stop() {
  }

  terminate() {
  }

  /* --------------------Messages--------------------------- */
  onUnitSpawn(gameObject) {
    const rigidbody = gameObject.getComponent(Component.RIGIDBODY);
    if (rigidbody) {
      this.addRigidbody(rigidbody);
    }
  }
}

