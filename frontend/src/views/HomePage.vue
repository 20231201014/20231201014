<template>
  <div class="homepage">
    <!-- 轮播图/推荐区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>发现你的兴趣社区</h1>
        <p>加入百度贴吧，与志同道合的朋友一起交流、分享和探索</p>
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索感兴趣的内容"
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            搜索
          </button>
        </div>
      </div>
    </section>
    
    <!-- 主要内容区域 -->
    <div class="container">
      <div class="main-content">
        <!-- 热门贴吧列表 -->
        <div class="hot-tiebas">
          <div class="section-header">
            <h2 class="section-title">
              <span class="icon">🏠</span>
              热门贴吧
            </h2>
            <router-link to="/tiebas" class="more-link">查看更多 →</router-link>
          </div>
          
          <div class="tieba-grid">
            <div 
              v-for="tieba in hotTiebas" 
              :key="tieba.id"
              class="tieba-item"
              @click="navigateToTieba(tieba.id)"
            >
              <div class="tieba-avatar">{{ tieba.name.charAt(0) }}</div>
              <h3 class="tieba-name">{{ tieba.name }}</h3>
              <p class="tieba-stats">{{ tieba.member_count }} 成员</p>
            </div>
          </div>
        </div>
        
        <!-- 热门帖子列表 -->
        <div class="hot-posts">
          <div class="section-header">
            <h2 class="section-title">
              <span class="icon">🔥</span>
              热门帖子
            </h2>
            <div class="sort-options">
              <button 
                :class="['sort-btn', { active: sortBy === 'hot' }]"
                @click="sortBy = 'hot'"
              >
                热门
              </button>
              <button 
                :class="['sort-btn', { active: sortBy === 'latest' }]"
                @click="sortBy = 'latest'"
              >
                最新
              </button>
            </div>
          </div>
          
          <div class="post-list">
            <div 
              v-for="post in hotPosts" 
              :key="post.id"
              class="post-item"
              @click="navigateToPost(post.id)"
            >
              <div class="post-header">
                <h3 class="post-title">{{ post.title }}</h3>
                <div class="post-meta">
                  <span class="author">{{ post.author.username }}</span>
                  <span class="dot">•</span>
                  <span class="time">{{ formatTime(post.created_at) }}</span>
                </div>
              </div>
              <p class="post-excerpt">{{ getExcerpt(post.content) }}</p>
              <div class="post-stats">
                <span class="stat-item">
                  <span class="icon">👁️</span>
                  {{ post.view_count }}
                </span>
                <span class="stat-item">
                  <span class="icon">💬</span>
                  {{ post.reply_count }}
                </span>
                <span class="stat-item">
                  <span class="icon">👍</span>
                  {{ post.like_count }}
                </span>
                <span class="tieba-name">{{ post.tieba.name }}</span>
              </div>
            </div>
          </div>
          
          <div class="load-more">
            <button class="btn btn-secondary" @click="loadMorePosts">
              加载更多
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置 dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const router = useRouter()
const postStore = usePostStore()

// 状态管理
const searchQuery = ref('')
const sortBy = ref('hot')
const hotTiebas = ref([])
const hotPosts = ref([])
const loading = ref(false)

// 模拟热门贴吧数据
const mockTiebas = [
  { id: 1, name: '数码科技', member_count: 1250000 },
  { id: 2, name: '电影吧', member_count: 890000 },
  { id: 3, name: '游戏吧', member_count: 1560000 },
  { id: 4, name: '美食吧', member_count: 780000 },
  { id: 5, name: '旅行吧', member_count: 650000 },
  { id: 6, name: '健身吧', member_count: 450000 },
  { id: 7, name: '读书吧', member_count: 320000 },
  { id: 8, name: '音乐吧', member_count: 540000 },
]

// 模拟热门帖子数据
const mockPosts = [
  {
    id: 1,
    title: '2023年最值得购买的手机推荐',
    content: '2023年已经过去大半，这一年里各大手机厂商都推出了不少旗舰产品。今天我就来为大家总结一下2023年最值得购买的几款手机...',
    author: { username: '数码达人' },
    tieba: { name: '数码科技' },
    view_count: 12500,
    reply_count: 890,
    like_count: 3450,
    created_at: '2023-10-15T10:30:00Z'
  },
  {
    id: 2,
    title: '《奥本海默》观影感受：诺兰的又一力作',
    content: '终于看了期待已久的《奥本海默》，诺兰果然没有让我们失望。这部电影无论是从叙事结构还是视觉效果都堪称完美...',
    author: { username: '影评人' },
    tieba: { name: '电影吧' },
    view_count: 8900,
    reply_count: 567,
    like_count: 2340,
    created_at: '2023-10-14T15:45:00Z'
  },
  {
    id: 3,
    title: '《原神》4.2版本更新内容汇总',
    content: '《原神》4.2版本终于要更新了！这次更新不仅有新角色，还有新地图、新任务。下面我就来为大家详细介绍一下...',
    author: { username: '原神玩家' },
    tieba: { name: '游戏吧' },
    view_count: 15600,
    reply_count: 1234,
    like_count: 4560,
    created_at: '2023-10-13T09:20:00Z'
  },
  {
    id: 4,
    title: '分享一道简单又好吃的家常菜：红烧肉',
    content: '红烧肉是一道经典的家常菜，色泽红亮，肥而不腻。今天我就来分享一下我的独门做法...',
    author: { username: '美食家' },
    tieba: { name: '美食吧' },
    view_count: 7800,
    reply_count: 432,
    like_count: 1980,
    created_at: '2023-10-12T18:30:00Z'
  },
]

