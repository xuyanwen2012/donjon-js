import Component from './component';
import {Components} from '../../core/const';

/**
 *
 */
export default class Rigidbody extends Component {

  constructor(data) {
    super(data);
    this._type = Components.RIGIDBODY;
  }

  /**
   * @param data {object}
   */
  copyConstructor(data = 1.0) {
    this.mass = data.mass;
  }

  /* -------------------Getter/Setter/Accessor-------------------------- */


  /* -------------------Serializable-------------------------- */

  deserialize(str) {
  }

  serialize() {
    return `${this._type}: `
  }
}