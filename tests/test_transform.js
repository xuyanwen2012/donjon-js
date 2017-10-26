var assert = require('assert');
var Victor = require('victor');
/**
 * @type {{GameObject, Transform}}
 */
var DJ = require('../build/js/donjon');


/**
 * start describing
 */
describe('Transform', function () {

  /* create dummy test objects */
  var obj = new DJ.GameObject("asd");
  var t1 = new DJ.Transform(obj);

  describe('#translate()', function () {

    t1.translate(new Victor(5, 5));

    it('should change position x to 5', function () {
      assert.equal(t1.position.x, 5);
    });
    it('should change position y to 5', function () {
      assert.equal(t1.position.x, 5);
    });

  });


});


