import Component from './component';
import Victor from 'victor';
/**
 * @extends Component
 */
export default class Rigidbody extends Component {
  /**
   * @param owner {GameObject}
   */
  constructor(owner) {
    super(owner);
    /** @private @type {number} */
    this.bodyType_ = Rigidbody.BodyTypes.DYNAMIC;

    /** @private @type {number} */
    this.detectionMode_ = Rigidbody.CollisionDetectionModes.DISCRETE;

    /** @private @type {number} */
    this.sleepMode_ = Rigidbody.SleepModes.START_AWAKE;

    /** @private @type {number} */
    this.drag_ = 0.5;
    //this._angularDrag = 0;
    /** @private @type {number} */
    this.mass_ = 1.0;

    /** @private @type {Victor} */
    this.impactForces_ = new Victor();

    /** @private @type {Victor} */
    this.forces_ = new Victor();

    /** @private @type {Victor} */
    this.velocity_ = new Victor();

    /** @private @type {number} */
    this.speed_ = 0.0;

    //this._angularVelocity = 0;

    //Ivan: should I add interpolation?
    this.deltaPos_ = new Victor();
  }

  /** @return {Victor} */
  get velocity() { return this.velocity_; }

  /** @param value {Victor} */
  set velocity(value) { this.velocity_ = value; }

  /**
   * Apply a force to the rigidbody.
   * The force is specified as two separate components in the X and Y
   * directions. The object will be accelerated by the force according to the
   * law force = mass x acceleration, the larger the mass, the greater the
   * force required to accelerate to a given speed.
   * @param force {Victor} Components of the force in the X and Y axes.
   */
  addForce(force) {
    this.impactForces_.add(force);
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
    return this.bodyType_ === Rigidbody.BodyTypes.KINEMATIC;
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
    this.deltaPos_ = position.clone().subtract(this.owner.transform.position);
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
    this.forces_.zero();
  }

  update(d_t) {
    this.calcLoads(d_t);
    this.updateBodyEuler(d_t);
  }

  /**
   * @param d_t {number}
   */
  calcLoads(d_t) {
    //aggregate forces
    this.resetForces();

    //test force
    this.forces_.add(this.impactForces_);

    this.impactForces_.zero();
  }

  /**
   * @param d_t {number}
   */
  updateBodyEuler(d_t) {
    let a = this.forces_.clone().divideScalar(this.mass_);

    let dv = a.multiplyScalar(d_t);
    this.velocity_.add(dv);

    let ds = this.velocity_.clone().multiplyScalar(d_t);
    this.owner.transform.translate(ds);

    //Misc. calculation
    //this.speed_ = this.velocity_.magnitude();
    //console.log(this.speed_);

    //maybe
    this.owner.transform.translate(this.deltaPos_);
    this.deltaPos_.zero();
  }
}

/** @const @enum {number} */
Rigidbody.CollisionDetectionModes = {
  DISCRETE: 1,
  CONTINUOUS: 2,
};

/** @const @enum {number} */
Rigidbody.BodyTypes = {
  DYNAMIC: 1,
  KINEMATIC: 2,
  STATIC: 3,
};

/** @const @enum {number} */
Rigidbody.SleepModes = {
  NEVER_SLEEP: 1,
  START_AWAKE: 2,
  START_ASLEEP: 3,
};