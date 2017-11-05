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
    this.type_ = Components.BOX_COLLIDER;
    this.rectangle_ = new Rectangle(...param);
  }

}