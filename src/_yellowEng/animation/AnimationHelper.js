import * as TWEEN from "@tweenjs/tween.js";

export async function handleAnimate(input, output) {
  // let finished = false;
  const myPromise = new Promise(function (resolve) {
    let tween = new TWEEN.Tween(input)
      .to(output)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start(); // Makes x go to 100
    function animate(time) {
      tween.update(time);
      if (tween.isPlaying()) {
        requestAnimationFrame(animate);
        return;
      }
      resolve(input);
    }
    requestAnimationFrame(animate);
  });
  return myPromise;
}
