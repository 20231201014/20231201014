<template>
  <div class="user-center-page">
    <!-- 用户头部信息 -->
    <div class="user-header">
      <div class="user-banner">
        <div class="banner-overlay"></div>
        <div class="user-info-container">
          <div class="user-basic-info">
            <img 
              v-if="userInfo.avatar" 
              :src="userInfo.avatar" 
              :alt="userInfo.username"
              class="user-avatar"
            />
            <div v-else class="user-avatar-placeholder">
              {{ userInfo.username.charAt(0) }}
            </div>
            
            <div class="user-main-info">
              <h1 class="user-name">{{ userInfo.username }}</h1>
              <div class="user-meta">
                <span class="user-id">ID: {{ userInfo.id }}</span>
                <span class="user-level">Lv.{{ userInfo.level }}</span>
                <span class="user-reg-date">注册于 {{ formatDate(userInfo.registered_at) }}</span>
              </div>
              
              <div class="user-bio" v-if="userInfo.bio">
                {{ userInfo.bio }}
              </div>
              
              <div class="user-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ formatNumber(userInfo.post_count) }}</span>
                  <span class="stat-label">帖子</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ formatNumber(userInfo.follower_count) }}</span>
                  <span class="stat-label">粉丝</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ formatNumber(userInfo.following_count) }}</span>
                  <span class="stat-label">关注</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ formatNumber(userInfo.like_received) }}</span>
                  <span class="stat-label">获赞</span>
                </div>
              </div>
            </div>
            
            <div class="user-actions" v-if="!isCurrentUser">
              <button 
                class="btn btn-primary follow-btn"
                @click="handleFollow"
                :disabled="isFollowing"
              >
                {{ isFollowing ? '已关注' : '关注' }}
              </button>
              <button class="btn btn-secondary message-btn" @click="handleMessage">
                <span class="icon">💬</span> 私信
              </button>
            </div>
            
            <div class="user-actions" v-else>
              <router-link to="/user/edit" class="btn btn-primary edit-btn">
                <span class="icon">✏️</span> 编辑资料
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="content-wrapper">
        <!-- 左侧导航 -->
        <div class="sidebar">
          <div class="user-nav">
            <button 
              v-for="navItem in navItems" 
              :key="navItem.key"
              class="nav-item"
              :class="{ active: activeTab === navItem.key }"
              @click="activeTab = navItem.key"
            >
              <span class="nav-icon">{{ navItem.icon }}</span>
              <span class="nav-label">{{ navItem.label }}</span>
              <span class="nav-badge" v-if="navItem.badge">{{ navItem.badge }}</span>
            </button>
          </div>
          
          <!-- 用户成就 -->
          <div class="achievements-section">
            <h3 class="section-title">我的成就</h3>
            <div class="achievements-list">
              <div 
                v-for="achievement in userAchievements" 
                :key="achievement.id"
                class="achievement-item"
                :class="{ unlocked: achievement.unlocked }"
                :title="achievement.description"
              >
                <span class="achievement-icon">{{ achievement.icon }}</span>
                <span class="achievement-name">{{ achievement.name }}</span>
              </div>
            </div>
          </div>
          
          <!-- 常用贴吧 -->
          <div class="frequent-tiebas">
            <h3 class="section-title">常用贴吧</h3>
            <div class="tiebas-list">
              <router-link 
                v-for="tieba in frequentTiebas" 
                :key="tieba.id"
                :to="`/tieba/${tieba.id}`"
                class="tieba-item"
              >
                <div class="tieba-avatar">{{ tieba.name.charAt(0) }}</div>
                <div class="tieba-info">
                  <div class="tieba-name">{{ tieba.name }}</div>
                  <div class="tieba-activity">{{ tieba.activity }}</div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- 右侧内容区域 -->
        <div class="main-content">
          <!-- 发布的帖子 -->
          <div class="tab-content" v-show="activeTab === 'posts'">
            <div class="tab-header">
              <h2 class="tab-title">我的帖子</h2>
              <div class="tab-actions">
                <router-link to="/create-post" class="btn btn-primary create-post-btn">
                  <span class="icon">✍️</span> 发新帖
                </router-link>
              </div>
            </div>
            
            <div class="posts-filter">
              <button 
                v-for="filter in postFilters" 
                :key="filter.key"
                class="filter-btn"
                :class="{ active: activePostFilter === filter.key }"
                @click="activePostFilter = filter.key"
              >
                {{ filter.label }}
              </button>
            </div>
            
            <div class="posts-list">
              <div 
                v-for="post in displayedPosts" 
                :key="post.id"
                class="post-item"
              >
                <div class="post-content">
                  <div class="post-header">
                    <router-link 
                      :to="`/tieba/${post.tieba.id}`" 
                      class="tieba-link"
                    >
                      # {{ post.tieba.name }}
                    </router-link>
                    <span class="post-time">{{ formatTime(post.created_at) }}</span>
                  </div>
                  <h3 class="post-title">
                    <router-link :to="`/post/${post.id}`">
                      {{ post.title }}
                    </router-link>
                  </h3>
                  <p class="post-excerpt">
                    {{ stripHtml(post.content).substring(0, 100) }}...
                  </p>
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
                    <div class="post-actions">
                      <button class="action-btn" @click="handleEditPost(post.id)">
                        <span class="icon">✏️</span>
                        编辑
                      </button>
                      <button class="action-btn delete-btn" @click="handleDeletePost(post.id)">
                        <span class="icon">🗑️</span>
                        删除
                      </button>
                    </div>
                  </div>
                </div>
                <div class="post-status" v-if="!post.published">
                  <span class="status-badge">草稿</span>
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
          
          <!-- 收藏的内容 -->
          <div class="tab-content" v-show="activeTab === 'collections'">
            <div class="tab-header">
              <h2 class="tab-title">我的收藏</h2>
            </div>
            
            <div class="collections-filter">
              <button 
                v-for="filter in collectionFilters" 
                :key="filter.key"
                class="filter-btn"
                :class="{ active: activeCollectionFilter === filter.key }"
                @click="activeCollectionFilter = filter.key"
              >
                {{ filter.label }}
              </button>
            </div>
            
            <div class="collections-list">
              <div 
                v-for="collection in collections" 
                :key="collection.id"
                class="collection-item"
              >
                <div class="collection-content">
                  <div class="collection-header">
                    <router-link 
                      :to="`/tieba/${collection.tieba.id}`" 
                      class="tieba-link"
                    >
                      # {{ collection.tieba.name }}
                    </router-link>
                    <span class="collect-time">收藏于 {{ formatTime(collection.collected_at) }}</span>
                  </div>
                  <h3 class="collection-title">
                    <router-link :to="`/post/${collection.id}`">
                      {{ collection.title }}
                    </router-link>
                  </h3>
                  <p class="collection-excerpt">
                    {{ stripHtml(collection.content).substring(0, 100) }}...
                  </p>
                  <div class="collection-footer">
                    <div class="post-author">
                      <img 
                        v-if="collection.author.avatar" 
                        :src="collection.author.avatar" 
                        :alt="collection.author.username"
                        class="author-avatar"
                      />
                      <span v-else class="avatar-placeholder">
                        {{ collection.author.username.charAt(0) }}
                      </span>
                      <router-link 
                        :to="`/user/${collection.author.id}`" 
                        class="author-name"
                      >
                        {{ collection.author.username }}
                      </router-link>
                    </div>
                    <button class="action-btn delete-btn" @click="handleUncollect(collection.id)">
                      <span class="icon">⭐</span>
                      取消收藏
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 我的回复 -->
          <div class="tab-content" v-show="activeTab === 'replies'">
            <div class="tab-header">
              <h2 class="tab-title">我的回复</h2>
            </div>
            
            <div class="replies-list">
              <div 
                v-for="reply in replies" 
                :key="reply.id"
                class="reply-item"
              >
                <div class="reply-content">
                  <div class="reply-header">
                    <router-link 
                      :to="`/tieba/${reply.post.tieba.id}`" 
                      class="tieba-link"
                    >
                      # {{ reply.post.tieba.name }}
                    </router-link>
                    <span class="reply-time">{{ formatTime(reply.created_at) }}</span>
                  </div>
                  <div class="reply-to-post">
                    <span class="reply-to-label">回复了:</span>
                    <router-link :to="`/post/${reply.post.id}`" class="post-title">
                      {{ reply.post.title }}
                    </router-link>
                  </div>
                  <p class="reply-text">{{ reply.content }}</p>
                  <div class="reply-footer">
                    <div class="reply-stats">
                      <span class="stat-item">
                        <span class="icon">👍</span>
                        {{ formatNumber(reply.like_count) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 我的关注 -->
          <div class="tab-content" v-show="activeTab === 'following'">
            <div class="tab-header">
              <h2 class="tab-title">我的关注</h2>
            </div>
            
            <div class="following-list">
              <div 
                v-for="user in following" 
                :key="user.id"
                class="following-item"
              >
                <div class="user-info">
                  <img 
                    v-if="user.avatar" 
                    :src="user.avatar" 
                    :alt="user.username"
                    class="user-avatar-small"
                  />
                  <span v-else class="avatar-placeholder-small">
                    {{ user.username.charAt(0) }}
                  </span>
                  <div class="user-details">
                    <router-link :to="`/user/${user.id}`" class="username">
                      {{ user.username }}
                    </router-link>
                    <div class="user-bio-small">{{ user.bio || '暂无简介' }}</div>
                  </div>
                </div>
                <button class="btn btn-secondary unfollow-btn" @click="handleUnfollow(user.id)">
                  已关注
                </button>
              </div>
            </div>
          </div>
          
          <!-- 我的粉丝 -->
          <div class="tab-content" v-show="activeTab === 'followers'">
            <div class="tab-header">
              <h2 class="tab-title">我的粉丝</h2>
            </div>
            
            <div class="followers-list">
              <div 
                v-for="user in followers" 
                :key="user.id"
                class="follower-item"
              >
                <div class="user-info">
                  <img 
                    v-if="user.avatar" 
                    :src="user.avatar" 
                    :alt="user.username"
                    class="user-avatar-small"
                  />
                  <span v-else class="avatar-placeholder-small">
                    {{ user.username.charAt(0) }}
                  </span>
                  <div class="user-details">
                    <router-link :to="`/user/${user.id}`" class="username">
                      {{ user.username }}
                    </router-link>
                    <div class="user-bio-small">{{ user.bio || '暂无简介' }}</div>
                  </div>
                </div>
                <button 
                  class="btn btn-primary follow-btn"
                  @click="handleFollow(user.id)"
                  :disabled="isFollowingUser(user.id)"
                >
                  {{ isFollowingUser(user.id) ? '已关注' : '关注' }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- 设置页面 -->
          <div class="tab-content" v-show="activeTab === 'settings'">
            <div class="tab-header">
              <h2 class="tab-title">账号设置</h2>
            </div>
            
            <div class="settings-form">
              <div class="settings-section">
                <h3 class="section-title">个人信息</h3>
                <div class="form-group">
                  <label class="form-label">头像</label>
                  <div class="avatar-upload">
                    <img 
                      v-if="userInfo.avatar" 
                      :src="userInfo.avatar" 
                      :alt="userInfo.username"
                      class="current-avatar"
                    />
                    <div v-else class="avatar-placeholder-large">
                      {{ userInfo.username.charAt(0) }}
                    </div>
                    <button class="btn btn-secondary upload-btn">更换头像</button>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">用户名</label>
                  <input 
                    type="text" 
                    v-model="userInfo.username" 
                    class="form-input"
                    disabled
                  />
                  <div class="form-hint">用户名不可修改</div>
                </div>
                <div class="form-group">
                  <label class="form-label">个性签名</label>
                  <textarea 
                    v-model="userInfo.bio" 
                    class="form-textarea"
                    rows="3"
                    placeholder="介绍一下自己吧..."
                  ></textarea>
                </div>
              </div>
              
              <div class="settings-section">
                <h3 class="section-title">账号安全</h3>
                <div class="security-item">
                  <div class="security-info">
                    <div class="security-label">修改密码</div>
                    <div class="security-desc">定期修改密码可以保护账号安全</div>
                  </div>
                  <button class="btn btn-secondary action-btn">修改</button>
                </div>
                <div class="security-item">
                  <div class="security-info">
                    <div class="security-label">绑定手机</div>
                    <div class="security-desc">{{ userInfo.phone ? '已绑定 ' + userInfo.phone : '未绑定' }}</div>
                  </div>
                  <button class="btn btn-secondary action-btn">绑定</button>
                </div>
                <div class="security-item">
                  <div class="security-info">
                    <div class="security-label">绑定邮箱</div>
                    <div class="security-desc">{{ userInfo.email ? '已绑定 ' + userInfo.email : '未绑定' }}</div>
                  </div>
                  <button class="btn btn-secondary action-btn">绑定</button>
                </div>
              </div>
              
              <div class="settings-actions">
                <button class="btn btn-primary save-btn">保存设置</button>
              </div>
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
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 状态管理
const userId = computed(() => parseInt(route.params.id || userStore.userInfo?.id))
const isCurrentUser = computed(() => userId.value === userStore.userInfo?.id)
const userInfo = ref({
  id: 1,
  username: '数码达人',
  avatar: null,
  bio: '热爱科技，分享数码产品使用体验和技巧。',
  level: 5,
  post_count: 128,
  follower_count: 5678,
  following_count: 156,
  like_received: 12345,
  registered_at: '2020-01-15T00:00:00Z',
  phone: '138****1234',
  email: 'user***@example.com'
})

const activeTab = ref('posts')
const currentPage = ref(1)
const pageSize = ref(10)
const isFollowing = ref(false)
const activePostFilter = ref('all')
const activeCollectionFilter = ref('all')

// 导航项
const navItems = [
  { key: 'posts', label: '我的帖子', icon: '📝' },
  { key: 'collections', label: '我的收藏', icon: '⭐' },
  { key: 'replies', label: '我的回复', icon: '💬' },
  { key: 'following', label: '我的关注', icon: '👥', badge: 156 },
  { key: 'followers', label: '我的粉丝', icon: '👁️', badge: 5678 },
  { key: 'settings', label: '账号设置', icon: '⚙️' }
]

// 帖子筛选
const postFilters = [
  { key: 'all', label: '全部' },
  { key: 'published', label: '已发布' },
  { key: 'drafts', label: '草稿' }
]

// 收藏筛选
const collectionFilters = [
  { key: 'all', label: '全部' },
  { key: 'posts', label: '帖子' },
  { key: 'tiebas', label: '贴吧' }
]

// 模拟帖子数据
const generateMockPosts = (count = 30) => {
  const titles = [
    '2023年最值得购买的手机推荐',
    '小米14 Pro开箱体验',
    'iPhone 15 Pro Max深度评测',
    '苹果新品发布会直播讨论',
    '三星Galaxy S23 Ultra使用一周感受'
  ]
  
  const tiebas = [
    { id: 1, name: '数码科技' },
    { id: 2, name: '手机吧' },
    { id: 3, name: '摄影吧' }
  ]
  
  const posts = []
  
  for (let i = 1; i <= count; i++) {
    posts.push({
      id: i,
      title: titles[Math.floor(Math.random() * titles.length)] + ' ' + i,
      content: '<p>这是一篇关于数码产品的详细讨论，包含了产品的各种特点和使用体验...</p>',
      tieba: tiebas[Math.floor(Math.random() * tiebas.length)],
      view_count: Math.floor(Math.random() * 10000),
      reply_count: Math.floor(Math.random() * 500),
      like_count: Math.floor(Math.random() * 1000),
      published: i % 5 !== 0, // 20% 的概率是草稿
      created_at: dayjs().subtract(Math.floor(Math.random() * 30), 'day').toISOString()
    })
  }
  
  return posts
}

const allPosts = ref(generateMockPosts())

// 模拟收藏数据
const collections = ref([
  {
    id: 101,
    title: 'iPhone 15 Pro Max使用一周体验',
    content: '<p>使用了一周的iPhone 15 Pro Max，来说说我的真实感受...</p>',
    tieba: { id: 1, name: '数码科技' },
    author: { id: 2, username: '科技爱好者', avatar: null },
    collected_at: '2023-10-10T10:30:00Z'
  },
  {
    id: 102,
    title: '2023年手机摄影横评',
    content: '<p>本文对比了市面上主流旗舰手机的摄影能力...</p>',
    tieba: { id: 3, name: '摄影吧' },
    author: { id: 3, username: '摄影达人', avatar: null },
    collected_at: '2023-10-08T14:20:00Z'
  }
])

// 模拟回复数据
const replies = ref([
  {
    id: 201,
    content: '这个评测很详细，对我帮助很大，谢谢分享！',
    like_count: 23,
    created_at: '2023-10-15T11:20:00Z',
    post: {
      id: 1001,
      title: '小米14 Pro深度评测',
      tieba: { id: 1, name: '数码科技' }
    }
  },
  {
    id: 202,
    content: '我也觉得这款手机的拍照能力确实很强。',
    like_count: 15,
    created_at: '2023-10-14T10:15:00Z',
    post: {
      id: 1002,
      title: '手机摄影技巧分享',
      tieba: { id: 3, name: '摄影吧' }
    }
  }
])

// 模拟关注数据
const following = ref([
  { id: 101, username: '科技新闻眼', avatar: null, bio: '关注科技最新动态' },
  { id: 102, username: '摄影达人', avatar: null, bio: '分享摄影技巧和作品' },
  { id: 103, username: '手机评测师', avatar: null, bio: '专业手机评测' }
])

// 模拟粉丝数据
const followers = ref([
  { id: 201, username: '数码小白', avatar: null, bio: '刚入门的数码爱好者' },
  { id: 202, username: '科技迷', avatar: null, bio: '热爱科技产品' },
  { id: 203, username: '摄影新手', avatar: null, bio: '学习摄影中' }
])

// 模拟成就数据
const userAchievements = ref([
  { id: 1, name: '初级作者', icon: '✍️', description: '发布10篇帖子', unlocked: true },
  { id: 2, name: '评论达人', icon: '💬', description: '发表50条评论', unlocked: true },
  { id: 3, name: '人气王', icon: '🔥', description: '获得1000个赞', unlocked: true },
  { id: 4, name: '社区活跃者', icon: '🌟', description: '连续签到30天', unlocked: false },
  { id: 5, name: '高级作者', icon: '🏆', description: '发布50篇帖子', unlocked: false }
])

// 模拟常用贴吧数据
const frequentTiebas = ref([
  { id: 1, name: '数码科技', activity: '经常访问' },
  { id: 2, name: '手机吧', activity: '经常访问' },
  { id: 3, name: '摄影吧', activity: '偶尔访问' }
])

// 计算属性
const filteredPosts = computed(() => {
  let posts = [...allPosts.value]
  
  if (activePostFilter.value === 'published') {
    posts = posts.filter(post => post.published)
  } else if (activePostFilter.value === 'drafts') {
    posts = posts.filter(post => !post.published)
  }
  
  // 按时间倒序排序
  posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  
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
const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日')
}

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

const handleFollow = (id) => {
  // 处理关注逻辑
  isFollowing.value = !isFollowing.value
  
  // 如果是在粉丝列表中关注用户
  if (id) {
    const user = followers.value.find(u => u.id === id)
    if (user) {
      following.value.push({
        ...user,
        followed_at: new Date().toISOString()
      })
      userInfo.value.following_count++
    }
  }
}

const handleUnfollow = (id) => {
  // 处理取消关注逻辑
  following.value = following.value.filter(user => user.id !== id)
  userInfo.value.following_count--
}

const isFollowingUser = (id) => {
  return following.value.some(user => user.id === id)
}

const handleMessage = () => {
  alert('私信功能开发中')
}

const handleEditPost = (id) => {
  router.push(`/edit-post/${id}`)
}

const handleDeletePost = (id) => {
  if (confirm('确定要删除这篇帖子吗？删除后不可恢复。')) {
    allPosts.value = allPosts.value.filter(post => post.id !== id)
    userInfo.value.post_count--
  }
}

const handleUncollect = (id) => {
  if (confirm('确定要取消收藏吗？')) {
    collections.value = collections.value.filter(collection => collection.id !== id)
  }
}

// 组件挂载时初始化数据
onMounted(async () => {
  // 实际项目中，这里应该调用API获取真实数据
  // try {
  //   await fetchUserDetail(userId.value)
  //   await fetchUserPosts(userId.value)
  // } catch (error) {
  //   console.error('获取用户数据失败:', error)
  // }
})
</script>

<style scoped>
.user-center-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 用户头部信息 */
.user-header {
  width: 100%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  position: relative;
}

.user-banner {
  position: relative;
  height: 250px;
  background: url('https://via.placeholder.com/1200x250') center/cover no-repeat;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.user-info-container {
  position: absolute;
  bottom: -80px;
  left: 0;
  right: 0;
  padding: 0 2rem;
}

.user-basic-info {
  display: flex;
  align-items: flex-start;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  gap: 1.5rem;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  flex-shrink: 0;
}

.user-avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  border: 4px solid white;
  flex-shrink: 0;
}

.user-main-info {
  flex: 1;
}

.user-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.user-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.user-bio {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.user-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.user-actions {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
  margin-top: 1rem;
}

.follow-btn,
.message-btn,
.edit-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
}

/* 内容区域 */
.content-wrapper {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  padding-top: 100px;
  padding-bottom: 2rem;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.user-nav {
  background: white;
  border-radius: 12px;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.nav-item:hover {
  background: #f8f9fa;
}

.nav-item.active {
  background: var(--primary-color);
  color: white;
}

.nav-icon {
  margin-right: 0.75rem;
  font-size: 1.1rem;
}

.nav-badge {
  background: rgba(0, 0, 0, 0.2);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
}

.nav-item:not(.active) .nav-badge {
  background: #e0e0e0;
  color: var(--text-secondary);
}

.achievements-section,
.frequent-tiebas {
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

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.achievement-item.unlocked {
  opacity: 1;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(0, 122, 255, 0.05));
}

.achievement-icon {
  font-size: 1.2rem;
}

.achievement-name {
  color: var(--text-secondary);
}

.achievement-item.unlocked .achievement-name {
  color: var(--text-primary);
  font-weight: 500;
}

.tiebas-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tieba-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.tieba-item:hover {
  background: #f8f9fa;
  transform: translateX(3px);
}

.tieba-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.tieba-info {
  flex: 1;
}

.tieba-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.tieba-activity {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 主要内容区域 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tab-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.tab-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tab-actions {
  display: flex;
  gap: 1rem;
}

.create-post-btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
}

/* 帖子列表 */
.posts-filter,
.collections-filter {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.filter-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.posts-list,
.collections-list,
.replies-list,
.following-list,
.followers-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.post-item,
.collection-item,
.reply-item,
.following-item,
.follower-item {
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.post-item:hover,
.collection-item:hover,
.reply-item:hover,
.following-item:hover,
.follower-item:hover {
  background: #fafafa;
}

.post-item:last-child,
.collection-item:last-child,
.reply-item:last-child,
.following-item:last-child,
.follower-item:last-child {
  border-bottom: none;
}

.post-header,
.collection-header,
.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.tieba-link {
  font-size: 0.85rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.tieba-link:hover {
  text-decoration: underline;
}

.post-time,
.collect-time,
.reply-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.post-title,
.collection-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.post-title a,
.collection-title a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.post-title a:hover,
.collection-title a:hover {
  color: var(--primary-color);
}

.post-excerpt,
.collection-excerpt {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.post-footer,
.collection-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-stats,
.reply-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.post-stats .stat-item,
.reply-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.post-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-btn.delete-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.post-status {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25rem 0.75rem;
  background: #faad14;
  color: white;
  border-radius: 0 12px 0 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.85rem;
}

.author-name {
  font-size: 0.9rem;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.author-name:hover {
  color: var(--primary-color);
}

.reply-to-post {
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.reply-to-label {
  margin-right: 0.5rem;
}

.reply-to-post .post-title {
  color: var(--primary-color);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0;
}

.reply-text {
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.user-avatar-small {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder-small {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  display: block;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.username:hover {
  color: var(--primary-color);
}

.user-bio-small {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.unfollow-btn {
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
}

/* 设置页面 */
.settings-form {
  padding: 1.5rem;
}

.settings-section {
  margin-bottom: 2rem;
}

.settings-section .section-title {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
}

.upload-btn {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--primary-color);
}

.form-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.security-item:last-child {
  border-bottom: none;
}

.security-info {
  flex: 1;
}

.security-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.security-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.security-item .action-btn {
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.save-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 250px 1fr;
  }
  
  .user-info-container {
    padding: 0 1.5rem;
  }
  
  .user-avatar,
  .user-avatar-placeholder {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .user-banner {
    height: 200px;
  }
  
  .user-info-container {
    padding: 0 1rem;
  }
  
  .user-basic-info {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .user-main-info {
    width: 100%;
  }
  
  .user-meta {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .user-stats {
    justify-content: center;
  }
  
  .user-actions {
    width: 100%;
    justify-content: center;
  }
  
  .tab-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .tab-actions {
    justify-content: center;
  }
  
  .posts-filter,
  .collections-filter {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .post-header,
  .collection-header,
  .reply-header,
  .post-footer,
  .collection-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .post-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .following-item,
  .follower-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .user-info {
    text-align: left;
  }
  
  .settings-form {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .user-basic-info {
    padding: 1.5rem;
  }
  
  .user-name {
    font-size: 1.5rem;
  }
  
  .user-stats {
    gap: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.1rem;
  }
  
  .post-item,
  .collection-item,
  .reply-item,
  .following-item,
  .follower-item {
    padding: 1.25rem;
  }
  
  .post-title,
  .collection-title {
    font-size: 1rem;
  }
  
  .post-stats,
  .reply-stats {
    gap: 1rem;
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