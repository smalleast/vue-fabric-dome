<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import { applyToken } from '@/util'
import { DESIGN_CLOUD_URL, DESIGN_CLOUD_LOGIN_PATH } from '@/constants'

export default {
  created () {
    let token = Cookie.get('ZHULOGIC_TOKEN')
    applyToken(token)
    this.$store.dispatch('profile').catch(err => {
      if (err.status === 401) {
        // 未登录，跳转到云设计平台的登录页，登录成功后重定向到当前页
        window.onbeforeunload = undefined
        window.location.href = `${DESIGN_CLOUD_URL}${DESIGN_CLOUD_LOGIN_PATH}?redirect=${window.location}`
      }
    })
  }
}
</script>
