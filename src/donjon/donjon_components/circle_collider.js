import Collider from './collider';
import {Components} from "../core/const";

export default class CircleCollider extends Collider {

  /**
   * @param owner {GameObject}
   * @param param r
   */
  constructor(owner, ...param) {
    super(owner);
    /** @private @type {number} */
    this._type = Components.CIRCLE_COLLIDER;

    this._radius = param[0];
  }

  /**
   *
   * @param other {CircleCollider}
   */
  copy(other) {
    super.copy(other);
    this._radius = other._radius;
  }

  get radius() {
    return this._radius;
  }

}