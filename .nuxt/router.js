import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _6f900a61 = () => interopDefault(import('..\\pages\\layout' /* webpackChunkName: "" */))
const _4f7e65d6 = () => interopDefault(import('..\\pages\\home' /* webpackChunkName: "" */))
const _bef2c55c = () => interopDefault(import('..\\pages\\login' /* webpackChunkName: "" */))
const _727b6152 = () => interopDefault(import('..\\pages\\profile' /* webpackChunkName: "" */))
const _6e30d99a = () => interopDefault(import('..\\pages\\settings' /* webpackChunkName: "" */))
const _63c130a4 = () => interopDefault(import('..\\pages\\editor' /* webpackChunkName: "" */))
const _5945a49f = () => interopDefault(import('..\\pages\\article' /* webpackChunkName: "" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _6f900a61,
    children: [{
      path: "",
      component: _4f7e65d6,
      name: "home"
    }, {
      path: "login",
      component: _bef2c55c,
      name: "login"
    }, {
      path: "register",
      component: _bef2c55c,
      name: "register"
    }, {
      path: "profile/:username",
      component: _727b6152,
      name: "profile"
    }, {
      path: "settings",
      component: _6e30d99a,
      name: "settings"
    }, {
      path: "editor",
      component: _63c130a4,
      name: "editor"
    }, {
      path: "article/:slug",
      component: _5945a49f,
      name: "article"
    }]
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
