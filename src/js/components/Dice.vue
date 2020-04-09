<template>
  <div id="dice">

    <div id="dice_wrapper">
      <button v-on:click="rollDie(4)">Roll {{diceCount}}xd4!</button>
      <button v-on:click="rollDie(6)">Roll {{diceCount}}xd6!</button>
      <button v-on:click="rollDie(8)">Roll {{diceCount}}xd8!</button>
      <button v-on:click="rollDie(10)">Roll {{diceCount}}xd10!</button>
      <button v-on:click="rollDie(12)">Roll {{diceCount}}xd12!</button>
      <button v-on:click="rollDie(20)">Roll {{diceCount}}xd20!</button>
    </div>
    <select v-model="diceCount">
      <option value="1">1 die</option>
      <option value="2">2 dice</option>
      <option value="3">3 dice</option>
      <option value="4">4 dice</option>
      <option value="5">5 dice</option>
      <option value="6">6 dice</option>
      <option value="7">7 dice</option>
      <option value="8">8 dice</option>
    </select>
    <button v-on:click="clearRolls">Clear Rolls</button>
    <div id="game_board">
      <div class="roll_results_wrapper">
        <div :class="'roll_results '+ getResultsColor(index)" v-for="(result, index) in rollResults">
          <div class="roll_results_info">
            <div class="roll_results_roller">
              {{result.player.name}}
            </div>
            <div class="roll_results_rolled">
               rolled {{result.diceCount}}xd{{result.numberOfSides}}:
            </div>
            <div class="roll_results_rolls">
              <span v-for="(roll, index) in result.rolls">  {{roll.result}}</span>
            </div>
          </div>
          <div class="roll_results_sum">
            {{result.rollsSum}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "Dice",
    data() {
      return {
        rollResults: [],
        players: {},
        diceCount: 1,
        resultsColors: ['red', 'periwinkle', 'orange'],
      }
    },
    sockets: {
      dieRolled(result) {
        this.rollResults.unshift(result);

        if (this.rollResults.length > 25) {
          this.rollResults = this.rollResults.slice(0, 25);
        }
      },
      players(players) {
        this.players = players;
        console.log(players);
      }
    },

    created() {
      let player_name_regex = /player_name=([a-zA-Z0-9 ]*)/ig,
        player_name_match = player_name_regex.exec(document.cookie),
        player_name = player_name_match !== null ? player_name_match[1] : null;

      if (player_name !== null) {
        let join = {
          name: player_name,
        };
        this.$socket.client.emit('playerJoin', join);
      }
      else {
        window.location = "/";
      }
    },
    methods: {
      rollDie(numberOfSides) {
        this.$socket.client.emit('rollDie', {diceCount: this.diceCount, numberOfSides: numberOfSides});
      },
      clearRolls() {
        this.$set(this, 'rollResults', []);
      },
      getResultsColor(i) {
        let a = this.rollResults.length - i;
        return this.resultsColors[a%3];
      },
    },
  }
</script>
