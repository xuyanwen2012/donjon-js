import Collider from "./collider";
import Rectangle from "../core/shapes/rectangle";

export default class BoxCollider extends Collider {

  /**
   * @param owner {GameObject}
   * @param param x,y,width,height.
   */
  constructor(owner, ...param) {
    super(owner);
    this.rectangle_ = new Rectangle(...param);
  }

}