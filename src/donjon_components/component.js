import GameObject from '../donjon_objects/game_objects';
import Transform from './comp_transform'

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
      console.error("Creating component.js without owner.");
    }
    /** @protected @type {GameObject} */
    this.owner_ = owner;
    /** @protected @type {Transform} */
    this.transform_ = owner.transform;
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

  /** @protected @abstract */
  setupListeners_() {
  }
}

