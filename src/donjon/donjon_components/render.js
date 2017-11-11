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

    /**
     * @type {string}
     * @protected
     */
    this._assetName = assetName;

    /** @protected @type {number} */
    this._type = Components.RENDER;

    /** @protected @type {number} */
    this._priorityType = 1;

    /** @protected @type {number} */
    this._opacity = 255;

    /** @protected @type {number} */
    this._blendMode = 0;//PIXI.BLEND_MODES.NORMAL;

    /** @protected @type {boolean} */
    this._transparent = false;

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
    const sx = this._transform.position.x;// - $gameMap.displayX();
    const tw = 48;//$gameMap.tileWidth();
    let number = Math.round(sx * tw + tw / 2);
    //console.log(sx);
    return number;
  }

  screenY() {
    const sy = this._transform.position.y;// - $gameMap.displayY();
    const th = 48;//$gameMap.tileHeight();
    return Math.round(sy * th + th / 2);
  }

  /** @return {number} z position on canvas to render */
  screenZ() {
    return (this._priorityType << 1 ) + 1;
  }
}