/**
 *
 *
 * @extends {SpriteBase}
 */
class SpriteRenderComponent extends SpriteBase {

  /**
   * @param renderComponent {RenderComponent}
   */
  constructor(renderComponent) {
    super();
    if (!renderComponent) {
      console.error("Creating SpriteRenderComponent without RenderComponent.");
    }

    console.log(renderComponent);

    /**
     * @type {RenderComponent}
     * @private
     */
    this._renderComponent = renderComponent;

    /**
     * @type {string}
     * @private
     */
    this._assetName = null;

    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
  }

  /**
   * @override
   */
  update() {
    super.update();
    this.updateBitmap();
    this.updateFrame();
    this.updatePosition();
    this.updateOther();
  }

  /** @override @protected */
  updateVisibility() {
    super.updateVisibility();
    if (this._renderComponent.isTransparent()) {
      this.visible = false;
    }
  }

  /**
   * Check if imaged changed, and reset the bitmap
   *
   * @private
   */
  updateBitmap() {
    if (this.isImageChanged()) {
      this._assetName = this._renderComponent.assetName;
      this.setBitmap();
    }
  }

  /**
   * Set the frame area base on pattern, direction, etc
   *
   * @private
   */
  updateFrame() {

    //this.setFrame(sx, sy, pw, ph);
  }

  /**
   * Update the position base on the screen x,y,z
   *
   * @private
   */
  updatePosition() {
    this.x = this._renderComponent.screenX();
    this.y = this._renderComponent.screenY();
    this.z = this._renderComponent.screenZ();
  }

  /**
   * Update opacity and blend mode
   *
   * @private
   */
  updateOther() {
    this.opacity = this._renderComponent.opacity;
    this.blendMode = this._renderComponent.blendMode;
  }

  /** @private @return {boolean} */
  isImageChanged() {
    return this._assetName !== this._renderComponent.assetName;
  }

  /**
   * @private
   */
  setBitmap() {
    this.bitmap = ImageManager.loadCharacter(this._assetName);
  }

}