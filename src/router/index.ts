import { createRouter, createWebHistory } from 'vue-router'

//创建一个路由器
const router = createRouter({
  history: createWebHistory(),//引入路由器的工作模式
  routes: [//这里面是一个一个的路由规则
    {
      path: '/',
      redirect: '/login',//当访问根路径时，重定向到登录页
    },
    {
      path: '/login',//路径
      name: 'login',//给路由规则起一个名字，方便后面使用
      component: () => import('../components/Login.vue'),//上面路径对应的组件
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../components/Index.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const user = localStorage.getItem('user')

  if (to.meta.requiresAuth && !user) {
    next('/login')
    return
  }

  if (to.path === '/login' && user) {
    next('/index')
    return
  }

  next()
})

//把router暴露出来
//记得去main.ts里引入这个router
export default router