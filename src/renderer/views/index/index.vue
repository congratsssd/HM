<template>
    <el-row>
        <el-col :span="0">
            <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="true" router>
                <el-menu-item
                    v-for="(item, index) in menuItems"
                    class="active"
                    :key="index"
                    :index="item.path"
                >
                    <img
                        src="@renderer/common/svg/whatsapp.svg"
                        alt="Whatsapp Icon"
                        width="24"
                        height="24"
                        class="green-icon"
                    />
                    <template #title>{{ item.name }}</template>
                </el-menu-item>
            </el-menu>
        </el-col>

        <router-view />
    </el-row>
</template>
<style>
.active {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px; /* 设置竖条的宽度 */
    background-color: #139ad3; /* 设置竖条的颜色 */
}
</style>

<script>
import '@renderer/common/css/index.css'
import { ElMessage } from 'element-plus'
const { ipcRenderer } = window.electron
import { ElMessageBox } from 'element-plus'

export default {
    name: 'Index',
    data() {
        return {
            menuItems: [
                {
                    id: 1,
                    name: 'WhatsApp',
                    path: '/whatsapp'
                }
            ]
        }
    },
    computed: {},
    mounted() {
        ipcRenderer.on('login_end', (event, resp) => {
            console.log(resp)
            if (resp.code == 0) {
                this.$router.push('/login')
                ElMessage.error(resp.msg)
            }
        })
        ipcRenderer.on('window_quit', (event, resp) => {
            window.close()
            // ElMessageBox.confirm(
            //     '您确认关闭当前窗口吗?',
            //     {
            //         confirmButtonText: '确认',
            //         cancelButtonText: '取消',
            //         type: 'warning',
            //     }
            // )
            //     .then(() => {
            //         ipcRenderer.send('window_quit',[]);
            //     })
        })
        this.$router.push({ path: '/update' })
    },
    methods: {}
}
</script>
