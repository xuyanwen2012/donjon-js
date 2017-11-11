import EventEmitter from "./managers/event_emitter";

function boom() {
  console.log("Booooom..");
}

EventEmitter.addListener('dickyou', boom);

EventEmitter.emit('dickyou');
EventEmitter.emit('dickyou');

EventEmitter.removeListener('dickyou', boom);

EventEmitter.emit('dickyou');
