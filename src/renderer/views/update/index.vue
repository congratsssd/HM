<template>
    <div class="center-container">
        <h2>
            {{ text }}
            <el-icon v-if="!show && !isUpdate" class="rotate"><Setting /></el-icon>
        </h2>
        <div v-if="show">
            <div class="demo-progress">
                <el-progress type="circle" :percentage="percentage" :status="status" />
            </div>
            <p>{{ speedText }}----{{ transferredMB }}/{{ totalMB }}</p>
        </div>
        <div v-if="isUpdate" style="margin-top: 50px">
            <el-space size="large">
                <el-button @click="handleUpdate(false)">跳过</el-button>
                <el-button @click="handleUpdate(true)" type="primary">更新</el-button>
            </el-space>
        </div>
    </div>
</template>

<style scoped>
.center-container {
    background: radial-gradient(circle, rgb(255, 255, 255), rgb(222, 254, 255), rgb(67, 195, 255));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* 使用100vh高度来充满视口 */
    width: 100vw;
    text-align: center; /* 确保文本也居中 */
}

.demo-progress .el-progress--circle {
    margin-right: 15px;
    margin-bottom: 15px; /* 如果需要，调整进度条与文案之间的距离 */
}

@keyframes rotate {
    0% {
        transform: rotate(0deg) translateY(0);
    }
    50% {
        transform: rotate(180deg) translateY(3px);
    }
    100% {
        transform: rotate(360deg) translateY(0);
    }
}

.rotate {
    animation: rotate 1s linear infinite;
}
</style>

<script>
import { ElMessage } from 'element-plus'

const { ipcRenderer } = window.electron
export default {
    name: 'Update',
    data() {
        return {
            text: '正在检测更新',
            status: '',
            percentage: 0,
            version: '1.0.0',
            speedText: '',
            totalMB: '',
            transferredMB: '',
            show: false,
            isUpdate: false
        }
    },
    mounted() {
        ipcRenderer.send('check_updates', 'a')

        ipcRenderer.on('update_version', (event, result) => {
            console.log('版本更新情况：', result)
            if (result === 500) {
                this.text = '检查更新失败'
                ElMessage({
                    type: 'warning',
                    message: '检查更新失败'
                })
                this.$router.push({ path: '/login' })
                return
            } else if (result.update) {
                this.show = true
                this.text = `[${result.use}]更新中，最新版本：` + result.new
            } else {
                this.text = '当前版本为最新'
                this.$router.push({ path: '/login' })
            }
        })
        ipcRenderer.on('requestUpdate', (ev, value) => {
            this.text = `当前版本是：${value.b}，最新版本：${value.a}。是否更新？`
            this.isUpdate = true
        })
        ipcRenderer.on('thisDownloadprogress', (event, progress) => {
            console.log(progress)
            // 计算下载速度
            let speed = progress.bytesPerSecond
            this.speedText =
                speed / 1024 / 1024 >= 0.1
                    ? (speed / 1024 / 1024).toFixed(2) + ' MB/s'
                    : (speed / 1024).toFixed(2) + ' KB/s'

            // 计算已下载的百分比
            let percentDownloaded = progress.percent.toFixed(2)

            // 计算已传输的数据量与总量，单位MB
            this.transferredMB = (progress.transferred / 1024 / 1024).toFixed(2) + ' MB'
            this.totalMB = (progress.total / 1024 / 1024).toFixed(2) + ' MB'

            // 如果小于0.1MB，转换为KB展示
            if (progress.transferred / 1024 / 1024 < 0.1) {
                this.transferredMB = (progress.transferred / 1024).toFixed(2) + ' KB'
            }
            if (progress.total / 1024 / 1024 < 0.1) {
                this.totalMB = (progress.total / 1024).toFixed(2) + ' KB'
            }
            console.log(
                'Download speed: ${speedText} - Downloaded ${percentDownloaded} (${transferredMB}/${totalMB})'
            )
            this.percentage = percentDownloaded
        })
    },
    methods: {
        handleUpdate(value) {
            if (value) {
                ipcRenderer.invoke('whetherOrNotUpdate', true)
                this.show = true
                this.isUpdate = false
            } else {
                this.$router.push({ path: '/login' })
            }
        }
    }
}
</script>
