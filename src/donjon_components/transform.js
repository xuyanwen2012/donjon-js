import Component from './component';
import Victor from 'victor'

/**
 * @extends Component
 */
export default class Transform extends Component {
  /**
   * @param owner {GameObject} The game object this component.js is attached
   *     to. A component.js is always attached to a game object.
   * @param pos {Victor=} The position of the transform.
   * @param height {number=} The Height of the transform.
   * @param scale {Victor=} The scale of the transform.
   */
  constructor(owner, pos = new Victor(0, 0),
              height = 0, scale = new Victor(1, 1)) {
    super(owner);
    /** @private @type {Victor} */
    this.position_ = pos;

    /** @private @type {number} */
    this.height_ = height;

    /** @private @type {number} */
    this.rotation_ = 0;

    /** @private @type {Victor} */
    this.scale_ = scale;

    /** @private @type {Transform} */
    this.parent_ = null;
  }

  /** @return {Transform} */
  get parent() {
    return this.parent_;
  }

  /** @return {Victor} */
  get position() {
    return this.position_;
  }

  /** @return {number} */
  get height() {
    return this.height_;
  }

  /** @return {number} */
  get rotation() {
    return this.rotation_;
  }

  /** @return {Victor} */
  get scale() {
    return this.scale_;
  }

  /** @param value {Transform}*/
  setParent(value) {
    if (value instanceof Transform) {
      this.parent_ = value;
    }
  }

  /**
   * calculate the distance from first transform to the second transform.
   * @param first{Transform}
   * @param second{Transform}
   * @return {number}
   */
  static squaredDistanceTo(first, second) {
    return first.position_.distanceSq(second.position_);
  }

  /**
   * @override
   */
  update() {
  }

  /**
   * Moves the transform in the direction and distance of translation.
   * @param translation {Victor} Victor with direction and distance.
   */
  translate(translation) {
    this.position_.add(translation);
  }

  /**
   * Rotates the transform so the forward vector points at /target/'s current
   * position.
   * @param target{Transform} Object to point towards.
   */
  lookAt(target) {
  }

  /**
   * Applies a rotation of eulerAngles to the transform.
   * @param eulerAngles{number} angle degrees .
   */
  rotate(eulerAngles) {
    this.rotation_ += eulerAngles;
  }

  /**
   * Rotates the transform about the point in world coordinates by angle
   * degrees.
   * @param point {Victor} point in world coordinates.
   * @param angle {number} angle degrees.
   */
  rotateAround(point, angle) {
  }
}