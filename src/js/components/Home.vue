<template>
  <div id="home">
    <form id="join" @submit.prevent="joinSession">
      <div class="form_field">
        <label for="name">Your Name</label>
        <input id="name"
          name="name"
          type="text"
          placeholder="Your Name"
          v-model="session_name" />
      </div>
      <div class="form_field">
        <label for="color">Pick a Color</label>
        <select name="color" id="color" v-model="session_color">
          <option value="">Random!</option>
          <option v-for="(color) in colors" :value="color">{{color}}</option>
        </select>
      </div>
      <div class="form_field">
        <button v-on:click.stop.prevent="joinSession()">Enter</button>
      </div>
      <div v-if="error" class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <span v-html="error"></span>
      </div>
    </form>
  </div>
</template>

<script>

  export default {
    name: "Home",
    data() {
      return {
        session_color: '',
        session_name: '',
        error: '',
        colors: window.colors,
      }
    },
    sockets: {

      joinError: function(message) {
        this.error = message;
      },
      gameNotFound: function() {
        this.error = "Sorry, we couldn't find that session.";
      },
    },
    computed: {

    },
    created() {

    },
    methods: {
      joinSession() {
        console.log('joinSession?', Math.random());
        if (this.session_name !== '') {
          this.error = '';
          let join = {
            name: this.session_name,
            color: this.session_color,
          };
          this.$socket.client.emit('playerJoin', join);
        }
        else {
          this.error = "You must provide a session code and&nbsp;name.";
        }
        return false;
      },
    },
  }
</script>
