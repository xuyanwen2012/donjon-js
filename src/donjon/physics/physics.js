import p2 from 'p2';
import EventEmitter from '../managers/event_emitter';

import Manager from '../managers/manager';
import {Components} from '../core/const';

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
    let body = new p2.Body({
      mass: rigidbody.mass,
      position: rigidbody.getOwner().getTransform().position, //.splice(0)
      fixedRotation: true,
      type: p2.Body.KINEMATIC,
    });

    // Add a circular shape to the body
    body.addShape(new p2.Circle({radius: 1}));


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
      //gravity: [0, -1],
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
  }

  terminate() {

  }
}