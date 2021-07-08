import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import VueClipboard from "vue-clipboard2";

import { store } from "./store.js";
import { initDBs } from "./initDB";
import { initSettings } from "./initSettings";

const initApp = async () => {
  Vue.use(VueClipboard);
  Vue.config.productionTip = false;

  await initDBs();
  await initSettings();

  new Vue({
    vuetify,
    store,
    render: h => h(App)
  }).$mount("#app");
};

initApp();
