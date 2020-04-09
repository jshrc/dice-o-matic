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
      <button v-on:click="joinSession()">Enter</button>
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
        session_code: '',
        session_name: '',
        error: '',
      }
    },
    sockets: {
      joinSuccess: function(session) {
        this.$emit('joinedGame', session);
        if (document.cookie.length) {
          let c = document.cookie.split("; ");
          for (let i in c)
            document.cookie =/^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        document.cookie = "socket_id="+session.socket_id;
        document.cookie = "player_name="+session.playerName;
        this.$router.push({name: "Play"});
      },
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
      this.$emit('joinedGame', false);
    },
    methods: {
      joinSession() {
        if (this.session_name !== '') {
          this.error = '';
          let join = {
            name: this.session_name,
          };
          this.$socket.client.emit('playerJoin', join);
        }
        else {
          this.error = "You must provide a session code and&nbsp;name.";
        }

      },
    },
  }
</script>
