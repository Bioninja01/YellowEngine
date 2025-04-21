<template>
  <button class="VrButton" @click="toggle">vr Button</button>
  <div class="cursor"></div>
</template>

<style scoped>
.cursor {
  position: absolute;
  background: black;
  width: 5px;
  height: 5px;
  z-index: 100000;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.VrButton {
  position: absolute;
  width: 200px;
  height: 100px;
  z-index: 100000;
}
</style>
<script>
import setUpGame from "./_yellowEng/scripts/setUpGame.js";
let webgl = null;

export default {
  data() {
    return {
      vrMode: false,
      
    };
  },
  async mounted() {
    webgl = await setUpGame()
    webgl.stop();
    webgl.mount(this.$el.parentElement);
    // await webgl.load();
    webgl.play();
  },
  unmounted() {
    if(webgl){
      webgl.unmounted();
    }
  },
  methods: {
    toggle() {
      if(webgl){
        this.vrMode ? webgl.stopVR() : webgl.startVR();
        this.vrMode = !this.vrMode;
      }
    },
  },
};
</script>
