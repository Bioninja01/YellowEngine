export default class Input {
  static Events = {
    keyDown: "keydown",
    keyUp: "keyup",
    mouseDown: "mousedown",
    mouseUp: "mouseup",
  };
  static #lookupTable = {};

  static GetKeyUp(key) {
    let data = Input.#lookupTable[key];
    if (data == Input.Events.keyUp) return true;
    return false;
  }
  static GetKeyDown(key) {
    let data = Input.#lookupTable[key];
    if (data == Input.Events.keyDown) return true;
    return false;
  }
  static GetMouseUp() {
    let data = Input.#lookupTable["mouse"];
    if (data == Input.Events.mouseUp) return true;
    return false;
  }
  static GetMouseDown() {
    let data = Input.#lookupTable["mouse"];
    if (data == Input.Events.mouseDown) return true;
    return false;
  }
  static GetMousemove() {
    let event = Input.#lookupTable["mousemove"];
    if (!event) return null;
    return event;
  }

  static handleKeyDown(event) {
    Input.#lookupTable[event.key] = Input.Events.keyDown;
  }
  static handleKeyUp(event) {
    Input.#lookupTable[event.key] = Input.Events.keyUp;
  }
  static handleMouseDown() {
    Input.#lookupTable["mouse"] = Input.Events.mouseDown;
  }
  static handleMouseUp() {
    Input.#lookupTable["mouse"] = Input.Events.mouseUp;
  }
  static handleMouseMove(event) {
    Input.#lookupTable["mousemove"] = event;
  }
  static setUpEventListeners() {
    window.addEventListener("keydown", Input.handleKeyDown);
    window.addEventListener("keyup", Input.handleKeyUp);
    window.addEventListener("mousedown", Input.handleMouseDown);
    window.addEventListener("mouseup", Input.handleMouseUp);
    window.addEventListener("mousemove", Input.handleMouseMove);
  }
  static removeEventListeners() {
    window.removeEventListener("keydown", Input.handleKeyDown);
    window.removeEventListener("keyup", Input.handleKeyUp);
    window.removeEventListener("mousedown", Input.handleMouseDown);
    window.removeEventListener("mouseup", Input.handleMouseUp);
    window.removeEventListener("mousemove", Input.handleMouseMove);
  }
  static update(detaTime) {
    let keys = Object.keys(Input.#lookupTable);
    for (let key of keys) {
      if (Input.#lookupTable[key] == Input.Events.keyUp) {
        delete Input.#lookupTable[key];
      }
    }
    if (Input.#lookupTable["mouse"] == Input.Events.mouseUp) {
      delete Input.#lookupTable["mouse"];
    }
    delete Input.#lookupTable["mousemove"];
  }
}
