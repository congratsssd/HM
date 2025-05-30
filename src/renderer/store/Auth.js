// store.js
import { createStore } from 'vuex'
import { UserLogin, UserLogout } from '@renderer/api/whatsapp'
import axios from 'axios'

export default createStore({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: {}
    },
    mutations: {
        auth_request(state) {
            state.status = 'loading'
        },
        auth_success(state, token, user) {
            state.status = 'success'
            state.token = token
            state.user = user
        },
        auth_error(state) {
            state.status = 'error'
        },
        logout(state) {
            state.status = ''
            state.token = ''
        }
    },
    actions: {
        login({ commit }, data) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                UserLogin({ account: data['user'], password: data['pwd'] })
                    .then((resp) => {
                        if (resp.code == 1) {
                            const token = resp.data.userinfo.token
                            const user = resp.data.userinfo.nickname
                            localStorage.setItem('token', token)
                            axios.defaults.headers.common['token'] = token
                            commit('auth_success', token, user)
                        }

                        resolve(resp)
                    })
                    .catch((err) => {
                        commit('auth_error')
                        localStorage.removeItem('token')
                        reject({ msg: '网络异常' })
                    })
            })
        },
        logout({ commit }) {
            return new Promise((resolve) => {
                UserLogout().then((resp) => {
                    commit('logout')
                    localStorage.removeItem('token')
                    delete axios.defaults.headers.common['Authorization']
                    resolve()
                })
            })
        }
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
        authStatus: (state) => state.status
    }
})
