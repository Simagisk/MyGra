import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home/home'
import user from '@/components/user/user'
import taxi from '@/components/taxi/taxi'
import replace from '@/components/replace/replace'
import bus from '@/components/bus/bus'
import travel from '@/components/user/menuPages/travel'
import setting from '@/components/user/menuPages/setting'
import wallet from '@/components/user/menuPages/wallet'
import order from '@/components/order/index'
import accepte from '@/components/order/accepte'
import loader from '@/components/order/loader'
import suggest from '@/components/suggest/suggest'
import webError from '@/components/webError'
import developing from '@/components/developing'
import cancel from '@/components/order/orderTip'
import webErr from '@/components/order/webError'
import findPosition from '@/components/findPosition/findPosition'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home/taxi',
      name: 'home',
      component: home,
      alias: '/' || '/home',
      children: [
        {
          path: 'home/taxi',
          name: 'taxi',
          component: taxi
        },
        {
          path: 'home/position',
          name: 'findPosition',
          component: findPosition
        },
        {
          path: 'home/replace',
          name: 'repalce',
          component: replace
        },
        {
          path: 'home/bus',
          name: 'bus',
          component: bus
        }
      ]
    },
    {
      path: '/suggest',
      name: 'suggest',
      component: suggest
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      children: [
        {
          path: '/user/travel',
          name: 'travel',
          component: developing
        },
        {
          path: '/user/setting',
          name: 'setting',
          component: setting
        },
        {
          path: '/user/wallet',
          name: 'wallet',
          component: developing
        }
      ]
    },
    {
      path: '/order',
      name: 'order',
      component: order,
      children: [
        {
          path: '/order/loader',
          name: 'loader',
          component: loader
        },
        {
          path: '/order/accepte',
          name: 'accepte',
          component: accepte
        },
        {
          path: '/order/cancel',
          name: 'cancel',
          component: cancel
        },
        {
          path: '/order/err',
          name: 'err',
          component: webErr
        }
      ]
    },
    {
      path: '/webError',
      component: webError
    },
    {
      path: '/developing',
      component: developing
    }
  ]
})
