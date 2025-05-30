 import { ipcRenderer, contextBridge } from 'electron'

import { tr } from './tr'
 import { inputEmits } from 'element-plus'

 import Store from 'electron-store'
 const store = new Store()

var last_sr = ''
var div_name = '2'

 if(localStorage.getItem('ws_is_name')){
     div_name=localStorage.getItem('ws_is_name')
 }
var is_auto_tr=false//定义is_auto_tr函数，初始为 false，启用后可变为函数、定时器 ID 或监听器实例，便于后续清理


ipcRenderer.on('ws_is_name', (ev, is_Translate) => {
    is_Translate = is_Translate ? '1' : '2'
    console.log('监控到开关自定义', is_Translate)
    div_name = is_Translate
    localStorage.setItem('ws_is_name', is_Translate)
    if (is_Translate == '1') {
        openIndexedDB()
        //添加

        //添加完成
    } else {
        window.location.reload()
    }
})
async function getConfig() {
    try {
        const response = await fetch('https://api.ultra-coding.com/common/config', {
            method: 'POST', // 根据接口要求可修改为 GET 或 POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                extensionName: 'Whatsapp message translator (Unofficial)'
            })
        })
        if (!response.ok) {
            throw new Error(`请求失败，状态码：${response.status}`)
        }
        const data = await response.json()
        console.log('返回数据：', data)
        return data
    } catch (error) {
        console.error('发生错误：', error)
        throw error
    }
}

var configs
// 调用示例
getConfig()
    .then((config) => {
        // 使用获取的 config
        console.log('配置：', config)
        configs = config
    })
    .catch((error) => {
        // 错误处理
        console.error('错误：', error)
    })

// preload.js
window.addEventListener('DOMContentLoaded', () => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@wppconnect/wa-js'

    script.onload = () => {
        console.log('✅ WPPConnect 已加载')
        if (window.WPP) {
            console.log('✅ WPP 变量已定义:', window.WPP)

            function waitForMainReady(callback) {
                const interval = setInterval(() => {
                    if (WPP?.conn?.isMainReady && WPP.conn.isMainReady()) {
                        clearInterval(interval)
                        console.log('✅ WhatsApp Web 已准备就绪！')
                        callback()
                    }
                }, 500) // 每 500ms 检查一次
            }


            // 监听 WhatsApp Web 是否加载完成
            waitForMainReady(() => {
                gyxz_hook()

            })

        }
    }

    script.onerror = () => {
        console.error('❌ WPPConnect 加载失败')
    }

    document.head.appendChild(script)
})

window.addEventListener('DOMContentLoaded', () => {
    // 插入占位提示
    const loader = document.createElement('div')
    loader.innerHTML = '<h1>Loading...</h1>' // 你的加载提示HTML
    loader.id = 'loader'
    document.body.appendChild(loader)
    // 监听加载事件
    window.addEventListener('load', () => {
        // 移除占位提示
        const existingLoader = document.getElementById('loader')
        if (existingLoader) {
            existingLoader.remove()
        }
    })
})

const random5DigitCode = generateRandomCode(5)
var uis = {}
var olds = {}
var windowId = ''
var app_name = '海马'
var isTranslate = true
const ci = '#main .lexical-rich-text-input>div',//定义ci
    li = '#main button>span[data-icon="send"]'

 const cachedStatus = localStorage.getItem('ws_is_name')//这是一个新的功能变量调取并赋值，所以需要重新将这个变量调取并赋值
 if (cachedStatus) {
     div_name = cachedStatus // 保留原始值 '1' 或 '2'
     is_auto_tr = cachedStatus === '2' //默认实时翻译关闭
     console.log('💾 加载缓存状态:', cachedStatus, '| 实时翻译:', is_auto_tr)
 } else {
     is_auto_tr = false
 }

 ipcRenderer.on('st_fy', (ev, is_Translate) => {
     is_Translate = is_Translate ? '1' : '2'
     is_auto_tr=is_Translate
     localStorage.setItem('ws_translate_key', is_Translate)

     console.log('📦 已缓存实时翻译开关状态:', is_Translate)
 })
process.argv.forEach((val) => {
    if (val.startsWith('--window-id=')) {
        windowId = val.split('=')[1]
    }
})
var ri,
    ii,
    oi = new WeakSet()

var all_name = false

