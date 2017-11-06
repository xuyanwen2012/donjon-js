import Collider from './collider';
import Circle from '../core/shapes/circle';
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

    this._circleArea = new Circle(...param);
  }

}