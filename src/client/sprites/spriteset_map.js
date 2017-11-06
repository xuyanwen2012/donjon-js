//-----------------------------------------------------------------------------
// Spriteset_Map
//
// The set of sprites on the map screen.

class Spriteset_Map extends Spriteset_Base {

  constructor() {
    super();
  }

  createLowerLayer() {
    super.createLowerLayer();
    this.createParallax();
    this.createTilemap();
    this.createWeather();
  }

  update() {
    super.update();
    this.updateTileset();
    this.updateParallax();
    this.updateTilemap();
    this.updateWeather();
  }

  createParallax() {
    this._parallax = new TilingSprite();
    this._parallax.move(0, 0, Graphics.width, Graphics.height);
    this._baseSprite.addChild(this._parallax);
  }

  createTilemap() {
    if (Graphics.isWebGL()) {
      this._tilemap = new ShaderTilemap();
    } else {
      this._tilemap = new Tilemap();
    }
    this._tilemap.tileWidth = $gameMap.tileWidth();
    this._tilemap.tileHeight = $gameMap.tileHeight();
    this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
    this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    this._tilemap.verticalWrap = $gameMap.isLoopVertical();
    this.loadTileset();
    this._baseSprite.addChild(this._tilemap);
  }

  loadTileset() {
    this._tileset = $gameMap.tileset();
    if (this._tileset) {
      const tilesetNames = this._tileset.tilesetNames;
      for (let i = 0; i < tilesetNames.length; i++) {
        this._tilemap.bitmaps[i] = ImageManager.loadTileset(tilesetNames[i]);
      }
      const newTilesetFlags = $gameMap.tilesetFlags();
      this._tilemap.refreshTileset();
      if (!this._tilemap.flags.equals(newTilesetFlags)) {
        this._tilemap.refresh();
      }
      this._tilemap.flags = newTilesetFlags;
    }
  }

  createWeather() {
    this._weather = new Weather();
    this.addChild(this._weather);
  }

  updateTileset() {
    if (this._tileset !== $gameMap.tileset()) {
      this.loadTileset();
    }
  }

  /*
   * Simple fix for canvas parallax issue, destroy old parallax and readd to  the tree.
   */
  _canvasReAddParallax() {
    const index = this._baseSprite.children.indexOf(this._parallax);
    this._baseSprite.removeChild(this._parallax);
    this._parallax = new TilingSprite();
    this._parallax.move(0, 0, Graphics.width, Graphics.height);
    this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
    this._baseSprite.addChildAt(this._parallax, index);
  }

  updateParallax() {
    if (this._parallaxName !== $gameMap.parallaxName()) {
      this._parallaxName = $gameMap.parallaxName();

      if (this._parallax.bitmap && Graphics.isWebGL() !== true) {
        this._canvasReAddParallax();
      } else {
        this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
      }
    }
    if (this._parallax.bitmap) {
      this._parallax.origin.x = $gameMap.parallaxOx();
      this._parallax.origin.y = $gameMap.parallaxOy();
    }
  }

  updateTilemap() {
    this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
  }

  updateWeather() {
    this._weather.type = $gameScreen.weatherType();
    this._weather.power = $gameScreen.weatherPower();
    this._weather.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    this._weather.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
  }
}