import {Components} from '../../core/const';
import Component from './component';

export default class CircleCollider extends Component {

  constructor(data) {
    super(data);
    this._type = Components.CIRCLE_COLLIDER;
  }

  /**
   * @param data {object}
   */
  copyConstructor(data) {
    this.offset = data.offset || 0;
    this.radius = data.radius || 0.5;
  }

  /* ---------------------------------------------------- */

  /**
   * Checks whether the x and y coordinates given are contained within this circle
   *
   * @param {number} x - The X coordinate of the point to test
   * @param {number} y - The Y coordinate of the point to test
   * @return {boolean} Whether the x/y coordinates are within this Circle
   */
  contains(x, y) {
    if (this.radius <= 0) {
      return false;
    }
    const r2 = this.radius * this.radius;
    let dx = (this.getOwner().getTransform().position[0] - x);
    let dy = (this.getOwner().getTransform().position[1] - y);
    dx *= dx;
    dy *= dy;
    return (dx + dy <= r2);
  }

  /* -------------------Serializable-------------------------- */

  deserialize(str) {
  }

  serialize() {
    return ``;
  }

  /* --------------------Messages--------------------------- */

  onCollisionEnter() {

  }

  onCollisionExit() {

  }

  onCollisionStay() {

  }

}