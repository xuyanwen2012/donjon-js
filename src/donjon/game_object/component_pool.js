import Pool from './pool';

export default class ComponentPool extends Pool {

  constructor(creator, size = 0) {
    super();
    this._creator = creator;
    this.resize(size);
  }

  create() {
    return new this._creator();
  }

  /**
   *
   * @param comp
   */
  destroy(comp) {
    comp.clearData();
  }
}