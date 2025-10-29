import { createRouter, createWebHistory } from 'vue-router'

// 路由懒加载
const HomePage = () => import('../views/HomePage.vue')
const TiebaDetail = () => import('../views/TiebaDetail.vue')
const PostDetail = () => import('../views/PostDetail.vue')
const CreatePost = () => import('../views/CreatePost.vue')
const UserProfile = () => import('../views/UserProfile.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const SearchResult = () => import('../views/SearchResult.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: '百度贴吧 - 首页'
    }
  },
  {
    path: '/tieba/:id',
    name: 'TiebaDetail',
    component: TiebaDetail,
    meta: {
      title: '贴吧详情'
    }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetail,
    meta: {
      title: '帖子详情'
    }
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: CreatePost,
    meta: {
      title: '发布帖子',
      requiresAuth: true
    }
  },
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: UserProfile,
    meta: {
      title: '个人中心'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      guest: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: '注册',
      guest: true
    }
  },
  {
    path: '/search',
    name: 'SearchResult',
    component: SearchResult,
    meta: {
      title: '搜索结果'
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '百度贴吧'
  
  // 检查是否需要登录
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      next({ name: 'Home' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router