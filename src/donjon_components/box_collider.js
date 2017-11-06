import Collider from "./collider";
import Rectangle from "../core/shapes/rectangle";
import {Components} from "../core/const";

export default class BoxCollider extends Collider {

  /**
   * @param owner {GameObject}
   * @param param {Array.<number>} x,y,width,height.
   */
  constructor(owner, ...param) {
    super(owner);
    /** @private @type {number} */
    this._type = Components.BOX_COLLIDER;
    this._rectangleArea = new Rectangle(...param);
  }

}