// API服务层 - 统一管理HTTP请求
import axios from 'axios'
import { useUserStore } from '@/stores/user'

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 基础URL，与vite.config.js中的proxy配置匹配
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从store获取token
    const userStore = useUserStore()
    const token = userStore.token
    
    // 如果有token，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 直接返回响应数据
    return response.data
  },
  error => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除用户信息并跳转到登录页
          const userStore = useUserStore()
          userStore.logout()
          // 保存当前页面，登录后跳转回来
          localStorage.setItem('redirectAfterLogin', window.location.pathname)
          window.location.href = '/login'
          break
        case 403:
          console.error('没有权限访问该资源')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error('请求失败:', error.response.data?.message || '未知错误')
      }
    } else if (error.request) {
      console.error('网络错误，请检查您的网络连接')
    } else {
      console.error('请求配置错误:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// 模拟数据 - 用于开发测试
const mockData = {
  // 模拟热门贴吧数据
  popularTiebas: [
    { id: 1, name: '吧主吧', description: '百度贴吧吧主交流平台', memberCount: 1250000, postCount: 5800000 },
    { id: 2, name: '李毅吧', description: '百度第一大吧，内涵和搞笑的天堂', memberCount: 32000000, postCount: 2100000000 },
    { id: 3, name: '魔兽世界', description: '艾泽拉斯的世界，为了联盟/部落！', memberCount: 5800000, postCount: 320000000 },
    { id: 4, name: '英雄联盟', description: '召唤师峡谷，英雄，去超越！', memberCount: 8600000, postCount: 450000000 },
    { id: 5, name: '绝地求生', description: '大吉大利，今晚吃鸡！', memberCount: 3200000, postCount: 180000000 }
  ],
  
  // 模拟热门帖子数据
  popularPosts: [
    {
      id: 1,
      title: '【公告】百度贴吧全新版本更新公告',
      content: '<p>亲爱的吧友们，百度贴吧将于本周四进行全新版本更新，带来全新的用户界面和功能体验。</p><p>主要更新内容：</p><ul><li>全新的沉浸式阅读体验</li><li>优化的发帖功能，支持更多富文本格式</li><li>增强的社区管理工具</li><li>性能优化，加载更快</li></ul>',
      author: { id: 1001, username: '贴吧管理员', avatar: '/avatar/admin.jpg' },
      tiebaId: 1,
      tiebaName: '吧主吧',
      viewCount: 32500,
      commentCount: 1258,
      likeCount: 5689,
      createTime: '2024-01-15T10:30:00Z',
      isTop: true,
      isHot: true
    },
    {
      id: 2,
      title: '【经验】分享一下我的考研复习计划',
      content: '<p>2024年考研已经结束，分享一下我的复习计划，希望对明年考研的同学有所帮助。</p><p>英语：每天背50个单词，做两篇阅读...</p>',
      author: { id: 1002, username: '考研小达人', avatar: '/avatar/user1.jpg' },
      tiebaId: 6,
      tiebaName: '考研吧',
      viewCount: 18900,
      commentCount: 876,
      likeCount: 3456,
      createTime: '2024-01-14T15:20:00Z',
      isTop: false,
      isHot: true
    },
    {
      id: 3,
      title: '【求助】电脑总是自动关机，是什么原因？',
      content: '<p>最近电脑总是在使用过程中突然自动关机，温度也不高，驱动都是最新的，有人知道是什么原因吗？</p>',
      author: { id: 1003, username: '电脑小白', avatar: '/avatar/user2.jpg' },
      tiebaId: 7,
      tiebaName: '电脑吧',
      viewCount: 12300,
      commentCount: 456,
      likeCount: 1234,
      createTime: '2024-01-15T09:15:00Z',
      isTop: false,
      isHot: true
    },
    {
      id: 4,
      title: '【分享】我的极简主义生活方式',
      content: '<p>从去年开始尝试极简主义生活，扔掉了80%的物品，生活反而更加轻松和充实了...</p>',
      author: { id: 1004, username: '极简生活', avatar: '/avatar/user3.jpg' },
      tiebaId: 8,
      tiebaName: '生活方式吧',
      viewCount: 9800,
      commentCount: 345,
      likeCount: 2345,
      createTime: '2024-01-13T20:45:00Z',
      isTop: false,
      isHot: true
    },
    {
      id: 5,
      title: '【讨论】人工智能会取代人类工作吗？',
      content: '<p>随着AI技术的快速发展，越来越多的工作岗位受到威胁，大家觉得人工智能最终会取代人类的工作吗？</p>',
      author: { id: 1005, username: '科技爱好者', avatar: '/avatar/user4.jpg' },
      tiebaId: 9,
      tiebaName: '科技吧',
      viewCount: 15600,
      commentCount: 789,
      likeCount: 4567,
      createTime: '2024-01-14T14:30:00Z',
      isTop: false,
      isHot: true
    }
  ],
  
  // 模拟帖子评论数据
  postComments: [
    {
      id: 101,
      postId: 1,
      author: { id: 1006, username: '热心吧友', avatar: '/avatar/user5.jpg' },
      content: '支持！期待新版本的到来！',
      likeCount: 123,
      createTime: '2024-01-15T10:45:00Z',
      replyTo: null
    },
    {
      id: 102,
      postId: 1,
      author: { id: 1007, username: '老用户', avatar: '/avatar/user6.jpg' },
      content: '希望新版本能解决卡顿问题',
      likeCount: 89,
      createTime: '2024-01-15T11:20:00Z',
      replyTo: null
    }
  ],
  
  // 模拟用户信息
  userInfo: {
    id: 1001,
    username: '测试用户',
    avatar: '/avatar/test.jpg',
    bio: '热爱技术，热爱生活',
    followingCount: 120,
    followerCount: 345,
    joinTime: '2023-01-01T00:00:00Z',
    postCount: 56,
    likedCount: 789
  }
}

// API接口定义
export const apiService = {
  // 用户相关API
  user: {
    // 登录
    login: async (credentials) => {
      // 模拟登录响应
      // return api.post('/user/login', credentials)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              token: 'mock-token-' + Date.now(),
              user: {
                id: 1001,
                username: credentials.username,
                avatar: '/avatar/test.jpg'
              }
            }
          })
        }, 300)
      })
    },
    
    // 注册
    register: async (userData) => {
      // return api.post('/user/register', userData)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              message: '注册成功'
            }
          })
        }, 300)
      })
    },
    
    // 获取用户信息
    getInfo: async () => {
      // return api.get('/user/info')
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: mockData.userInfo
          })
        }, 300)
      })
    },
    
    // 更新用户信息
    updateInfo: async (userData) => {
      return api.put('/user/info', userData)
    },
    
    // 修改密码
    changePassword: async (passwordData) => {
      return api.put('/user/password', passwordData)
    },
    
    // 上传头像
    uploadAvatar: async (formData) => {
      return api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  },
  
  // 贴吧相关API
  tieba: {
    // 获取热门贴吧列表
    getPopularList: async () => {
      // return api.get('/tieba/popular')
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: mockData.popularTiebas
          })
        }, 300)
      })
    },
    
    // 获取贴吧详情
    getDetail: async (tiebaId) => {
      // return api.get(`/tieba/${tiebaId}`)
      return new Promise((resolve) => {
        setTimeout(() => {
          const tieba = mockData.popularTiebas.find(t => t.id === parseInt(tiebaId))
          resolve({
            success: true,
            data: tieba || null
          })
        }, 300)
      })
    },
    
    // 获取贴吧帖子列表
    getPosts: async (tiebaId, params = {}) => {
      // return api.get(`/tieba/${tiebaId}/posts`, { params })
      return new Promise((resolve) => {
        setTimeout(() => {
          const posts = mockData.popularPosts.filter(p => p.tiebaId === parseInt(tiebaId))
          resolve({
            success: true,
            data: {
              list: posts,
              total: posts.length,
              page: params.page || 1,
              pageSize: params.pageSize || 10
            }
          })
        }, 300)
      })
    },
    
    // 关注贴吧
    follow: async (tiebaId) => {
      return api.post(`/tieba/${tiebaId}/follow`)
    },
    
    // 取消关注贴吧
    unfollow: async (tiebaId) => {
      return api.delete(`/tieba/${tiebaId}/follow`)
    }
  },
  
  // 帖子相关API
  post: {
    // 获取热门帖子列表
    getPopularList: async () => {
      // return api.get('/post/popular')
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: mockData.popularPosts
          })
        }, 300)
      })
    },
    
    // 获取帖子详情
    getDetail: async (postId) => {
      // return api.get(`/post/${postId}`)
      return new Promise((resolve) => {
        setTimeout(() => {
          const post = mockData.popularPosts.find(p => p.id === parseInt(postId))
          resolve({
            success: true,
            data: post || null
          })
        }, 300)
      })
    },
    
    // 创建帖子
    create: async (postData) => {
      return api.post('/post', postData)
    },
    
    // 更新帖子
    update: async (postId, postData) => {
      return api.put(`/post/${postId}`, postData)
    },
    
    // 删除帖子
    delete: async (postId) => {
      return api.delete(`/post/${postId}`)
    },
    
    // 点赞帖子
    like: async (postId) => {
      return api.post(`/post/${postId}/like`)
    },
    
    // 取消点赞帖子
    unlike: async (postId) => {
      return api.delete(`/post/${postId}/like`)
    },
    
    // 收藏帖子
    collect: async (postId) => {
      return api.post(`/post/${postId}/collect`)
    },
    
    // 取消收藏帖子
    uncollect: async (postId) => {
      return api.delete(`/post/${postId}/collect`)
    },
    
    // 获取帖子评论列表
    getComments: async (postId, params = {}) => {
      // return api.get(`/post/${postId}/comments`, { params })
      return new Promise((resolve) => {
        setTimeout(() => {
          const comments = mockData.postComments.filter(c => c.postId === parseInt(postId))
          resolve({
            success: true,
            data: {
              list: comments,
              total: comments.length,
              page: params.page || 1,
              pageSize: params.pageSize || 20
            }
          })
        }, 300)
      })
    },
    
    // 发表评论
    addComment: async (postId, commentData) => {
      return api.post(`/post/${postId}/comments`, commentData)
    },
    
    // 删除评论
    deleteComment: async (postId, commentId) => {
      return api.delete(`/post/${postId}/comments/${commentId}`)
    },
    
    // 搜索帖子
    search: async (keyword, params = {}) => {
      return api.get('/post/search', {
        params: {
          keyword,
          ...params
        }
      })
    }
  },
  
  // 用户互动相关API
  interaction: {
    // 关注用户
    followUser: async (userId) => {
      return api.post(`/user/${userId}/follow`)
    },
    
    // 取消关注用户
    unfollowUser: async (userId) => {
      return api.delete(`/user/${userId}/follow`)
    },
    
    // 获取关注列表
    getFollowing: async (userId, params = {}) => {
      return api.get(`/user/${userId}/following`, { params })
    },
    
    // 获取粉丝列表
    getFollowers: async (userId, params = {}) => {
      return api.get(`/user/${userId}/followers`, { params })
    },
    
    // 获取用户发布的帖子
    getUserPosts: async (userId, params = {}) => {
      return api.get(`/user/${userId}/posts`, { params })
    },
    
    // 获取用户收藏的帖子
    getUserCollections: async (params = {}) => {
      return api.get('/user/collections', { params })
    },
    
    // 获取用户的回复
    getUserReplies: async (params = {}) => {
      return api.get('/user/replies', { params })
    }
  },
  
  // 上传相关API
  upload: {
    // 上传图片
    uploadImage: async (formData) => {
      return api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    
    // 上传文件
    uploadFile: async (formData) => {
      return api.post('/upload/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  },
  
  // 通知相关API
  notification: {
    // 获取通知列表
    getList: async (params = {}) => {
      return api.get('/notification', { params })
    },
    
    // 标记通知为已读
    markAsRead: async (notificationId) => {
      return api.put(`/notification/${notificationId}/read`)
    },
    
    // 标记所有通知为已读
    markAllAsRead: async () => {
      return api.put('/notification/read-all')
    },
    
    // 获取未读通知数量
    getUnreadCount: async () => {
      return api.get('/notification/unread-count')
    }
  }
}

export default apiService