<template>
  <div class="post-detail-page">
    <div class="container">
      <div class="content-wrapper">
        <!-- 帖子主体 -->
        <div class="post-main">
          <!-- 帖子内容 -->
          <article class="post-content" v-if="post">
            <div class="post-header">
              <h1 class="post-title">{{ post.title }}</h1>
              <div class="post-meta">
                <div class="author-info">
                  <img 
                    v-if="post.author.avatar" 
                    :src="post.author.avatar" 
                    :alt="post.author.username"
                    class="author-avatar"
                  />
                  <span v-else class="avatar-placeholder">
                    {{ post.author.username.charAt(0) }}
                  </span>
                  <div class="author-details">
                    <router-link 
                      :to="`/user/${post.author.id}`" 
                      class="author-name"
                    >
                      {{ post.author.username }}
                    </router-link>
                    <span class="post-time">{{ formatTime(post.created_at) }}</span>
                  </div>
                </div>
                <div class="post-actions">
                  <button 
                    class="action-btn"
                    @click="handleLike"
                    :class="{ active: post.is_liked }"
                  >
                    <span class="icon">{{ post.is_liked ? '❤️' : '🤍' }}</span>
                    <span>{{ post.like_count }}</span>
                  </button>
                  <button class="action-btn" @click="handleCollect">
                    <span class="icon">{{ isCollected ? '⭐' : '☆' }}</span>
                    <span>收藏</span>
                  </button>
                  <button class="action-btn" @click="handleShare">
                    <span class="icon">🔗</span>
                    <span>分享</span>
                  </button>
                  <button class="action-btn" @click="handleReport">
                    <span class="icon">⚠️</span>
                    <span>举报</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="post-body" v-html="post.content"></div>
            
            <div class="post-footer">
              <div class="post-stats">
                <span class="stat-item">
                  <span class="icon">👁️</span>
                  {{ post.view_count }} 阅读
                </span>
                <span class="stat-item">
                  <span class="icon">💬</span>
                  {{ post.reply_count }} 回复
                </span>
                <span class="stat-item">
                  <span class="icon">👍</span>
                  {{ post.like_count }} 点赞
                </span>
              </div>
              <div class="post-tags">
                <router-link :to="`/tieba/${post.tieba.id}`" class="tieba-tag">
                  # {{ post.tieba.name }}
                </router-link>
                <span 
                  v-for="tag in post.tags" 
                  :key="tag.id"
                  class="tag"
                >
                  # {{ tag.name }}
                </span>
              </div>
            </div>
          </article>
          
          <!-- 加载中 -->
          <div class="loading" v-else>
            加载中...
          </div>
          
          <!-- 评论区 -->
          <section class="comments-section">
            <div class="comments-header">
              <h2 class="comments-title">
                <span class="icon">💬</span>
                评论 ({{ comments.length }})
              </h2>
            </div>
            
            <!-- 评论输入框 -->
            <div class="comment-input" v-if="userStore.isAuthenticated">
              <textarea
                v-model="newComment"
                placeholder="写下你的评论..."
                rows="3"
              ></textarea>
              <div class="comment-actions">
                <div class="comment-tools">
                  <button class="tool-btn" title="表情">
                    😊
                  </button>
                  <button class="tool-btn" title="图片">
                    📷
                  </button>
                </div>
                <button 
                  class="btn btn-primary"
                  @click="submitComment"
                  :disabled="!newComment.trim()"
                >
                  发表评论
                </button>
              </div>
            </div>
            
            <div class="login-prompt" v-else>
              <router-link to="/login" class="link">登录</router-link> 后发表评论
            </div>
            
            <!-- 评论列表 -->
            <div class="comments-list">
              <div 
                v-for="comment in comments" 
                :key="comment.id"
                class="comment-item"
              >
                <div class="comment-header">
                  <div class="comment-author">
                    <img 
                      v-if="comment.author.avatar" 
                      :src="comment.author.avatar" 
                      :alt="comment.author.username"
                      class="comment-avatar"
                    />
                    <span v-else class="comment-avatar-placeholder">
                      {{ comment.author.username.charAt(0) }}
                    </span>
                    <div class="comment-author-info">
                      <router-link 
                        :to="`/user/${comment.author.id}`" 
                        class="comment-author-name"
                      >
                        {{ comment.author.username }}
                      </router-link>
                      <span class="comment-time">{{ formatTime(comment.created_at) }}</span>
                    </div>
                  </div>
                  <span class="floor-number">#{{ comment.floor_number }}</span>
                </div>
                <div class="comment-content">{{ comment.content }}</div>
                <div class="comment-actions">
                  <button class="comment-action-btn" @click="likeComment(comment.id)">
                    <span class="icon">{{ comment.is_liked ? '❤️' : '🤍' }}</span>
                    <span>{{ comment.like_count }}</span>
                  </button>
                  <button class="comment-action-btn" @click="replyToComment(comment)">
                    <span class="icon">↩️</span>
                    <span>回复</span>
                  </button>
                </div>
                
                <!-- 回复列表 -->
                <div class="replies" v-if="comment.replies && comment.replies.length > 0">
                  <div 
                    v-for="reply in comment.replies" 
                    :key="reply.id"
                    class="reply-item"
                  >
                    <div class="reply-content">
                      <span class="reply-author">{{ reply.author.username }}</span>
                      <span class="reply-text">{{ reply.content }}</span>
                    </div>
                    <div class="reply-meta">
                      <span class="reply-time">{{ formatTime(reply.created_at) }}</span>
                      <button class="reply-action-btn" @click="replyToComment(reply)">
                        回复
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- 回复输入框 -->
                <div class="reply-input" v-if="replyingTo === comment.id">
                  <textarea
                    v-model="replyContent"
                    placeholder="回复 @{{ comment.author.username }}..."
                    rows="2"
                  ></textarea>
                  <div class="reply-input-actions">
                    <button class="btn btn-secondary" @click="cancelReply">
                      取消
                    </button>
                    <button 
                      class="btn btn-primary"
                      @click="submitReply(comment.id)"
                      :disabled="!replyContent.trim()"
                    >
                      回复
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 加载更多评论 -->
            <div class="load-more-comments" v-if="hasMoreComments">
              <button class="btn btn-secondary" @click="loadMoreComments">
                加载更多评论
              </button>
            </div>
          </section>
        </div>
        
        <!-- 侧边栏 -->
        <div class="sidebar">
          <!-- 作者信息卡片 -->
          <div class="author-card" v-if="post">
            <div class="author-card-header">
              <img 
                v-if="post.author.avatar" 
                :src="post.author.avatar" 
                :alt="post.author.username"
                class="author-card-avatar"
              />
              <span v-else class="author-card-avatar-placeholder">
                {{ post.author.username.charAt(0) }}
              </span>
              <div class="author-card-info">
                <router-link 
                  :to="`/user/${post.author.id}`" 
                  class="author-card-name"
                >
                  {{ post.author.username }}
                </router-link>
                <div class="author-card-stats">
                  <span>{{ post.author.post_count || 0 }} 帖子</span>
                  <span>{{ post.author.follower_count || 0 }} 粉丝</span>
                </div>
              </div>
            </div>
            <button class="btn btn-primary author-follow-btn">
              {{ isFollowing ? '已关注' : '关注' }}
            </button>
          </div>
          
          <!-- 所属贴吧信息 -->
          <div class="tieba-card" v-if="post">
            <div class="tieba-card-header">
              <h3 class="tieba-card-title">所属贴吧</h3>
            </div>
            <div class="tieba-card-content">
              <div class="tieba-card-info">
                <div class="tieba-card-avatar">{{ post.tieba.name.charAt(0) }}</div>
                <div class="tieba-card-details">
                  <router-link 
                    :to="`/tieba/${post.tieba.id}`" 
                    class="tieba-card-name"
                  >
                    {{ post.tieba.name }}
                  </router-link>
                  <div class="tieba-card-stats">
                    {{ post.tieba.member_count }} 成员 · {{ post.tieba.post_count }} 帖子
                  </div>
                </div>
              </div>
              <button class="btn btn-primary tieba-join-btn">
                {{ isJoined ? '已加入' : '加入贴吧' }}
              </button>
            </div>
          </div>
          
          <!-- 相关推荐 -->
          <div class="related-posts">
            <div class="related-posts-header">
              <h3 class="related-posts-title">相关推荐</h3>
            </div>
            <div class="related-posts-list">
              <div 
                v-for="relatedPost in relatedPosts" 
                :key="relatedPost.id"
                class="related-post-item"
                @click="navigateToPost(relatedPost.id)"
              >
                <h4 class="related-post-title">{{ relatedPost.title }}</h4>
                <div class="related-post-meta">
                  <span>{{ relatedPost.tieba.name }}</span>
                  <span>{{ relatedPost.reply_count }} 回复</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const postStore = usePostStore()

