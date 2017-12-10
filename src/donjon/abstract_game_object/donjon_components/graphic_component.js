import Component from './component';
import {Components} from '../../core/const';

/**
 * A Render component contains essential data to Pixi.Sprite.
 */
export default class GraphicComponent extends Component {
  constructor(data) {
    super(data);
    this._type = Components.GRAPHIC;
  }

  /**
   * @param data {object}
   */
  copyConstructor(data) {
    this.assetName = data.assetName || "";
    this.priorityType = data.priorityType || 1;
    this.opacity = data.opacity || 255;
    this.blendMode = data.blendMode || 0;
    this.transparent = data.transparent || false;
  }

  /* -------------------Getter/Setter/Accessor-------------------------- */

  /** @return {boolean} */
  isTransparent() {
    return this.transparent;
  }

  /** @param transparent {boolean} */
  setTransparent(transparent) {
    this.transparent = transparent;
  }

  /** @return {number} x position on canvas to render */
  screenX() {
    //todo use Camera instance's position
    const sx = this.owner.getTransform().position[0];
    const tw = 48;
    return Math.round(sx * tw + tw / 2);
  }

  /** @return {number} y position on canvas to render */
  screenY() {
    const sy = this.owner.getTransform().position[1];
    const th = 48;
    return Math.round(sy * th + th / 2);
  }

  /** @return {number} z position on canvas to render */
  screenZ() {
    return (this.priorityType << 1) + 1;
  }

  /** @return {number} x scale on canvas to render */
  screenScaleX() {
    return this.owner.getTransform().scale[0];
  }

  /** @return {number} y scale on canvas to render */
  screenScaleY() {
    return this.owner.getTransform().scale[1];
  }

  /* -------------------Serializable-------------------------- */

  serialize() {
    return `${this._type}: ${this.assetName} ${this.priorityType}\
 ${this.opacity} ${this.blendMode} ${+this.transparent}`;
  }

  deserialize(str) {
  }

}