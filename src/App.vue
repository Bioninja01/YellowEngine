<template>
  <!-- <pre class="VrButton">{{ camera.position }}</pre> -->
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
import webgl from "./_yellowEng/scripts/setup";
export default {
  data() {
    return {
      vrMode: false,
    };
  },
  async mounted() {
    webgl.mount(this.$el.parentElement);
    await webgl.load();
    webgl.play();
  },
  unmounted() {
    console.log("this is asdasd sadasdtest!!");
  },
  methods: {
    toggle() {
      this.vrMode ? webgl.stopVR() : webgl.startVR();
      this.vrMode = !this.vrMode;
    },
  },
};
</script>
