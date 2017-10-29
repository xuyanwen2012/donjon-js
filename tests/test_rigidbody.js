const assert = require('assert');
const Victor = require('victor');

/**
 * @type {{GameObject, Components}}
 */
const DJ = require('../build/js/donjon');

//local alias
const GameObject = DJ.GameObject;
const EnumRigidbody = DJ.Components.RIGIDBODY;


describe('Rigidbody', function () {

  let obj1 = new GameObject("object with R");
  obj1.addComponent(EnumRigidbody);

  //====================================================================
  describe('#clone()', function () {
    const rigidbody = obj1.getComponent(EnumRigidbody);

  });


});


