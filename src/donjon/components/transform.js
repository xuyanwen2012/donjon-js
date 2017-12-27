import Component from './component';

export default class Transform extends Component {

  constructor() {
    super();
    this._type = Component.TRANSFORM;

  }

  /**
   * basically destructor
   */
  clearData() {
    super.clearData();
    this.position = [0, 0];
    this.scale = [1.0, 1.0];
    this.direction = 2;
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

  /**
   * @override
   * @param data
   */
  setData(data) {
    if (data.position) {
      this.setPosition(data.position);
    }
    if (data.scale) {
      this.setPosition(data.scale);
    }
    if (data.direction) {
      this.direction = data.direction;
    }
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
   * @param msg {{newPos,owner}}
   */
  onInstantiate(msg) {
    super.onInstantiate(msg);
    /* Assign new position, if applies */
    if (msg.newPos) {
      msg.owner._transform.setPosition(msg.newPos);
    }
  }
}