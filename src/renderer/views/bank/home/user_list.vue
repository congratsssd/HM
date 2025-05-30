<template>
    <el-button type="primary" key="primary" link @click="add">
        <el-icon :size="20">
            <Plus />
        </el-icon>
        新增 Whatsapp
    </el-button>

    <el-divider></el-divider>
    <el-table :data="menuItems" style="width: 100%">
        <!-- 序号列 -->
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <!-- 头像和姓名列 -->
        <el-table-column label="访客" align="center">
            <template #default="scope">
                <el-avatar :src="scope.row.avatar" class="avatar" size="medium"></el-avatar>
                <span class="name">{{ scope.row.name }}</span>
            </template>
        </el-table-column>
        <!-- 电话号码列 -->
        <el-table-column prop="phone" label="电话号码"></el-table-column>
        <!-- 国家列 -->
        <el-table-column prop="country" label="国家"></el-table-column>
        <!-- 最后登录时间列 -->
        <el-table-column prop="lastLogin" label="最后登录时间" width="180"></el-table-column>
        <!-- 操作列 -->
        <!-- 操作列 -->
        <el-table-column label="操作" width="180">
            <template #default="scope">
                <div v-if="scope.row.status">
                    <el-button circle type="success" @click="ShowWindow(scope.row)">
                        显示
                    </el-button>

                    <el-button circle type="warning" @click="CloseWindow(scope.row)">
                        关闭
                    </el-button>
                </div>

                <div v-else>
                    <el-button circle type="success" @click="StartWindow(scope.row)">
                        启动
                    </el-button>
                    <el-button circle type="primary" @click="setWindow(scope.row)" disabled="true">
                        代理
                    </el-button>

                    <el-button
                        circle
                        v-if="!scope.row.status"
                        type="danger"
                        @click="delWindow(scope.row)"
                        disabled="true"
                    >
                        删除
                    </el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import { getUserList, addwindows } from '@renderer/api/whatsapp'
const { ipcRenderer } = window.electron
import { langue } from '@renderer/langue'
import { mapState } from 'vuex'

export default {
    name: 'UserList',
    data() {
        return {
            contacts: []
        }
    },
    computed: {
        ...mapState(['menuItems'])
    },
    mounted() {
        this.get_data()
        ipcRenderer.on('show_name', (event, data) => {
            console.log(data)
            this.name = data['name']
            this.id = data['id']
        })
    },
    methods: {
        // init_
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
        ShowWindow(row) {
            this.log('启动窗口成功：', row.id)

            ipcRenderer.send('swithMenu', { id: row.id })
        },

        StartWindow(row) {
            this.log('启动窗口成功：', row.id)
            this.$store.dispatch('setStatus', { id: row.id, status: 1 })
            ipcRenderer.send('addMenuItem', { id: row.id, proxy: row.proxy })
        },
        CloseWindow(row) {
            this.$store.dispatch('setStatus', { id: row.id, status: 0 })
            ipcRenderer.send('CloseMenu', { id: row.id, proxy: row.proxy })
        },
        add() {
            addwindows()
                .then((data) => {
                    this.log('添加窗口成功：', data)
                    this.$store.dispatch('addMenuItem', data)
                    const locationDataJSON = localStorage.getItem('position')
                    const position = JSON.parse(locationDataJSON)

                    ipcRenderer.send('addMenuItem', {
                        id: data,
                        position: position,
                        proxy: 'socks5://127.0.0.1:7890'
                    })
                })
                .catch((error) => {
                    console.error('Error fetching user list:', error)
                })
        },

        get_data() {
            getUserList()
                .then((data) => {
                    this.contacts = data
                    this.log('用户列表页重新渲染')
                    this.$store.dispatch('setMenuItem', data)
                })
                .catch((error) => {
                    this.error('Error fetching user list:', error)
                })
        }
    }
}
</script>
<script setup></script>
