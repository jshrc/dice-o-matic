<template>
  <div id="dice">
    <div id="dice_wrapper">
      <button v-on:click="rollDie(4)">Roll {{diceCount}}xd4</button>
      <button v-on:click="rollDie(6)">Roll {{diceCount}}xd6</button>
      <button v-on:click="rollDie(8)">Roll {{diceCount}}xd8</button>
      <button v-on:click="rollDie(10)">Roll {{diceCount}}xd10</button>
      <button v-on:click="rollDie(12)">Roll {{diceCount}}xd12</button>
      <button v-on:click="rollDie(20)">Roll {{diceCount}}xd20</button>
    </div>
    <div id="dice_controls_wrapper">
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
      <button class="red" v-on:click="clearRolls">Clear Rolls</button>
    </div>
    <div id="dice_controls_wrapper">
      <label :class="'button '+(showingRolls == 'all' ? 'selected' : 'unselected')" for="showingRolls__all"><input type="radio" value="all" id="showingRolls__all" name="showingRolls" v-model="showingRolls"/>All Rolls</label>
      <label :class="'button '+(showingRolls == 'my' ? 'selected' : 'unselected')" for="showingRolls__my"><input type="radio" value="my" id="showingRolls__my" name="showingRolls" v-model="showingRolls"/>My Rolls</label>
      <label :class="'button '+(showingRolls == 'others' ? 'selected' : 'unselected')" for="showingRolls__others"><input type="radio" value="others" id="showingRolls__others" name="showingRolls" v-model="showingRolls"/>Other's Rolls</label>
    </div>
    <div id="game_board">
      <div class="roll_results_wrapper">
        <template v-for="(result, index) in rollResults">
          <div v-show="showingRolls == 'all' || showingRolls == 'my' && result.player.name == player.name || showingRolls == 'others' && result.player.name != player.name" :class="'roll_results '+ result.player.color">
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
        </template>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "Dice",
    props: {
      player: {},
      players: [],
    },
    data() {
      return {
        rollResults: [],
        showingRolls: 'all',
        diceCount: 1,
        resultsColors: window.colors,
        a: 0,
      }
    },
    sockets: {
      dieRolled(result) {
        this.rollResults.unshift(result);

        if (this.rollResults.length > 25) {
          this.rollResults.pop();// = this.rollResults.slice(0, 25);
        }
      },
    },
    created() {


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
        return this.resultsColors[a%this.resultsColors.length];

        let color = this.resultsColors[this.a];
        console.log('b', this.a);
        this.a++;
        console.log('a',this.a,this.resultsColors.length);
        if (this.a >= this.a,this.resultsColors.length) {
          this.a = 0;
        }
        return color;
      },
    },
  }
</script>
