export default {
  name: 'test',
  routes: [
    { name: 'test-page1', path:'/test-page1', meta: { title: '测试页面1' }, component: () => import('Views/testPage1.vue') }
  ]
}