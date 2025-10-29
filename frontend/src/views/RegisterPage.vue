<template>
  <div class="register-page">
    <div class="register-container">
      <!-- 注册表单卡片 -->
      <div class="register-card">
        <div class="register-header">
          <div class="logo-container">
            <h1 class="logo-text">百度贴吧</h1>
            <p class="logo-slogan">加入我们的兴趣社区</p>
          </div>
          <h2 class="register-title">账号注册</h2>
        </div>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <!-- 手机号输入 -->
          <div class="form-group">
            <label for="phone" class="form-label">手机号</label>
            <div class="input-wrapper">
              <span class="input-icon">📱</span>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="form-input"
                placeholder="请输入手机号"
                required
                :class="{ 'error': errors.phone }"
                maxlength="11"
              />
            </div>
            <div class="error-message" v-if="errors.phone">{{ errors.phone }}</div>
          </div>
          
          <!-- 验证码输入 -->
          <div class="form-group">
            <label for="verificationCode" class="form-label">验证码</label>
            <div class="verification-container">
              <div class="input-wrapper verification-input-wrapper">
                <span class="input-icon">🔑</span>
                <input
                  id="verificationCode"
                  v-model="form.verificationCode"
                  type="text"
                  class="form-input"
                  placeholder="请输入验证码"
                  required
                  :class="{ 'error': errors.verificationCode }"
                  maxlength="6"
                />
              </div>
              <button
                type="button"
                @click="sendVerificationCode"
                class="send-code-btn"
                :disabled="countdown > 0 || isSendingCode"
              >
                {{ isSendingCode ? '发送中...' : (countdown > 0 ? `${countdown}秒后重发` : '获取验证码') }}
              </button>
            </div>
            <div class="error-message" v-if="errors.verificationCode">{{ errors.verificationCode }}</div>
          </div>
          
          <!-- 用户名输入 -->
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                id="username"
                v-model="form.username"
                type="text"
                class="form-input"
                placeholder="3-20个字符，支持中英文、数字和下划线"
                required
                :class="{ 'error': errors.username }"
                maxlength="20"
              />
            </div>
            <div class="error-message" v-if="errors.username">{{ errors.username }}</div>
          </div>
          
          <!-- 密码输入 -->
          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="6-20个字符，建议包含字母、数字和特殊符号"
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
            
            <!-- 密码强度指示器 -->
            <div class="password-strength-container" v-if="form.password.length > 0">
              <div class="password-strength-labels">
                <span class="strength-label weak" :class="{ active: passwordStrength === 'weak' }"></span>
                <span class="strength-label medium" :class="{ active: passwordStrength === 'medium' }"></span>
                <span class="strength-label strong" :class="{ active: passwordStrength === 'strong' }"></span>
              </div>
              <div class="strength-text">{{ getStrengthText() }}</div>
            </div>
            
            <div class="error-message" v-if="errors.password">{{ errors.password }}</div>
          </div>
          
          <!-- 确认密码 -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">确认密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="请再次输入密码"
                required
                :class="{ 'error': errors.confirmPassword }"
              />
              <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                class="toggle-password-btn"
                aria-label="显示/隐藏密码"
              >
                {{ showConfirmPassword ? '👁️‍🗨️' : '👁️' }}
              </button>
            </div>
            <div class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
          </div>
          
          <!-- 用户协议 -->
          <div class="form-group agree-terms">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.agreeTerms" class="checkbox-input" required />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">
                我已阅读并同意
                <a href="#" class="terms-link">《用户协议》</a>
                和
                <a href="#" class="terms-link">《隐私政策》</a>
              </span>
            </label>
            <div class="error-message" v-if="errors.agreeTerms">{{ errors.agreeTerms }}</div>
          </div>
          
          <!-- 注册按钮 -->
          <button
            type="submit"
            class="register-button"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>立即注册</span>
          </button>
          
          <!-- 全局错误提示 -->
          <div class="global-error" v-if="errors.global">
            {{ errors.global }}
          </div>
        </form>
        
        <!-- 登录入口 -->
        <div class="login-link">
          <span>已有账号?</span>
          <router-link to="/login" class="link-text">立即登录</router-link>
        </div>
      </div>
      
      <!-- 注册页脚信息 -->
      <div class="register-footer">
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
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 表单状态
const form = reactive({
  phone: '',
  verificationCode: '',
  username: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

// 错误状态
const errors = reactive({
  phone: '',
  verificationCode: '',
  username: '',
  password: '',
  confirmPassword: '',
  agreeTerms: '',
  global: ''
})

// 显示密码状态
const showPassword = ref(false)
const showConfirmPassword = ref(false)
// 加载状态
const isLoading = ref(false)
// 验证码倒计时
const countdown = ref(0)
const isSendingCode = ref(false)
// 密码强度
const passwordStrength = ref('')

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// 监听密码输入，实时检查密码强度
watch(() => form.password, (newPassword) => {
  if (newPassword.length > 0) {
    passwordStrength.value = checkPasswordStrength(newPassword)
  } else {
    passwordStrength.value = ''
  }
  
  // 清除密码错误信息
  if (errors.password && errors.password !== '密码强度太弱') {
    errors.password = ''
  }
})

// 检查密码强度
const checkPasswordStrength = (password) => {
  let strength = 0
  
  // 长度检查
  if (password.length >= 8) strength++
  
  // 包含小写字母
  if (/[a-z]/.test(password)) strength++
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) strength++
  
  // 包含数字
  if (/[0-9]/.test(password)) strength++
  
  // 包含特殊字符
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  if (strength <= 2) return 'weak'
  if (strength <= 4) return 'medium'
  return 'strong'
}

// 获取密码强度文本
const getStrengthText = () => {
  const texts = {
    weak: '弱密码，请增加复杂度',
    medium: '中等强度密码',
    strong: '强密码，很安全'
  }
  return texts[passwordStrength.value] || ''
}

// 验证手机号
const validatePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 验证用户名
const validateUsername = (username) => {
  // 3-20个字符，支持中英文、数字和下划线
  const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

// 发送验证码
const sendVerificationCode = async () => {
  // 验证手机号
  if (!form.phone.trim()) {
    errors.phone = '请输入手机号'
    return
  }
  
  if (!validatePhone(form.phone)) {
    errors.phone = '请输入正确的手机号'
    return
  }
  
  errors.phone = ''
  isSendingCode.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟成功发送验证码
    alert(`验证码已发送至 ${form.phone}`)
    
    // 开始倒计时
    startCountdown()
  } catch (error) {
    errors.phone = '发送验证码失败，请稍后重试'
  } finally {
    isSendingCode.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 表单验证
const validateForm = () => {
  let isValid = true
  
  // 重置错误
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  // 验证手机号
  if (!form.phone.trim()) {
    errors.phone = '请输入手机号'
    isValid = false
  } else if (!validatePhone(form.phone)) {
    errors.phone = '请输入正确的手机号'
    isValid = false
  }
  
  // 验证验证码
  if (!form.verificationCode.trim()) {
    errors.verificationCode = '请输入验证码'
    isValid = false
  } else if (!/^\d{6}$/.test(form.verificationCode)) {
    errors.verificationCode = '验证码为6位数字'
    isValid = false
  }
  
  // 验证用户名
  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  } else if (!validateUsername(form.username)) {
    errors.username = '用户名格式不正确，支持3-20个字符，可使用中英文、数字和下划线'
    isValid = false
  }
  
  // 验证密码
  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码长度至少为6位'
    isValid = false
  } else if (form.password.length > 20) {
    errors.password = '密码长度不能超过20位'
    isValid = false
  } else if (passwordStrength.value === 'weak') {
    errors.password = '密码强度太弱，建议包含字母、数字和特殊符号'
    isValid = false
  }
  
  // 验证确认密码
  if (!form.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    isValid = false
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }
  
  // 验证用户协议
  if (!form.agreeTerms) {
    errors.agreeTerms = '请阅读并同意用户协议和隐私政策'
    isValid = false
  }
  
  return isValid
}

// 处理注册
const handleRegister = async () => {
  // 验证表单
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  errors.global = ''
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟注册成功，设置用户信息
    const mockUser = {
      id: Math.floor(Math.random() * 10000),
      username: form.username,
      phone: form.phone,
      avatar: null,
      token: 'mock-jwt-token'
    }
    
    // 保存用户信息到store
    userStore.setUserInfo(mockUser)
    
    // 注册成功提示
    alert('注册成功！欢迎加入百度贴吧')
    
    // 跳转到首页
    router.push('/')
  } catch (error) {
    // 处理注册错误
    errors.global = error.message || '注册失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-page {
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

/* 注册容器 */
.register-container {
  width: 100%;
  max-width: 460px;
  padding: 0 20px;
  z-index: 1;
}

.register-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  padding: 32px;
  position: relative;
  overflow: hidden;
}

/* 注册头部 */
.register-header {
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

.register-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* 注册表单 */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
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

/* 验证码容器 */
.verification-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.verification-input-wrapper {
  flex: 1;
}

.send-code-btn {
  padding: 12px 16px;
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  background-color: white;
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 110px;
}

.send-code-btn:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: white;
}

.send-code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f5f5;
  color: var(--text-secondary);
  border-color: #e1e5e9;
}

