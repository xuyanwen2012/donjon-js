import Game from "./donjon_game/game";

const game = new Game();

/* temp load data */
//const $dataMap = require('../../data/Map001.json');
const $dataMapInfos = require('../../data/MapInfos.json');
const $dataSystem = require('../../data/System.json');
const $dataTilesets = require('../../data/Tilesets.json');
game.database.setMapInfos($dataMapInfos);
game.database.setSystem($dataSystem);
game.database.setTilesets($dataTilesets);
game.database.makeEmptyMap();


game.start();
/* game loop */
const delta = Math.floor(1000 / 60);
setInterval(function () {
  game.fixedUpdate();
}, delta);