async function gyxz_hook() {
    console.log('WPP加载结果：', window.WPP)

    WPP.webpack.isFullReady = true
    var langs = false
    var fyjg
    var jt = true
    var userid
    var msg_hook = false

    function hook_msg() {
        Object.entries(WPP.webpack.modules()).forEach(([key, module]) => {
            // 确保 module 不为 null 并检查 sendTextMsgToChat 函数
            if (module && typeof module.sendTextMsgToChat === 'function') {
                const old_send = module.sendTextMsgToChat
                if (!msg_hook) {
                    module.sendTextMsgToChat = function (...args) {
                        if (!isTranslate) {
                            return old_send.apply(this, args)
                        } else {
                            fyjg = tr('.real-time-tranlate-text').text()
                            if (fyjg.includes('翻译失败')) {
                                return
                            }
                            if (fyjg.length > 1) {
                                args[1] = fyjg
                                fyjg = ''
                                tr('.real-time-tranlate-text').text('')
                                return old_send.apply(this, args)
                            } else {
                                return old_send.apply(this, args)
                            }
                        }
                    }
                }
                console.log(
                    `在模块 ${key} 中找到了函数 sendTextMsgToChat`,
                    old_send,
                    module.sendTextMsgToChat
                )
                // 这里可以执行更多的操作
            }
        })
        msg_hook = true
    }

    function checkForElements(element = false) {
        console.log('开始！')
        if (element == false) {
            element = document.querySelector('[title="Chats"]')
        }
        if (element) {
            console.log('执行页面初始化啦！')
            // clearInterval(intervalId_Doms)

            // hook_msg()

            openIndexedDB()
            init_ws()
            var $ = require('jquery')
            ;(ri = $(
                '<style>\n#custom-context-menu {\n  position: absolute;\n  border: 1px solid #ddd;\n  background-color: #f1f1f1;\n  z-index: 999;\n  border-radius: 5px;\n  padding: 3px;\n  min-width: 60px;\n}\n\n#custom-context-menu .menu-item {\n  padding: 4px;\n  cursor: pointer;\n  font-size: 13px;\n}\n\n#custom-context-menu .menu-item:hover {\n  background-color: #0373fa;\n  border-radius: 3px;\n  color:#fff;\n}\n</style>'
            )),
                (ii = $("<div id='custom-context-menu' style='display: none;'></div>"))
            cv()
            console.log('监听body事件')

            //
            $('body').on('keyup', ci, () => {
                if (isTranslate) {
                    console.log('获取输入内容')
                    const e = document.querySelector(ci)
                    const msg = e.__lexicalTextContent.split('\n\n\n\n').join('\n') + ' '
                    const punctuation = ['?', '!', '.', '？', '！', '。', '.']
                    if (punctuation.includes(msg.slice(-1))) {
                        ipcRenderer.send('chatgpt_send', {
                            id: windowId.toString(),
                            info: WPP.conn.getMyUserId().user,
                            user: WPP.chat.getActiveChat().__x_id.user,
                            msg
                        })
                        set_fy_jg(tr('.real-time-tranlate-text'), '翻译中，稍等')
                        console.log('翻译原文：', msg)
                    }
                }
            })

            document.addEventListener(
                'keydown',
                (e) => {
                    if ((e.metaKey || e.ctrlKey) && 'c' === e.key.toLocaleLowerCase()) {
                        1 === tr(e.target).find('.message-translate-content').length &&
                            (navigator.clipboard.writeText(document.getSelection().toString()),
                            e.preventDefault())
                    }
                },
                !0
            )
        }
    }

    async function getRealContacts() {
        try {
            const contacts = await WPP.contact.list()
            const realContacts = contacts.filter((c) => c.isAddressBookContact === 1)
            console.log('📋 真实联系人列表:', realContacts)
            return realContacts.length
        } catch (error) {
            console.error('❌ 获取联系人失败:', error)
        }
        return 0
    }

    async function init_ws() {
        ipcRenderer.send('ws-user-loading', true)
        var only = WPP.conn.getMyUserId().user
        var r = await WPP.contact.get(only)
        var user_info = {
            phone: only,
            avatar: await WPP.contact.getProfilePictureUrl(only),
            name: r.pushname || r.__x_verifiedName,
            id: windowId.toString(),
            contanct_list: await getRealContacts()
        }
        console.log('用户基础信息', user_info)
        ipcRenderer.send('set_ws_info', user_info)

        var user_list = JSON.stringify(await WPP.contact.list())
        ipcRenderer.send('ws_send', {
            ws_type: 'Whats',
            type: 'user_list',
            id: windowId.toString(),
            user_list: user_list
        })
    }
    // 每隔500毫秒执行一次检查
    // var intervalId_Doms = setInterval(checkForElements, 500)

    WPP.webpack.onReady(function () {
        console.log('加载完成咯11', WPP.webpack.isFullReady)
        WPP.on('chat.new_message', (chat) => {
            // Your code
            var dataId = chat.id.id
            init_ws()
            if (chat.type == 'ptt') {
                ptt_set(dataId, chat)
            } else {
                ipcRenderer.send('new_msg', {
                    info: WPP.conn.getMyUserId().user,
                    user: WPP.chat.getActiveChat()?.__x_id.user,
                    id: windowId.toString(),
                    data: JSON.stringify(chat)
                })
            }
            if (chat.type == 'location') {
                ipcRenderer.send('result_ws_other', {
                    user: chat.id.remote.user,
                    dataId: dataId,
                    type: 'location',
                    postion: {
                        lat: chat.lat,
                        lng: chat.lng,
                        loc: chat.loc
                    },
                    id: windowId.toString()
                })
            }
        })
    })

    WPP.on('conn.online', (online) => {
        console.log('在线状态：', online)

        ipcRenderer.send('ws_send', {
            ws_type: 'Whats',
            type: 'online',
            id: windowId.toString(),
            online: online
        })
    })
    WPP.on('chat.active_chat', async (chat) => {
        console.log('激活聊天页面');
        ipcRenderer.send('ws-user-loading', true)

        var csss = configs.data.systemSendMsgBtn
        const e = document.querySelector(csss)
        var trs = require('jquery')

        var $target = trs(csss)

        // 如果找到目标元素，并且它后面没有 "myTranslateBtn" 按钮，则追加按钮
        if ($target.length > 0 && $target.find('a.myTranslateBtn').length === 0) {
            $target.append(
                `<a class="myTranslateBtn" href="#">
      <svg t="1676293033227" class="icon" viewBox="0 0 1024 1024" version="1.1"
           xmlns="http://www.w3.org/2000/svg" p-id="1243" width="24" height="24">
        <path d="M166 403.612c22.092 0 40-17.908 40-40v-62h140v62c2.112 53.072 77.906 53.032 80 0v-214c-8.264-199.044-291.81-198.89-300 0v214c0 22.092 17.908 40 40 40z m40-254c3.856-92.888 136.178-92.816 140 0v72h-140z m234.172 590.38c42.236 42.716 42.32 112.166 0.25 154.988l-61.524 64.29c-15.292 15.976-40.614 16.502-56.554 1.244-15.96-15.274-16.516-40.594-1.244-56.556l42.436-44.344H212.5C95.328 859.612 0 764.286 0 647.112v-161.5c2.112-53.072 77.906-53.032 80 0v161.5c0 73.06 59.44 132.5 132.5 132.5h153.826l-46.334-45.442c-15.772-15.468-16.018-40.794-0.548-56.566s40.796-16.016 56.566-0.548l63.73 62.502 0.432 0.434zM1024 380.112v161.5c-2.112 53.072-77.906 53.032-80 0v-161.5c0-73.06-59.44-132.5-132.5-132.5h-153.826l46.334 45.442c15.772 15.468 16.018 40.794 0.548 56.566-15.478 15.778-40.802 16.01-56.566 0.548l-63.73-62.502-0.436-0.434c-42.236-42.716-42.32-112.166-0.25-154.988l61.524-64.29c15.272-15.96 40.592-16.516 56.554-1.244 15.96 15.274 16.516 40.594 1.244 56.556L660.46 167.61h151.036C928.672 167.612 1024 262.94 1024 380.112z m-60 319.5c0 22.092-17.908 40-40 40h-21.99c-4.884 42.434-39.134 130.046-84.268 180.73 26.094 14.15 57.262 23.27 94.258 23.27 22.092 0 40 17.908 40 40s-17.908 40-40 40c-57.514 0-109.952-15.826-155.89-47.042-45.574 31.018-98.234 47.042-156.11 47.042-22.092 0-40-17.908-40-40s17.908-40 40-40c34.546 0 66.088-7.724 94.44-23.066-12.404-14.704-23.884-30.858-34.378-48.398-11.342-18.958-5.168-43.52 13.79-54.862 18.956-11.344 43.52-5.168 54.862 13.788 7.5 12.534 16.55 25.656 27.34 38.332a282.312 282.312 0 0 0 17.192-22.642c27.328-39.914 41.51-81.504 47.386-107.152H588c-53.072-2.112-53.032-77.906 0-80h130v-40c2.112-53.072 77.906-53.032 80 0v40h126c22.092 0 40 17.908 40 40z" p-id="1244" fill="${e.textColor}"></path>
      </svg>
    </a>`
            )
            trs('.myTranslateBtn').click(function (ee) {
                ee.preventDefault()
                var e = document.querySelector(ci)
                var msg = e.__lexicalTextContent.split('\n\n\n\n').join('\n') + ' '
                ipcRenderer.send('chatgpt_send', {
                    id: windowId.toString(),
                    info: WPP.conn.getMyUserId().user,
                    user: WPP.chat.getActiveChat().__x_id.user,
                    msg
                })
                last_sr = msg

                set_fy_jg(tr('.real-time-tranlate-text'), '翻译中，稍等')
                console.log('翻译原文：', msg)
            })
        }

        if (!msg_hook) {
            hook_msg()
        }
        userid = WPP.chat.getActiveChat().id.user
        langs = false
        var langs_temp = localStorage.getItem(userid + '_lg')
        if (langs_temp) {
            langs = langs_temp
        }
        handlks()
        hanld_input()

        var title = WPP.chat.getActiveChat().title()
        ipcRenderer.send('set_name', {
            name: title,
            user: userid,
            id: windowId.toString(),
            avatar: await WPP.contact.getProfilePictureUrl(userid)
        })
        if (all_name) {
            openIndexedDB(false, userid, title)
        }

        // 定时函数
        const debounce = (func, delay) => {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this,  args);
                }, delay);
            };
        }


        const debouncedSend = debounce((text) => {
            // 实时翻译状态检查
            if (is_auto_tr === '1' || is_auto_tr === true) {
                // ✅ 开启实时翻译，发送翻译请求
                ipcRenderer.send('chatgpt_send', {
                    info: WPP.conn.getMyUserId().user,
                    msg: text,
                    user: WPP.chat.getActiveChat().__x_id.user,
                    id: windowId.toString()
                })
                console.log('✅ 实时翻译已开启，正在翻译：', text)
            } else {
                // ❌ 实时翻译关闭，不发送请求，也不清空翻译框
                console.log('🚫 实时翻译已关闭，跳过翻译：', text)
            }
        }, 500)
         // 翻译input

            tr(ci)[0].addEventListener('input',ev => {
                    console.log("翻译原文：", ev.target.innerText)
                    debouncedSend(ev.target.innerText);

            })



        //添加完成
    })
