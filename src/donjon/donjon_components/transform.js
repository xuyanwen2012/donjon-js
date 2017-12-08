import Component from './component';
import Victor from 'victor'
import {Components} from "../core/const";

/**
 * @extends Component
 */
export default class Transform extends Component {

  /**
   * @param owner {GameObject} The game object this component.js is attached
   *     to. A component.js is always attached to a game object.
   * @param pos {Array.<number>=} The position of the transform.
   * @param height {number=} The Height of the transform.
   * @param scale {Array.<number>=} The scale of the transform.
   */
  constructor(owner, pos = [0, 0], height = 0, scale = [1, 1]) {
    super(owner);

    /** @private @type {number} */
    this._type = Components.TRANSFORM;
    /** @private @type {Transform} */
    this._transform = this;
    /** @private @type {Victor} */
    this._position = Victor.fromArray(pos);
    /** @private @type {number} */
    this._height = height;
    /** @private @type {number} */
    this._rotation = 0;
    /** @private @type {Victor} */
    this._scale = Victor.fromArray(scale);
    // /** @private @type {Transform} */
    // this._parent = null;
  }

  /**
   *
   * @param other {Transform}
   */
  copy(other) {
    this._position.copy(other._position);
    this._height = other._height;
    this._rotation = other._rotation;
    this._scale.copy(other._scale);
  }

  // /** @return {Transform} */
  // get parent() {
  //   return this._parent;
  // }

  /** @return {Victor} */
  get position() {
    return this._position;
  }

  /** @return {number} */
  get height() {
    return this._height;
  }

  /** @return {number} */
  get rotation() {
    return this._rotation;
  }

  /** @return {Victor} */
  get scale() {
    return this._scale;
  }

  /**
   * calculate the distance from first transform to the second transform.
   * @param first{Transform}
   * @param second{Transform}
   * @return {number}
   */
  static squaredDistanceTo(first, second) {
    return first._position.distanceSq(second._position);
  }

  // /** @param value {Transform}*/
  // setParent(value) {
  //   if (value instanceof Transform) {
  //     this._parent = value;
  //   }
  // }

  /** @param pos {Array.<number>}*/
  setPosition(pos) {
    this._position.x = pos[0] || 0;
    this._position.y = pos[1] || 0;
  }

  /**
   * @override
   */
  update() {
  }

  /**
   * Moves the transform in the direction and distance of translation.
   * @param translation {Array.<number>} Victor with direction and distance.
   */
  translate(translation) {
    //this._position.add(translation);
    this._position.x += translation[0];
    this._position.y += translation[1];
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
    this._rotation += eulerAngles;
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