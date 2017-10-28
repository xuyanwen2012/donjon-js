const assert = require('assert');
const Victor = require('victor');
/**
 * @type {{GameObject, Components}}
 */
const DJ = require('../build/js/donjon');

//local alias
const GameObject = DJ.GameObject;
const EnumRigidbody = DJ.Components.RIGIDBODY;
const EnumBoxCollider = DJ.Components.BOX_COLLIDER;
const EnumCircleCollider = DJ.Components.CIRCLE_COLLIDER;

describe('Collider', function () {

  let obj1 = new GameObject("box object");
  obj1.addComponent(EnumRigidbody);
  obj1.addComponent(EnumBoxCollider);

  let obj2 = new GameObject("error object");
  obj1.addComponent(EnumBoxCollider);

  let obj3 = new GameObject("circle object");
  obj1.addComponent(EnumRigidbody);
  obj1.addComponent(EnumCircleCollider);

  //====================================================================
  describe('#constructor()', function () {
    it('obj1 should create with attachedRigidbody', function () {
      const collider = obj1.getComponent(EnumBoxCollider);
      if (collider.attachedRigidbody) {
        assert.ok(true);
      } else {
        assert.fail(collider.attachedRigidbody, 'Rigidbody', 'No rigidbody' +
          ' attached during constructor.');
      }
    });
    it('obj2 should fail', function () {
      try {
        const collider = obj2.getComponent(EnumBoxCollider);
      } catch (e) {
        assert.ok(true);
      }
    });
  });
  //====================================================================


});