//判断参数变量
    checkForElements(true)
    async function ptt_set(dataId, chat) {
        ipcRenderer.send('result_ws_other', {
            user: chat.id.remote.user,
            dataId: dataId,
            type: 'ptt',
            video: await WPP.chat.downloadMedia(chat.id._serialized).then(WPP.util.blobToBase64),
            id: windowId.toString()
        })
        var video = await WPP.chat.downloadMedia(chat.id._serialized).then(WPP.util.blobToBase64)
        chat.notifyName = video
        ipcRenderer.send('new_msg', {
            info: WPP.conn.getMyUserId().user,
            user: WPP.chat.getActiveChat()?.__x_id.user,
            id: windowId.toString(),
            data: JSON.stringify(chat)
        })
    }

    function hanld_input() {
        tr('footer').has('.real-time-tranlate-content').length > 0 ||
            (({
                parent: e,
                css: t = 'font-size:12px;padding:10px 20px 10px 0;display:flex;display:flex;align-items:center;'
            }) => {
                const r = '',
                    i = app_name
                tr(e).before(
                    `<div class="real-time-tranlate-content" style="${t}">\n        <div style="border-left:2px solid rgb(34,165,81);padding-left:20px;word-break: break-word;width: 100%;">\n          <div style="color:rgb(34,165,81)">${i}实时翻译</div>\n          <div class="real-time-tranlate-text" style="max-height:100px;overflow:auto;">${
                        r ? '...' : ''
                    }</div>\n        </div>\n      </div>`
                )
            })({
                parent: 'footer>div:first-child',
                css: 'background: var(--rich-text-panel-background);font-size:12px;line-height:1.5;padding:10px 20px 0 65px;display:flex;display:flex;align-items:center;'
            })
        const e = document.querySelector(ci)
        console.log('主动翻译')
        if (e.__lexicalTextContent.split('\n\n\n\n').join('\n').length > 1) {
            ipcRenderer.send('chatgpt_send', {
                info: WPP.conn.getMyUserId().user,
                msg: e.__lexicalTextContent.split('\n\n\n\n').join('\n'),
                user: WPP.chat.getActiveChat().__x_id.user,
                id: windowId.toString()
            })
            console.log('翻译原文：', e.__lexicalTextContent.split('\n\n\n\n').join('\n'))
        }
    }

    function translateRender() {
        tr('#main div[role="application"]>div[role="row"]').forEach((e) => {
            if (tr(e).has('[role=button]').length > 0 || tr(e).find('img').length > 0) {
                si([tr(e).find('img').last()[0]])
            }
            if (
                tr(e).has('.message-translate-content').length > 0 ||
                0 === tr(e).has('.copyable-text').length
            )
                return

            if (tr(e).has('[data-icon=map-placeholder]').length > 0) {
                return
            }
            const t = tr(
                `<div class='message-translate-content' style='${(() => {
                    const e = {}
                    return `font-weight:${e.fontWeight || 400};font-size:${
                        e.fontSize || 12
                    }px;color:${
                        e.color || '#008000'
                    };border-top:1px dashed #333;margin-top:4px;padding-top:4px;`
                })()}margin-bottom:5px;'></div>`
            )
            t.insertAfter(tr(e).find('.copyable-text[data-pre-plain-text]'))
            const n = tr(e).find('.copyable-text[data-pre-plain-text] .copyable-text').text()
            console.log('聊天记录翻译', n)
            if (n) {
                di(tr(e).find('.message-translate-content'), n, tr(e))
                !(function (e, t = []) {
                    ai(e, [
                        {
                            label: '复制',
                            callback(e) {
                                copyToClipboard(tr(e.target).text())
                                // navigator.clipboard.writeText(tr(e.target).text())
                            }
                        },
                        ...t
                    ])
                })([t[0], tr(e).find('.copyable-text[data-pre-plain-text]')[0]])
            }
        })
    }

    function clearTranslateRender() {
        tr('#main div[role="application"]>div[role="row"]').forEach((e) => {
            if (tr(e).find('.message-translate-content')[0])
                tr(e).find('.message-translate-content')[0].remove()
        })
    }

    //聊天记录翻译+复制功能实现
    function handlks() {
        ipcRenderer.on('ws_is_translate', (ev, is_Translate) => {
            isTranslate = is_Translate
            console.log(isTranslate)
            if (isTranslate) translateRender()
            else clearTranslateRender()
            if (!isTranslate) {
                fyjg = tr('.real-time-tranlate-text').text()
                tr('.real-time-tranlate-text').text('')
            }
        })

        const targetNode = document.body
        const config = { childList: true, subtree: true }
        const observer = new MutationObserver((mutationsList, observer) => {
            if (!isTranslate) return
            translateRender()
        })
        observer.observe(targetNode, config)
    }
}

