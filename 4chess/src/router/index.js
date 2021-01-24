import Vue from 'vue'
import Router from 'vue-router'
import Broad from '@/components/Broad'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Broad
    }
  ]
})
