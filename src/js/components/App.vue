<template>
  <div id="app">
    <h1>Dice-O-Matic!</h1>
    <div style="display: none;">
      <span class="fas fa-dice-one"></span>
      <span class="fas fa-dice-two"></span>
      <span class="fas fa-dice-three"></span>
      <span class="fas fa-dice-four"></span>
      <span class="fas fa-dice-one"></span>
    </div>
    <div v-if="isConnected" id="app_content">
      <router-view v-on:joinedGame="joinedGame"
        v-bind:activeSession="activeSession"></router-view>
    </div>
    <connecting v-else-if="!connectionError"></connecting>
    <connection-error v-else></connection-error>
  </div>
</template>

<script>
  import { EventBus } from '../eventbus.js';
  import VueSocketIOExt from 'vue-socket.io-extended';
  import io from 'socket.io-client';
  import Connecting from './Connecting.vue';
  import ConnectionError from "./ConnectionError.vue";
  import Vue from 'vue';
  export default {
    name: 'app',
    components: {
      'connecting': Connecting,
      'connection-error': ConnectionError,
    },
    data() {
      return {
        ioConnected: false,
        activeSession: false,
        connectionError: false,
        rollResult: null,
      }
    },
    computed: {
      hasNav() {
        return this.$route.meta.needsNav != undefined;
      },
      hasSlideout() {
        return this.$route.matched[0].components.slideout != undefined;
      },
      isConnected() {
        return this.ioConnected;
      }
    },
    sockets: {
      connect() {
        this.ioConnected = true;
      },
      reconnect() {
        this.ioConnected = true;
      },
      disconnect() {
        this.ioConnected = false;
      },
      error() {

      },
    },
    watch: {
      '$route' (to, from) {
        window.scrollTo(0,0);
        if (this.$route.meta.needsSocketIO === true && !this.ioConnected) {
          this.connectSocketIO();
        }
      }
    },
    created() {
    },
    mounted() {
      let socket_name_regex = /player_name=([a-zA-Z0-9\-_ ]*)/ig,
            socket_player_name_match = socket_name_regex.exec(document.cookie),
            player_name = socket_player_name_match !== null ? socket_player_name_match[1] : null;
            console.log(player_name,'!!!!');
    },
    methods: {
      joinedGame(session) {
        this.activeSession = session.session;
      },
    }
  }
</script>
