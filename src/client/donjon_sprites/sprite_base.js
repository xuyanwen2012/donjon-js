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
     * @type {Array}
     * @private
     */
    //this._animationSprites = [];
    /**
     * @type {SpritesetBase}
     * @private
     */
    //this._effectTarget = this;
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
    //this._updateAnimationSprites();
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

  // _updateAnimationSprites () {
  //     if (this._animationSprites.length > 0) {
  //         let sprites = this._animationSprites.clone();
  //         this._animationSprites = [];
  //         for (let i = 0; i < sprites.length; i++) {
  //             let sprite = sprites[i];
  //             if (sprite.isPlaying()) {
  //                 this._animationSprites.push(sprite);
  //             } else {
  //                 sprite.remove();
  //             }
  //         }
  //     }
  // };

  // startAnimation (animation, mirror, delay) {
  //     let sprite = new Sprite_Animation();
  //     sprite.setup(this._effectTarget, animation, mirror, delay);
  //     this.parent.addChild(sprite);
  //     this._animationSprites.push(sprite);
  // };
  //
  // isAnimationPlaying () {
  //     return this._animationSprites.length > 0;
  // };

}