import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin(), bytecodePlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin(), bytecodePlugin()],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/preload/index.js'),
                    whatsapp: resolve(__dirname, 'src/preload/whatsapp/index.js')
                }
            }
        }
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer')
            }
        },
        plugins: [vue()],
        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'src/renderer/main.js'),
                    index: resolve(__dirname, 'src/renderer/index.html'),
                    unreferenced: resolve(__dirname, 'src/renderer/quitView.html')
                }
            }
        },
        server: {
            port: 3001
        }
    },
    build: {
        rollupOptions: {
            input: {
                main: 'src/main.js', // 主进程的入口文件
                renderer: 'src/renderer.js' // 渲染进程的入口文件
            }
        }
    }
})
