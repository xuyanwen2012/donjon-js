import {Components} from '../../core/const';
import Component from './component';

export default class Transform extends Component {

  constructor(data) {
    super(data);
    this._type = Components.TRANSFORM;
  }

  /* -------------------Static---------------------------- */

  /**
   * @param first {Transform}
   * @param second {Transform}
   * @return {number}
   */
  static distance(first, second) {
    return Math.sqrt(this.sqrDistance(first, second));
  }

  /**
   * @param first {Transform}
   * @param second {Transform}
   * @return {number}
   */
  static sqrDistance(first, second) {
    const dx = first.position[0] - second.position[0];
    const dy = first.position[1] - second.position[1];
    return dx * dx + dy * dy;
  }

  /* ------------------------------------------------------------------- */

  copyConstructor(data = {}) {
    this.position = data.position ? data.position.slice(0) : [0, 0];
    this.scale = data.scale ? data.scale.slice(0) : [1.0, 1.0];
    this.direction = data.direction ? data.direction : 2;
  }

  /* -------------------Getter/Setter/Accessor-------------------------- */

  /** @return {number} */
  getX() {
    return this.position[0];
  }

  /** @return {number} */
  getY() {
    return this.position[1];
  }

  /** @param pos {Array.<number>}*/
  setPosition(pos = [0, 0]) {
    this.position[0] = pos[0];
    this.position[1] = pos[1];
  }

  /** @param scale {Array.<number>}*/
  setScale(scale = [1.0, 1.0]) {
    this.scale[0] = scale[0];
    this.scale[1] = scale[1];
  }

  /* ------------------------------------------------------ */

  /** @param translation {Array.<number>}*/
  translate(translation) {
    this.position[0] += translation[0];
    this.position[1] += translation[1];
  }

  /* -------------------Serializable-------------------------- */

  serialize() {
    return `${this._type}: ${this.position[0]} ${this.position[1]} ${this.scale[0]} ${this.scale[1]}`;
  }

  deserialize(str) {

  }

  /* --------------------Messages--------------------------- */
  /**
   *
   * @param owner
   * @param newPos
   */
  onInstantiate(owner, newPos) {
    super.onInstantiate(owner);
    /* Assign new position, if applies */
    if (newPos) {
      owner._transform.setPosition(newPos);
    }
  }
}