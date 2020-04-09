import Vue from 'vue';
import VueRouter from 'vue-router';
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client'

window.socketIOURI = window.location.protocol+"//"+window.location.hostname+"";
Vue.use(VueRouter);

window.axios = require('axios');
import App from './components/App.vue';
const socket = io(window.socketIOURI, {
  autoConnect: true
});
Vue.use(VueSocketIOExt, socket);

import {routes} from './routes.js';
const router = new VueRouter({
  mode: 'history',
  routes: routes,
});

import { EventBus } from './eventbus.js';
window.EventBus = EventBus;

const app = new Vue({
  el: "#app",
  router,
  template: '<App/>',
  components: { App }
});
