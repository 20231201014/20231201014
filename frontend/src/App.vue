<template>
  <div class="app">
    <!-- 顶部导航栏 -->
    <Navbar />
    
    <!-- 路由出口 -->
    <main class="main-container">
      <router-view />
    </main>
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/vue/Navbar.vue'
import Footer from './components/vue/Footer.vue'
</script>

<style>
/* CSS变量定义 */
:root {
  --primary-color: #007AFF;
  --secondary-color: #5856D6;
  --accent-color: #FF9500;
  --success-color: #34C759;
  --warning-color: #FF9500;
  --error-color: #FF3B30;
  --text-primary: #000000;
  --text-secondary: #8E8E93;
  --text-tertiary: #C7C7CC;
  --background-primary: #FFFFFF;
  --background-secondary: #F2F2F7;
  --border-color: #C6C6C8;
  --shadow-light: rgba(0, 0, 0, 0.1);
  --shadow-medium: rgba(0, 0, 0, 0.2);
  --shadow-heavy: rgba(0, 0, 0, 0.3);
  --border-radius-small: 8px;
  --border-radius-medium: 12px;
  --border-radius-large: 16px;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --transition-fast: 0.2s ease;
  --transition-medium: 0.3s ease;
  --transition-slow: 0.5s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px;
  }
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--background-secondary);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  flex: 1;
  padding-top: var(--spacing-lg);
  padding-bottom: var(--spacing-xl);
}

/* 通用容器样式 */
.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 2rem);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    max-width: 100%;
    padding: 0 1rem;
  }
}
</style>