import { defineStore } from 'pinia'
import axios from 'axios'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    currentPost: null,
    comments: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    filters: {
      sortBy: 'created_at',
      order: 'desc',
      tiebaId: null
    }
  }),
  
  getters: {
    sortedPosts: (state) => {
      return [...state.posts].sort((a, b) => {
        if (state.filters.order === 'desc') {
          return new Date(b[state.filters.sortBy]) - new Date(a[state.filters.sortBy])
        } else {
          return new Date(a[state.filters.sortBy]) - new Date(b[state.filters.sortBy])
        }
      })
    },
    isLoading: (state) => state.loading
  },
  
  actions: {
    // 获取帖子列表
    async fetchPosts(params = {}) {
      this.loading = true
      this.error = null
      try {
        const queryParams = {
          page: this.page,
          sort_by: this.filters.sortBy,
          order: this.filters.order,
          ...params
        }
        
        if (this.filters.tiebaId) {
          queryParams.tieba_id = this.filters.tiebaId
        }
        
        const response = await axios.get('/api/posts/', { params: queryParams })
        this.posts = response.data.results
        this.totalPages = Math.ceil(response.data.count / 20)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.detail || '获取帖子列表失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取热门帖子
    async fetchHotPosts() {
      this.loading = true
      try {
        const response = await axios.get('/api/posts/hot/')
        return response.data
      } catch (error) {
        this.error = '获取热门帖子失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取帖子详情
    async fetchPostDetail(postId) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`/api/posts/${postId}/`)
        this.currentPost = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.detail || '获取帖子详情失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取帖子评论
    async fetchComments(postId, page = 1) {
      this.loading = true
      try {
        const response = await axios.get(`/api/posts/${postId}/comments/`, {
          params: { page }
        })
        this.comments = response.data.results
        return response.data
      } catch (error) {
        this.error = '获取评论失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 创建帖子
    async createPost(postData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/posts/', postData)
        // 添加到帖子列表开头
        this.posts.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || '创建帖子失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 编辑帖子
    async updatePost(postId, postData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.put(`/api/posts/${postId}/`, postData)
        
        // 更新本地帖子数据
        const index = this.posts.findIndex(post => post.id === postId)
        if (index !== -1) {
          this.posts[index] = response.data
        }
        
        if (this.currentPost && this.currentPost.id === postId) {
          this.currentPost = response.data
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data || '更新帖子失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 删除帖子
    async deletePost(postId) {
      this.loading = true
      try {
        await axios.delete(`/api/posts/${postId}/`)
        
        // 从本地列表中移除
        this.posts = this.posts.filter(post => post.id !== postId)
        
        if (this.currentPost && this.currentPost.id === postId) {
          this.currentPost = null
        }
        
        return true
      } catch (error) {
        this.error = '删除帖子失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 发布评论
    async createComment(postId, commentData) {
      this.loading = true
      try {
        const response = await axios.post(`/api/posts/${postId}/comments/`, commentData)
        
        // 添加到评论列表
        this.comments.unshift(response.data)
        
        // 更新帖子的回复数
        if (this.currentPost && this.currentPost.id === postId) {
          this.currentPost.reply_count += 1
        }
        
        return response.data
      } catch (error) {
        this.error = '发布评论失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 点赞帖子
    async likePost(postId) {
      try {
        const response = await axios.post(`/api/posts/${postId}/like/`)
        
        // 更新本地点赞数
        const updatePostLikeCount = (post) => {
          if (post && post.id === postId) {
            post.like_count = response.data.like_count
            post.is_liked = response.data.is_liked
          }
        }
        
        updatePostLikeCount(this.currentPost)
        this.posts = this.posts.map(post => {
          if (post.id === postId) {
            return { ...post, ...response.data }
          }
          return post
        })
        
        return response.data
      } catch (error) {
        throw error
      }
    },
    
    // 设置过滤条件
    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },
    
    // 切换页码
    setPage(newPage) {
      this.page = newPage
    }
  }
})