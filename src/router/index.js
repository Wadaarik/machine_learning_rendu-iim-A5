import Vue from 'vue'
import Router from 'vue-router'
import Pokemon from '@/components/Pokemon'
import Threejs from'@/components/Threejs'
import Game from'@/components/Connect4'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Pokemon',
      component: Pokemon
    },
    {
      path: '/three/',
      name: 'Threejs',
      component: Threejs
    },
    {
      path: '/game/',
      name: 'Connect 4',
      component: Game
    }

  ]
})
