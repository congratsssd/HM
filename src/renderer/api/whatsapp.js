// api/user.js

import axios from 'axios'
import ApiDomainPlugin from '@renderer/apiDomain.js'

function UserLogin(data) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${ApiDomainPlugin.apiDomain}/user/login`, data)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// 获取用户列表
function getUserList() {
    return new Promise((resolve, reject) => {
        axios
            .get(`${ApiDomainPlugin.apiDomain}/index/user_list`)
            .then((response) => {
                resolve(response.data.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function AddWsUser(data) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${ApiDomainPlugin.apiDomain}/index/whatsapp_add`, data)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function UpWsUser(id, key, value) {
    console.log(id, key, value)
    var header = {}
    if (key == 'location') {
        header = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    return new Promise((resolve, reject) => {
        axios
            .post(
                `${ApiDomainPlugin.apiDomain}/index/whatsapp_save`,
                { id: id, type: key, content: value },
                header
            )
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function UpWsSer(id, key, value) {
    console.log(id, key, value)
    var header = {}
    if (key == 'location') {
        header = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    return new Promise((resolve, reject) => {
        axios
            .post(
                `${ApiDomainPlugin.apiDomain}/index/whatsapp_server_save`,
                { id: id, type: key, content: value },
                header
            )
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function GetOrder(mobile) {
    return new Promise((resolve, reject) => {
        axios
            .get(`${ApiDomainPlugin.apiDomain}/index/user_order?mobile=` + mobile)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// 获取单个用户信息
function addwindows() {
    return new Promise((resolve, reject) => {
        axios
            .get(`${ApiDomainPlugin.apiDomain}/index/user_add`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function UserLogout() {
    return new Promise((resolve, reject) => {
        axios
            .get(`${ApiDomainPlugin.apiDomain}/user/logout`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// 导出接口函数
export { getUserList, addwindows, GetOrder, AddWsUser, UpWsUser, UpWsSer, UserLogin, UserLogout }
