import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import service from "./axios-init";
import VueAxios from "vue-axios";
import store from "./store/index";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/js/all.js";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueAxios, service);
Vue.prototype.$service = service;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
