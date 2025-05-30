const axios = require('axios')
const { ipcRenderer } = require('electron')
const random5DigitCode = generateRandomCode(5)
var uis = {}
var olds = {}
var windowId = ''
process.argv.forEach((val) => {
    if (val.startsWith('--window-id=')) {
        windowId = val.split('=')[1]
    }
})
var langs = false
var new_input = false

function generateRandomCode(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomCode = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        randomCode += charset[randomIndex]
    }

    return randomCode
}

var jt = true
var userid
;(function () {
    'use strict'

    WPP.webpack.onReady(function () {
        WPP.on('chat.new_message', (chat) => {
            // Your code
            console.log(
                'gyxz',
                '新对话类型：',
                chat.__x_type,
                '内容：',
                chat.__x_body,
                '发件人：',
                chat.__x_notifyName,
                chat.__x_from.user,
                '收件人',
                chat.__x_to.user
            )
        })
        getContacts()
    })

    WPP.on('chat.active_chat', (chat) => {
        if (new_input) {
            var editableDiv = document.querySelector('#main div[contenteditable="true"]')
            editableDiv.style.display = 'none'
        }

        userid = WPP.chat.getActiveChat().id.user
        langs = false
        var langs_temp = localStorage.getItem(userid + '_lg')
        if (langs_temp) {
            langs = langs_temp
        }
        handlks()
        hanld_input()
        ocr()

        var title = WPP.chat.getActiveChat().title()

        ipcRenderer.send('set_name', {
            name: title,
            id: windowId.toString()
        })

        document.getElementById('chet_new_msg').focus()
    })

    //获取联系人列表
    // Your code here...
    async function getContacts() {
        const checkWhatsAppLoadInterval = setInterval(() => {
            if (WPP.webpack.isFullReady) {
                console.log('系统加载完成', WPP.webpack.isFullReady)
                clearInterval(checkWhatsAppLoadInterval)
                var originalAddEventListener = EventTarget.prototype.addEventListener
                EventTarget.prototype.addEventListener = function (type, listener, options) {
                    // 检查事件类型是否为 'keydown' 并且元素具有指定的属性
                    if (
                        this instanceof HTMLElement &&
                        type === 'keydown' &&
                        this.getAttribute('contenteditable') === 'true' &&
                        this.getAttribute('role') === 'textbox' &&
                        this.getAttribute('spellcheck') === 'true' &&
                        this.getAttribute('data-lexical-editor') === 'true' &&
                        listener.toString().indexOf('_lexicalHandled') > -1
                    ) {
                        if (new_input) {
                            set_input()
                            return
                        }

                        console.log('回车事件,拦截', this, type, listener)

                        var customListener = (event) => {
                            if (event.key === 'Enter' || event.keyCode === 13) {
                                var content = this.querySelector('span')?.textContent || ''

                                console.log('需要翻译的内容：', content)
                                if (content != '') {
                                    var select = document.getElementById('languageSelect') // 获取select元素
                                    var selectedText = select.options[select.selectedIndex].value // 获取当前选中项的文本

                                    ipcRenderer.send('chatgpt_send', {
                                        msg: content,
                                        types: selectedText,
                                        user: WPP.chat.getActiveChat().__x_id.user,
                                        id: windowId.toString()
                                    })
                                } else {
                                    console.log('继续调用原逻辑')
                                    listener.call(this, event)
                                }
                            } else {
                                console.log('继续调用原逻辑')
                                // 然后调用原始监听器
                                listener.call(this, event)
                            }
                        }

                        return originalAddEventListener.call(this, type, customListener, options)
                    } else {
                        return originalAddEventListener.call(this, type, listener, options)
                    }
                }
                openIndexedDB()
            }
        }, 500) // 1000 毫秒等于1秒
    }

    async function set_contact(phone, name) {
        var user = await WPP.contact.get(phone)
        console.log('user', user)
        if (user) {
            user.set('name', name)
        }
    }

    async function openIndexedDB(all = true, uid = false, name = false) {
        const dbName = 'contacts-name-cache' // 数据库名称
        const tableName = 'store-' + WPP.conn.getMyUserId().user

        try {
            // 打开 IndexedDB 数据库
            const db = await indexedDB.open(dbName)

            // 通过 onupgradeneeded 事件处理程序确保表存在
            db.onupgradeneeded = function (event) {
                const db = event.target.result
                if (!db.objectStoreNames.contains(tableName)) {
                    db.createObjectStore(tableName)
                }
            }

            db.onsuccess = function (event) {
                const db = event.target.result
                // 开始事务并获取表
                if (all) {
                    const transaction = db.transaction([tableName], 'readonly')
                    const store = transaction.objectStore(tableName)

                    // 使用游标循环输出数据
                    const cursorRequest = store.openCursor()
                    cursorRequest.onsuccess = function (event) {
                        const cursor = event.target.result
                        if (cursor) {
                            set_contact(cursor.key, cursor.value)
                            cursor.continue()
                        }
                    }

                    cursorRequest.onerror = function (event) {
                        console.error('无法打开游标:', event.target.error)
                    }
                } else {
                    const transaction = db.transaction([tableName], 'readwrite')
                    const store = transaction.objectStore(tableName)

                    const getRequest = store.get(uid)

                    getRequest.onsuccess = function (event) {
                        store.put(uid, name)
                        console.log('修改完成')
                    }
                }
                transaction.oncomplete = function () {
                    console.log('数据处理完成')
                    db.close()
                }

                transaction.onerror = function (event) {
                    console.error('事务错误:', event.target.error)
                }
            }

            db.onerror = function (event) {
                console.error('打开 IndexedDB 出错:', event.target.error)
            }
        } catch (error) {
            console.error('打开 IndexedDB 出错:', error)
        }
    }

    function set_input() {
        // 获取可编辑的 div 元素
        var editableDiv = document.querySelector('#main div[contenteditable="true"]')
        // 创建一个新的 div 元素
        var newDiv = document.createElement('div')
        newDiv.id = 'chet_new_msg'
        newDiv.setAttribute('contenteditable', 'true')
        newDiv.setAttribute('role', 'textbox')
        newDiv.setAttribute('spellcheck', 'true')
        newDiv.setAttribute('title', '输入消息')
        newDiv.setAttribute('tabindex', '10')
        newDiv.setAttribute('data-tab', '10')
        newDiv.setAttribute('data-lexical-editor', 'true')
        newDiv.style.cssText =
            'max-height: 7.35em; min-height: 1.47em; user-select: text; white-space: pre-wrap; word-break: break-word;'
        newDiv.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault() // 阻止默认行为，如换行
                console.log('宝贝，进来了')

                var content = this.innerText
                console.log('需要翻译的内容：', content)
                if (content != '') {
                    var select = document.getElementById('languageSelect') // 获取select元素
                    var selectedText = select.value // 获取当前选中项的文本
                    this.innerText = ''
                    ipcRenderer.send('chatgpt_send', {
                        msg: content,
                        types: selectedText,
                        user: WPP.chat.getActiveChat().__x_id.user,
                        id: windowId.toString()
                    })
                } else {
                    console.log('继续调用原逻辑')
                    listener.call(this, event)
                }
            }
        })
        editableDiv.parentNode.insertBefore(newDiv, editableDiv.nextSibling)

        var elementA = document.getElementById('chet_new_msg')
        var nextDiv = elementA.nextElementSibling
        if (nextDiv && nextDiv.tagName === 'DIV') {
            nextDiv.remove()
        }
    }

    function hanld_input() {
        // 查找目标元素
        const referenceNode = document.querySelector('._2lryq')

        // 创建辅助框元素
        const helperBox = document.createElement('div')
        helperBox.id = 'helperBox'
        helperBox.style.border = '1px solid #d3d3d3'
        helperBox.style.marginTop = '10px'
        helperBox.style.padding = '10px'
        helperBox.style.display = 'flex'
        helperBox.style.alignItems = 'center'
        helperBox.style.backgroundColor = 'transparent'
        helperBox.style.gap = '10px'
        const languageSelect = document.createElement('select')
        languageSelect.style.flex = '1.5'
        languageSelect.style.padding = '5px'
        languageSelect.id = 'languageSelect'
        languageSelect.style.border = '1px solid #d3d3d3'
        languageSelect.style.borderRadius = '5px'
        languageSelect.addEventListener('click', function (event) {
            localStorage.setItem(userid + '_lg', this.value)
            langs = this.value

            console.log('Select 元素被点击了!')
        })
        const options = [
            { text: '请选择语种', value: '' },
            { text: '英语', value: 'en' },
            { text: '阿拉伯语', value: 'ar' },
            { text: '乌尔都语', value: 'ur' },
            { text: '印地语', value: 'hi' },
            { text: '孟加拉语', value: 'bn' },
            { text: '希伯来语', value: 'he' },
            { text: '波斯语', value: 'fa' },
            { text: '土耳其语', value: 'tr' },
            { text: '库尔德语', value: 'ku' }
        ]

        options.forEach((opt) => {
            const optionElement = document.createElement('option')
            optionElement.textContent = opt.text
            optionElement.value = opt.value
            languageSelect.appendChild(optionElement)
        })
        if (langs == false) {
            languageSelect.value = ''
        } else {
            languageSelect.value = langs
            //WPP.chat.getActiveChat().id.user
        }
        // 将下拉框和按钮添加到helperBox
        helperBox.appendChild(languageSelect)

        // 将辅助框插入到 referenceNode 的父元素中，并确保它位于 referenceNode 之前
        referenceNode.parentNode.insertBefore(helperBox, referenceNode)
    }

    function handlks() {
        // 选择要监视的目标节点
        const targetNode = document.body

        // 配置观察器的选项（这里配置子节点的变化）
        const config = { childList: true, subtree: true }

        // 创建一个新的 MutationObserver 并指定回调函数
        const observer = new MutationObserver((mutationsList, observer) => {
            // 遍历每个变化
            for (const mutation of mutationsList) {
                // 遍历新增的节点
                for (const addedNode of mutation.addedNodes) {
                    // 检查新增的节点是否为我们关注的类型（这里是 role="row"）
                    if (addedNode instanceof Element && addedNode.getAttribute('role') === 'row') {
                        ocr()
                    }
                }
            }
        })

        // 以目标节点和配置启动观察器
        observer.observe(targetNode, config)
    }

    function ocr() {
        const mainDiv = document.querySelector('#main')

        const rows = mainDiv.querySelectorAll('[role="row"]')

        // 遍历每个元素
        rows.forEach((row) => {
            // 判断消息类型
            const messageType = row.querySelector('.message-in') ? 'message-in' : 'message-out'

            const dataIdContainer = row.querySelector('div[data-id]')

            // 获取 data-id 属性的值
            var dataId = dataIdContainer ? dataIdContainer.getAttribute('data-id') : null
            if (dataId) {
                let lastIndex = dataId.lastIndexOf('_')
                dataId = dataId.slice(lastIndex + 1)
                // 获取 copyable-text 的元素
                const copyableTextElement = row.querySelector('.copyable-text')
                let copyableTextHTML = ''
                // 检查是否找到了 copyable-text 元素

                if (copyableTextElement) {
                    // 获取原始文本内容
                    const originalContent = copyableTextElement.innerText
                    if (copyableTextElement.getAttribute('gyxz') != '1') {
                        const jsonData = localStorage.getItem(dataId + '_FY')

                        uis[dataId] = copyableTextElement

                        olds[dataId] = originalContent
                        if (jsonData == '翻译中') {
                            const temp = localStorage.getItem(dataId + '_FY_' + random5DigitCode)
                            console.log(temp, temp == null)
                            if (temp == null) {
                                sendChatCompletionRequest(
                                    dataId,
                                    originalContent,
                                    copyableTextElement
                                )
                            }
                        } else {
                            if (jsonData) {
                                set_fy(dataId, jsonData)
                            } else {
                                sendChatCompletionRequest(
                                    dataId,
                                    originalContent,
                                    copyableTextElement
                                )
                            }
                        }
                    }
                }
            }
        })
    }

    function set_fy(dataId, generatedText) {
        var copyableTextElement = uis[dataId]

        if (copyableTextElement.getAttribute('gyxz') != '1') {
            copyableTextElement.setAttribute('gyxz', '1')
            var ais =
                "<br><p class='ai_fy' style='color:cornflowerblue' id='" +
                dataId +
                "_ai_fy' old='" +
                olds[dataId] +
                "_ai'>Ai翻译</p>"

            copyableTextElement.innerHTML =
                olds[dataId] + "<p style='color:#df227d' >" + generatedText + '</p>'
            copyableTextElement.insertAdjacentHTML('afterend', '<br>')
            // 假设 copyableTextElement 是包含 P 标签的父元素
            copyableTextElement.addEventListener('click', function (event) {
                // 检查被点击的元素是否是 P 标签
                if (event.target.tagName === 'P') {
                    // 您可以在这里添加您想要的逻辑
                    // 如果需要区分不同的 P 标签，可以使用 class, id 或其他属性
                    if (event.target.className === 'ai_fy') {
                        console.log('点击了 AI 翻译 P 标签', this)
                    }
                }
            })
        }
    }

    async function sendChatCompletionRequest(dataId, text, copyableTextElement) {
        localStorage.setItem(dataId + '_FY', '翻译中')
        localStorage.setItem(dataId + '_FY_' + random5DigitCode, '正在翻译')
        console.log('开始翻译')

        ipcRenderer.send('chatgpt', { msg: text, dataId: dataId, type: 0, id: windowId.toString() })
    }

    ipcRenderer.on('save_name_' + windowId.toString(), async (event, result) => {
        console.log('修养备注', result)
        var uid = WPP.chat.getActiveChat().id.user
        set_contact(uid, result['name'])
    })

    // （可选）接收来自主进程的响应
    ipcRenderer.on('chatgpt-result_' + windowId.toString(), (event, result) => {
        var dataId = result['dataId']
        if (langs == false) {
            localStorage.setItem(userid + '_lg', result['types'])
            langs = result['types']
            var select = document.getElementById('languageSelect') // 获取select元素
            select.value = langs // 获取当前选中项的文本
        }
        var elementsWithDataId = document.querySelectorAll('[data-id]')

        var generatedText = result['result']

        localStorage.setItem(dataId + '_FY', generatedText)
        localStorage.removeItem(dataId + '_FY_' + random5DigitCode)
        var found = false

        // 遍历这些元素，检查是否有包含 "123123" 的 data-id 值
        for (var i = 0; i < elementsWithDataId.length; i++) {
            var element = elementsWithDataId[i]
            var dataIdValue = element.getAttribute('data-id')

            if (dataIdValue && dataIdValue.includes(dataId)) {
                found = true
                break
            }
        }
        if (found) {
            set_fy(dataId, generatedText)
        }
    })

    ipcRenderer.on('chatgpt-send_chat_' + windowId.toString(), async (event, result) => {
        await WPP.chat.sendTextMessage(result['user'], result['result'])
        input_clear()
    })

    function input_clear() {
        let el = document.querySelector(
            '#main .copyable-area [contenteditable="true"][role="textbox"]'
        )
        let replaceText = ' '
        let range = document.createRange()
        range.selectNodeContents(el)
        let sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)

        const dataTransfer = new DataTransfer()
        dataTransfer.setData('text', replaceText)
        const events = new ClipboardEvent('paste', {
            clipboardData: dataTransfer,
            bubbles: false
        })
        el.dispatchEvent(events)
    }
})()
