<template>
  <div id="loading">
    <i :class="'waiting fas fa-circle-notch fa-spin '"></i>
    <div :class="'loading '">Connecting...</div>
  </div>
</template>

<script>
  export default {
    name: "Connecting",
    data() {
      return {}
    },
    created() {
    },
    methods: {

    },
  }
</script>