// 格式化时间
const formatTime = (time) => {
  return dayjs(time).fromNow()
}

// 获取内容摘要
const getExcerpt = (content) => {
  // 去除HTML标签
  const plainText = content.replace(/<[^>]*>/g, '')
  return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText
}

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      name: 'SearchResult', 
      query: { q: searchQuery.value.trim() }
    })
  }
}

// 导航到贴吧详情
const navigateToTieba = (id) => {
  router.push(`/tieba/${id}`)
}

// 导航到帖子详情
const navigateToPost = (id) => {
  router.push(`/post/${id}`)
}

// 加载更多帖子
const loadMorePosts = () => {
  loading.value = true
  // 模拟加载延迟
  setTimeout(() => {
    // 复制现有帖子并修改ID以模拟新数据
    const newPosts = mockPosts.map(post => ({
      ...post,
      id: post.id + hotPosts.value.length,
      title: `${post.title} (更多)`,
      created_at: new Date().toISOString()
    }))
    hotPosts.value = [...hotPosts.value, ...newPosts]
    loading.value = false
  }, 1000)
}

// 组件挂载时初始化数据
onMounted(() => {
  // 初始化热门贴吧数据
  hotTiebas.value = mockTiebas
  
  // 初始化热门帖子数据
  hotPosts.value = mockPosts
  
  // 实际项目中，这里应该调用API获取真实数据
  // try {
  //   await postStore.fetchHotPosts()
  // } catch (error) {
  //   console.error('获取热门帖子失败:', error)
  // }
})
</script>

<style scoped>
.homepage {
  min-height: 100vh;
}

/* 轮播图区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: clamp(3rem, 10vw, 5rem) 20px;
  text-align: center;
  margin-bottom: clamp(2rem, 6vw, 3rem);
}

.hero-content h1 {
  font-size: clamp(1.875rem, 5vw, 3rem);
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-content p {
  font-size: clamp(1rem, 3vw, 1.25rem);
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.search-box {
  display: flex;
  max-width: min(600px, 90vw);
  width: 100%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.search-input {
  flex: 1;
  padding: clamp(0.75rem, 3vw, 1rem) clamp(1rem, 4vw, 1.25rem);
  border: none;
  font-size: clamp(0.875rem, 3vw, 1rem);
  outline: none;
  background: transparent;
  color: var(--text-primary);
  min-height: 44px;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  padding: clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 4vw, 2rem);
  font-size: clamp(0.875rem, 3vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

/* 主要内容区域 */
.main-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
  gap: clamp(1rem, 4vw, 2rem);
  margin-bottom: clamp(2rem, 6vw, 3rem);
}

/* 热门贴吧列表 */
.hot-tiebas {
  background: white;
  border-radius: 12px;
  padding: clamp(1.5rem, 4vw, 2rem);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-title {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: bold;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.25rem;
}

.more-link {
  text-decoration: none;
  color: var(--primary-color);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.more-link:hover {
  transform: translateX(3px);
}

.tieba-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(120px, 100%), 1fr));
  gap: clamp(0.75rem, 2vw, 1rem);
  flex: 1;
}

.tieba-item {
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tieba-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tieba-avatar {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin: 0 auto 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
}

.tieba-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.tieba-stats {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 热门帖子列表 */
.hot-posts {
  background: white;
  border-radius: 12px;
  padding: clamp(1.5rem, 4vw, 2rem);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.sort-options {
  display: flex;
  gap: 0.5rem;
}

.sort-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 16px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-btn.active,
.sort-btn:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  padding: 1rem;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.1);
}

.post-header {
  margin-bottom: 0.75rem;
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
  gap: 0.5rem;
}

.dot {
  font-size: 0.5rem;
}

.post-excerpt {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.load-more {
  margin-top: 1.5rem;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .tieba-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
  }
  
  .tieba-avatar {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }
  
  .post-stats {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .hero-content h1 {
    font-size: 1.75rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
  
  .search-box {
    border-radius: 20px;
  }
  
  .hot-tiebas,
  .hot-posts {
    padding: 1rem;
  }
  
  .tieba-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>