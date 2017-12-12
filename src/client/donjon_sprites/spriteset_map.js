/**
 * @extends SpritesetBase
 */
class SpritesetMap extends SpritesetBase {

  /**
   * @override
   * @protected
   */
  createLowerLayer() {
    super.createLowerLayer();
    this.createParallax();
    this.createTilemap();
    this.createCharacters();
    this.createWeather();
  }

  /**
   * @override
   * @protected
   */
  update() {
    super.update();
    this.updateTileset();
    this.updateParallax();
    this.updateTilemap();
    this.updateWeather();
  }

  /** @private */
  createParallax() {
    this.parallax = new TilingSprite();
    this.parallax.move(0, 0, Graphics.width, Graphics.height);
    this._baseSprite.addChild(this.parallax);
  }

  /** @private */
  createTilemap() {
    /** @protected @type {ShaderTilemap|Tilemap} */
    this._tilemap = null;
    if (Graphics.isWebGL()) {
      this._tilemap = new ShaderTilemap();
    } else {
      this._tilemap = new Tilemap();
    }
    this._tilemap.tileWidth = $game.getMap().tileWidth();
    this._tilemap.tileHeight = $game.getMap().tileHeight();
    //ignore the warning
    this._tilemap.setData($game.getMap().width(), $game.getMap().height(), $game.getMap().data());
    this._tilemap.horizontalWrap = false;
    this._tilemap.verticalWrap = false;
    this.loadTileset();
    this._baseSprite.addChild(this._tilemap);
  }

  /** @private */
  loadTileset() {
    /** @protected @type {{tilesetNames}} */
    this.tileset = $game.getMap().tileset();
    if (this.tileset) {
      let tilesetNames = this.tileset.tilesetNames;
      for (let i = 0; i < tilesetNames.length; i++) {
        this._tilemap.bitmaps[i] = ImageManager.loadTileset(tilesetNames[i]);
      }
      let newTilesetFlags = $game.getMap().tilesetFlags();
      this._tilemap.refreshTileset();
      if (!this._tilemap.flags.equals(newTilesetFlags)) {
        this._tilemap.refresh();
      }
      this._tilemap.flags = newTilesetFlags;
    }
  }

  /** @private */
  createCharacters() {
    this._characterSprites = [];
  }

  /**
   * @param gameObject {GameObject}
   */
  addCharacter(gameObject) {
    const graphicComp = gameObject.getGraphicComp();
    if (graphicComp) {
      const sprite = new SpriteGraphicComp(graphicComp);
      this._characterSprites.push(sprite);
      this._tilemap.addChild(sprite);
    } else {
      console.warn(`Object does not have renderer component.`);
    }
  }

  /** @private */
  createWeather() {
    this._weather = new Weather();
    this.addChild(this._weather);
  }

  /** @private */
  updateTileset() {
    if (this.tileset !== $game.getMap().tileset()) {
      this.loadTileset();
    }
  }

  /*
   * Simple fix for canvas parallax issue, destroy old parallax and readd to  the tree.
   */
  /** @private */
  canvasReAddParallax() {
    let index = this._baseSprite.children.indexOf(this.parallax);
    this._baseSprite.removeChild(this.parallax);
    this.parallax = new TilingSprite();
    this.parallax.move(0, 0, Graphics.width, Graphics.height);
    this.parallax.bitmap = ImageManager.loadParallax(this.parallaxName);
    this._baseSprite.addChildAt(this.parallax, index);
  }

  /** @private */
  updateParallax() {
    if (this.parallaxName !== $game.getMap().parallaxName()) {
      this.parallaxName = $game.getMap().parallaxName();

      if (this.parallax.bitmap && Graphics.isWebGL() !== true) {
        this.canvasReAddParallax();
      } else {
        this.parallax.bitmap = ImageManager.loadParallax(this.parallaxName);
      }
    }
    if (this.parallax.bitmap) {
      this.parallax.origin.x = $game.getMap().parallaxOx();
      this.parallax.origin.y = $game.getMap().parallaxOy();
    }
  }

  /** @private */
  updateTilemap() {
    this._tilemap.origin.x = $game.getMap().displayX() * $game.getMap().tileWidth();
    this._tilemap.origin.y = $game.getMap().displayY() * $game.getMap().tileHeight();
  }

  /** @private */
  updateWeather() {
    this._weather.type = $game.getScreen().weatherType();
    this._weather.power = $game.getScreen().weatherPower();
    this._weather.origin.x = $game.getMap().displayX() * $game.getMap().tileWidth();
    this._weather.origin.y = $game.getMap().displayY() * $game.getMap().tileHeight();
  }
}