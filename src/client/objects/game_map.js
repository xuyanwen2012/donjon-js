/**
 * The game object class for a map. It contains scrolling and passage
 * determination functions.
 */
class Game_Map {

  constructor() {
    this.initialize(...arguments);
  }

  initialize() {
    this._mapId = 0;
    this._tilesetId = 0;

    this._displayX = 0;
    this._displayY = 0;

    this._scrollDirection = 2;
    this._scrollRest = 0;
    this._scrollSpeed = 4;

    this._parallaxName = '';
    this._parallaxZero = false;
    this._parallaxLoopX = false;
    this._parallaxLoopY = false;
    this._parallaxSx = 0;
    this._parallaxSy = 0;
    this._parallaxX = 0;
    this._parallaxY = 0;
  }

  setup(mapId) {
    if (!$dataMap) {
      throw new Error('The map data is not available');
    }
    this._mapId = mapId;
    this._tilesetId = $dataMap.tilesetId;
    this._displayX = 0;
    this._displayY = 0;
    this.setupScroll();
    this.setupParallax();
  }

  tileWidth() {
    return 48;
  }

  tileHeight() {
    return 48;
  }

  mapId() {
    return this._mapId;
  }

  tilesetId() {
    return this._tilesetId;
  }

  displayX() {
    return this._displayX;
  }

  displayY() {
    return this._displayY;
  }

  parallaxName() {
    return this._parallaxName;
  }

  requestRefresh(mapId) {
    this._needsRefresh = true;
  }

  setupScroll() {
    this._scrollDirection = 2;
    this._scrollRest = 0;
    this._scrollSpeed = 4;
  }

  setupParallax() {
    this._parallaxName = $dataMap.parallaxName || '';
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    this._parallaxLoopX = $dataMap.parallaxLoopX;
    this._parallaxLoopY = $dataMap.parallaxLoopY;
    this._parallaxSx = $dataMap.parallaxSx;
    this._parallaxSy = $dataMap.parallaxSy;
    this._parallaxX = 0;
    this._parallaxY = 0;
  }

  setDisplayPos(x, y) {
    if (this.isLoopHorizontal()) {
      this._displayX = x.mod(this.width());
      this._parallaxX = x;
    } else {
      const endX = this.width() - this.screenTileX();
      this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
      this._parallaxX = this._displayX;
    }
    if (this.isLoopVertical()) {
      this._displayY = y.mod(this.height());
      this._parallaxY = y;
    } else {
      const endY = this.height() - this.screenTileY();
      this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
      this._parallaxY = this._displayY;
    }
  }

  parallaxOx() {
    if (this._parallaxZero) {
      return this._parallaxX * this.tileWidth();
    } else if (this._parallaxLoopX) {
      return this._parallaxX * this.tileWidth() / 2;
    } else {
      return 0;
    }
  }

  parallaxOy() {
    if (this._parallaxZero) {
      return this._parallaxY * this.tileHeight();
    } else if (this._parallaxLoopY) {
      return this._parallaxY * this.tileHeight() / 2;
    } else {
      return 0;
    }
  }

  tileset() {
    return $dataTilesets[this._tilesetId];
  }

  tilesetFlags() {
    const tileset = this.tileset();
    if (tileset) {
      return tileset.flags;
    } else {
      return [];
    }
  }

  width() {
    return $dataMap.width;
  }

  height() {
    return $dataMap.height;
  }

  data() {
    return $dataMap.data;
  }

  isLoopHorizontal() {
    return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
  }

  isLoopVertical() {
    return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
  }

  isDashDisabled() {
    return $dataMap.disableDashing;
  }

  encounterList() {
    return $dataMap.encounterList;
  }

  encounterStep() {
    return $dataMap.encounterStep;
  }

  isOverworld() {
    return this.tileset() && this.tileset().mode === 0;
  }

  screenTileX() {
    return Graphics.width / this.tileWidth();
  }

  screenTileY() {
    return Graphics.height / this.tileHeight();
  }

  adjustX(x) {
    if (this.isLoopHorizontal() && x < this._displayX -
      (this.width() - this.screenTileX()) / 2) {
      return x - this._displayX + $dataMap.width;
    } else {
      return x - this._displayX;
    }
  }

  adjustY(y) {
    if (this.isLoopVertical() && y < this._displayY -
      (this.height() - this.screenTileY()) / 2) {
      return y - this._displayY + $dataMap.height;
    } else {
      return y - this._displayY;
    }
  }

  roundX(x) {
    return this.isLoopHorizontal() ? x.mod(this.width()) : x;
  }

  roundY(y) {
    return this.isLoopVertical() ? y.mod(this.height()) : y;
  }

  xWithDirection(x, d) {
    return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
  }

  yWithDirection(y, d) {
    return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
  }

  roundXWithDirection(x, d) {
    return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
  }

  roundYWithDirection(y, d) {
    return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
  }

