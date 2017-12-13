import Component from './component';
import {Components} from '../../core/const';

/**
 *
 */
export default class Rigidbody extends Component {

  constructor() {
    super();
    this._type = Components.RIGIDBODY;
  }

  clearData() {
    super.clearData();
    this.mass = 1.0;
    this.bodyType = Rigidbody.DYNAMIC;
  }

  /* -------------------Getter/Setter/Accessor-------------------------- */


  /* -------------------Serializable-------------------------- */

  deserialize(str) {
  }

  serialize() {
    return `${this._type}: `
  }

}
/**
 * @const
 * @static
 * @type {number}
 */
Rigidbody.DYNAMIC = 1;
/**
 * @const
 * @static
 * @type {number}
 */
Rigidbody.STATIC = 2;
/**
 * @const
 * @static
 * @type {number}
 */
Rigidbody.KINEMATIC = 4;
