import Vue from 'vue'
import ElementUI from 'element-ui'
import ShortKey from 'vue-shortkey'
import EventProxy from 'vue-event-proxy'

import App from './App.vue'
import router from './router'
import store from './store'
import './axios'
import './fundebug'

import 'animate.css'
import 'vue2-animate/dist/vue2-animate.min.css'

import './iconfont/iconfont.css'
import './style/element-variables.scss'
import './style/main.scss'

Vue.use(ElementUI)
Vue.use(ShortKey)
Vue.use(EventProxy)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// JavaScript before leaving the page
// https://stackoverflow.com/questions/7080269/javascript-before-leaving-the-page
if (process.env.VUE_APP_ENABLE_BEFORE_UNLOAD === 'true') {
  window.onbeforeunload = function () { return true }
}
