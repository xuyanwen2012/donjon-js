import {Components} from '../../core/const';
import Component from './component';

export default class BoxCollider extends Component {

  constructor(data) {
    super(data);
    this._type = Components.BOX_COLLIDER;
  }

  /**
   * @param data {object}
   */
  copyConstructor(data) {
    this.offset = data.offset || 0;
    this.width = data.width || 1;
    this.height = data.height || 1;
  }

  /* ---------------------------------------------------- */

  /**
   * Checks whether the x and y coordinates given are contained within this Box
   *
   * @param {number} x - The X coordinate of the point to test
   * @param {number} y - The Y coordinate of the point to test
   * @return {boolean} Whether the x/y coordinates are within this Rectangle
   */
  contains(x, y) {
    const dx = this.getOwner().getTransform().position[0];
    const dy = this.getOwner().getTransform().position[1];
    const sw = this.width / 2;
    const sh = this.height / 2;

    return x > dx - sw && x < dx + sw && y > dy - sh && y < dy + sh;
  }

  /* -------------------Serializable-------------------------- */

  deserialize(str) {
  }

  serialize() {
    return `${this._type}: ${this.offset} ${this.width} ${this.height}`
  }

  /* --------------------Messages--------------------------- */

  onCollisionEnter() {

  }

  onCollisionExit() {

  }

  onCollisionStay() {

  }

}