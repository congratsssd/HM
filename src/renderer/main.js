import { createApp } from 'vue'

// 全局样式
import '@renderer/common/styles/frame.styl'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// M
import App from '@renderer/App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// +
import router from './router'
import store from './store/index'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(store)
app.config.globalProperties.log = function (...args) {
    console.log('gyxz', ...args)
}
app.use(ElementPlus, {
    locale: zhCn
})
app.use(router)
app.mount('#app')

localStorage.removeItem('whatsapp_run')
app.config.globalProperties.$storeWhatsAppRun = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

// 全局函数来读取 WhatsApp 运行数组从 localStorage
app.config.globalProperties.$getWhatsAppRun = (key) => {
    const storedData = localStorage.getItem(key)
    return storedData ? JSON.parse(storedData) : []
}

app.config.globalProperties.storeC = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

// 全局函数来读取 WhatsApp 运行数组从 localStorage
app.config.globalProperties.storeG = (key) => {
    const storedData = localStorage.getItem(key)
    return storedData ? JSON.parse(storedData) : []
}
