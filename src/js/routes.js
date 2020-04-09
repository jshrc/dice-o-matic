import Home from './components/Home.vue'
import Dice from './components/Dice.vue'

export const routes = [
  {
    path: '/',
    component: Home,
    name: 'Home',
    meta: {
      'needsSocketIO': true,
    },
  },
  {
    path: '/play',
    component: Dice,
    name: 'Play',
    meta: {
      'needsSocketIO': true,
    },
  },
];
