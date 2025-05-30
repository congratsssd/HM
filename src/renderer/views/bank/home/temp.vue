<template>
    <div class="common-layout">
        <el-container :span="20">
            <el-aside :span="4">
                <el-col :span="18">
                    <el-menu
                        default-active="1"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose"
                    >
                        <el-sub-menu index="1">
                            <template #title>
                                <el-icon>
                                    <location />
                                </el-icon>
                                <span>WhatsApp</span>
                            </template>

                            <el-menu-item index="1-4-1">
                                <el-badge :value="news" class="item">
                                    <el-image
                                        style="width: 40px; height: 50px"
                                        :src="circleUrl"
                                        :fit="fit"
                                    />
                                    你好<span> +44 7826 178063</span>
                                </el-badge>
                            </el-menu-item>
                        </el-sub-menu>
                        <el-menu-item index="4">
                            <el-icon>
                                <setting />
                            </el-icon>
                            <span>设置</span>
                        </el-menu-item>
                    </el-menu>
                </el-col>
            </el-aside>
            <el-container :span="5">
                <el-header>
                    <el-button :type="success" @click="adds"> 添加端口 </el-button>
                </el-header>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
const { ipcRenderer } = window.electron
export default {
    components: {
        Document,
        IconMenu,
        Location,
        Setting
    },
    data() {
        return {
            news: 10,
            circleUrl:
                'https://media-hkg4-1.cdn.whatsapp.net/v/t61.24694-24/411321396_5602758793181228_7117749379651902030_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AdTkZL3B4ikGUJuifVRYag1Sso1to7o0agAiR-OW6OqIeQ&oe=65B79F09&_nc_sid=e6ed6c&_nc_cat=102'
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        },
        adds() {
            const existingData = JSON.parse(localStorage.getItem('data')) || []

            // 创建一条新的数据
            const newData = {
                id: existingData.length + 1, // 自增 id
                time: new Date().toLocaleString(), // 当前时间
                name: '',
                status: '',
                avatar: ''
            }
            existingData.push(newData)
            localStorage.setItem('data', JSON.stringify(existingData))
            console.log(newData.id)

            ipcRenderer.send('addMenuItem', newData.id)
        }
    }
}
</script>

<style scoped lang="stylus"></style>

<style scoped>
.demo-basic {
    text-align: center;
}

.demo-basic .sub-title {
    margin-bottom: 10px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
}

.demo-basic .demo-basic--circle,
.demo-basic .demo-basic--square {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.demo-basic .block:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
}

.demo-basic .block {
    flex: 1;
}

.demo-basic .el-col:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
}
</style>
