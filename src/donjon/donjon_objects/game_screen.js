/**
 * The game object class for screen effect data, such as changes in color tone
 */
export default class GameScreen {

  constructor() {
    this.clear();
  }

  clear() {
    this.clearFade();
    this.clearTone();
    this.clearFlash();
    this.clearShake();
    this.clearZoom();
    this.clearWeather();
  }

  /**
   * @return {number}
   */
  brightness() {
    return this._brightness;
  }

  tone() {
    return this._tone;
  }

  flashColor() {
    return this._flashColor;
  }

  shake() {
    return this._shake;
  }

  zoomX() {
    return this._zoomX;
  }

  zoomY() {
    return this._zoomY;
  }

  zoomScale() {
    return this._zoomScale;
  }

  weatherType() {
    return this._weatherType;
  }

  weatherPower() {
    return this._weatherPower;
  }

  clearFade() {
    /** @private @type {number} */
    this._brightness = 255;
    /** @private @type {number} */
    this._fadeOutDuration = 0;
    /** @private @type {number} */
    this._fadeInDuration = 0;
  };

  clearTone() {
    /**
     * @type {[number,number,number,number]}
     * @private
     */
    this._tone = [0, 0, 0, 0];
    /**
     * @type {[number,number,number,number]}
     * @private
     */
    this._toneTarget = [0, 0, 0, 0];

    /** @private @type {number} */
    this._toneDuration = 0;
  };

  clearFlash() {
    /**
     * @type {[number,number,number,number]}
     * @private
     */
    this._flashColor = [0, 0, 0, 0];
    /** @private @type {number} */
    this._flashDuration = 0;
  };

  clearShake() {
    /** @private @type {number} */
    this._shakePower = 0;
    /** @private @type {number} */
    this._shakeSpeed = 0;
    /** @private @type {number} */
    this._shakeDuration = 0;
    /** @private @type {number} */
    this._shakeDirection = 1;
    /** @private @type {number} */
    this._shake = 0;
  };

  clearZoom() {
    /** @private @type {number} */
    this._zoomX = 0;
    /** @private @type {number} */
    this._zoomY = 0;
    /** @private @type {number} */
    this._zoomScale = 1;
    /** @private @type {number} */
    this._zoomScaleTarget = 1;
    /** @private @type {number} */
    this._zoomDuration = 0;
  };

  clearWeather() {
    /** @private @type {string} */
    this._weatherType = 'none';
    /** @private @type {number} */
    this._weatherPower = 0;
    /** @private @type {number} */
    this._weatherPowerTarget = 0;
    /** @private @type {number} */
    this._weatherDuration = 0;
  };

  /**
   * @param duration {number}
   */
  startFadeOut(duration) {
    this._fadeOutDuration = duration;
    this._fadeInDuration = 0;
  };

  /**
   * @param duration {number}
   */
  startFadeIn(duration) {
    this._fadeInDuration = duration;
    this._fadeOutDuration = 0;
  };

  /**
   * @param tone {[number,number,number,number]}
   * @param duration {number}
   */
  startTint(tone, duration) {
    this._toneTarget = tone.clone();
    this._toneDuration = duration;
    if (this._toneDuration === 0) {
      this._tone = this._toneTarget.clone();
    }
  };

  /**
   *
   * @param color {[number,number,number,number]}
   * @param duration {number}
   */
  startFlash(color, duration) {
    this._flashColor = color.clone();
    this._flashDuration = duration;
  };

  /**
   *
   * @param power {number}
   * @param speed {number}
   * @param duration {number}
   */
  startShake(power, speed, duration) {
    this._shakePower = power;
    this._shakeSpeed = speed;
    this._shakeDuration = duration;
  };

  /**
   *
   * @param x {number}
   * @param y {number}
   * @param scale {number}
   * @param duration {number}
   */
  startZoom(x, y, scale, duration) {
    this._zoomX = x;
    this._zoomY = y;
    this._zoomScaleTarget = scale;
    this._zoomDuration = duration;
  };

  /**
   *
   * @param x {number}
   * @param y {number}
   * @param scale {number}
   */
  setZoom(x, y, scale) {
    this._zoomX = x;
    this._zoomY = y;
    this._zoomScale = scale;
  };

  /**
   *
   * @param type {string}
   * @param power {number}
   * @param duration {number}
   */
  changeWeather(type, power, duration) {
    if (type !== 'none' || duration === 0) {
      this._weatherType = type;
    }
    this._weatherPowerTarget = type === 'none' ? 0 : power;
    this._weatherDuration = duration;
    if (duration === 0) {
      this._weatherPower = this._weatherPowerTarget;
    }
  };

  update() {
    this.updateFadeOut();
    this.updateFadeIn();
    this.updateTone();
    this.updateFlash();
    this.updateShake();
    this.updateZoom();
    this.updateWeather();
  };

  updateFadeOut() {
    if (this._fadeOutDuration > 0) {
      let d = this._fadeOutDuration;
      this._brightness = (this._brightness * (d - 1)) / d;
      this._fadeOutDuration--;
    }
  };

  updateFadeIn() {
    if (this._fadeInDuration > 0) {
      let d = this._fadeInDuration;
      this._brightness = (this._brightness * (d - 1) + 255) / d;
      this._fadeInDuration--;
    }
  };

  updateTone() {
    if (this._toneDuration > 0) {
      let d = this._toneDuration;
      for (let i = 0; i < 4; i++) {
        this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
      }
      this._toneDuration--;
    }
  };

  updateFlash() {
    if (this._flashDuration > 0) {
      let d = this._flashDuration;
      this._flashColor[3] *= (d - 1) / d;
      this._flashDuration--;
    }
  };

  updateShake() {
    if (this._shakeDuration > 0 || this._shake !== 0) {
      let delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
      if (this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0) {
        this._shake = 0;
      } else {
        this._shake += delta;
      }
      if (this._shake > this._shakePower * 2) {
        this._shakeDirection = -1;
      }
      if (this._shake < -this._shakePower * 2) {
        this._shakeDirection = 1;
      }
      this._shakeDuration--;
    }
  };

  updateZoom() {
    if (this._zoomDuration > 0) {
      let d = this._zoomDuration;
      let t = this._zoomScaleTarget;
      this._zoomScale = (this._zoomScale * (d - 1) + t) / d;
      this._zoomDuration--;
    }
  };

  updateWeather() {
    if (this._weatherDuration > 0) {
      let d = this._weatherDuration;
      let t = this._weatherPowerTarget;
      this._weatherPower = (this._weatherPower * (d - 1) + t) / d;
      this._weatherDuration--;
      if (this._weatherDuration === 0 && this._weatherPowerTarget === 0) {
        this._weatherType = 'none';
      }
    }
  };

  startFlashForDamage() {
    this.startFlash([255, 0, 0, 128], 8);
  };

}