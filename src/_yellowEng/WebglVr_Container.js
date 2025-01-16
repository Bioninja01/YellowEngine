import Webgl_Container from "./Webgl_Container";
import { setupVrControllers, setupXrControllers } from "./helpers/WebgVrHelper";

export default class WebglVr_Container extends Webgl_Container {
  controllers;
  constructor() {
    super();
  }
  async startVR() {
    const xrManager = this.renderer.xr;
    const vrSession = await navigator.xr.requestSession("immersive-vr", {
      optionalFeatures: ["local-floor", "bounded-floor", "layers"],
    });
    xrManager.setSession(vrSession);
    this.controllers = setupVrControllers(xrManager, this.camera_dolly);
    setupXrControllers(this);
  }
  stopVR() {
    this.renderer.xr.getSession().end();
    this.reset();
  }
  update(detaTime) {
    super.update(detaTime);
    if (this.controllers) {
      Object.values(this.controllers).forEach((controller) => {
        if (controller?.gamepad) {
          controller.gamepad.update();
        }
      });
    }
  }
}
