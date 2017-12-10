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

  /* -------------------Serializable-------------------------- */

  deserialize(str) {
  }

  serialize() {
    return `${this._type}: ${this.offset} ${this.width} ${this.height}`
  }
}