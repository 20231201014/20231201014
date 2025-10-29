<template>
  <div class="create-post-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">发布新帖</h1>
        <p class="page-subtitle">分享你的想法和见解</p>
      </div>
      
      <div class="content-wrapper">
        <!-- 发布表单 -->
        <div class="form-container">
          <form @submit.prevent="handleSubmit">
            <!-- 选择贴吧 -->
            <div class="form-group">
              <label for="tieba-select" class="form-label">选择贴吧 <span class="required">*</span></label>
              <div class="select-wrapper">
                <select 
                  id="tieba-select" 
                  v-model="selectedTieba" 
                  class="form-select"
                  required
                >
                  <option value="">请选择要发布的贴吧</option>
                  <option 
                    v-for="tieba in joinedTiebas" 
                    :key="tieba.id" 
                    :value="tieba"
                  >
                    {{ tieba.name }}
                  </option>
                </select>
                <div class="select-icon">▼</div>
              </div>
            </div>
            
            <!-- 帖子标题 -->
            <div class="form-group">
              <label for="post-title" class="form-label">帖子标题 <span class="required">*</span></label>
              <input 
                type="text" 
                id="post-title" 
                v-model="title" 
                class="form-input"
                placeholder="请输入帖子标题（5-50个字符）"
                maxlength="50"
                required
              />
              <div class="char-count">{{ title.length }}/50</div>
            </div>
            
            <!-- 内容编辑器 -->
            <div class="form-group">
              <label class="form-label">帖子内容 <span class="required">*</span></label>
              <div class="editor-container">
                <!-- 使用React富文本编辑器 -->
                <ReactWrapper :component="RichEditor" @change="handleEditorChange" />
              </div>
              <div class="editor-hint">
                支持文字、图片、链接等多种格式，内容越丰富越容易获得关注哦！
              </div>
            </div>
            
            <!-- 标签选择 -->
            <div class="form-group">
              <label class="form-label">添加标签</label>
              <div class="tags-container">
                <div 
                  v-for="tag in availableTags" 
                  :key="tag.id"
                  class="tag-item"
                  :class="{ selected: selectedTags.includes(tag.id) }"
                  @click="toggleTag(tag.id)"
                >
                  {{ tag.name }}
                </div>
              </div>
              <div class="tags-hint">最多可选择3个标签</div>
            </div>
            
            <!-- 可见性设置 -->
            <div class="form-group">
              <label class="form-label">可见性设置</label>
              <div class="visibility-options">
                <label class="visibility-option">
                  <input 
                    type="radio" 
                    name="visibility" 
                    value="public" 
                    v-model="visibility"
                    checked
                  />
                  <span class="radio-label">
                    <span class="visibility-icon">🌐</span>
                    公开
                    <span class="visibility-desc">所有人可见</span>
                  </span>
                </label>
                <label class="visibility-option">
                  <input 
                    type="radio" 
                    name="visibility" 
                    value="private" 
                    v-model="visibility"
                  />
                  <span class="radio-label">
                    <span class="visibility-icon">🔒</span>
                    私密
                    <span class="visibility-desc">仅自己可见</span>
                  </span>
                </label>
                <label class="visibility-option">
                  <input 
                    type="radio" 
                    name="visibility" 
                    value="friends" 
                    v-model="visibility"
                  />
                  <span class="radio-label">
                    <span class="visibility-icon">👥</span>
                    好友可见
                    <span class="visibility-desc">仅关注者可见</span>
                  </span>
                </label>
              </div>
            </div>
            
            <!-- 发布选项 -->
            <div class="form-group">
              <label class="form-label">发布选项</label>
              <div class="publish-options">
                <label class="publish-option">
                  <input type="checkbox" v-model="allowComments" checked />
                  <span class="checkbox-label">允许评论</span>
                </label>
                <label class="publish-option">
                  <input type="checkbox" v-model="notifyFollowers" />
                  <span class="checkbox-label">通知我的关注者</span>
                </label>
                <label class="publish-option">
                  <input type="checkbox" v-model="saveAsDraft" />
                  <span class="checkbox-label">保存为草稿</span>
                </label>
              </div>
            </div>
            
            <!-- 发布按钮 -->
            <div class="form-actions">
              <button type="button" class="btn btn-secondary cancel-btn" @click="handleCancel">
                取消
              </button>
              <button 
                type="submit" 
                class="btn btn-primary submit-btn"
                :disabled="loading || !isFormValid"
              >
                {{ loading ? '发布中...' : '发布帖子' }}
              </button>
            </div>
          </form>
        </div>
        
        <!-- 侧边栏 -->
        <div class="sidebar">
          <!-- 发帖指南 -->
          <div class="guideline-section">
            <h3 class="section-title">发帖指南</h3>
            <div class="guideline-content">
              <ul class="guideline-list">
                <li class="guideline-item">
                  <span class="guideline-icon">✅</span>
                  <span class="guideline-text">标题要简洁明了，突出主题</span>
                </li>
                <li class="guideline-item">
                  <span class="guideline-icon">✅</span>
                  <span class="guideline-text">内容要丰富、有价值</span>
                </li>
                <li class="guideline-item">
                  <span class="guideline-icon">✅</span>
                  <span class="guideline-text">添加合适的标签，让更多人看到</span>
                </li>
                <li class="guideline-item">
                  <span class="guideline-icon">❌</span>
                  <span class="guideline-text">不要发布广告、垃圾信息</span>
                </li>
                <li class="guideline-item">
                  <span class="guideline-icon">❌</span>
                  <span class="guideline-text">禁止发布违法违规内容</span>
                </li>
                <li class="guideline-item">
                  <span class="guideline-icon">❌</span>
                  <span class="guideline-text">不要侵犯他人隐私</span>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- 热门标签 -->
          <div class="hot-tags-section">
            <h3 class="section-title">热门标签</h3>
            <div class="hot-tags-container">
              <div 
                v-for="hotTag in hotTags" 
                :key="hotTag.id"
                class="hot-tag-item"
                @click="addHotTag(hotTag.id)"
              >
                {{ hotTag.name }}
                <span class="hot-tag-count">{{ hotTag.usage_count }}</span>
              </div>
            </div>
          </div>
          
          <!-- 发布规范 -->
          <div class="rules-section">
            <h3 class="section-title">发布规范</h3>
            <div class="rules-content">
              <p>请遵守百度贴吧社区规范，共同维护良好的社区环境。违规内容将被删除，情节严重者将被禁言或封号。</p>
              <button class="rules-link">查看完整规范</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { ReactWrapper } from 'veaury'
