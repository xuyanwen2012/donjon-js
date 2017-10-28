import Collider from './collider';
import Circle from '../core/shapes/circle';

export default class CircleCollider extends Collider {

  /**
   * @param owner {GameObject}
   * @param param r
   */
  constructor(owner, ...param) {
    super(owner);
    this.circle_ = new Circle(...param);
  }

}