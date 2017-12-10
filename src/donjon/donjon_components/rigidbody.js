import Component from './component';
import Victor from 'victor';
import {
  CollisionDetectionModes,
  Components,
  RigidBodyTypes,
  SleepModes
} from '../core/const';
import EventEmitter from '../managers/event_emitter';


/**
 * @extends Component
 */
export default class Rigidbody extends Component {

  /**
   * @param owner {GameObject}
   * @param param {[]}
   */
  constructor(owner, ...param) {
    super(owner);

    /** @private @type {number} */
    this._type = Components.RIGIDBODY;

    /** @private @type {number} */
    this._bodyType = RigidBodyTypes.DYNAMIC;

    // /** @private @type {number} */
    // this._detectionMode = CollisionDetectionModes.DISCRETE;

    /** @private @type {number} */
    this._sleepMode = SleepModes.START_AWAKE;

    /** @private @type {number} */
    this._mass = 1.0;

    /** @private @type {Victor} */
    this._impactForces = new Victor();

    /** @private @type {Victor} */
    this._forces = new Victor();

    /** @private @type {Victor} */
    this._velocity = new Victor();

    /** @private @type {number} */
    this._speed = 0.0;

    //this._angularVelocity = 0;

    //Ivan: should I add interpolation?
    /** @private @type {Victor} */
    this._deltaPos = new Victor();
  }

  /**
   * Copy data from another transform
   * @param other {Rigidbody}
   */
  copy(other) {
    this._bodyType = other._bodyType;
    this._sleepMode = other._sleepMode;
    this._mass = other._mass;
    this._speed = other._speed;
    this._impactForces.copy(other._impactForces);
    this._forces.copy(other._forces);
    this._velocity.copy(other._velocity);
    this._deltaPos.copy(other._deltaPos);
  }

  update() {

  }

  get mass() {
    return this._mass;
  }

  /** @return {Victor} */
  get velocity() {
    return this._velocity;
  }

  /** @param value {Victor} */
  set velocity(value) {
    this._velocity = value;
  }

  getBodyType() {
    return this._bodyType;
  }

  /**
   * Apply a force to the rigidbody.
   * The force is specified as two separate components in the X and Y
   * directions. The object will be accelerated by the force according to the
   * law force = mass x acceleration, the larger the mass, the greater the
   * force required to accelerate to a given speed.
   * @param force {Victor} Components of the force in the X and Y axes.
   */
  addForce(force) {
    EventEmitter.emit('addForce', this, [force.x, force.y]);
    this._impactForces.add(force);
  }

  /**
   * Checks whether the collider is touching any of the collider(s) attached
   * to this rigidbody or not.
   * @param collider{Collider} The collider to check if it is touching any of
   *     the collider(s) attached to this rigidbody.
   * @return {boolean} Whether the collider is touching any of the
   *     collider(s) attached to this rigidbody or not.
   */
  isTouching(collider) {
    //TODO: handle algorithm

  }

  isKinematic() {
    return this._bodyType === RigidBodyTypes.KINEMATIC;
  }

  isStatic() {
    return this._bodyType === RigidBodyTypes.STATIC;
  }

  isAwake() {

  }

  isSleeping() {

  }

  wakeUp() {

  }

  sleep() {
    /*
      Sleeping is an optimisation that is used to temporarily remove an object from physics
      simulation when it is at rest. This function makes the rigidbody sleep - it is sometimes
      desirable to enable this manually rather than allowing automatic sleeping with the
      sleepMode property.
    */
  }

  /**
   * Moves the rigidbody to position.
   * @param position{Victor} The new position for the Rigidbody object.
   */
  movePosition(position) {
    this._deltaPos = position.clone().subtract(this.owner.transform.position);
  }

  /*
      void FixedUpdate() {
          rb2D.MovePosition(rb2D.position + velocity * Time.fixedDeltaTime);
      }
   */

  /**
   * Rotates the rigidbody to angle (given in degrees).
   * @param angle {number}    The new rotation angle for the Rigidbody object.
   */
  moveRotation(angle) {

  }

  /**
   *
   */
  resetForces() {
    this._forces.zero();
  }
}