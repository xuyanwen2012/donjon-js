import p2 from 'p2';

//local alias
const World = p2.World;
const Body = p2.Body;
const Circle = p2.Circle;

/**
 *
 */
export default class Physics {

  constructor() {

    /** @type {World} @private */
    this._world = new World();


    /** @type {Array.<Rigidbody>} @private */
    this._bodyComponents = [];

    this._lastTime = 0;
  }

  /**
   * Construct p2.Body from RigidbodyComponent
   *
   * @param rigidbody {Rigidbody}
   */
  addComponent(rigidbody) {

  }


  /**
   *
   */
  tick() {
    this._world.step(Physics.fixDeltaTime);
  }


}

Physics.fixDeltaTime = 1 / 60.0;
Physics.maxSubSteps = 5;
