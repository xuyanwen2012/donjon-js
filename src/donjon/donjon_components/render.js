import Component from './component';
import {Components} from '../core/const';
//import DonjonMap from '../donjon_objects/donjon_map';

/**
 * A Render component contains essential data to Pixi.Sprite.
 */
export default class RenderComponent extends Component {

  /**
   * @param owner {GameObject}
   * @param assetName {string}
   */
  constructor(owner, assetName) {
    super(owner);
    /** @protected @type {number} */
    this._type = Components.RENDER;

    /**
     * @type {string}
     * @protected
     */
    this._assetName = assetName;

    /** @protected @type {number} */
    this._priorityType = 1;

    /** @protected @type {number} */
    this._opacity = 255;

    /** @protected @type {number} */
    this._blendMode = 0;//PIXI.BLEND_MODES.NORMAL;

    /** @protected @type {boolean} */
    this._transparent = false;

  }

  /**
   *
   * @param other{RenderComponent}
   */
  copy(other) {
    this._assetName = other._assetName;
    this._priorityType = other._priorityType;
    this._opacity = other._opacity;
    this._blendMode = other._blendMode;
    this._transparent = other._transparent;
  }

  update() {

  }

  get assetName() {
    return this._assetName;
  }

  get blendMode() {
    return this._blendMode;
  }

  set blendMode(value) {
    this._blendMode = value;
  }

  get opacity() {
    return this._opacity;
  }

  set opacity(value) {
    this._opacity = value;
  }

  /** @return {boolean} */
  isTransparent() {
    return this._transparent;
  }

  /** @param transparent {boolean} */
  setTransparent(transparent) {
    this._transparent = transparent;
  }

  /** @return {number} x position on canvas to render */
  screenX() {
    //todo use Camera instance's position
    const sx = this.transform.position.x;// - $gameMap.displayX();
    const tw = 48;//$gameMap.tileWidth();
    return Math.round(sx * tw + tw / 2);
  }

  /** @return {number} y position on canvas to render */
  screenY() {
    const sy = this.transform.position.y;// - $gameMap.displayY();
    const th = 48;//$gameMap.tileHeight();
    return Math.round(sy * th + th / 2);
  }

  /** @return {number} z position on canvas to render */
  screenZ() {
    return (this._priorityType << 1 ) + 1;
  }

  /** @return {number} x scale on canvas to render */
  screenScaleX() {
    return this._transform.scale.x;
  }

  /** @return {number} y scale on canvas to render */
  screenScaleY() {
    return this._transform.scale.y;
  }
}