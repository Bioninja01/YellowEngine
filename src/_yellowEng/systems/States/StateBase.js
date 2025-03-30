export default class StateBase {
  static STATE = {
    INIT: "INIT",
  };
  constructor() {
    this.currentState = this.constructor.STATE.INIT;
  }
  static getStates() {
    let arr = Object.values(this.STATE);
    return arr;
  }
  get state() {
    return this.currentState;
  }
  set state(value = this.constructor.STATE.INIT) {
    this.currentState = value;
    this.handelState(value);
  }
  handelState(value) {}
  toogleState() {
    let states = this.constructor.getStates();
    let firstState = states[0];
    while (states.length > 0) {
      const state = states.shift();
      if (state == this.currentState) {
        this.state = states.shift();
        return;
      }
    }
    this.currentState = firstState;
  }
}
