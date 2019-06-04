const list = [
  {
    path: '/',
    name: 'index',
    component: resolve =>
      require(['../views/population/overview/index.vue'], resolve)
  },
  {
    path: '/totalPopulation',
    name: 'totalPopulation',
    component: resolve =>
      require(['../views/population/total/index.vue'], resolve)
  },
  {
    path: '/permanentPopulation',
    name: 'permanentPopulation',
    component: resolve =>
      require(['../views/population/permanent/index.vue'], resolve)
  },
  {
    path: '/source',
    name: 'source',
    component: resolve =>
      require(['../views/population/source/index.vue'], resolve)
  },
  {
    path: '/occupation',
    name: 'occupation',
    component: resolve =>
      require(['../views/population/occupation/index.vue'], resolve)
  },
  {
    path: '/workerForce',
    name: 'workerForce',
    component: resolve =>
      require(['../views/population/workerForce/index.vue'], resolve)
  },
  {
    path: '/composition',
    name: 'composition',
    component: resolve =>
      require(['../views/population/composition/index.vue'], resolve)
  },
  {
    path: '/citycommute',
    name: 'citycommute',
    component: resolve =>
      require(['../views/population/citycommute/index.vue'], resolve)
  }
];
export default (process.env.NODE_ENV !== 'production'
  ? list
  : list.slice(0, 8));
