import {Components} from '../../core/const';

import Component from './component';

export default class Transform extends Component {

  constructor(data) {
    super(data);
    this._type = Components.TRANSFORM;
  }

  copyConstructor(data = {}) {
    this.position = data.position ? data.position.slice(0) : [0, 0];
    this.scale = data.scale ? data.scale.slice(0) : [1.0, 1.0];
  }

  /* -------------------Getter/Setter/Accessor-------------------------- */

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

  onInstantiate(owner, newPos) {
    super.onInstantiate(owner);
    /* Assign new position, if applies */
    if (newPos) {
      owner._transform.setPosition(newPos);
    }
  }
}