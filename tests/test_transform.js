var assert = require('assert');

/* Dummy method to import Test class */
var Transform = require('../js/donjon_components/comp_transform').default;
var GameObject = require('../js/donjon_objects/game_objects').default;
var Victor = require('../js/libs/victor');

/* create dummy test objects */
var obj = new GameObject("asd");
var t1 = new Transform(obj);

/**
 * start describing
 */
describe('Transform', function() {
  describe('#translate()', function() {

    t1.translate(new Victor(5,5));

    it('should change position x to 5',function () {
      assert.equal(t1.position.x,5);
    });
    it('should change position y to 5',function () {
      assert.equal(t1.position.x,5);
    });

  });
});


