import Component from './component';

/**
 *
 */
export default class Rigidbody extends Component {

  constructor() {
    super();
    this._type = Component.RIGIDBODY;

    /* non data properties */
    this._body = null;
  }

  clearData() {
    super.clearData();
    this.mass = 1.0;
    this.bodyType = Rigidbody.DYNAMIC;

    this._body = null;
  }

  /* -------------------Getter/Setter/Accessor-------------------------- */

  setBody(body) {
    this._body = body;
  }

  /* --------------------Game Flow--------------------------- */

  update() {

  }

  updateBodyEuler() {
    this.getOwner().getTransform()
      .setPosition(this._body.position);
    this._body.velocity[0] = 0;
    this._body.velocity[1] = 0;
  }

  /* -------------------Serializable-------------------------- */

  deserialize(str) {
  }

  serialize() {
    return `${this._type}: `
  }

  /* --------------------Messages--------------------------- */
  onInstantiate(owner) {

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
