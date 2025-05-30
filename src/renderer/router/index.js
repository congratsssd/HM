import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@renderer/views/index/index.vue'

import Whatsapp from '@renderer/views/whatsapp/user_list.vue'
import Update from '@renderer/views/update/index.vue'
import Login from '@renderer/views/login/login.vue'

const routes = [
    { path: '/home', component: Index, exact: true, meta: { requiresAuth: true } },
    // 精确匹配 #/home，指向Home页面
    { path: '/whatsapp', component: Whatsapp, exact: true, meta: { requiresAuth: true } },
    { path: '/update', component: Update, exact: true, meta: { requiresAuth: true } },
    { path: '/login', component: Login, exact: true }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
