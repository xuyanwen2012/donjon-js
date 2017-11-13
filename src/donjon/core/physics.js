import p2 from 'p2';
import ObjectManager from "../managers/object_mannager";
import {Components} from "./const";
import EventEmitter from "../managers/event_emitter";

/**
 *
 */
export default class Physics {
  constructor() {
    throw new Error('This is a static class');
  }

  static initializeListeners() {
    EventEmitter.addListener('addForce', this.addForceToBody);
  }

  /**
   * @private
   */
  static addForceToBody(rigidbody, forceArr) {

  }

  /**
   * Construct p2.Body from RigidbodyComponent
   *
   * @param rigidbody {Rigidbody}
   */
  static addRigidbody(rigidbody) {
    /* create p2 body */
    let body = new p2.Body({
      mass: rigidbody.mass,
      type: rigidbody.getBodyType(),
      position: rigidbody.transform.position.toArray(),
      fixedRotation: true,
    });

    const bodyPair = [rigidbody, body];
    this._bodyPairs.push(bodyPair);

    /* get all colliders of the body */
    const obj = rigidbody.owner;

    const box = obj.getComponents(Components.BOX_COLLIDER);
    const circle = obj.getComponents(Components.CIRCLE_COLLIDER);

    box.forEach(b => {
        console.log("box added");
      body.addShape(new p2.Box({
        width: b.width,
        height: b.height,
        }))
      }
    );
    circle.forEach(circle => {
        console.log("circle added");
      body.addShape(new p2.Circle({
        radius: circle.radius,
        }))
      }
    );

    /* Add the body to the world */
    this._world.addBody(body);
    console.log(this._world);
  }

  static setup() {
    this.initializeListeners();

    const bodies = ObjectManager.retrieveAllComponents(Components.RIGIDBODY);
    bodies.forEach(body =>
      this.addRigidbody(body)
    );

    /* add debug plane */
    const planeShape = new p2.Plane();
    const planeBody = new p2.Body({
      position: [0, 0]
    });
    planeBody.addShape(planeShape);
    this._world.addBody(planeBody);
  }

  /**
   *
   */
  static tick() {
    this._world.step(Physics.fixDeltaTime);

    /* update game object's position */
    this._bodyPairs.forEach(pair => {
        pair[0].owner.transform.setPosition({
          x: pair[1].position[0],
          y: pair[1].position[1]
        });
      //console.log(`(${pair[0].owner.transform.position.x},
      // ${pair[0].owner.transform.position.y})`);
      }
    )
  }


}

Physics._bodyPairs = [];
Physics._coliders = [];
Physics._world = new p2.World({
  gravity: [0, -10]
});
Physics.fixDeltaTime = 1 / 60.0;
Physics.maxSubSteps = 5;