//手动初始化
ipcRenderer.on('server_init', () => {
    console.log('开始初始化信息！')

    gyxz_hook()
})

function copyToClipboard(text) {
    var textarea = document.createElement('textarea')
    textarea.textContent = text
    document.body.appendChild(textarea)

    textarea.select()
    try {
        return document.execCommand('copy') // Security exception may be thrown by some browsers.
    } catch (ex) {
        console.warn('Copy to clipboard failed.', ex)
        return false
    } finally {
        document.body.removeChild(textarea)
    }
}

ipcRenderer.on('save_name_' + windowId.toString(), async (event, result) => {
    var uid = WPP.chat.getActiveChat().id.user
    console.log('修改你猜', result)
    set_contact(uid, result['name'])
    openIndexedDB(false, uid, result['name'])
    await backups()
})

/**
 * 处理翻译失败
 * @param {*} type   'input' | 'list'
 * @param {*} dataId
 */
const translatedFail = (type, dataId, r = '') => {
    let text
    let inputElement

    if (type === 'input') {
        // 处理输入框
        text = document.querySelector(ci).__lexicalTextContent.split('\n\n\n\n').join('\n') // 未翻译的文字
        inputElement = tr('.real-time-tranlate-text')[0] // 目标输出dom
        inputElement.innerHTML = ''

        if (text.length === 0) return
    } else {
        // 处理聊天记录
        text = tr(olds[dataId][0].parentNode)
            .find('.copyable-text[data-pre-plain-text] .copyable-text')
            .text() // 未翻译的文字
        inputElement = olds[dataId][0] // 目标输出dom
    }
    // const span = document.createElement('span')
    const button = document.createElement('button')
    // span.innerText = '翻译失败:'+JSON.stringify(r)
    button.innerHTML = '[再次翻译]翻译失败:' + JSON.stringify(r)
    button.style.padding = `5px 10px`
    button.style.cursor = 'pointer'

    button.onclick = () => {
        if (type === 'list') sendChatCompletionRequest(dataId, text)
        else {
            ipcRenderer.send('chatgpt_send', {
                info: WPP.conn.getMyUserId().user,
                msg: text,
                user: WPP.chat.getActiveChat().__x_id.user,
                id: windowId.toString()
            })
        }
        inputElement.innerHTML = '重新翻译中...'
    }

    inputElement.appendChild(button)

    // inputElement.appendChild(span)
}

