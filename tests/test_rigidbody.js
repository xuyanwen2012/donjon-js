const assert = require('assert');
/**
 * @type {{GameObject, Collider}}
 */
const DJ = require('../build/js/donjon');


describe('Rigidbody', function () {

  const obj1 = new DJ.GameObject("object with R");
  obj1.addComponent(DJ.Rigidbody);

  //====================================================================
  describe('#clone()', function () {
    const rigidbody = obj1.getComponent(DJ.Rigidbody);
    const cloned = rigidbody.clone(obj1);
    it('should clone but not equal', function () {
      assert.notEqual(cloned, rigidbody);
    });
  });

});


