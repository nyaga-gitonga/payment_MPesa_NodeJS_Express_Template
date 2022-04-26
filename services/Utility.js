const events = require("events");
const eventEmitter = new events.EventEmitter();

class Utility {
  constructor() {
    this.events = {
      recieveEvents: (event, cb) => {
        eventEmitter.on(event, (data) => {
          cb(data);
        });
      },
      emitEvents: (Evt_name, data) => {
        eventEmitter.emit(Evt_name, data);
      },
    };
  }
}

let utility = new Utility();

module.exports = { utility };