// 收消息-翻译
 ipcRenderer.on('chatgpt-result_' + windowId.toString(), (event, result) => {
     var dataId = result['dataId']
     if (!result.types) {
         set_fy_jg(olds[dataId], "翻译失败" + JSON.stringify(result))
         // translatedFail('list', dataId, result)
         return
     }
     var generatedText = result['result']
     console.log("设置翻译结果啦", dataId, olds[dataId], generatedText)
     set_fy_jg(olds[dataId], generatedText)
     translated_hm('save', dataId, generatedText)
     delete olds[dataId]
 })

//发送消息-翻译
ipcRenderer.on('chatgpt-send_chat_' + windowId.toString(), async (event, result) => {
    // debugger
    if (!result.types) {
        translatedFail('input', '', result)
        return
    }
    if (result.types == '失败') {
        translatedFail('input', '', result)
        return
    }

    set_fy_jg(tr('.real-time-tranlate-text'), result['result'])
})

//发送位置
ipcRenderer.on('send_location_' + windowId.toString(), async (event, result) => {
    console.log('发送位置', result)
    WPP.chat.sendLocationMessage(WPP.chat.getActiveChat().id._serialized, result)
})

ipcRenderer.on('send_audio_' + windowId.toString(), async (event, result) => {
    // console.log('发送语言', result)
    WPP.chat.sendFileMessage(WPP.chat.getActiveChat().id._serialized, result.r, {
        type: 'audio',
        isPtt: true // false for common audio
    })
})

