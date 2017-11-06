/**
 * The game object class for a map. It contains scrolling and passage
 * determination functions.
 */
class GameMap {

  constructor() {
    /** @private @type {number} */
    this.mapId_ = 0;

    /** @private @type {number} */
    this.tilesetId_ = 0;

    /** @private @type {number} */
    this.displayX_ = 0;

    /** @private @type {number} */
    this.displayY_ = 0;

    /** @private @type {boolean} */
    this.nameDisplay_ = true;

    /** @private @type {number} */
    this.scrollDirection_ = 2;

    /** @private @type {number} */
    this.scrollRest_ = 0;

    /** @private @type {number} */
    this.scrollSpeed_ = 4;

    /** @private @type {String} */
    this.parallaxName_ = '';

    /** @private @type {boolean} */
    this.parallaxZero_ = false;

    /** @private @type {boolean} */
    this.parallaxLoopX_ = false;

    /** @private @type {boolean} */
    this.parallaxLoopY_ = false;

    /** @private @type {number} */
    this.parallaxSx_ = 0;

    /** @private @type {number} */
    this.parallaxSy_ = 0;

    /** @private @type {number} */
    this.parallaxX_ = 0;

    /** @private @type {number} */
    this.parallaxY_ = 0;
  }

  /**
   * @param mapId {number}
   */
  setup(mapId) {
    if (!$dataMap) {
      throw new Error('The map data is not available');
    }
    this.mapId_ = mapId;
    this.tilesetId_ = $dataMap.tilesetId;

    this.displayX_ = 0;
    this.displayY_ = 0;
    //this._setupEvents();
    this.setupScroll_();
    this.setupParallax_();
    this._needsRefresh = false;
  }

  /** @return {number} */
  tileWidth() {
    return 48
  }

  /** @return {number} */
  tileHeight() {
    return 48
  }

  /** @return {number} */
  mapId() {
    return this.mapId_
  }

  /** @return {number} */
  displayX() {
    return this.displayX_
  }

  /** @return {number} */
  displayY() {
    return this.displayY_
  }

  /** @return {String} */
  parallaxName() {
    return this.parallaxName_
  }

  /** @param mapId {number} */
  requestRefresh(mapId) {
    this._needsRefresh = true
  }

  /** @return {boolean} */
  isNameDisplayEnabled() {
    return this.nameDisplay_
  }

  disableNameDisplay() {
    this.nameDisplay_ = false
  }

  enableNameDisplay() {
    this.nameDisplay_ = true
  }

  /** @private */
  setupScroll_() {
    this.scrollDirection_ = 2;
    this.scrollRest_ = 0;
    this.scrollSpeed_ = 4;
  }

  /** @private */
  setupParallax_() {
    this.parallaxName_ = $dataMap.parallaxName || '';
    this.parallaxZero_ = ImageManager.isZeroParallax(this.parallaxName_);
    this.parallaxLoopX_ = $dataMap.parallaxLoopX;
    this.parallaxLoopY_ = $dataMap.parallaxLoopY;
    this.parallaxSx_ = $dataMap.parallaxSx;
    this.parallaxSy_ = $dataMap.parallaxSy;
    this.parallaxX_ = 0;
    this.parallaxY_ = 0;
  }

  /**
   * @param x {number}
   * @param y {number}
   */
  setDisplayPos(x, y) {
    let endX = this.width() - this.screenTileX();
    this.displayX_ = endX < 0 ? endX / 2 : x.clamp(0, endX);
    this.parallaxX_ = this.displayX_;

    let endY = this.height() - this.screenTileY();
    this.displayY_ = endY < 0 ? endY / 2 : y.clamp(0, endY);
    this.parallaxY_ = this.displayY_;
  }

  /** @return {number} */
  parallaxOx() {
    if (this.parallaxZero_) {
      return this.parallaxX_ * this.tileWidth();
    } else if (this.parallaxLoopX_) {
      return this.parallaxX_ * this.tileWidth() / 2;
    } else {
      return 0;
    }
  }

  /** @return {number} */
  parallaxOy() {
    if (this.parallaxZero_) {
      return this.parallaxY_ * this.tileHeight();
    } else if (this.parallaxLoopY_) {
      return this.parallaxY_ * this.tileHeight() / 2;
    } else {
      return 0;
    }
  }

  tileset() {
    return $dataTilesets[this.tilesetId_];
  }

