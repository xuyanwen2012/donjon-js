import Transform from './transform'
import GameObject from '../donjon_objects/game_object';
import {Components} from '../core/const';

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
    this._owner = owner;
    /** @protected @type {number} */
    this._type = Components.NULL;
    /** @protected @type {Transform} */
    this._transform = owner ? owner.transform : null;
  }

  /** @return {GameObject} */
  get owner() {
    return this._owner;
  }

  /** @return {Transform} */
  get transform() {
    return this._transform
  }

  /** @return {number} */
  get type() {
    return this._type;
  }

  /** @abstract */
  update() {
  }

}

