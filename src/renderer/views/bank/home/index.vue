<template>
    <user-list @refresh-menu="get_menu" />
    <el-container class="custom-container">
        <el-aside width="230px">
            <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                :collapse="false"
                @select="handleMenuClick"
            >
                <el-sub-menu index="-1">
                    <template #title>
                        <div @click="get_user">
                            <el-icon>
                                <location />
                            </el-icon>
                            <span>WhatsApp</span>
                        </div>
                    </template>
                    <div v-for="contact in menuItems">
                        <el-menu-item
                            :index="contact.id"
                            v-if="contact.status"
                            class="menu-item-with-divider"
                        >
                            <div class="menu-item-layout">
                                <el-avatar
                                    :src="contact.avatar || 'default-avatar-path.png'"
                                    class="menu-avatar"
                                ></el-avatar>
                                <div class="menu-text-content">
                                    <p class="menu-item-name">{{ contact.name }}</p>
                                    <p class="menu-item-phone">{{ contact.phone }}</p>
                                </div>
                            </div>
                        </el-menu-item>
                    </div>
                </el-sub-menu>

                <el-menu-item index="-1" @click="seting">
                    <el-icon>
                        <setting />
                    </el-icon>
                    <template #title> 设置 </template>
                </el-menu-item>
            </el-menu>

            <!--            <div>-->

            <!--                <el-form-item label="备注">-->
            <!--                    <el-input-->
            <!--                        type="textarea"-->
            <!--                        :rows="4"-->
            <!--                        v-model="name"></el-input>-->
            <!--                </el-form-item>-->
            <!--                <br>-->
            <!--                <el-button type="danger" @click="modifyName">修改备注</el-button>-->
            <!--            </div>-->
        </el-aside>
        <user-list :user-contacts="contacts"></user-list>

        <el-main id="main_master">
            <div ref="mainElement">
                <router-view />
            </div>
        </el-main>

        <el-aside width="120px">
            <el-menu default-active="2" :collapse="false" @select="handleMenuClick">
                <el-menu-item index="-1" @click="seting">
                    <el-icon>
                        <setting />
                    </el-icon>
                    <template #title> 客户信息 </template>
                </el-menu-item>

                <el-menu-item index="-1" @click="seting">
                    <el-icon>
                        <setting />
                    </el-icon>
                    <template #title> 代理设置 </template>
                </el-menu-item>
                <el-menu-item index="-1" @click="seting">
                    <el-icon>
                        <setting />
                    </el-icon>
                    <template #title> 翻译设置 </template>
                </el-menu-item>
            </el-menu>
        </el-aside>
    </el-container>
</template>

<script>
import { getUserList } from '@renderer/api/whatsapp'
import { mapState } from 'vuex'

const { ipcRenderer } = window.electron

export default {
    name: 'Index',
    data() {
        return {
            contacts: [],
            name: '',
            id: -1
        }
    },
    computed: {
        ...mapState(['menuItems'])
    },
    mounted() {
        this.get_menu()
        ipcRenderer.on('show_name', (event, data) => {
            console.log(data)
            this.name = data['name']
            this.id = data['id']
        })
    },
    methods: {
        modifyName() {
            if (this.id > -1) {
                ipcRenderer.send('update_name', { id: this.id, name: this.name })
            }
        },
        getMainPosition() {
            const mainElement = document.getElementById('main_master')
            console.log(this.$refs.mainElement)
            if (mainElement) {
                const rect = mainElement.getBoundingClientRect()
                var r = {
                    x: Math.round(rect.x),
                    y: Math.round(rect.y),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                }
                console.log(r)
                return r

                const { top, left, width, height } = {
                    x: Math.round(rect.x),
                    y: Math.round(rect.y),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                }
                console.log(top, left, rect.x, rect.y)
                const { screenX, screenY } = window
                const x = screenX + left
                const y = screenY + top
                return { x, y, width, height }
            }
            return null
        },
        handleMenuClick(val) {
            if (val > -1) {
                console.log('当前点击窗口是', val)
                ipcRenderer.send('swithMenu', { id: val })
            }
        },
        seting() {
            this.log('set')
            this.$router.push('/set')
            ipcRenderer.send('swithMenu', { id: -1 })
        },
        get_user() {
            // 使用 this.$router.push() 方法跳转路由
            this.log('list')
            this.$router.push('/user_list')
            ipcRenderer.send('swithMenu', { id: -1 })
        },

        get_menu() {
            getUserList()
                .then((data) => {
                    this.$store.dispatch('setMenuItem', data)

                    const position = this.getMainPosition()
                    this.log('获取结果', position)
                    // 将位置信息存储到本地存储
                    ipcRenderer.send('resize-view', position)
                })
                .catch((error) => {
                    console.error('Error fetching user list:', error)
                })
        }
    }
}
</script>

<style scoped>
.custom-container {
    width: 100%; /* 设置容器的宽度为100% */
    height: 100vh; /* 设置容器的高度为视窗高度的100% */
    /* 其他样式属性，根据需要添加 */
}

.menu-item-with-divider {
    position: relative; /* 为伪元素定位 */
    margin-bottom: 10px; /* 分割线和下一个菜单项之间的距离 */
    /* 减小菜单项的整体高度 */
    height: 10px; /* 或者您想要的任何高度 */
    padding: 5px 10px; /* 适当减小内边距 */
    box-sizing: border-box;
}

.menu-item-with-divider::after {
    content: ''; /* 伪元素内容为空 */
    position: absolute;
    bottom: -10px; /* 将分割线放置在菜单项底部外面 */
    left: 0;
    right: 0;
    border-bottom: 1px solid #ebeef5; /* 分割线的样式 */
}

.menu-item-layout {
    display: flex;
    align-items: center;
}

.menu-avatar {
    /* 调整头像大小和边距 */
    --el-avatar-size: 40px;
}

.menu-text-content {
    /* 调整文本内容的大小和布局 */
    display: flex;
    flex-direction: column;
    justify-content: center; /* 垂直居中文本 */
    overflow: hidden; /* 防止内容溢出 */
}

.menu-item-name {
    /* 姓名样式 */
    margin: 0;
    font-weight: bold; /* 如果需要的话 */
}

.menu-item-phone {
    /* 电话号码样式 */
    margin: 0;
    color: #666; /* 次要信息的颜色可以稍微淡一些 */
}

/* 其他样式... */
</style>

<style scoped>
.el-menu-vertical-demo {
    width: 230px;
    //min-height: 400px;
    height: 100%;
}

.contact-info > p {
    margin: 0;
    line-height: 1.5;
}

/* 可以根据你的设计要求进一步定制 */
</style>
