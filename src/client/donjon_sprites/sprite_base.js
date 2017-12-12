/**
 * In addition to Sprite, this class handles visibility and animation.
 * @extends Sprite
 */
class SpriteBase extends Sprite {

  /**
   * @param {Bitmap=} bitmap The image for the sprite
   */
  constructor(bitmap) {
    super(bitmap);

    /**
     * @type {boolean}
     * @private
     */
    this._hiding = false;
  }

  /**
   * @override
   */
  update() {
    super.update();
    this.updateVisibility();
  }

  hide() {
    this._hiding = true;
    this.updateVisibility();
  }

  show() {
    this._hiding = false;
    this.updateVisibility();
  }

  /**
   * @protected
   */
  updateVisibility() {
    this.visible = !this._hiding;
  }
}