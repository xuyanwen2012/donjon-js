import GameObject from './donjon_objects/game_objects';
import Rigidbody from "./donjon_components/comp_rigidbody";
import Collider from "./donjon_components/comp_collider";
import Victor from 'victor';

let obj = new GameObject("Robot");
obj.addComponent(Rigidbody);
obj.addComponent(Collider);
const rigidbody = obj.getComponent(Rigidbody);
const collider = obj.getComponent(Collider);
collider.attachToRigidbody(rigidbody);

for(let i = 0; i < 20; i++){
  obj.transform.translate(new Victor(1,5));
  console.log(obj.transform.position.toString());
}


