<template>
  <div class="tieba-detail-page">
    <!-- 贴吧头部横幅 -->
    <div class="tieba-header">
      <div class="tieba-banner">
        <div class="banner-overlay"></div>
        <div class="tieba-info-container">
          <div class="tieba-basic-info">
            <div class="tieba-avatar">
              {{ tiebaInfo.name.charAt(0) }}
            </div>
            <div class="tieba-main-info">
              <h1 class="tieba-name">{{ tiebaInfo.name }}</h1>
              <div class="tieba-stats">
                <span class="stat-item">{{ tiebaInfo.member_count.toLocaleString() }} 成员</span>
                <span class="stat-item">{{ tiebaInfo.post_count.toLocaleString() }} 帖子</span>
                <span class="stat-item">{{ tiebaInfo.follow_count.toLocaleString() }} 关注</span>
              </div>
            </div>
            <div class="tieba-actions">
              <button 
                class="btn btn-primary join-btn"
                @click="handleJoin"
                :disabled="isJoined"
              >
                {{ isJoined ? '已加入' : '加入贴吧' }}
              </button>
              <button class="btn btn-secondary share-btn" @click="handleShare">
                <span class="icon">🔗</span> 分享
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="content-wrapper">
        <!-- 左侧内容区域 -->
        <div class="main-content">
          <!-- 帖子筛选和排序 -->
          <div class="filter-section">
            <div class="filter-tabs">
              <button 
                v-for="tab in tabs" 
                :key="tab.key"
                class="filter-tab"
                :class="{ active: activeTab === tab.key }"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
              </button>
            </div>
            <div class="sort-options">
              <label for="sort-select">排序方式：</label>
              <select id="sort-select" v-model="sortBy" class="sort-select">
                <option value="latest">最新发布</option>
                <option value="hot">最热</option>
                <option value="reply">回复最多</option>
              </select>
            </div>
          </div>

          <!-- 帖子列表 -->
          <div class="posts-list">
            <div 
              v-for="post in displayedPosts" 
              :key="post.id"
              class="post-item"
              @click="navigateToPost(post.id)"
            >
              <div class="post-header">
                <div class="post-author">
                  <img 
                    v-if="post.author.avatar" 
                    :src="post.author.avatar" 
                    :alt="post.author.username"
                    class="author-avatar"
                  />
                  <span v-else class="avatar-placeholder">
                    {{ post.author.username.charAt(0) }}
                  </span>
                  <div class="author-info">
                    <router-link 
                      :to="`/user/${post.author.id}`" 
                      class="author-name"
                    >
                      {{ post.author.username }}
                    </router-link>
                    <span class="post-time">{{ formatTime(post.created_at) }}</span>
                  </div>
                </div>
                <div class="post-tags" v-if="post.tags && post.tags.length > 0">
                  <span 
                    v-for="tag in post.tags" 
                    :key="tag.id"
                    class="tag"
                  >
                    #{{ tag.name }}
                  </span>
                </div>
              </div>
              
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt" v-if="post.content && !post.has_image">
                {{ stripHtml(post.content).substring(0, 100) }}...
              </p>
              
              <div class="post-media" v-if="post.has_image">
                <div class="images-grid" :class="getImageGridClass(post.image_count)">
                  <img 
                    v-for="(img, index) in post.images.slice(0, 3)" 
                    :key="index"
                    :src="img"
                    :alt="`${post.title} - 图片${index + 1}`"
                    class="post-image"
                  />
                  <div class="more-images" v-if="post.image_count > 3">
                    +{{ post.image_count - 3 }}
                  </div>
                </div>
              </div>
              
              <div class="post-footer">
                <div class="post-stats">
                  <span class="stat-item">
                    <span class="icon">👁️</span>
                    {{ formatNumber(post.view_count) }}
                  </span>
                  <span class="stat-item">
                    <span class="icon">💬</span>
                    {{ formatNumber(post.reply_count) }}
                  </span>
                  <span class="stat-item">
                    <span class="icon">👍</span>
                    {{ formatNumber(post.like_count) }}
                  </span>
                </div>
                <div class="post-hot" v-if="post.is_hot">
                  <span class="hot-badge">🔥 热门</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination" v-if="totalPages > 1">
            <button 
              class="page-btn"
              @click="currentPage = 1"
              :disabled="currentPage === 1"
            >
              首页
            </button>
            <button 
              class="page-btn"
              @click="currentPage--"
              :disabled="currentPage === 1"
            >
              上一页
            </button>
            <button 
              v-for="page in visiblePages" 
              :key="page"
              class="page-btn"
              :class="{ active: currentPage === page }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button 
              class="page-btn"
              @click="currentPage++"
              :disabled="currentPage === totalPages"
            >
              下一页
            </button>
            <button 
              class="page-btn"
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
            >
              末页
            </button>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="sidebar">
          <!-- 发帖按钮 -->
          <div class="create-post-btn-container">
            <router-link to="/create-post" class="btn btn-primary create-post-btn">
              <span class="icon">✍️</span> 发新帖
            </router-link>
          </div>

          <!-- 贴吧简介 -->
          <div class="tieba-description">
            <h3 class="section-title">贴吧简介</h3>
            <div class="description-content">
              <p>{{ tiebaInfo.description }}</p>
            </div>
          </div>

          <!-- 吧务团队 -->
          <div class="moderators">
            <h3 class="section-title">吧务团队</h3>
            <div class="moderators-list">
              <div class="moderator-item" v-for="mod in moderators" :key="mod.id">
                <img 
                  v-if="mod.avatar" 
                  :src="mod.avatar" 
                  :alt="mod.username"
                  class="mod-avatar"
                />
                <span v-else class="mod-avatar-placeholder">
                  {{ mod.username.charAt(0) }}
                </span>
                <div class="mod-info">
                  <router-link :to="`/user/${mod.id}`" class="mod-name">
                    {{ mod.username }}
                  </router-link>
                  <span class="mod-title">{{ mod.title }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 活跃用户 -->
          <div class="active-users">
            <h3 class="section-title">活跃用户</h3>
            <div class="active-users-list">
              <div 
                class="active-user-item" 
                v-for="user in activeUsers" 
                :key="user.id"
              >
                <img 
                  v-if="user.avatar" 
                  :src="user.avatar" 
                  :alt="user.username"
                  class="user-avatar"
                />
                <span v-else class="user-avatar-placeholder">
                  {{ user.username.charAt(0) }}
                </span>
                <router-link :to="`/user/${user.id}`" class="user-name">
                  {{ user.username }}
                </router-link>
                <span class="activity-score">{{ user.activity_score }}</span>
              </div>
            </div>
          </div>

          <!-- 相关贴吧 -->
          <div class="related-tiebas">
            <h3 class="section-title">相关贴吧</h3>
            <div class="related-tiebas-list">
              <router-link 
                v-for="relatedTieba in relatedTiebas" 
                :key="relatedTieba.id"
                :to="`/tieba/${relatedTieba.id}`"
                class="related-tieba-item"
              >
                <div class="related-tieba-avatar">
                  {{ relatedTieba.name.charAt(0) }}
                </div>
                <div class="related-tieba-info">
                  <div class="related-tieba-name">{{ relatedTieba.name }}</div>
                  <div class="related-tieba-stats">
                    {{ formatNumber(relatedTieba.member_count) }} 成员
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const route = useRoute()
const router = useRouter()

// 状态管理
const tiebaInfo = ref({
  id: parseInt(route.params.id),
  name: '数码科技',
  description: '讨论最新数码产品、手机、电脑、相机等科技产品的贴吧，分享使用心得和购买建议。',
  member_count: 1250000,
  post_count: 890000,
  follow_count: 567890,
  created_at: '2010-01-15T00:00:00Z'
})

const isJoined = ref(false)
const activeTab = ref('all')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(20)

// 标签页
const tabs = [
  { key: 'all', label: '全部' },
  { key: 'hot', label: '热门' },
  { key: 'recommend', label: '推荐' },
  { key: 'image', label: '图片' }
]

// 模拟帖子数据
const generateMockPosts = (count = 50) => {
  const titles = [
    '2023年最值得购买的手机推荐',
    '小米14 Pro开箱体验',
    'iPhone 15 Pro Max深度评测',
    '苹果新品发布会直播讨论',
    '三星Galaxy S23 Ultra使用一周感受',
    '华为Mate60 Pro值得买吗？',
    '2023年旗舰手机性能对比',
    '手机摄影技巧分享',
    '如何延长手机电池寿命？',
    '2023年新出的性价比手机推荐'
  ]
  
  const authors = [
    { id: 1, username: '数码达人', avatar: null },
    { id: 2, username: '科技爱好者', avatar: null },
    { id: 3, username: '手机控', avatar: null },
    { id: 4, username: '摄影小白', avatar: null },
    { id: 5, username: '科技评测师', avatar: null }
  ]
  
  const tags = [
    { id: 1, name: '手机推荐' },
    { id: 2, name: '数码评测' },
    { id: 3, name: '开箱体验' },
    { id: 4, name: '摄影技巧' },
    { id: 5, name: '使用心得' }
  ]
  
  const posts = []
  
  for (let i = 1; i <= count; i++) {
    const hasImage = Math.random() > 0.5
    const imageCount = hasImage ? Math.floor(Math.random() * 9) + 1 : 0
    const postTags = []
    const tagCount = Math.floor(Math.random() * 3) + 1
    
    for (let j = 0; j < tagCount; j++) {
      const randomTag = tags[Math.floor(Math.random() * tags.length)]
      if (!postTags.some(tag => tag.id === randomTag.id)) {
        postTags.push(randomTag)
      }
    }
    
    posts.push({
      id: i,
      title: titles[Math.floor(Math.random() * titles.length)],
      content: '<p>这是一篇关于数码产品的详细讨论，包含了产品的各种特点和使用体验...</p>',
      author: authors[Math.floor(Math.random() * authors.length)],
      tags: postTags,
      view_count: Math.floor(Math.random() * 10000),
      reply_count: Math.floor(Math.random() * 500),
      like_count: Math.floor(Math.random() * 1000),
      has_image,
      image_count: imageCount,
      images: hasImage ? Array(imageCount).fill('https://via.placeholder.com/300') : [],
      is_hot: Math.random() > 0.8,
      created_at: dayjs().subtract(Math.floor(Math.random() * 7), 'day').toISOString()
    })
  }
  
  return posts
}

const allPosts = ref(generateMockPosts())

// 吧务团队
const moderators = ref([
  { id: 101, username: '数码达人', avatar: null, title: '吧主' },
  { id: 102, username: '科技管理员', avatar: null, title: '小吧主' },
  { id: 103, username: '数码编辑', avatar: null, title: '小吧主' },
  { id: 104, username: '摄影达人', avatar: null, title: '图片小编' }
])

// 活跃用户
const activeUsers = ref([
  { id: 201, username: '手机控', avatar: null, activity_score: 980 },
  { id: 202, username: '电脑迷', avatar: null, activity_score: 870 },
  { id: 203, username: '摄影爱好者', avatar: null, activity_score: 760 },
  { id: 204, username: '科技新闻眼', avatar: null, activity_score: 650 },
  { id: 205, username: '数码小白', avatar: null, activity_score: 540 }
])

// 相关贴吧
const relatedTiebas = ref([
  { id: 2, name: '手机吧', member_count: 2300000 },
  { id: 3, name: '摄影吧', member_count: 1800000 },
  { id: 4, name: '电脑吧', member_count: 1500000 },
  { id: 5, name: '苹果吧', member_count: 1200000 }
])

// 计算属性
const filteredPosts = computed(() => {
  let posts = [...allPosts.value]
  
  // 根据标签筛选
  if (activeTab.value === 'hot') {
    posts = posts.filter(post => post.is_hot)
  } else if (activeTab.value === 'image') {
    posts = posts.filter(post => post.has_image)
  } else if (activeTab.value === 'recommend') {
    posts = posts.filter(post => post.like_count > 500)
  }
  
  // 排序
  posts.sort((a, b) => {
    if (sortBy.value === 'latest') {
      return new Date(b.created_at) - new Date(a.created_at)
    } else if (sortBy.value === 'hot') {
      return b.like_count - a.like_count
    } else if (sortBy.value === 'reply') {
      return b.reply_count - a.reply_count
    }
    return 0
  })
  
  return posts
})

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / pageSize.value)
})

const displayedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredPosts.value.slice(startIndex, endIndex)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, 5)
    } else if (current >= total - 2) {
      pages.push(total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(current - 2, current - 1, current, current + 1, current + 2)
    }
  }
  
  return pages
})

// 方法
const formatTime = (time) => {
  return dayjs(time).fromNow()
}

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const stripHtml = (html) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

const getImageGridClass = (count) => {
  if (count === 1) return 'grid-1'
  if (count === 2) return 'grid-2'
  return 'grid-3'
}

const navigateToPost = (id) => {
  router.push(`/post/${id}`)
}

const handleJoin = () => {
  isJoined.value = true
  tiebaInfo.value.member_count++
  // 实际项目中调用API
}

const handleShare = () => {
  alert('分享功能开发中')
}

// 监听分页和排序变化
const watchForChanges = () => {
  // 重置到第一页当标签或排序改变时
  activeTab.value = 'all'
  sortBy.value = 'latest'
  currentPage.value = 1
}

// 组件挂载
onMounted(() => {
  // 实际项目中，这里应该调用API获取真实数据
  // try {
  //   await fetchTiebaDetail(route.params.id)
  //   await fetchPosts(route.params.id)
  // } catch (error) {
  //   console.error('获取数据失败:', error)
  // }
})
</script>