// 状态管理
const post = ref(null)
const comments = ref([])
const relatedPosts = ref([])
const newComment = ref('')
const replyingTo = ref(null)
const replyContent = ref('')
const isCollected = ref(false)
const isFollowing = ref(false)
const isJoined = ref(false)
const hasMoreComments = ref(true)
const loading = ref(false)

// 模拟帖子数据
const mockPost = {
  id: parseInt(route.params.id),
  title: '2023年最值得购买的手机推荐',
  content: '<p>2023年已经过去大半，这一年里各大手机厂商都推出了不少旗舰产品。今天我就来为大家总结一下2023年最值得购买的几款手机。</p><h3>1. 苹果 iPhone 15 Pro Max</h3><p>作为苹果的顶级旗舰，iPhone 15 Pro Max搭载了最新的A17 Pro芯片，性能强大，拍照出色，尤其是在视频拍摄方面领先行业。</p><h3>2. 三星 Galaxy S23 Ultra</h3><p>三星Galaxy S23 Ultra拥有200MP主摄，支持S Pen，大屏幕带来极佳的观影体验。</p><h3>3. 小米14 Pro</h3><p>小米14 Pro搭载骁龙8 Gen 3处理器，徕卡影像系统，性能和拍照都很出色。</p><p>以上就是我为大家推荐的2023年最值得购买的几款手机，大家有什么想法可以在评论区讨论。</p>',
  author: {
    id: 1,
    username: '数码达人',
    avatar: null,
    post_count: 128,
    follower_count: 5678
  },
  tieba: {
    id: 1,
    name: '数码科技',
    member_count: 1250000,
    post_count: 890000
  },
  tags: [
    { id: 1, name: '手机推荐' },
    { id: 2, name: '数码评测' }
  ],
  view_count: 12500,
  reply_count: 890,
  like_count: 3450,
  is_liked: false,
  created_at: '2023-10-15T10:30:00Z'
}