ipcRenderer.on('ws_open_load', () => {
    location.reload()
})

//开始备份联系人
ipcRenderer.on('backup_start', async () => {
    await backups()
})

//开始备份联系人
ipcRenderer.on('recovd', (event, result) => {
    console.log('要恢复的数据！', result)
    const openDbRequest = indexedDB.open('contacts-name-cache', 2)

    openDbRequest.onupgradeneeded = (event) => {
        const db = event.target.result
        const storeName = 'store-' + WPP.conn.getMyUserId().user

        // 如果对象存储表存在，先删除它
        if (db.objectStoreNames.contains(storeName)) {
            db.deleteObjectStore(storeName)
            console.log(`Object store ${storeName} deleted successfully`)
        }

        // 重新创建对象存储表
        db.createObjectStore(storeName) // 这里你可以指定 keyPath
    }

    openDbRequest.onsuccess = (event) => {
        const db = event.target.result
        const storeName = 'store-' + WPP.conn.getMyUserId().user

        const transaction = db.transaction(storeName, 'readwrite')
        const objectStore = transaction.objectStore(storeName)

        // 假设 data 是要写入的数据数组
        result.forEach(({ key, value }) => {
            const request = objectStore.add(value, key) // 使用指定的 key
            request.onerror = (error) => {
                console.error(`Error writing data to ${storeName}`, error)
            }
        })
        openIndexedDB()
        transaction.oncomplete = () => {
            console.log(`Data written to ${storeName} successfully`)
        }
    }

    openDbRequest.onerror = (error) => {
        console.error('Error opening IndexedDB', error)
    }
})

async function set_contact(phone, name) {
    var user = await WPP.contact.get(phone)
    console.log('修改昵称', user)
    if (user) {
        user.set('name', name)
    }
}

/**
 * 创建本地数据库用于存储已翻译的数据
 * @param {*} all
 * @param {*} uid
 * @param {*} name
 */
async function openIndexedDB(all = true, uid = false, name = false) {
    if (div_name == '2') {
        console.log('关闭自定义')
        return
    }
    const dbName = 'contacts-name-cache' // 数据库名称
    const tableName = 'store-' + WPP.conn.getMyUserId().user

    // 尝试打开（或创建）数据库
    const openRequest = indexedDB.open(dbName, 2) // 指定版本号，如果是首次创建数据库，可以是1

    openRequest.onupgradeneeded = function (event) {
        const db = event.target.result
        // 检查并创建对象存储（表）
        if (!db.objectStoreNames.contains(tableName)) {
            db.createObjectStore(tableName) // 'id' 是主键，根据需要调整
            console.log('已创建对象存储（表）:', tableName)
        }
    }

    openRequest.onsuccess = function (event) {
        const db = event.target.result

        if (all) {
            const transaction = db.transaction([tableName], 'readonly')
            const store = transaction.objectStore(tableName)

            // 使用游标循环输出数据
            const cursorRequest = store.openCursor()
            cursorRequest.onsuccess = function (event) {
                const cursor = event.target.result
                if (cursor) {
                    console.log('开始更新昵称')
                    set_contact(cursor.key, cursor.value)
                    cursor.continue()
                }
            }

            cursorRequest.onerror = function (event) {
                console.error('无法打开游标:', event.target.error)
            }
            all_name = true

            transaction.oncomplete = function () {
                console.log('数据处理完成')
                db.close()
            }

            transaction.onerror = function (event) {
                console.error('事务错误:', event.target.error)
            }
        } else {
            // 确保表存在
            const transaction = db.transaction([tableName], 'readwrite')
            const store = transaction.objectStore(tableName)
            const getRequest = store.get(uid)
            getRequest.onsuccess = function (event) {
                if (event.target.result === undefined) {
                    store.add(name, uid)
                } else {
                    store.put(name, uid)
                }
                console.log('修改完成')
            }

            transaction.oncomplete = function () {
                console.log('数据处理完成')
                db.close()
            }

            transaction.onerror = function (event) {
                console.error('事务错误:', event.target.error)
            }
        }

        db.close() // 操作完成后关闭数据库
    }

    openRequest.onerror = function (event) {
        console.error('打开数据库出错:', event.target.error)
    }
}

