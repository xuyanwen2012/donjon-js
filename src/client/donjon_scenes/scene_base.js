/**
 * A Container represents a collection of display objects.
 * It is the base class of all display objects that act as a container for
 * other objects.
 * @abstract
 * @extends {Stage} SceneBase
 */
class SceneBase extends Stage {
  /**
   * @constructor
   */
  constructor() {
    super();
    /** @private @type {boolean} */
    this._active = false;

    /** @private @type {number} */
    this._fadeSign = 0;

    /** @private @type {number} */
    this._fadeDuration = 0;

    /**
     * @type {ScreenSprite} a sprite that is covering all other sprite on screen
     * @private
     */
    this._fadeSprite = null;

    /** @private @type {number} */
    this.imageReservationId_ = Utils.generateRuntimeId();
  }

  /**
   * Attach a reservation to the reserve queue.
   */
  attachReservation() {
    ImageManager.setDefaultReservationId(this.imageReservationId_);
  }

  /**
   * Remove the reservation from the Reserve queue.
   */
  detachReservation() {
    ImageManager.releaseReservation(this.imageReservationId_);
  }

  /** @abstract */
  create() {
  }

  terminate() {
    this.removeChild(this._fadeSprite);
  }

  /**
   * @return {boolean}
   */
  isActive() {
    return this._active;
  }

  /**
   * @return {boolean} if ImageManager is ready
   */
  isReady() {
    return ImageManager.isReady();
  }

  /**
   *
   */
  start() {
    this._active = true;
  }

  /**
   * Handle fading update and update all children
   */
  update() {
    //EventsManager.tick();
    this.updateFade();
    this.updateChildren();
    AudioManager.checkErrors();
  }

  stop() {
    this._active = false;
  }

  /**
   * @return {boolean}
   */
  isBusy() {
    return this._fadeDuration > 0;
  }

  /**
   * @param duration {Number}
   * @param white {Boolean}
   */
  startFadeIn(duration, white = false) {
    this.createFadeSprite(white);
    this._fadeSign = 1;
    this._fadeDuration = duration || 30;
    this._fadeSprite.opacity = 255;
  }

  /**
   * @param duration {Number}
   * @param white {Boolean}
   */
  startFadeOut(duration, white = false) {
    this.createFadeSprite(white);
    this._fadeSign = -1;
    this._fadeDuration = duration || 30;
    this._fadeSprite.opacity = 0;
  }

  /**
   * @private
   * @param white {Boolean}
   */
  createFadeSprite(white) {
    if (!this._fadeSprite) {
      this._fadeSprite = new ScreenSprite();
      this.addChild(this._fadeSprite);
    }
    if (white) {
      this._fadeSprite.setWhite();
    } else {
      this._fadeSprite.setBlack();
    }
  }

  /** @private */
  updateFade() {
    if (this._fadeDuration > 0) {
      let d = this._fadeDuration;
      if (this._fadeSign > 0) {
        this._fadeSprite.opacity -= this._fadeSprite.opacity / d;
      } else {
        this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;
      }
      this._fadeDuration--;
    }
  }

  /**
   * the children includes {PIXI.DisplayObject}
   * @protected
   */
  updateChildren() {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child.update) {
        child.update();
      }
    }
  }

  popScene() {
    SceneManager.pop();
  }

  fadeOutAll() {
    const time = this.slowFadeSpeed() / 60;
    AudioManager.fadeOutBgm(time);
    AudioManager.fadeOutBgs(time);
    AudioManager.fadeOutMe(time);
    this.startFadeOut(this.slowFadeSpeed());
  }

  fadeSpeed() {
    return 24;
  }

  slowFadeSpeed() {
    return this.fadeSpeed() * 2;
  }
}