import Transform from './transform'
import GameObject from '../donjon_objects/game_objects';

/**
 *  Component Class
 *  Super abstract class for all components, provide basic owner to game
 * entities,
 *  @abstract
 */
export default class Component {

  /**
   * set the owner when construct the component.js
   * @param owner {GameObject}
   */
  constructor(owner) {
    if (!owner) {
      console.error('Creating component without owner.');
    }
    /** @protected @type {GameObject} */
    this.owner_ = owner;
    /** @protected @type {Transform} */
    this.transform_ = owner ? owner.transform : null;
    this.setupListeners_();
  }

  /** @return {GameObject} */
  get owner() {
    return this.owner_;
  }

  /** @return {Transform} */
  get transform() {
    return this.transform_
  }

  /** @abstract */
  update() {
  }

  /**
   * @abstract
   * @param newOwner {GameObject}
   */
  clone(newOwner) {
  }

  /** @protected @abstract */
  setupListeners_() {
  }
}