import RichEditor from '@/components/react/RichEditor'

const router = useRouter()
const userStore = useUserStore()
const postStore = usePostStore()

// 状态管理
const loading = ref(false)
const selectedTieba = ref('')
const title = ref('')
const content = ref('')
const selectedTags = ref([])
const visibility = ref('public')
const allowComments = ref(true)
const notifyFollowers = ref(false)
const saveAsDraft = ref(false)

// 模拟数据
const joinedTiebas = ref([
  { id: 1, name: '数码科技' },
  { id: 2, name: '手机吧' },
  { id: 3, name: '摄影吧' },
  { id: 4, name: '电脑吧' }
])

const availableTags = ref([
  { id: 1, name: '手机推荐' },
  { id: 2, name: '数码评测' },
  { id: 3, name: '开箱体验' },
  { id: 4, name: '摄影技巧' },
  { id: 5, name: '使用心得' },
  { id: 6, name: '求助' },
  { id: 7, name: '讨论' },
  { id: 8, name: '分享' },
  { id: 9, name: '问答' },
  { id: 10, name: '经验' }
])

const hotTags = ref([
  { id: 1, name: '2023新品', usage_count: '2.3k' },
  { id: 2, name: '性价比', usage_count: '1.8k' },
  { id: 3, name: '开箱', usage_count: '1.5k' },
  { id: 4, name: '评测', usage_count: '1.2k' },
  { id: 5, name: '推荐', usage_count: '1.0k' }
])

