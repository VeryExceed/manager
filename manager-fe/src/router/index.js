import { createRouter, createWebHashHistory} from 'vue-router'
import Home from '@/components/Home.vue'
import storage from '../utils/storage'
import API from '../api'
import utils from '../utils/utils'

const routes = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: Home,
    redirect: '/welcome',
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎体验Vue3全栈课程'
        },
        component: () => import('@/views/Welcome.vue')
      }
    ]
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/Login.vue')
  },
  {
    name: '404',
    path: '/404',
    meta: {
      title: '页面不存在'
    },
    component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const modules = import.meta.globEager('./modules/**/*.js')
Object.values(modules).forEach((modulesValueItem) => {
  // ? 如果不存在就返回undefined
  if (modulesValueItem.default?.routes?.length) {
    modulesValueItem.default.routes.forEach((routesItem) => {
      router.addRoute(routesItem)
      console.log(routesItem)
    })
  }
})

async function loadAsyncRoutes() {
  let userInfo = storage.getItem('userInfo') || {}
  if (userInfo.token) {
    try {
      const { menuList } = await API.getPermissionList()
      let routes = utils.generateRoute(menuList)
      routes.map((route) => {
        let url = `./../views/${route.component}.vue`
        route.component = () => import(/* @vite-ignore */`${url}`)
        router.addRoute('home', route)
      })
    } catch (error) {
      
    }
  }
}
await loadAsyncRoutes()


// 判断当前地址是否可以访问
function checkPermission(path) {
  let hasPermission = router
    .getRoutes()
    .filter((route) => route.path == path).length
  if (hasPermission) {
    return true
  } else {
    return false
  }
}

// 导航守卫
router.beforeEach((to, form, next) => {
  if (checkPermission(to.path)) {
    document.title = to.meta.title
    next()
  } else {
    next('/404')
  }
})

export default router
