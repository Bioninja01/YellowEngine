import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vueAppGlobales from "./vueAppGlobales.js";

const app = createApp(App);
app.use(vueAppGlobales);
app.mount("#app");