  /** @return {Array} */
  tilesetFlags() {
    let tileset = this.tileset();
    if (tileset) {
      return tileset.flags;
    } else {
      return [];
    }
  }

  /** @return {String} */
  displayName() {
    return $dataMap.displayName_;
  }

  /** @return {number} */
  width() {
    return $dataMap.width;
  }

  /** @return {number} */
  height() {
    return $dataMap.height;
  }

  /** @return {number} */
  data() {
    return $dataMap.data;
  }

  /** @return {number} */
  screenTileX() {
    return Graphics.width / this.tileWidth();
  }

  /** @return {number} */
  screenTileY() {
    return Graphics.height / this.tileHeight();
  }

  /** @return {number} */
  adjustX(x) {
    return x - this.displayX_
  }

  /** @return {number} */
  adjustY(y) {
    return y - this.displayY_
  }

  /** @return {number} */
  xWithDirection(x, d) {
    return x + (d === 6 ? 1 : d === 4 ? -1 : 0)
  }

  /** @return {number} */
  yWithDirection(y, d) {
    return y + (d === 2 ? 1 : d === 8 ? -1 : 0)
  }

  /** @return {number} */
  deltaX(x1, x2) {
    return x1 - x2
  }

  /** @return {number} */
  deltaY(y1, y2) {
    return y1 - y2
  }

  /** @return {number} */
  distance(x1, y1, x2, y2) {
    return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
  }

  /** @return {number} */
  canvasToMapX(x) {
    let tileWidth = this.tileWidth();
    let originX = this.displayX_ * tileWidth;
    return Math.floor((originX + x) / tileWidth);
  }

  /** @return {number} */
  canvasToMapY(y) {
    let tileHeight = this.tileHeight();
    let originY = this.displayY_ * tileHeight;
    return Math.floor((originY + y) / tileHeight);
  }

  autoplay() {
    if ($dataMap.autoplayBgm) {
      AudioManager.playBgm($dataMap.bgm);
    }
    if ($dataMap.autoplayBgs) {
      AudioManager.playBgs($dataMap.bgs);
    }
  }

  refreshIfNeeded() {
    if (this._needsRefresh) {
      this.refresh();
    }
  }

  refresh() {
    // this.events().forEach(function (event) {
    //     event.refresh();
    // });
    this._needsRefresh = false;
  }

  scrollDown(distance) {
    if (this.height() >= this.screenTileY()) {
      let lastY = this.displayY_;
      this.displayY_ = Math.min(this.displayY_ + distance,
        this.height() - this.screenTileY());
      this.parallaxY_ += this.displayY_ - lastY;
    }
  }

  scrollLeft(distance) {
    if (this.width() >= this.screenTileX()) {
      let lastX = this.displayX_;
      this.displayX_ = Math.max(this.displayX_ - distance, 0);
      this.parallaxX_ += this.displayX_ - lastX;
    }
  }

  scrollRight(distance) {
    if (this.width() >= this.screenTileX()) {
      let lastX = this.displayX_;
      this.displayX_ = Math.min(this.displayX_ + distance,
        this.width() - this.screenTileX());
      this.parallaxX_ += this.displayX_ - lastX;
    }
  }

  scrollUp(distance) {
    if (this.height() >= this.screenTileY()) {
      let lastY = this.displayY_;
      this.displayY_ = Math.max(this.displayY_ - distance, 0);
      this.parallaxY_ += this.displayY_ - lastY;
    }
  }

  isValid(x, y) {
    return x >= 0 && x < this.width() && y >= 0 && y < this.height();
  }

  checkPassage(x, y, bit) {
    let flags = this.tilesetFlags();
    let tiles = this.allTiles(x, y);
    for (let i = 0; i < tiles.length; i++) {
      let flag = flags[tiles[i]];
      if ((flag & 0x10) !== 0)  // [*] No effect on passage
        continue;
      if ((flag & bit) === 0)   // [o] Passable
        return true;
      if ((flag & bit) === bit) // [x] Impassable
        return false;
    }
    return false;
  }

  tileId(x, y, z) {
    let width = $dataMap.width;
    let height = $dataMap.height;
    return $dataMap.data[(z * height + y) * width + x] || 0;
  }

  layeredTiles(x, y) {
    let tiles = [];
    for (let i = 0; i < 4; i++) {
      tiles.push(this.tileId(x, y, 3 - i));
    }
    return tiles;
  }