// 模拟评论数据
const mockComments = [
  {
    id: 1,
    author: { id: 2, username: '科技爱好者', avatar: null },
    content: '很详细的推荐！我也觉得iPhone 15 Pro Max确实是今年的机皇。',
    like_count: 123,
    is_liked: false,
    floor_number: 1,
    created_at: '2023-10-15T11:20:00Z',
    replies: [
      {
        id: 101,
        author: { id: 1, username: '数码达人', avatar: null },
        content: '是的，尤其是在视频拍摄方面，确实很强大。',
        created_at: '2023-10-15T11:30:00Z'
      }
    ]
  },
  {
    id: 2,
    author: { id: 3, username: '国产支持者', avatar: null },
    content: '支持国产！小米14 Pro性价比真的很高，而且拍照也不错。',
    like_count: 89,
    is_liked: true,
    floor_number: 2,
    created_at: '2023-10-15T12:10:00Z',
    replies: []
  }
]

// 模拟相关推荐数据
const mockRelatedPosts = [
  {
    id: 101,
    title: '小米14 Pro深度评测',
    tieba: { name: '数码科技' },
    reply_count: 342
  },
  {
    id: 102,
    title: 'iPhone 15 Pro Max使用一周体验',
    tieba: { name: '数码科技' },
    reply_count: 567
  },
  {
    id: 103,
    title: '2023年手机摄影横评',
    tieba: { name: '摄影吧' },
    reply_count: 234
  }
]

