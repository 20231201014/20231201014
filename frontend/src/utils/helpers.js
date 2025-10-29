// 通用工具函数库
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * 格式化日期为相对时间（例如：3小时前）
 * @param {string|Date} date - 日期
 * @returns {string} 格式化后的相对时间
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  return dayjs(date).fromNow()
}

/**
 * 格式化日期为指定格式
 * @param {string|Date} date - 日期
 * @param {string} format - 格式字符串，默认为 'YYYY-MM-DD HH:mm'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

/**
 * 格式化大数字（例如：1000 -> 1k, 10000 -> 1w）
 * @param {number} num - 要格式化的数字
 * @returns {string} 格式化后的数字字符串
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

/**
 * 从HTML字符串中提取纯文本
 * @param {string} html - HTML字符串
 * @returns {string} 提取的纯文本
 */
export const stripHtml = (html) => {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

/**
 * 截断文本并添加省略号
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * 验证手机号格式
 * @param {string} phone - 手机号
 * @returns {boolean} 是否为有效的手机号
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱
 * @returns {boolean} 是否为有效的邮箱
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证用户名格式（3-20个字符，支持中英文、数字和下划线）
 * @param {string} username - 用户名
 * @returns {boolean} 是否为有效的用户名
 */
export const validateUsername = (username) => {
  const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * 检查密码强度
 * @param {string} password - 密码
 * @returns {string} 强度等级：'weak', 'medium', 'strong'
 */
export const checkPasswordStrength = (password) => {
  if (!password) return 'weak'
  
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

/**
 * 生成随机ID
 * @param {number} length - ID长度
 * @returns {string} 随机ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, delay) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 深拷贝对象
 * @param {*} obj - 要拷贝的对象
 * @returns {*} 拷贝后的对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  
  const clonedObj = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }
  return clonedObj
}

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
export const getUrlParam = (name) => {
  const url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * 滚动到页面顶部
 * @param {number} duration - 动画持续时间（毫秒）
 */
export const scrollToTop = (duration = 300) => {
  const scrollHeight = window.scrollY
  const startTime = Date.now()
  
  const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  
  const animateScroll = () => {
    const currentTime = Date.now()
    const elapsed = Math.min((currentTime - startTime) / duration, 1)
    const progress = easeInOutQuad(elapsed)
    window.scrollTo(0, scrollHeight * (1 - progress))
    
    if (elapsed < 1) {
      requestAnimationFrame(animateScroll)
    }
  }
  
  requestAnimationFrame(animateScroll)
}

/**
 * 判断是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 获取设备类型
 * @returns {string} 设备类型：'desktop', 'tablet', 'mobile'
 */
export const getDeviceType = () => {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否复制成功
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      textArea.remove()
      return result
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

/**
 * 下载文件
 * @param {string} url - 文件URL
 * @param {string} filename - 文件名
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename || ''
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 图片预加载
 * @param {string[]} images - 图片URL数组
 * @returns {Promise<void[]>} 加载完成的Promise
 */
export const preloadImages = (images) => {
  return Promise.all(
    images.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = src
      })
    })
  )
}

/**
 * 获取文件大小的人类可读形式
 * @param {number} bytes - 字节数
 * @returns {string} 人类可读的文件大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 验证文件类型
 * @param {File} file - 文件对象
 * @param {string[]} allowedTypes - 允许的MIME类型数组
 * @returns {boolean} 是否为允许的文件类型
 */
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type)
}

/**
 * 验证文件大小
 * @param {File} file - 文件对象
 * @param {number} maxSize - 最大文件大小（字节）
 * @returns {boolean} 是否在允许的大小范围内
 */
export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize
}

/**
 * 生成随机颜色
 * @returns {string} 十六进制颜色值
 */
export const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

/**
 * 根据文本生成一致的颜色
 * @param {string} text - 文本
 * @returns {string} 十六进制颜色值
 */
export const generateColorFromString = (text) => {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF
    color += ('00' + value.toString(16)).substr(-2)
  }
  return color
}