<style scoped>
.tieba-detail-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 贴吧头部横幅 */
.tieba-header {
  width: 100%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  position: relative;
}

.tieba-banner {
  position: relative;
  height: 200px;
  background: url('https://via.placeholder.com/1200x200') center/cover no-repeat;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.tieba-info-container {
  position: absolute;
  bottom: -60px;
  left: 0;
  right: 0;
  padding: 0 2rem;
}

.tieba-basic-info {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  gap: 1.5rem;
}

.tieba-avatar {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.tieba-main-info {
  flex: 1;
}

.tieba-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.tieba-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tieba-actions {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.join-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
}

.share-btn {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
}

/* 内容区域 */
.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  padding-top: 80px;
  padding-bottom: 2rem;
}

/* 左侧主要内容 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 筛选区域 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.filter-tab {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.filter-tab:hover {
  background: #f0f0f0;
  color: var(--text-primary);
}

.filter-tab.active {
  background: var(--primary-color);
  color: white;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.sort-select {
  padding: 0.4rem 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  outline: none;
}

/* 帖子列表 */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.author-name {
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.author-name:hover {
  color: var(--primary-color);
}

.post-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.2rem 0.6rem;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.post-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.post-excerpt {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.post-media {
  margin-bottom: 1rem;
}

.images-grid {
  display: grid;
  gap: 0.5rem;
  border-radius: 8px;
  overflow: hidden;
}

.grid-1 {
  grid-template-columns: 1fr;
}

.grid-2 {
  grid-template-columns: 1fr 1fr;
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.post-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.more-images {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px 0 8px 0;
  font-weight: bold;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.post-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.post-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.post-hot .hot-badge {
  background: linear-gradient(135deg, #ff6b6b, #ffa502);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.page-btn:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: var(--primary-color);
}

.page-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.create-post-btn-container {
  margin-bottom: 1rem;
}

.create-post-btn {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tieba-description,
.moderators,
.active-users,
.related-tiebas {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.description-content p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.moderators-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.moderator-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mod-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.mod-avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
}

.mod-info {
  flex: 1;
}

.mod-name {
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.mod-name:hover {
  color: var(--primary-color);
}

.mod-title {
  font-size: 0.8rem;
  color: var(--primary-color);
  background: rgba(0, 122, 255, 0.1);
  padding: 0.1rem 0.5rem;
  border-radius: 8px;
  display: inline-block;
}

.active-users-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.active-user-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
}

.user-name {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.user-name:hover {
  color: var(--primary-color);
}

.activity-score {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent-color);
}

.related-tiebas-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.related-tieba-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.related-tieba-item:hover {
  background: #f8f9fa;
  transform: translateX(3px);
}

.related-tieba-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
}

.related-tieba-info {
  flex: 1;
}

.related-tieba-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.related-tieba-stats {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr 280px;
  }
  
  .tieba-info-container {
    padding: 0 1.5rem;
  }
  
  .tieba-avatar {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .tieba-banner {
    height: 150px;
  }
  
  .tieba-info-container {
    padding: 0 1rem;
  }
  
  .tieba-basic-info {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .tieba-main-info {
    width: 100%;
  }
  
  .tieba-stats {
    justify-content: center;
  }
  
  .tieba-actions {
    width: 100%;
    justify-content: center;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-tabs {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .sort-options {
    justify-content: center;
  }
  
  .post-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .post-tags {
    width: 100%;
  }
  
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .tieba-basic-info {
    padding: 1.5rem;
  }
  
  .tieba-name {
    font-size: 1.5rem;
  }
  
  .tieba-stats {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  
  .tieba-actions {
    flex-direction: column;
  }
  
  .filter-tab {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .post-item {
    padding: 1.25rem;
  }
  
  .post-title {
    font-size: 1rem;
  }
  
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
  
  .post-image {
    height: 150px;
  }
  
  .post-stats {
    gap: 1rem;
    font-size: 0.8rem;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .page-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
  }
}
</style>