// 格式化时间
const formatTime = (time) => {
  return dayjs(time).fromNow()
}

// 导航到帖子详情
const navigateToPost = (id) => {
  router.push(`/post/${id}`)
}

// 处理点赞
const handleLike = () => {
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // 模拟点赞
  post.value.is_liked = !post.value.is_liked
  post.value.like_count += post.value.is_liked ? 1 : -1
  
  // 实际项目中调用API
  // try {
  //   await postStore.likePost(post.value.id)
  // } catch (error) {
  //   console.error('点赞失败:', error)
  // }
}

// 处理收藏
const handleCollect = () => {
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  isCollected.value = !isCollected.value
  // 实际项目中调用API
}

// 处理分享
const handleShare = () => {
  // 模拟分享功能
  alert('分享功能开发中')
}

// 处理举报
const handleReport = () => {
  alert('举报功能开发中')
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  // 模拟提交评论
  const newCommentObj = {
    id: Date.now(),
    author: userStore.userInfo || { id: 0, username: '匿名用户' },
    content: newComment.value,
    like_count: 0,
    is_liked: false,
    floor_number: comments.value.length + 1,
    created_at: new Date().toISOString(),
    replies: []
  }
  
  comments.value.unshift(newCommentObj)
  post.value.reply_count += 1
  newComment.value = ''
  
  // 实际项目中调用API
  // try {
  //   await postStore.createComment(post.value.id, { content: newComment.value })
  // } catch (error) {
  //   console.error('发表评论失败:', error)
  // }
}

// 点赞评论
const likeComment = (commentId) => {
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    comment.is_liked = !comment.is_liked
    comment.like_count += comment.is_liked ? 1 : -1
  }
}

// 回复评论
const replyToComment = (comment) => {
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  replyingTo.value = replyingTo.value === comment.id ? null : comment.id
  replyContent.value = ''
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
  replyContent.value = ''
}

// 提交回复
const submitReply = (commentId) => {
  if (!replyContent.value.trim()) return
  
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    const newReply = {
      id: Date.now(),
      author: userStore.userInfo || { id: 0, username: '匿名用户' },
      content: replyContent.value,
      created_at: new Date().toISOString()
    }
    
    if (!comment.replies) {
      comment.replies = []
    }
    
    comment.replies.push(newReply)
    post.value.reply_count += 1
    replyingTo.value = null
    replyContent.value = ''
  }
}

// 加载更多评论
const loadMoreComments = () => {
  loading.value = true
  // 模拟加载延迟
  setTimeout(() => {
    // 复制现有评论并修改ID以模拟新数据
    const newComments = mockComments.map(comment => ({
      ...comment,
      id: comment.id + comments.value.length,
      floor_number: comments.value.length + comment.floor_number,
      created_at: new Date().toISOString()
    }))
    
    comments.value = [...comments.value, ...newComments]
    loading.value = false
    
    // 模拟没有更多数据
    if (comments.value.length > 10) {
      hasMoreComments.value = false
    }
  }, 1000)
}

