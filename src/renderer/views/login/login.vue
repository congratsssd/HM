<template>
    <div class="login">
        <p class="logo">
            <img src="@renderer/common/png/logo.png" />
        </p>
        <h2 class="flex">
            请登录
            <el-dropdown>
                <span class="el-dropdown-link">
                    <el-icon><Avatar /></el-icon> </span
                ><img src="@renderer/common/png/logo.png" />
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>英文</el-dropdown-item>
                        <el-dropdown-item>中文</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </h2>
        <el-form size="large">
            <el-form-item label="">
                <el-input v-model="code" placeholder="请输入激活码" />
            </el-form-item>
            <el-form-item label="">
                <el-button block type="primary" :loading="login" @click="submitForm"
                    >登录</el-button
                >

                <el-button block type="primary" @click="end">停止</el-button>
            </el-form-item>
        </el-form>
        <el-form size="large">
            <el-form-item label="">
                <el-input v-model="proxy" placeholder="代理" />
            </el-form-item>
        </el-form>
        <el-form size="large">
            <el-form-item label="">
                <el-input v-model="server" placeholder="服务" />
            </el-form-item>
        </el-form>
        <p>
            <el-checkbox v-model="check_read"> 我已阅读并同意 </el-checkbox>
            <el-button type="text">用户协议</el-button>和<el-button type="text">用户协议</el-button>
        </p>
        <p>
            <el-checkbox v-model="s"> 代理 </el-checkbox>
            <el-checkbox v-model="hasHold"> 保持登录 </el-checkbox>
        </p>
        <p class="footer">
            {{ err }}
            {{ copyright }}
        </p>
    </div>
</template>
<script>
import store from '@renderer/store/Auth'
import { ElMessageBox, ElMessage } from 'element-plus'

const { ipcRenderer } = window.electron

export default {
    name: 'Login',
    data() {
        return {
            code: '',
            copyright: '本产品仅支持美元付款，任何非美元收款的渠道可能存在诈骗风险。',
            hasHold: true,
            name: '',
            pwd: '',
            login: false,
            s: false,
            check_read: true,
            proxy: '',
            err: '',
            server: 'http://api.haimapro.com'
        }
    },
    mounted() {
        console.log('信息', localStorage.getItem('login_delivery'))
        if (localStorage.getItem('login_delivery')) {
            this.code = localStorage.getItem('login_user')
            this.hasHold = true
        }
        ipcRenderer.send('get_p')
        ipcRenderer.on('login_er', (event, resp) => {
            this.err = resp
        })

        ipcRenderer.on('proxys', (event, resp) => {
            this.proxy = resp
        })

        ipcRenderer.on('login_result', (event, resp) => {
            console.log(resp)
            if (resp.code == 0) {
                ElMessage.error(resp.msg)
                this.login = false
                return
            }
            localStorage.setItem('login_user', this.code)
            localStorage.setItem('login_delivery', this.hasHold)
            console.log('设置海马', resp.is_hny)
            localStorage.setItem('login_hny', resp.is_hny)
            // 登录成功，比如重定向到主页
            this.$router.push('/whatsapp')
            this.login = false
        })
    },
    methods: {
        submitForm() {
            this.login = true
            ipcRenderer.send('ws_login', {
                ws_type: 'User',
                type: 'login',
                user: this.code,
                proxy: this.proxy,
                server: this.server,
                s: this.s
            })
        },
        end() {
            this.login = false
            ipcRenderer.send('login_end', {
                ws_type: 'User',
                type: 'login',
                user: this.code,
                proxy: this.proxy
            })
        }
    }
}
</script>
<style lang="scss">
.login {
    background: url('@renderer/common/png/bg.jpg') no-repeat top right;
    background-size: 100% 100%;
    padding: 100px 0 0 100px;
    position: relative;
    width: 100vw;
    height: 100vh;
    .logo {
        img {
            width: 100px;
        }
    }
    h2 {
        display: flex;
        align-items: center;
        margin: 15px 0;
    }
    .el-form {
        width: 400px;
        .el-button {
            flex: 1;
        }
    }
    .el-dropdown {
        margin: 0 0 0 10px;
    }
    p {
        color: #333;
        line-height: 32px;
        .el-button {
            vertical-align: bottom;
            padding: 0;
            & + .el-button {
                margin: 0;
            }
        }
    }
    .footer {
        position: fixed;
        bottom: 30px;
        color: #999;
    }
}
</style>
