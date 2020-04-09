<template>
  <div id="app">
    <header>
      <h1><i class="fas fa-dice"></i> Dice-O-Matic!</h1>
      <div v-if="isJoined">
        <i class="fas fa-user"></i>
        {{player.name}}
      </div>
    </header>
    <div style="display: none;">
      <span class="fas fa-dice-one"></span>
      <span class="fas fa-dice-two"></span>
      <span class="fas fa-dice-three"></span>
      <span class="fas fa-dice-four"></span>
      <span class="fas fa-dice-one"></span>
    </div>
    <div v-if="isConnected" id="app_content">
      <router-view
        v-bind:player="player"
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
        player: {},
        players: [],
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
      },
      isJoined() {
        return this.player.name != undefined;
      },
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
      players(players) {
        this.players = players;
      },
      joinSuccess: function(session) {
        if (document.cookie.length) {
          let c = document.cookie.split("; ");
          for (let i in c)
            document.cookie =/^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        document.cookie = "socket_id="+session.socket_id;
        document.cookie = "player_name="+session.name;
        document.cookie = "player_color="+session.color;
        this.player = session;

        if (this.$route.name !== "Play") {
          this.$router.push({name: "Play", params: {player_name: session.name, player_color: session.color}});
        }
      },
    },
    watch: {
      '$route' (to, from) {
        window.scrollTo(0,0);

      }
    },
    created() {

      if (this.$route.name == 'Play' && this.player.name == undefined) {
        let player_name,
          player_color;

        let player_name_regex = /player_name=([a-zA-Z0-9 ]*)/ig,
          player_name_match = player_name_regex.exec(document.cookie);
        player_name = player_name_match !== null ? player_name_match[1] : null;

        let player_color_regex = /player_color=([a-zA-Z0-9 ]*)/ig,
          player_color_match = player_color_regex.exec(document.cookie);
        player_color = player_color_match !== null ? player_color_match[1] : 'red';
        console.log("player_name", player_name)
        console.log("player_color", player_color)

        if (player_name !== null) {
          let join = {
            name: player_name,
            color: player_color,
          };
          this.$socket.client.emit('playerJoin', join);
        }
        else {
          window.location = "/";
        }
      }

    },
    mounted() {

    },
    methods: {
      joinedGame(session) {
        this.activeSession = session.session;
      },
    }
  }
</script>