// 组件挂载时初始化数据
onMounted(async () => {
  // 初始化帖子数据
  post.value = { ...mockPost, id: parseInt(route.params.id) }
  
  // 初始化评论数据
  comments.value = mockComments
  
  // 初始化相关推荐数据
  relatedPosts.value = mockRelatedPosts
  
  // 实际项目中，这里应该调用API获取真实数据
  // try {
  //   await postStore.fetchPostDetail(route.params.id)
  //   post.value = postStore.currentPost
  //   
  //   await postStore.fetchComments(route.params.id)
  //   comments.value = postStore.comments
  // } catch (error) {
  //   console.error('获取帖子详情失败:', error)
  // }
})
</script>

<style scoped>
.post-detail-page {
  padding: 2rem 0;
  min-height: 100vh;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

/* 帖子主体 */
.post-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.post-header {
  margin-bottom: 1.5rem;
}

.post-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
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

.author-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.author-name {
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.author-name:hover {
  color: var(--primary-color);
}

.post-time {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.post-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

.action-btn.active {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.post-body {
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-primary);
}

.post-body h3 {
  margin: 1.5rem 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.post-body p {
  margin-bottom: 1rem;
}

.post-body img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

.post-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.post-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tieba-tag,
.tag {
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  border-radius: 16px;
  font-size: 0.875rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.3s ease;
}

.tieba-tag:hover,
.tag:hover {
  background: var(--primary-color);
  color: white;
}

/* 评论区 */
.comments-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.comments-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.comments-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-input textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.3s ease;
}

.comment-input textarea:focus {
  border-color: var(--primary-color);
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.comment-tools {
  display: flex;
  gap: 0.5rem;
}

.tool-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 1.25rem;
  transition: background-color 0.3s ease;
}

.tool-btn:hover {
  background: #f0f0f0;
}

.login-prompt {
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.comment-item {
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-avatar-placeholder {
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

.comment-author-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.comment-author-name {
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.comment-author-name:hover {
  color: var(--primary-color);
}

.comment-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.floor-number {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.comment-content {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.comment-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.comment-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.comment-action-btn:hover {
  background: #f0f0f0;
  color: var(--primary-color);
}

.replies {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reply-item {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.reply-content {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.reply-author {
  font-weight: 600;
  color: var(--primary-color);
  margin-right: 0.5rem;
}

.reply-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.reply-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-color);
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.reply-action-btn:hover {
  background: rgba(0, 122, 255, 0.1);
}

.reply-input {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.reply-input textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.3s ease;
}

.reply-input textarea:focus {
  border-color: var(--primary-color);
}

.reply-input-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.load-more-comments {
  margin-top: 1.5rem;
  text-align: center;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.author-card,
.tieba-card,
.related-posts {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.author-card-header,
.tieba-card-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.author-card-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

.author-card-avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
}

.author-card-info,
.tieba-card-details {
  flex: 1;
}

.author-card-name,
.tieba-card-name {
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  display: block;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.author-card-name:hover,
.tieba-card-name:hover {
  color: var(--primary-color);
}

.author-card-stats,
.tieba-card-stats {
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  gap: 1rem;
}

.author-follow-btn,
.tieba-join-btn {
  width: 100%;
}

.tieba-card-header,
.related-posts-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
}

.tieba-card-title,
.related-posts-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tieba-card-avatar {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
}

.related-posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.related-post-item {
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.related-post-item:hover {
  background: #f8f9fa;
  transform: translateX(3px);
}

.related-post-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-post-meta {
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  gap: 0.75rem;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 4rem;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr 280px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .post-content,
  .comments-section {
    padding: 1.5rem;
  }
  
  .post-title {
    font-size: 1.5rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .post-actions {
    width: 100%;
    justify-content: space-around;
  }
  
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .sidebar {
    order: -1;
  }
}

@media (max-width: 480px) {
  .post-content,
  .comments-section {
    padding: 1rem;
  }
  
  .post-title {
    font-size: 1.25rem;
  }
  
  .author-avatar,
  .avatar-placeholder {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .action-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .post-stats {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>