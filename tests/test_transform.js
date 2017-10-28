const assert = require('assert');
const Victor = require('victor');
/**
 * @type {{GameObject, Transform}}
 */
const DJ = require('../build/js/donjon');


/**
 * start describing
 */
describe('Transform', function () {

  /* create dummy test objects */
  let obj = new DJ.GameObject("asd");

  describe('#translate()', function () {

    obj.transform.translate(new Victor(5, 5));

    it('should change position x to 5', function () {
      assert.equal(obj.transform.position.x, 5);
    });
    it('should change position y to 5', function () {
      assert.equal(obj.transform.position.x, 5);
    });

  });


});


