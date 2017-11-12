import p2 from 'p2';
import ObjectManager from "../managers/object_mannager";
import {Components} from "./const";

//local alias
/** @namespace p2.World */
const World = p2.World;
/** @namespace p2.Body */
const Body = p2.Body;
/** @namespace p2.Circle */
const Circle = p2.Circle;
/** @namespace p2.Box */
const Box = p2.Box;

/**
 *
 */
export default class Physics {
  constructor() {
    throw new Error('This is a static class');
  }

  /**
   * Construct p2.Body from RigidbodyComponent
   *
   * @param rigidbody {Rigidbody}
   */
  static addRigidbody(rigidbody) {
    /* create p2 body */
    let body = new Body({
      mass: 1,
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
        body.addShape(new Box({
          width: 1,
          height: 1
        }))
      }
    );
    circle.forEach(circle => {
        console.log("circle added");
        body.addShape(new Circle({
          radius: 0.5
        }))
      }
    );

    /* Add the body to the world */
    this._world.addBody(body);
    console.log(this._world);
  }

  static setup() {
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

    /* update object's position */
    this._bodyPairs.forEach(pair => {
        pair[0].owner.transform.setPosition({
          x: pair[1].position[0],
          y: pair[1].position[1]
        });
        console.log(`(${pair[0].owner.transform.position.x}, ${pair[0].owner.transform.position.y})`);
      }
    )

  }


}
Physics._bodyPairs = [];
Physics._coliders = [];
Physics._world = new World({
  gravity: [0, -1]
});
Physics.fixDeltaTime = 1 / 60.0;
Physics.maxSubSteps = 5;
