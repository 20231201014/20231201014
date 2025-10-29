<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 登录表单卡片 -->
      <div class="login-card">
        <div class="login-header">
          <div class="logo-container">
            <h1 class="logo-text">百度贴吧</h1>
            <p class="logo-slogan">发现你的兴趣世界</p>
          </div>
          <h2 class="login-title">账号登录</h2>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- 账号输入 -->
          <div class="form-group">
            <label for="username" class="form-label">账号</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                id="username"
                v-model="form.username"
                type="text"
                class="form-input"
                placeholder="请输入用户名或手机号"
                required
                :class="{ 'error': errors.username }"
              />
            </div>
            <div class="error-message" v-if="errors.username">{{ errors.username }}</div>
          </div>
          
          <!-- 密码输入 -->
          <div class="form-group">
            <div class="label-wrapper">
              <label for="password" class="form-label">密码</label>
              <router-link to="/forgot-password" class="forgot-password">忘记密码?</router-link>
            </div>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="请输入密码"
                required
                :class="{ 'error': errors.password }"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="toggle-password-btn"
                aria-label="显示/隐藏密码"
              >
                {{ showPassword ? '👁️‍🗨️' : '👁️' }}
              </button>
            </div>
            <div class="error-message" v-if="errors.password">{{ errors.password }}</div>
          </div>
          
          <!-- 记住我 -->
          <div class="form-group remember-me">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.rememberMe" class="checkbox-input" />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">记住我 30 天</span>
            </label>
          </div>
          
          <!-- 登录按钮 -->
          <button
            type="submit"
            class="login-button"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>登录</span>
          </button>
          
          <!-- 全局错误提示 -->
          <div class="global-error" v-if="errors.global">
            {{ errors.global }}
          </div>
        </form>
        
        <!-- 第三方登录 -->
        <div class="third-party-login">
          <div class="divider">
            <span class="divider-text">其他登录方式</span>
          </div>
          <div class="third-party-buttons">
            <button type="button" class="third-party-btn wechat-btn">
              <span class="btn-icon">💚</span>
              <span class="btn-text">微信</span>
            </button>
            <button type="button" class="third-party-btn qq-btn">
              <span class="btn-icon">💙</span>
              <span class="btn-text">QQ</span>
            </button>
            <button type="button" class="third-party-btn weibo-btn">
              <span class="btn-icon">❤️</span>
              <span class="btn-text">微博</span>
            </button>
          </div>
        </div>
        
        <!-- 注册入口 -->
        <div class="register-link">
          <span>还没有账号?</span>
          <router-link to="/register" class="link-text">立即注册</router-link>
        </div>
      </div>
      
      <!-- 登录页脚信息 -->
      <div class="login-footer">
        <div class="footer-links">
          <a href="#" class="footer-link">关于我们</a>
          <a href="#" class="footer-link">使用帮助</a>
          <a href="#" class="footer-link">用户协议</a>
          <a href="#" class="footer-link">隐私政策</a>
        </div>
        <p class="copyright">© 2023 百度贴吧 版权所有</p>
      </div>
    </div>
    
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
      <div class="decoration-circle circle-4"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 表单状态
const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// 错误状态
const errors = reactive({
  username: '',
  password: '',
  global: ''
})

// 显示密码状态
const showPassword = ref(false)
// 加载状态
const isLoading = ref(false)

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 表单验证
const validateForm = () => {
  let isValid = true
  
  // 重置错误
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  // 验证用户名
  if (!form.username.trim()) {
    errors.username = '请输入账号'
    isValid = false
  }
  
  // 验证密码
  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码长度至少为6位'
    isValid = false
  }
  
  return isValid
}

// 处理登录
const handleLogin = async () => {
  // 验证表单
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  errors.global = ''
  
  try {
    // 模拟API调用，实际项目中应该调用真实的登录API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟登录成功，设置用户信息
    const mockUser = {
      id: 1,
      username: form.username,
      avatar: null,
      token: 'mock-jwt-token'
    }
    
    // 保存用户信息到store
    userStore.setUserInfo(mockUser)
    
    // 如果需要记住我，保存到localStorage
    if (form.rememberMe) {
      localStorage.setItem('userInfo', JSON.stringify(mockUser))
    }
    
    // 登录成功，跳转到首页
    router.push('/')
  } catch (error) {
    // 处理登录错误
    errors.global = error.message || '登录失败，请检查账号和密码'
  } finally {
    isLoading.value = false
  }
}

