import p2 from 'p2';
import EventEmitter from '../managers/event_emitter';
import Manager from '../managers/manager';
import {Components} from '../core/const';
import Input from "../core/input";

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

    let collider = owner.getComponent(Components.CIRCLE_COLLIDER);
    if (collider) {
      body.addShape(new p2.Circle({
        radius: collider.radius
      }));
    }

    collider = owner.getComponent(Components.BOX_COLLIDER);
    if (collider) {
      body.addShape(new p2.Box({
        width: collider.width,
        height: collider.height,
      }));
    }

    this.addedComps.push(rigidbody);
    this.addedBody.push(body);
    this.world.addBody(body);
  }

  /* --------------------Messages--------------------------- */

  onUnitSpawn(gameObject) {
    const rigidbody = gameObject.getComponent(Components.RIGIDBODY);
    if (rigidbody) {
      this.addRigidbody(rigidbody);
    }
  }

  /* ----------------------------Game Flow----------------------------------- */

  /**
   * Create
   */
  setup() {
    this.world = new p2.World({
      gravity: [0, 0],
    });
  }

  tick(dt) {
    /* internal step */
    this.world.step(dt);

    /* manually update game object's position */
    for (let i = 0; i < this.addedBody.length; i++) {
      this.addedComps[i].getOwner().getTransform()
        .setPosition(this.addedBody[i].position);
    }

    /*---------------temp*/
    let speed = 3;
    let dx = Input.dirVic[0] * speed;
    let dy = Input.dirVic[1] * speed;

    const player = this.addedBody[0];
    player.velocity[0] = dx;
    player.velocity[1] = dy;

    const enemy = this.addedBody[1];
    enemy.velocity[0] = 0;
    enemy.velocity[1] = 0;
    const enemy2 = this.addedBody[2];
    enemy2.velocity[0] = 0;
    enemy2.velocity[1] = 0;

    if (Input.isTriggered('ok')) {
      enemy.force[0] = 100;
    }

  }

  terminate() {

  }
}