/* 密码强度指示器 */
.password-strength-container {
  margin-top: 8px;
}

.password-strength-labels {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.strength-label {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background-color: #e1e5e9;
  transition: all 0.3s ease;
}

.strength-label.active.weak {
  background-color: #ff4d4f;
}

.strength-label.active.medium {
  background-color: #faad14;
}

.strength-label.active.strong {
  background-color: #52c41a;
}

.strength-text {
  font-size: 12px;
  color: var(--text-secondary);
}

.strength-text.weak {
  color: #ff4d4f;
}

.strength-text.medium {
  color: #faad14;
}

.strength-text.strong {
  color: #52c41a;
}

/* 用户协议 */
.agree-terms {
  flex-direction: row;
  align-items: flex-start;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: var(--text-secondary);
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
  margin-top: 1px;
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

.terms-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.terms-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

/* 注册按钮 */
.register-button {
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

.register-button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.register-button:active:not(:disabled) {
  transform: translateY(0);
}

.register-button:disabled {
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

/* 登录链接 */
.login-link {
  text-align: center;
  margin-top: 20px;
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

/* 注册页脚 */
.register-footer {
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
  .register-card {
    padding: 24px;
    border-radius: 12px;
  }
  
  .logo-text {
    font-size: 24px;
  }
  
  .register-title {
    font-size: 20px;
  }
  
  .register-form {
    gap: 16px;
  }
  
  .form-input {
    font-size: 14px;
    padding: 11px 36px 11px 36px;
  }
  
  .input-icon {
    font-size: 14px;
  }
  
  .verification-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .verification-input-wrapper {
    width: 100%;
  }
  
  .send-code-btn {
    width: 100%;
    min-width: auto;
  }
  
  .register-button {
    font-size: 15px;
    padding: 11px 20px;
  }
  
  .footer-links {
    flex-wrap: wrap;
    gap: 12px;
  }
}

@media (max-width: 360px) {
  .register-container {
    padding: 0 16px;
  }
  
  .register-card {
    padding: 20px;
  }
  
  .form-input {
    font-size: 13px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .register-page {
    background-color: #1a1a1a;
  }
  
  .register-card {
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
}
</style>