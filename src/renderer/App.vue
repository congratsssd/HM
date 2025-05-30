<template>
    <Index></Index>
</template>
<script>
import Index from '@renderer/views/index/index.vue'
const { ipcRenderer } = window.electron
export default {
    name: 'App',
    components: {
        Index // 注册 Index 组件，使其可以在模板中使用
    },
    // 其他组件选项和内容
    mounted() {
        this.getVersion()
    },
    methods: {
        getVersion: async () => {
            // const version = await ipcRenderer.invoke('get-version')
            // document.title = document.title + '-' + version
            ipcRenderer.send('set-version', document.title)
        }
    }
}
</script>
