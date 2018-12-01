let router = []

if (process.env.NODE_ENV !== 'production') {
  router = [
    {
      path: '/test',
      name: 'test',
      component: () => import(/* webpackChunkName: "test" */ '@/views/test/index.vue')
    },
    {
      path: '/test/crop',
      name: 'crop',
      component: () => import(/* webpackChunkName: "crop" */ '@/views/test/crop.vue')
    },
    {
      path: '/test/crop-pattern',
      name: 'crop-pattern',
      component: () => import(/* webpackChunkName: "crop-pattern" */ '@/views/test/crop-pattern.vue')
    },
    {
      path: '/test/filters',
      name: 'filters',
      component: () => import(/* webpackChunkName: "filters" */ '@/views/test/filters.vue')
    }
  ]
}

export default router