  allTiles(x, y) {
    return this.layeredTiles(x, y);
  }

  /**
   * @param x {number}
   * @param y {number}
   * @param z {number}
   * @return {number}
   */
  autotileType(x, y, z) {
    let tileId = this.tileId(x, y, z);
    return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
  }

  /**
   * @param x {number}
   * @param y {number}
   * @param d {number}
   * @return {Boolean}
   */
  isPassable(x, y, d) {
    return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
  }

  /**
   * @private
   * @param x {number}
   * @param y {number}
   * @param bit {number}
   * @return {boolean|*}
   */
  checkLayeredTilesFlags_(x, y, bit) {
    let flags = this.tilesetFlags();
    return this.layeredTiles(x, y).some(function (tileId) {
      return (flags[tileId] & bit) !== 0;
    });
  }

  isLadder(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags_(x, y, 0x20);
  }

  isBush(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags_(x, y, 0x40);
  }

  isCounter(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags_(x, y, 0x80);
  }

  isDamageFloor(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags_(x, y, 0x100);
  }

  /**
   * @param x {number}
   * @param y {number}
   * @return {*}
   */
  terrainTag(x, y) {
    if (this.isValid(x, y)) {
      let flags = this.tilesetFlags();
      let tiles = this.layeredTiles(x, y);
      for (let i = 0; i < tiles.length; i++) {
        let tag = flags[tiles[i]] >> 12;
        if (tag > 0) {
          return tag;
        }
      }
    }
    return 0;
  }

  regionId(x, y) {
    return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
  }

  /**
   * @param direction {number}
   * @param distance {number}
   * @param speed {number}
   */
  startScroll(direction, distance, speed) {
    this.scrollDirection_ = direction;
    this.scrollRest_ = distance;
    this.scrollSpeed_ = speed;
  }

  /**
   * @return {boolean}
   */
  isScrolling() {
    return this.scrollRest_ > 0;
  }

  /**
   * @param sceneActive {boolean}
   */
  update(sceneActive) {
    this.refreshIfNeeded();
    if (sceneActive) {
      //this.updateInterpreter();
    }
    this.updateScroll_();
    this.updateParallax_();
    //this.updateEvents();
  }

  /** @private */
  updateScroll_() {
    if (this.isScrolling()) {
      let lastX = this.displayX_;
      let lastY = this.displayY_;
      this.doScroll(this.scrollDirection_, this.scrollDistance());
      if (this.displayX_ === lastX && this.displayY_ === lastY) {
        this.scrollRest_ = 0;
      } else {
        this.scrollRest_ -= this.scrollDistance();
      }
    }
  }

  scrollDistance() {
    return Math.pow(2, this.scrollSpeed_) / 256;
  }

  doScroll(direction, distance) {
    switch (direction) {
      case 2:
        this.scrollDown(distance);
        break;
      case 4:
        this.scrollLeft(distance);
        break;
      case 6:
        this.scrollRight(distance);
        break;
      case 8:
        this.scrollUp(distance);
        break;
    }
  }

  /** @private */
  updateParallax_() {
    if (this.parallaxLoopX_) {
      this.parallaxX_ += this.parallaxSx_ / this.tileWidth() / 2;
    }
    if (this.parallaxLoopY_) {
      this.parallaxY_ += this.parallaxSy_ / this.tileHeight() / 2;
    }
  }

  /**
   * @param tilesetId {number}
   */
  changeTileset(tilesetId) {
    this.tilesetId_ = tilesetId;
    this.refresh();
  }

  /**
   * @param name {string}
   * @param loopX {number}
   * @param loopY {number}
   * @param sx {number}
   * @param sy {number}
   */
  changeParallax(name, loopX, loopY, sx, sy) {
    this.parallaxName_ = name;
    this.parallaxZero_ = ImageManager.isZeroParallax(this.parallaxName_);
    if (this.parallaxLoopX_ && !loopX) {
      this.parallaxX_ = 0;
    }
    if (this.parallaxLoopY_ && !loopY) {
      this.parallaxY_ = 0;
    }
    this.parallaxLoopX_ = loopX;
    this.parallaxLoopY_ = loopY;
    this.parallaxSx_ = sx;
    this.parallaxSy_ = sy;
  }

}