async function backups() {
    console.log('收到消息！')
    const openDbRequest = indexedDB.open('contacts-name-cache', 2)
    openDbRequest.onsuccess = (event) => {
        const db = event.target.result
        const storeName = 'store-' + WPP.conn.getMyUserId().user
        const transaction = db.transaction(storeName, 'readonly')
        const objectStore = transaction.objectStore(storeName)
        const cursorRequest = objectStore.openCursor()
        const data = []
        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result
            if (cursor) {
                data.push({
                    key: cursor.primaryKey, // primaryKey 是记录的键
                    value: cursor.value
                })
                cursor.continue()
            } else {
                // 所有记录已经处理完成
                const jsonData = JSON.stringify(data)
                ipcRenderer.send('backup_end', { p: WPP.conn.getMyUserId().user, json: jsonData })
                console.log('备份完成！送到本地！')
            }
        }
        cursorRequest.onerror = (error) => {}
    }
    openDbRequest.onerror = (error) => {
        console.error('Error opening IndexedDB', error)
    }
}

// 获取随机字符串
function generateRandomCode(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomCode = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        randomCode += charset[randomIndex]
    }

    return randomCode
}

function si(e, t = []) {
    e.forEach((e) => {
        ai(
            [e],
            [
                {
                    label: '复制图片',
                    callback(tt) {
                        ;((e) => {
                            const t = document.createElement('canvas')
                            ;(t.width = e.naturalWidth),
                                (t.height = e.naturalHeight),
                                t.getContext('2d').drawImage(e, 0, 0),
                                t.toBlob((e) => {
                                    const reader = new FileReader()
                                    reader.onload = function (event) {
                                        const arrayBuffer = event.target.result
                                        const buffer = Buffer.from(arrayBuffer)

                                        ipcRenderer.send('copy_img', { info: buffer })
                                    }
                                    reader.readAsArrayBuffer(e)

                                    // ipcRenderer.send('copy_img',{info:e});
                                    // navigator.clipboard.write([new ClipboardItem({"image/png": e})]).then((() => null)).catch((e => {
                                    //     console.error("copy img error:", e)
                                    // }))
                                }, 'image/png')
                        })(e)
                    }
                },
                ...t
            ]
        )
    })
}

function cv() {
    var tr = require('jquery')
    tr(document.head).append(ri),
        tr(document.body).append(ii),
        document.addEventListener(
            'click',
            (e) => {
                tr(e.target).closest(ii).length || ii.hide()
            },
            !0
        ),
        document.addEventListener(
            'contextmenu',
            (e) => {
                oi.has(e.target) || ii.hide()
            },
            !0
        )
}

function ai(e, t) {
    var tr = require('jquery')

    e.forEach((e) => {
        e &&
            !oi.has(e) &&
            (oi.add(e),
            e.addEventListener(
                'contextmenu',
                (e) => {
                    e.preventDefault(), ii.children().remove()
                    const n = tr(new DocumentFragment())
                    t.forEach((t) => {
                        console.log('设置复制,', t)
                        const r = tr(`<div class='menu-item'>${t.label}</div>`)
                        r.click(() => {
                            t.callback(e), ii.hide()
                        }),
                            n.append(r)
                    }),
                        ii.append(n),
                        ii.css({ top: e.pageY + 'px', left: e.pageX + 'px', display: 'block' })
                },
                !0
            ))
    })
}

/**
 * 往目标dom插入文字
 * @param {*} e dom节点
 * @param {*} r 文字
 */