// 计算属性
const isFormValid = computed(() => {
  return selectedTieba.value && 
         title.value.trim().length >= 5 && 
         title.value.trim().length <= 50 && 
         content.value.trim()
})

// 方法
const handleEditorChange = (editorContent) => {
  content.value = editorContent
}

const toggleTag = (tagId) => {
  if (selectedTags.value.includes(tagId)) {
    selectedTags.value = selectedTags.value.filter(id => id !== tagId)
  } else if (selectedTags.value.length < 3) {
    selectedTags.value.push(tagId)
  } else {
    alert('最多只能选择3个标签')
  }
}

const addHotTag = (tagId) => {
  if (!selectedTags.value.includes(tagId) && selectedTags.value.length < 3) {
    selectedTags.value.push(tagId)
  }
}

const handleSubmit = async () => {
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  loading.value = true
  
  try {
    // 模拟提交延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 构建帖子数据
    const postData = {
      tieba_id: selectedTieba.value.id,
      title: title.value.trim(),
      content: content.value,
      tags: selectedTags.value,
      visibility: visibility.value,
      allow_comments: allowComments.value,
      notify_followers: notifyFollowers.value,
      is_draft: saveAsDraft.value
    }
    
    console.log('提交的帖子数据:', postData)
    
    // 实际项目中调用API
    // await postStore.createPost(postData)
    
    // 提交成功后的处理
    if (saveAsDraft.value) {
      alert('草稿保存成功！')
    } else {
      alert('帖子发布成功！')
    }
    
    // 跳转到相应页面
    if (saveAsDraft.value) {
      router.push('/user/drafts')
    } else {
      router.push(`/tieba/${selectedTieba.value.id}`)
    }
  } catch (error) {
    console.error('发布失败:', error)
    alert('发布失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  if (title.value || content.value) {
    if (confirm('确定要放弃编辑吗？未保存的内容将会丢失。')) {
      router.back()
    }
  } else {
    router.back()
  }
}

// 组件挂载时检查登录状态
onMounted(() => {
  if (!userStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<style scoped>
.create-post-page {
  padding: 2rem 0;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

/* 表单容器 */
.form-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.required {
  color: #ff4d4f;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.form-select {
  width: 100%;
  padding: 0.875rem 2.5rem 0.875rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  outline: none;
  transition: border-color 0.3s ease;
  appearance: none;
}

.form-select:focus {
  border-color: var(--primary-color);
}

.select-icon {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: var(--primary-color);
}

.char-count {
  text-align: right;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.editor-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  min-height: 300px;
}

.editor-hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-item {
  padding: 0.4rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-item:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tag-item.selected {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.tags-hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.visibility-options,
.publish-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.visibility-option,
.publish-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.visibility-option input,
.publish-option input {
  margin-right: 0.75rem;
  width: 1rem;
  height: 1rem;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.visibility-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-left: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.cancel-btn,
.submit-btn {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.guideline-section,
.hot-tags-section,
.rules-section {
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

.guideline-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.guideline-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.guideline-icon {
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.guideline-text {
  color: var(--text-secondary);
}

.hot-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hot-tag-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.hot-tag-item:hover {
  background: var(--primary-color);
  color: white;
}

.hot-tag-count {
  font-size: 0.75rem;
  opacity: 0.8;
}

.rules-content {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.rules-link {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  text-decoration: underline;
}

.rules-link:hover {
  opacity: 0.8;
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
  
  .form-container {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .visibility-options,
  .publish-options {
    gap: 0.75rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-header {
    margin-bottom: 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .form-container {
    padding: 1.25rem;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .editor-container {
    min-height: 250px;
  }
  
  .guideline-section,
  .hot-tags-section,
  .rules-section {
    padding: 1.25rem;
  }
  
  .guideline-item {
    font-size: 0.85rem;
  }
}
</style>