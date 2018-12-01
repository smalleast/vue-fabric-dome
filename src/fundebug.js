import Vue from 'vue'

const API_KEY = 'a34cbaa406cc6e81c7e787adc47f12734c00808d44705e440e4b3db21753a7d6'

function formatComponentName (vm) {
  if (vm.$root === vm) return 'root'

  var name = vm._isVue
    ? (vm.$options && vm.$options.name) ||
      (vm.$options && vm.$options._componentTag)
    : vm.name
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options && vm.$options.__file
      ? ' at ' + (vm.$options && vm.$options.__file)
      : '')
  )
}

if (process.env.NODE_ENV === 'production') {
  const fundebug = require('fundebug-javascript')
  fundebug.apikey = API_KEY

  Vue.config.errorHandler = function (err, vm, info) {
    if (vm) {
      var componentName = formatComponentName(vm)
      var propsData = vm.$options && vm.$options.propsData
      fundebug.notifyError(err, {
        metaData: {
          componentName: componentName,
          propsData: propsData,
          info: info
        }
      })
    } else {
      fundebug.notifyError(err)
    }
  }
}
