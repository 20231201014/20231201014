import { createApp } from 'vue'
import { createAppWithReact } from 'veaury'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Antd from 'antd'
import 'antd/dist/reset.css'

// 创建 Pinia 实例
const pinia = createPinia()

// 创建 Veaury 混合应用
const app = createAppWithReact({
  rootComponent: App,
  // React 全局配置
  reactOptions: {
    // 可以在这里配置 React 的全局设置
  },
  // Vue 全局配置
  vueOptions: {
    // 可以在这里配置 Vue 的全局设置
  }
})

// 注册插件
app.use(router)
app.use(pinia)
app.use(ElementPlus)

// 挂载应用
app.mount('#app')