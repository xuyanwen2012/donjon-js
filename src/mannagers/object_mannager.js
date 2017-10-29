import Transform from '../donjon_components/transform';
import Victor from 'victor';
import Rigidbody from "../donjon_components/rigidbody";
import BoxCollider from "../donjon_components/box_collider";
import CircleCollider from "../donjon_components/circle_collider";

const fs = require("fs");

export default class ObjectManager {
  constructor() {


    let transform = new Transform(null, new Victor(666, 666), 5);
    let rigidbody = new Rigidbody(null);
    let boxCollider = new BoxCollider(null, 1, 2, 3, 4);
    let circleCollider = new CircleCollider(null, 5, 6, 7);


    let jsonList = {
      transform,
      rigidbody,
      boxCollider,
      circleCollider,
    };

    fs.writeFileSync('data/prefabs.json', JSON.stringify(jsonList), 'utf8');

    //let components = fs.readFileSync('data/prefabs.json');

    let transform2 = new Transform(null);
    transform2.copy(transform);

    let rigidbody2 = new Rigidbody(null);
    rigidbody2.copy(rigidbody);

    let boxCollider2 = new BoxCollider(null);
    boxCollider2.copy(boxCollider);

    let circleCollider2 = new CircleCollider(null);
    circleCollider2.copy(circleCollider);

    console.log(transform2);
    console.log(rigidbody2);
    console.log(boxCollider2);
    console.log(circleCollider2);


  }
}