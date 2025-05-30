// globalData.js

import { reactive } from 'vue'

const globalData = reactive({
    contacts: [] // 初始化全局变量
})

function setContacts(newContacts) {
    globalData.contacts = newContacts // 直接更新全局数据，而不是修改其属性
}

export { globalData, setContacts }