// 处理第三方登录
const handleThirdPartyLogin = (provider) => {
  // 模拟第三方登录，实际项目中应该调用对应的OAuth流程
  console.log(`登录方式: ${provider}`)
  alert(`${provider}登录功能开发中`)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(0, 122, 255, 0.05));
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(0, 204, 153, 0.1), rgba(0, 204, 153, 0.05));
  bottom: -50px;
  left: -50px;
}

.circle-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, rgba(255, 125, 0, 0.1), rgba(255, 125, 0, 0.05));
  top: 30%;
  left: 15%;
}

.circle-4 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, rgba(255, 59, 48, 0.1), rgba(255, 59, 48, 0.05));
  bottom: 20%;
  right: 10%;
}

/* 登录容器 */
.login-container {
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
  z-index: 1;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  padding: 32px;
  position: relative;
  overflow: hidden;
}

/* 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-container {
  margin-bottom: 24px;
}

.logo-text {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.logo-slogan {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 8px 0 0;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* 登录表单 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.label-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.forgot-password {
  font-size: 13px;
  color: var(--primary-color);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.forgot-password:hover {
  opacity: 0.8;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  font-size: 16px;
  color: #999;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 12px 40px 12px 40px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 15px;
  color: var(--text-primary);
  background-color: white;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.form-input.error {
  border-color: #ff4d4f;
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.1);
}

.toggle-password-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #999;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toggle-password-btn:hover {
  background-color: #f5f5f5;
  color: var(--text-primary);
}

.error-message {
  font-size: 13px;
  color: #ff4d4f;
  margin-top: 6px;
}

/* 记住我 */
.remember-me {
  flex-direction: row;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-custom {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  background-color: white;
  transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-text {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 登录按钮 */
.login-button {
  width: 100%;
  padding: 12px 24px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.login-button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 全局错误提示 */
.global-error {
  padding: 12px;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  color: #ff4d4f;
  font-size: 14px;
  text-align: center;
}

/* 第三方登录 */
.third-party-login {
  margin: 24px 0;
}

.divider {
  position: relative;
  height: 1px;
  background-color: #e8e8e8;
  margin-bottom: 20px;
}

.divider-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 16px;
  background-color: white;
  font-size: 13px;
  color: var(--text-secondary);
}

.third-party-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.third-party-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.third-party-btn:hover {
  background-color: #f5f5f5;
  border-color: var(--primary-color);
}

.btn-icon {
  font-size: 16px;
}

.btn-text {
  color: var(--text-secondary);
}

.wechat-btn:hover {
  color: #07c160;
  border-color: #07c160;
}

.qq-btn:hover {
  color: #12b7f5;
  border-color: #12b7f5;
}

.weibo-btn:hover {
  color: #e6162d;
  border-color: #e6162d;
}

/* 注册链接 */
.register-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: var(--text-secondary);
}

.link-text {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.link-text:hover {
  opacity: 0.8;
  text-decoration: underline;
}

/* 登录页脚 */
.login-footer {
  text-align: center;
  margin-top: 24px;
  padding: 0 16px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
}

.footer-link {
  font-size: 12px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--primary-color);
}

.copyright {
  font-size: 12px;
  color: #999;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    padding: 24px;
    border-radius: 12px;
  }
  
  .logo-text {
    font-size: 24px;
  }
  
  .login-title {
    font-size: 20px;
  }
  
  .login-form {
    gap: 16px;
  }
  
  .form-input {
    font-size: 14px;
    padding: 11px 36px 11px 36px;
  }
  
  .input-icon {
    font-size: 14px;
  }
  
  .login-button {
    font-size: 15px;
    padding: 11px 20px;
  }
  
  .third-party-buttons {
    gap: 12px;
  }
  
  .third-party-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .footer-links {
    flex-wrap: wrap;
    gap: 12px;
  }
}

@media (max-width: 360px) {
  .login-container {
    padding: 0 16px;
  }
  
  .login-card {
    padding: 20px;
  }
  
  .form-input {
    font-size: 13px;
  }
  
  .third-party-btn {
    flex-direction: column;
    padding: 10px 8px;
    gap: 4px;
  }
  
  .btn-text {
    font-size: 12px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .login-page {
    background-color: #1a1a1a;
  }
  
  .login-card {
    background-color: #252525;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  .form-input {
    background-color: #333;
    border-color: #444;
    color: #fff;
  }
  
  .form-input::placeholder {
    color: #888;
  }
  
  .checkbox-custom {
    background-color: #333;
    border-color: #444;
  }
  
  .third-party-btn {
    background-color: #333;
    border-color: #444;
  }
  
  .third-party-btn:hover {
    background-color: #444;
  }
  
  .divider {
    background-color: #444;
  }
  
  .divider-text {
    background-color: #252525;
  }
}
</style>