import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userInfo: (state) => state.currentUser
  },
  
  actions: {
    // 登录
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/auth/login/', credentials)
        this.token = response.data.token
        this.currentUser = response.data.user
        localStorage.setItem('token', response.data.token)
        
        // 设置axios默认请求头
        axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`
        return response.data
      } catch (error) {
        this.error = error.response?.data?.detail || '登录失败，请检查账号密码'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 注册
    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/auth/register/', userData)
        return response.data
      } catch (error) {
        this.error = error.response?.data || '注册失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取用户信息
    async fetchUserInfo() {
      if (!this.token) return
      
      this.loading = true
      try {
        const response = await axios.get('/api/users/me/')
        this.currentUser = response.data
        return response.data
      } catch (error) {
        // 如果获取失败，清除token
        this.logout()
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 登出
    logout() {
      this.token = null
      this.currentUser = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },
    
    // 更新用户信息
    async updateProfile(profileData) {
      if (!this.token) throw new Error('请先登录')
      
      this.loading = true
      try {
        const response = await axios.put('/api/users/me/', profileData)
        this.currentUser = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data || '更新失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 修改密码
    async changePassword(passwordData) {
      if (!this.token) throw new Error('请先登录')
      
      this.loading = true
      try {
        const response = await axios.post('/api/auth/change-password/', passwordData)
        return response.data
      } catch (error) {
        this.error = error.response?.data || '修改密码失败'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})