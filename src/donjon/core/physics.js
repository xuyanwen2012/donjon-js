import p2 from 'p2';
import ObjectManager from "../managers/object_mannager";
import {Components} from "./const";

/**
 *
 */
export default class Physics {

  constructor() {

    this._bodyPairs = [];

    /**
     * @type {p2.World}
     * @private
     */
    this._world = new p2.World({
      // gravity: [0, -1]
    });

    // this.fixDeltaTime = 1 / 60.0;

    this.initializeListeners();
  }

  initializeListeners() {
    //EventEmitter.addListener('addForce', this.addForceToBody);
  }

  /**
   * @private
   */
  addForceToBody(rigidbody, forceArr) {

  }

  /**
   * Construct p2.Body from RigidbodyComponent
   *
   * @param rigidbody {Rigidbody}
   */
  addRigidbody(rigidbody) {
    /* create p2 body */
    let body = new p2.Body({
      mass: rigidbody.mass,
      type: rigidbody.getBodyType(),
      position: rigidbody.transform.position.toArray(),
      fixedRotation: true,
      allowSleep: true,
    });

    const bodyPair = [rigidbody, body];
    this._bodyPairs.push(bodyPair);

    /* get all colliders of the body */
    const obj = rigidbody.owner;

    const box = obj.getComponents(Components.BOX_COLLIDER);
    const circle = obj.getComponents(Components.CIRCLE_COLLIDER);

    box.forEach(b =>
      body.addShape(new p2.Box({
        width: b.width,
        height: b.height,
      }))
    );
    circle.forEach(circle =>
      body.addShape(new p2.Circle({
        radius: circle.radius,
      }))
    );

    /* Add the body to the world */
    this._world.addBody(body);
  }

  /**
   *
   */
  setup() {
    const bodies = ObjectManager.retrieveAllComponents(Components.RIGIDBODY);
    bodies.forEach(body =>
      this.addRigidbody(body)
    );

    /* add debug plane */
    //const planeShape = new p2.Plane();
    const planeBody = new p2.Body({
      position: [0, 0]
    });
    // const planeBody2 = new p2.Body({
    //   position: [0, -10]
    // });
    planeBody.addShape(new p2.Plane());
    //planeBody2.addShape(new p2.Plane());
    this._world.addBody(planeBody);
    //this._world.addBody(planeBody2);
  }

  /**
   *
   */
  tick(dt) {
    /* internal step */
    this._world.step(dt);

    /* update game object's position */
    this._bodyPairs.forEach(pair =>
      pair[0].owner.transform.setPosition(pair[1].position)
    )
  }
}