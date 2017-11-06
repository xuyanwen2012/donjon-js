/**
 * @extends SpritesetBase
 */
class SpritesetMap extends SpritesetBase {
  /**
   * @override
   * @protected
   */
  createLowerLayer_() {
    super.createLowerLayer_();
    this.createParallax_();
    this.createTilemap_();
    this.createCharacters_();
    this.createWeather_();
  }

  /**
   * @override
   * @protected
   */
  update() {
    super.update();
    this.updateTileset_();
    this.updateParallax_();
    this.updateTilemap_();
    this.updateWeather_();
  }

  hideCharacters() {
    for (let i = 0; i < this.characterSprites_.length; i++) {
      const sprite = this.characterSprites_[i];
      //if (!sprite.isTile()) {
      sprite.hide();
      //}
    }
  }

  /** @private */
  createParallax_() {
    this.parallax_ = new TilingSprite();
    this.parallax_.move(0, 0, Graphics.width, Graphics.height);
    this.baseSprite_.addChild(this.parallax_);
  }

  /** @private */
  createTilemap_() {
    /** @protected @type {ShaderTilemap|Tilemap} */
    this.tilemap_ = null;
    if (Graphics.isWebGL()) {
      this.tilemap_ = new ShaderTilemap();
    } else {
      this.tilemap_ = new Tilemap();
    }
    this.tilemap_.tileWidth = $gameMap.tileWidth();
    this.tilemap_.tileHeight = $gameMap.tileHeight();
    //ignore the warning
    this.tilemap_.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
    this.tilemap_.horizontalWrap = false;
    this.tilemap_.verticalWrap = false;
    this.loadTileset();
    this.baseSprite_.addChild(this.tilemap_);
  }

  /**
   *
   */
  loadTileset() {
    /** @protected @type {{tilesetNames}} */
    this.tileset_ = $gameMap.tileset();
    if (this.tileset_) {
      let tilesetNames = this.tileset_.tilesetNames;
      for (let i = 0; i < tilesetNames.length; i++) {
        this.tilemap_.bitmaps[i] = ImageManager.loadTileset(tilesetNames[i]);
      }
      let newTilesetFlags = $gameMap.tilesetFlags();
      this.tilemap_.refreshTileset();
      if (!this.tilemap_.flags.equals(newTilesetFlags)) {
        this.tilemap_.refresh();
      }
      this.tilemap_.flags = newTilesetFlags;
    }
  }

  /**
   * add existing character sprites to the tilemap as child.
   * @private
   */
  createCharacters_() {
    /** @private @type {Array<SpriteRenderer>} */
    this.characterSprites_ = [];
    //this._updateSpriteBuffer()
    /*
      this._characterSprites.push(new Sprite_Character($gamePlayer));
      for (var i = 0; i < this._characterSprites.length; i++) {
        this._tilemap.addChild(this._characterSprites[i]);
      }
    */
  }

  /**
   * add character render sprites while game is running.
   * @param sprite {SpriteRenderer}
   */
  addCharacter(sprite) {
    this.characterSprites_.push(sprite);
    this.tilemap_.addChild(sprite);
  }

  /** @private */
  createWeather_() {
    this.weather_ = new Weather();
    this.addChild(this.weather_);
  }

  /** @private */
  updateTileset_() {
    if (this.tileset_ !== $gameMap.tileset()) {
      this.loadTileset();
    }
  }

  /*
   * Simple fix for canvas parallax issue, destroy old parallax and readd to  the tree.
   */
  /** @private */
  canvasReAddParallax_() {
    let index = this.baseSprite_.children.indexOf(this.parallax_);
    this.baseSprite_.removeChild(this.parallax_);
    this.parallax_ = new TilingSprite();
    this.parallax_.move(0, 0, Graphics.width, Graphics.height);
    this.parallax_.bitmap = ImageManager.loadParallax(this.parallaxName_);
    this.baseSprite_.addChildAt(this.parallax_, index);
  }

  /** @private */
  updateParallax_() {
    if (this.parallaxName_ !== $gameMap.parallaxName()) {
      this.parallaxName_ = $gameMap.parallaxName();

      if (this.parallax_.bitmap && Graphics.isWebGL() !== true) {
        this.canvasReAddParallax_();
      } else {
        this.parallax_.bitmap = ImageManager.loadParallax(this.parallaxName_);
      }
    }
    if (this.parallax_.bitmap) {
      this.parallax_.origin.x = $gameMap.parallaxOx();
      this.parallax_.origin.y = $gameMap.parallaxOy();
    }
  }

  /** @private */
  updateTilemap_() {
    this.tilemap_.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    this.tilemap_.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
  }

  /** @private */
  updateWeather_() {
    this.weather_.type = $gameScreen.weatherType();
    this.weather_.power = $gameScreen.weatherPower();
    this.weather_.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    this.weather_.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
  }
}