<template>
  <nav class="navbar">
    <div class="nav-container">
      <!--  Logo  -->
      <router-link to="/" class="logo">
        百度贴吧
      </router-link>
      
      <!--  移动端菜单按钮  -->
      <button 
        class="nav-toggle" 
        @click="toggleMenu"
        :class="{ active: menuOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <!--  导航链接 - 桌面端  -->
      <ul class="nav-links">
        <li>
          <router-link to="/" class="nav-link">首页</router-link>
        </li>
        <li>
          <router-link to="/hot" class="nav-link">热门</router-link>
        </li>
        <li>
          <router-link to="/following" class="nav-link">关注</router-link>
        </li>
      </ul>
      
      <!--  搜索框 -->
      <div class="search-container">
        <form @submit.prevent="handleSearch" class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索帖子、用户或贴吧"
            class="search-input"
          />
          <button type="submit" class="search-btn">
            <span class="icon">🔍</span>
            <span class="btn-text">搜索</span>
          </button>
        </form>
      </div>
      
      <!--  用户操作区 -->
      <div class="nav-user">
        <!--  未登录状态 -->
        <template v-if="!userStore.isAuthenticated">
          <router-link to="/login" class="btn btn-secondary">登录</router-link>
          <router-link to="/register" class="btn btn-primary">注册</router-link>
        </template>
        
        <!--  已登录状态 -->
        <template v-else>
          <router-link to="/create-post" class="btn btn-primary">
            <span class="icon">✍️</span>
            发帖
          </router-link>
          
          <!--  用户头像 -->
          <div class="user-dropdown">
            <button 
              class="user-avatar" 
              @click="toggleDropdown"
              :class="{ active: dropdownOpen }"
            >
              <img 
                v-if="userStore.userInfo?.avatar" 
                :src="userStore.userInfo.avatar" 
                :alt="userStore.userInfo.username"
              />
              <span v-else class="avatar-placeholder">
                {{ userStore.userInfo?.username?.[0] || 'U' }}
              </span>
            </button>
            
            <!--  下拉菜单 -->
            <div class="dropdown-menu" v-if="dropdownOpen">
              <router-link to="/user/me" class="dropdown-item">
                <span class="icon">👤</span>
                个人中心
              </router-link>
              <router-link to="/user/me/posts" class="dropdown-item">
                <span class="icon">📝</span>
                我的发帖
              </router-link>
              <router-link to="/user/me/collections" class="dropdown-item">
                <span class="icon">⭐</span>
                我的收藏
              </router-link>
              <router-link to="/user/me/messages" class="dropdown-item">
                <span class="icon">💬</span>
                消息通知
                <span class="badge" v-if="unreadMessages">{{ unreadMessages }}</span>
              </router-link>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout" @click="handleLogout">
                <span class="icon">🚪</span>
                退出登录
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
    
    <!--  移动端导航菜单 -->
    <div class="mobile-nav" v-if="menuOpen">
      <ul class="mobile-nav-links">
        <li>
          <router-link to="/" class="mobile-nav-link" @click="closeMenu">首页</router-link>
        </li>
        <li>
          <router-link to="/hot" class="mobile-nav-link" @click="closeMenu">热门</router-link>
        </li>
        <li>
          <router-link to="/following" class="mobile-nav-link" @click="closeMenu">关注</router-link>
        </li>
        
        <li v-if="userStore.isAuthenticated">
          <router-link to="/user/me" class="mobile-nav-link" @click="closeMenu">个人中心</router-link>
        </li>
        <li v-if="userStore.isAuthenticated">
          <router-link to="/user/me/posts" class="mobile-nav-link" @click="closeMenu">我的发帖</router-link>
        </li>
        
        <li v-if="!userStore.isAuthenticated">
          <router-link to="/login" class="mobile-nav-link" @click="closeMenu">登录</router-link>
        </li>
        <li v-if="!userStore.isAuthenticated">
          <router-link to="/register" class="mobile-nav-link" @click="closeMenu">注册</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 状态管理
const menuOpen = ref(false)
const dropdownOpen = ref(false)
const searchQuery = ref('')
const unreadMessages = ref(0)

// 切换移动端菜单
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

// 关闭菜单
const closeMenu = () => {
  menuOpen.value = false
  dropdownOpen.value = false
}

// 切换用户下拉菜单
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
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

// 处理登出
const handleLogout = async () => {
  userStore.logout()
  dropdownOpen.value = false
  router.push('/')
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.user-dropdown')
  if (!dropdown) {
    dropdownOpen.value = false
  }
}

// 组件挂载时加载用户信息
onMounted(async () => {
  if (userStore.isAuthenticated) {
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }
  
  // 添加点击外部事件监听
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-light);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.logo {
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}

/* 汉堡菜单按钮 */
.nav-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 0.5rem;
  background: none;
  border: none;
  z-index: 1001;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background: var(--text-primary);
  margin: 3px 0;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.nav-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav-toggle.active span:nth-child(2) {
  opacity: 0;
}

.nav-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* 导航链接 - 桌面端 */
.nav-links {
  display: flex;
  gap: clamp(1rem, 3vw, 2rem);
  list-style: none;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: var(--text-primary);
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-medium);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-color);
  background: rgba(0, 122, 255, 0.1);
  transform: translateY(-1px);
}

/* 搜索框 */
.search-container {
  flex: 1;
  max-width: 500px;
  margin: 0 clamp(1rem, 4vw, 2rem);
}

.search-box {
  display: flex;
  background: rgba(242, 242, 247, 0.8);
  border-radius: 25px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.search-box:focus-within {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  padding: clamp(0.75rem, 3vw, 1rem) clamp(1rem, 4vw, 1.5rem);
  font-size: clamp(0.875rem, 3vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

.btn-text {
  display: inline;
}

/* 用户操作区 */
.nav-user {
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  align-items: center;
  flex-shrink: 0;
}

/* 通用按钮样式 */
.btn {
  padding: clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem);
  border: none;
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  transition: all 0.3s ease;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  box-shadow: var(--shadow-light);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 用户头像和下拉菜单 */
.user-dropdown {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  overflow: hidden;
}

.user-avatar:hover,
.user-avatar.active {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: white;
  font-weight: bold;
  font-size: 1rem;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: var(--border-radius-medium);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--text-primary);
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  gap: 0.75rem;
  position: relative;
}

.dropdown-item:hover {
  background-color: var(--background-secondary);
}

.dropdown-item.logout:hover {
  background-color: rgba(255, 59, 48, 0.1);
  color: var(--error-color);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 4px 0;
}

.badge {
  position: absolute;
  top: 8px;
  right: 12px;
  background-color: var(--error-color);
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* 移动端导航菜单 */
.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;
  width: 80%;
}

.mobile-nav-link {
  display: block;
  padding: 1rem 0;
  margin: 0.5rem 0;
  text-decoration: none;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 500;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  transition: all 0.3s ease;
}

.mobile-nav-link:hover {
  background-color: var(--background-secondary);
  color: var(--primary-color);
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .btn-text {
    display: none;
  }
}

@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }
  
  .nav-links,
  .search-container {
    display: none;
  }
  
  .nav-user {
    gap: 0.5rem;
  }
  
  .nav-user .btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0.75rem 1rem;
  }
  
  .nav-user .btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .user-avatar {
    width: 36px;
    height: 36px;
  }
}
</style>