function set_fy_jg(element, textValue, dataId = '', t = '') {
    console.log(element, textValue, dataId, t)
    tr(element).text(textValue)
    if (store.get(WPP.conn.getMyUserId().user + '_set_fy_auto')) {
        sendChatCompletionRequest(dataId, t)
        return // 实时翻译，不再绑定点击事件
    }

    if (element) {
        element[0].addEventListener('click', function () {
            olds[dataId] = element
            sendChatCompletionRequest(dataId, t)
            tr(element).text('重新翻译中，请稍等')
        })
    }
    tr(element).css({
        'white-space': 'pre-line',
        'overflow-wrap': 'break-word', // 或者使用 word-wrap: break-word
        'word-break': 'break-all' // 根据需要选择 break-all 或 normal
    })
}

/**
 * 本地数据库查询
 * @param {*} type 类型  'get' | 'add' | 'save'
 * @param {*} id 指定的 dom dataid
 * @param {*} value
 * @returns
 */
async function translated_hm(type, id, value = '') {
    const dbName = 'haima-' + WPP.conn.getMyUserId().user // 数据库名称
    const tableName = 'translated-' + WPP.conn.getMyUserId().user

    try {
        // 尝试打开（或创建）数据库
        const openRequest = indexedDB.open(dbName, 1) // 指定版本号，如果是首次创建数据库，可以是1

        openRequest.onupgradeneeded = function (event) {
            const db = event.target.result
            // 检查并创建对象存储（表）
            if (!db.objectStoreNames.contains(tableName)) {
                db.createObjectStore(tableName, { keyPath: 'id' }) // 使用 'id' 作为主键
                console.log('已创建对象存储（表）:', tableName)
            }
        }

        const db = await new Promise((resolve, reject) => {
            openRequest.onsuccess = function (event) {
                resolve(event.target.result)
            }
            openRequest.onerror = function (event) {
                reject(event.target.error)
            }
        })

        const transaction = db.transaction([tableName], 'readwrite')
        const objectStore = transaction.objectStore(tableName)

        switch (type) {
            case 'get':
                const getRequest = objectStore.get(id)
                const data = await new Promise((resolve, reject) => {
                    getRequest.onsuccess = function (event) {
                        resolve(event.target.result)
                    }
                    getRequest.onerror = function (event) {
                        reject(event.target.error)
                    }
                })
                return data ? data.value : null
            case 'add':
                // 添加数据时需要提供键值
                objectStore.add({ id: id, value: value })
                break
            case 'save':
                // 更新数据时需要提供键值
                objectStore.put({ id: id, value: value })
                break
            default:
                objectStore.delete(id)
                break
        }
        db.close()
    } catch (error) {
        console.error('操作数据库出错:', error)
    } finally {
    }
}

/**
 * 执行翻译
 * @param {*} e 目标 dom
 * @param {*} t 未翻译的文字
 * @param {*} main 原 dom
 * @returns void
 */
const di = async (e, t, main) => {
    if ('' === t?.trim()) return void tr(e).text('...')
    var dataId = main[0].querySelector('div[data-id]').getAttribute('data-id')
    let parts = dataId.split('_')
    let result
    if (parts[parts.length - 1].endsWith('@c.us')) {
        // 如果最后一段是 "@c.us"，则取前一个
        result = parts[parts.length - 2]
    } else {
        // 否则直接取最后一段
        result = parts[parts.length - 1]
    }
    dataId = result
    const jsonData = await translated_hm('get', dataId)
    if (jsonData && jsonData !== '翻译中') {
        console.log('历史记录，并非最新！', e, jsonData, dataId, t)
        set_fy_jg(e, jsonData, dataId, t)
        return
    }
    if (!olds[dataId]) {
        olds[dataId] = e
    }
    // 2024.3.23 YKY
    sendChatCompletionRequest(dataId, t)

    // if (jsonData == '翻译中') {
    //     const temp = await translated_hm('get',dataId +  random5DigitCode)
    //     if (temp == null) {
    //         sendChatCompletionRequest(dataId, t);
    //     }
    // } else {
    //     if (jsonData !== null && jsonData !== '翻译失败') {
    //         set_fy_jg(e, jsonData);
    //     } else {
    //         sendChatCompletionRequest(dataId, t);
    //     }
    // }
}

/**
 *
 * @param {*} dataId dataid
 * @param {*} text 需要翻译的文字
 */
async function sendChatCompletionRequest(dataId, text) {
    console.log('开始翻译')
    translated_hm('add', dataId, '翻译中')
    ipcRenderer.send('chatgpt', {
        info: WPP.conn.getMyUserId().user,
        user: WPP.chat.getActiveChat().id.user,
        msg: text,
        dataId: dataId,
        type: 0,
        id: windowId.toString()
    })
}
