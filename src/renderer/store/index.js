// store.js
import { createStore } from 'vuex'

export default createStore({
    state: {
        menuItems: [
            // 初始菜单项
        ]
    },
    mutations: {
        ADD_MENU_ITEM(state, item) {
            state.menuItems.push(item)
        },
        SET_MENU(state, item) {
            state.menuItems = item
        },
        SET_MENU_ITEM(state, items) {
            state.menuItems.forEach((item) => {
                if (item.id == items.id) {
                    item.status = items['status']
                }
            })
        }
        // 更多mutations...
    },
    actions: {
        addMenuItem({ commit }, item) {
            commit('ADD_MENU_ITEM', item)
        },
        setMenuItem({ commit }, item) {
            console.log(item)
            item.forEach((item) => {
                item.status = 0
            })
            commit('SET_MENU', item)
        },
        setStatus({ commit }, item) {
            commit('SET_MENU_ITEM', item)
        }
        // 更多actions...
    }
    // 更多配置...
})
