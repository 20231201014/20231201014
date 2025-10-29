<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">百度贴吧</h3>
          <p class="footer-description">
            全球最大的中文社区，分享你的兴趣，发现精彩世界。
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="微博">
              <span class="icon">🔵</span>
            </a>
            <a href="#" class="social-link" aria-label="微信">
              <span class="icon">🟢</span>
            </a>
            <a href="#" class="social-link" aria-label="QQ">
              <span class="icon">💙</span>
            </a>
          </div>
        </div>
        
        <div class="footer-section">
          <h4 class="footer-subtitle">功能导航</h4>
          <ul class="footer-links">
            <li><router-link to="/" class="footer-link">首页</router-link></li>
            <li><router-link to="/hot" class="footer-link">热门贴吧</router-link></li>
            <li><router-link to="/create-post" class="footer-link">发布帖子</router-link></li>
            <li><router-link to="/search" class="footer-link">搜索</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4 class="footer-subtitle">关于我们</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">关于贴吧</a></li>
            <li><a href="#" class="footer-link">使用帮助</a></li>
            <li><a href="#" class="footer-link">用户协议</a></li>
            <li><a href="#" class="footer-link">隐私政策</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4 class="footer-subtitle">联系我们</h4>
          <ul class="footer-links">
            <li class="footer-link">
              <span class="icon">✉️</span>
              <span>contact@tieba.com</span>
            </li>
            <li class="footer-link">
              <span class="icon">📞</span>
              <span>400-888-8888</span>
            </li>
            <li class="footer-link">
              <span class="icon">📍</span>
              <span>北京市海淀区百度科技园</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-copyright">
          &copy; {{ currentYear }} 百度贴吧毕业设计项目. 保留所有权利.
        </div>
        <div class="footer-info">
          <a href="#" class="info-link">京ICP备12345678号</a>
          <span>|</span>
          <a href="#" class="info-link">网络文化经营许可证</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

// 计算当前年份
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: var(--background-primary);
  border-top: 1px solid var(--border-color);
  padding: clamp(2rem, 5vw, 3rem) 0;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: clamp(1.5rem, 4vw, 2.5rem);
  margin-bottom: clamp(1.5rem, 4vw, 2rem);
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-subtitle {
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.footer-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.25rem;
  flex: 1;
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--background-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link:hover {
  background-color: var(--primary-color);
  transform: translateY(-3px);
}

.social-link:hover .icon {
  color: white;
}

.icon {
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-link:hover {
  color: var(--primary-color);
  transform: translateX(5px);
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
}

.footer-copyright {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.info-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.info-link:hover {
  color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .footer-info span {
    display: none;
  }
}

@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .footer-section {
    text-align: center;
    align-items: center;
  }
  
  .footer-description {
    text-align: center;
  }
  
  .footer-link {
    justify-content: center;
  }
}
</style>