import GameObject from './donjon_objects/game_objects';
import Victor from './libs/victor';

let obj = new GameObject("obj1");
obj.tag = GameObject.Tags.PLAYER;

obj.transform.translate(new Victor(5,5));
console.log(obj.transform.position.toString());
console.log(obj.compareTag(GameObject.Tags.PLAYER));
console.log(obj.compareTag(GameObject.Tags.UNTAGGED));