  deltaX(x1, x2) {
    let result = x1 - x2;
    if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
      if (result < 0) {
        result += this.width();
      } else {
        result -= this.width();
      }
    }
    return result;
  }

  deltaY(y1, y2) {
    let result = y1 - y2;
    if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
      if (result < 0) {
        result += this.height();
      } else {
        result -= this.height();
      }
    }
    return result;
  }

  distance(x1, y1, x2, y2) {
    return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
  }

  canvasToMapX(x) {
    const tileWidth = this.tileWidth();
    const originX = this._displayX * tileWidth;
    const mapX = Math.floor((originX + x) / tileWidth);
    return this.roundX(mapX);
  }

  canvasToMapY(y) {
    const tileHeight = this.tileHeight();
    const originY = this._displayY * tileHeight;
    const mapY = Math.floor((originY + y) / tileHeight);
    return this.roundY(mapY);
  }

  autoplay() {
    if ($dataMap.autoplayBgm) {
      AudioManager.playBgm($dataMap.bgm);
    }
    if ($dataMap.autoplayBgs) {
      AudioManager.playBgs($dataMap.bgs);
    }
  }

  scrollDown(distance) {
    if (this.isLoopVertical()) {
      this._displayY += distance;
      this._displayY %= $dataMap.height;
      if (this._parallaxLoopY) {
        this._parallaxY += distance;
      }
    } else if (this.height() >= this.screenTileY()) {
      const lastY = this._displayY;
      this._displayY = Math.min(this._displayY + distance,
        this.height() - this.screenTileY());
      this._parallaxY += this._displayY - lastY;
    }
  }

  scrollLeft(distance) {
    if (this.isLoopHorizontal()) {
      this._displayX += $dataMap.width - distance;
      this._displayX %= $dataMap.width;
      if (this._parallaxLoopX) {
        this._parallaxX -= distance;
      }
    } else if (this.width() >= this.screenTileX()) {
      const lastX = this._displayX;
      this._displayX = Math.max(this._displayX - distance, 0);
      this._parallaxX += this._displayX - lastX;
    }
  }

  scrollRight(distance) {
    if (this.isLoopHorizontal()) {
      this._displayX += distance;
      this._displayX %= $dataMap.width;
      if (this._parallaxLoopX) {
        this._parallaxX += distance;
      }
    } else if (this.width() >= this.screenTileX()) {
      const lastX = this._displayX;
      this._displayX = Math.min(this._displayX + distance,
        this.width() - this.screenTileX());
      this._parallaxX += this._displayX - lastX;
    }
  }

  scrollUp(distance) {
    if (this.isLoopVertical()) {
      this._displayY += $dataMap.height - distance;
      this._displayY %= $dataMap.height;
      if (this._parallaxLoopY) {
        this._parallaxY -= distance;
      }
    } else if (this.height() >= this.screenTileY()) {
      const lastY = this._displayY;
      this._displayY = Math.max(this._displayY - distance, 0);
      this._parallaxY += this._displayY - lastY;
    }
  }

  isValid(x, y) {
    return x >= 0 && x < this.width() && y >= 0 && y < this.height();
  }

  checkPassage(x, y, bit) {
    const flags = this.tilesetFlags();
    const tiles = this.allTiles(x, y);
    for (let i = 0; i < tiles.length; i++) {
      const flag = flags[tiles[i]];
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
    const width = $dataMap.width;
    const height = $dataMap.height;
    return $dataMap.data[(z * height + y) * width + x] || 0;
  }

  layeredTiles(x, y) {
    const tiles = [];
    for (let i = 0; i < 4; i++) {
      tiles.push(this.tileId(x, y, 3 - i));
    }
    return tiles;
  }

  allTiles(x, y) {
    const tiles = this.tileEventsXy(x, y).map(event => event.tileId());
    return tiles.concat(this.layeredTiles(x, y));
  }

  autotileType(x, y, z) {
    const tileId = this.tileId(x, y, z);
    return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
  }

  isPassable(x, y, d) {
    return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
  }

  isBoatPassable(x, y) {
    return this.checkPassage(x, y, 0x0200);
  }

  isShipPassable(x, y) {
    return this.checkPassage(x, y, 0x0400);
  }

  isAirshipLandOk(x, y) {
    return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
  }

  checkLayeredTilesFlags(x, y, bit) {
    const flags = this.tilesetFlags();
    return this.layeredTiles(x, y).some(tileId => (flags[tileId] & bit) !== 0);
  }

  isLadder(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
  }

  isBush(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
  }

  isCounter(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
  }

  isDamageFloor(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
  }

  terrainTag(x, y) {
    if (this.isValid(x, y)) {
      const flags = this.tilesetFlags();
      const tiles = this.layeredTiles(x, y);
      for (let i = 0; i < tiles.length; i++) {
        const tag = flags[tiles[i]] >> 12;
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

  startScroll(direction, distance, speed) {
    this._scrollDirection = direction;
    this._scrollRest = distance;
    this._scrollSpeed = speed;
  }

  isScrolling() {
    return this._scrollRest > 0;
  }

  update(sceneActive) {
    if (sceneActive) {
    }
    this.updateScroll();
    this.updateParallax();
  }

  updateScroll() {
    if (this.isScrolling()) {
      const lastX = this._displayX;
      const lastY = this._displayY;
      this.doScroll(this._scrollDirection, this.scrollDistance());
      if (this._displayX === lastX && this._displayY === lastY) {
        this._scrollRest = 0;
      } else {
        this._scrollRest -= this.scrollDistance();
      }
    }
  }

  scrollDistance() {
    return 2 ** this._scrollSpeed / 256;
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

  updateParallax() {
    if (this._parallaxLoopX) {
      this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
    }
    if (this._parallaxLoopY) {
      this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
    }
  }

  changeTileset(tilesetId) {
    this._tilesetId = tilesetId;
    this.refresh();
  }

  changeParallax(name, loopX, loopY, sx, sy) {
    this._parallaxName = name;
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    if (this._parallaxLoopX && !loopX) {
      this._parallaxX = 0;
    }
    if (this._parallaxLoopY && !loopY) {
      this._parallaxY = 0;
    }
    this._parallaxLoopX = loopX;
    this._parallaxLoopY = loopY;
    this._parallaxSx = sx;
    this._parallaxSy = sy;
  }
}
