import {
    app,
    shell,
    BrowserWindow,
    ipcMain,
    dialog,
    BrowserView,
    clipboard,
    nativeImage
} from 'electron'
import path, { join } from 'path'
import HTray from './tray'

import { useDebounceFn } from '@vueuse/core'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import Store from 'electron-store'

const store = new Store()
import os from 'os'
import fs from 'fs-extra'

// 获取用户的 Roaming 目录，不带应用名称
function getRoamingPath() {
    // Windows平台的Roaming路径一般位于用户目录下的AppData\Roaming
    const roamingPath = path.join(os.homedir(), 'AppData', 'Roaming')
    return roamingPath
}

let rights = false
//左侧展开，固定140
let lefts = true
const sourceDir = getRoamingPath() + '\\hnysm_ws\\Partitions' // 源文件夹路径

const targetDir = app.getPath('userData') + '\\Partitions' // 目标文件夹路径
console.log(app.getPath('userData'))

// 判断源文件夹是否存在
fs.pathExists(sourceDir, (err, exists) => {
    if (err) {
        console.error('检查源文件夹时出错:', err)
        return
    }
    if (!exists) {
        console.log('源文件夹不存在')
        return
    }
    // 判断目标文件夹是否存在，如果不存在则创建
    fs.ensureDir(targetDir, (err) => {
        if (err) {
            console.error('创建目标文件夹时出错:', err)
            return
        }

        // 移动文件夹
        console.log('正在移动文件夹...')
        fs.move(sourceDir, targetDir, { overwrite: true }, (err) => {
            if (err) {
                console.error('移动文件夹时出错:', err)
                return
            }
            console.log('文件夹移动完成')
        })
    })
})
console.log(sourceDir, targetDir) // 输出Roaming目录的路径

// 使用示例
var views = {
    list: [],
    on: -1
}
Object.defineProperty(app, 'isPackaged', {
    get() {
        return true
    }
})
import { checkProxy } from './proxy'

const proxy_data = {}
var badgeCount = 0
var language = 'auto'
// 设置编码为 UTF-8
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('enable-features', 'WebUIDarkMode')
app.commandLine.appendSwitch(
    'enable-features',
    [
        'XrSpatialTracking',
        'AttributionReporting',
        'ComputePressure',
        'InterestCohort',
        'PrivateStateTokenIssuance',
        'PrivateStateTokenRedemption',
        'SharedStorage',
        'SharedStorageSelectUrl',
        'Unload',
        'WindowManagement'
    ].join(',')
)

import { translateTextFree } from './google'
import { autoUpdateInit } from './autoUpdater'

const views_position = {
    x: 200,
    y: 0,
    width: 1240 - 165,
    height: 740
}

import { io } from 'socket.io-client'
import { HaixiangConfig, HaixiangList } from './haixiang'
import HttpProxyAgent from 'http-proxy-agent'
import { getProxySettings } from 'get-proxy-settings'
// import { electron } from 'node:process';

var is_google = 0
var socket = new io()
// 动态导入electron-is-dev

var isDev = false
import('electron-is-dev')
    .then((isDevModule) => {
        isDev = isDevModule.default // 获取默认导出
    })
    .catch((error) => {
        console.error('导入electron-is-dev失败', error)
    })

const resize_mt = (e, t) => {
    const { width: r, height: a } = t?.getContentBounds()
    const i = lefts ? 200 : 200
    const n = rights ? 60 : 360
    const size = { x: i + 20, y: 0, width: r - i - n - 20, height: a }
    console.log('新尺寸', size)
    e.setBounds(size)
}
var mainWindow

// is.dev=true
function createWindow() {
    // isDev=true

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 800,
        minWidth: 1500,
        minHeight: 800,
        show: false,
        // frame: !1,
        // titleBarStyle: "hiddenInset",
        // resizable: false,
        // maximizable: true,
        autoHideMenuBar: true,
        icon,
        title: '海马-' + app.getVersion(),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            // 禁用同源策略，允许跨域请求
            webSecurity: false
        }
    })

    mainWindow.on('focus', () => {
    })
    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })
    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        console.log('信息：', process.env['ELECTRON_RENDERER_URL'])
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        console.log('信息：', join(__dirname, '../renderer/index.html'))
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
    var postions

    ipcMain.handle('checkProxy', async (event, proxy) => {
        try {
            const data = await checkProxy(proxy)
            return data
        } catch (error) {
            throw error
        }
    })

    ipcMain.on('dialog_msg', async (event, arg) => {
        dialog.showMessageBox(mainWindow, {
            type: 'info', // 消息框类型: "none", "info", "error", "question" 或 "warning"
            title: '异常', // 消息框的标题
            message: arg, // 主要的消息文本
            // detail: '这是详细信息，可选。', // 更详细的文本
            buttons: ['确定'], // 按钮数组，顺序从左到右
            defaultId: 0 // 默认选中的按钮，这里的0表示第一个按钮
            // cancelId: 1, // 表示取消操作的按钮ID，这里的1表示第二个按钮
        })
    })

    ipcMain.on('check_haixiang', (event, args) => {
        const sourceDir = getRoamingPath() + '\\haixiang\\Partitions' // 源文件夹路径
        console.log('检测海象', sourceDir)
        fs.access(sourceDir, fs.constants.F_OK, (err) => {
            if (err) {
                return
            }
            // 读取目录内容
            fs.readdir(sourceDir, (err, files) => {
                if (err) {
                    return
                }
                var user_list = HaixiangList(sourceDir).then((user_list) => {
                    console.log('海象', user_list)
                    if (user_list.length > 0) {
                        const result_sre = getRoamingPath() + '\\haixiang\\databases\\session.db' // 源文件夹路径
                        const idMap = HaixiangConfig(result_sre)
                        mainWindow.webContents.send('haixiang_r', idMap)
                    }
                })
            })
        })
    })

    //更新窗口尺寸
    ipcMain.on('resize-view', (event, args) => {
        if (args['is'] == 0 || args['is'] == null) {
            rights = true
        } else {
            rights = false
        }
        set_size()
    })

    //启动窗口
    ipcMain.on('StartMenuItem', (event, data) => {
        data = JSON.parse(data)

        console.log(
            data,
            '保存路径',
            'persist:' + data.type + '_gyxz' + data['id'].toString(),
            join(__dirname, '../preload/' + data.type + '.js')
        )
        const view = new BrowserView({
            webPreferences: {
                // 其他设置...
                nodeIntegration: false,
                permissionsPolicy: 'clipboard-read=(),clipboard-write=()',

                preload: join(__dirname, '../preload/' + data.type + '.js'),
                partition: 'persist:' + data.type + '_gyxz' + data['id'].toString(),
                contextIsolation: false,
                webSecurity: false,
                sandbox: false,
                additionalArguments: ['--window-id=' + data['id'].toString()]

                // devTools: is.dev
            }
        })

        // 获取 BrowserView 的 session
        const ses = view.webContents.session

        // 拦截 HTTP 响应头，移除或修改 CSP
        ses.webRequest.onHeadersReceived((details, callback) => {
            const responseHeaders = details.responseHeaders

            // 移除 CSP 头
            delete responseHeaders['content-security-policy']
            delete responseHeaders['content-security-policy-report-only']

            callback({ responseHeaders })
        })

        if (data['proxy'] && data['proxy'] != '') {
            view.webContents.session.setProxy({
                proxyRules: data['proxy']
            })
        } else {
            view.webContents.session.setProxy({ mode: 'system' })
        }
        view.setAutoResize({ width: true, height: true })
        if (is.dev) {
            view.webContents.openDevTools()
        }

        // view.webContents.openDevTools()
        // data['urls']="http://git.gyxz.vip"
        view.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url.replace('zh-CN', 'en')) // 使用默认浏览器打开 URL
            return { action: 'deny' } // 阻止 Electron 打开新窗口
        })

        view.webContents.on('notification', (event, notification) => {
            // 拦截通知
            event.preventDefault()
        })

        let i = !1,
            n = ''

        view.webContents.on('dom-ready', async () => {
            if (data.type == 'whatsapp') {
                if (i) return void view.webContents.removeInsertedCSS(n)
                const t =
                    'if (navigator.serviceWorker) {\n        navigator.serviceWorker.getRegistrations().then(function (registrations) {\n          for (let registration of registrations) {\n            registration.unregister();\n          }\n          location.reload()\n        });\n      }else{\n        location.reload()\n      }'
                view.webContents.executeJavaScript(t)
                i = true
                n = await view.webContents.insertCSS('html { opacity:0 }')
            }
        })
        view.webContents.loadURL(data['urls'], { userAgent: data.ua })
        views[data['id']] = view
        views['on'] = data['id']
        // 创建工具栏
        mainWindow.setBrowserView(view)
        console.log(view.webContents.id, view.webContents.getURL(), data)
        resize_mt(view, mainWindow)
    })

    //切换窗口
    ipcMain.on('swithMenu', (event, data) => {
        console.log('切换视图', data, views)
        if (views.on !== -1 && views[views.on]) {
            views[views.on].setBounds({ x: 0, y: 0, width: 0, height: 0 }) // 隐藏当前视图
        }
        if (views[data.id]) {
            mainWindow.setBrowserView(views[data.id])
            resize_mt(views[data.id], mainWindow)
            views.on = data.id
        }
    })
    //关闭窗口
    ipcMain.on('CloseMenu', (event, data) => {
        console.log('关闭窗口', data.id)
        views[data['id']].webContents.destroy()
        mainWindow.removeBrowserView(views[data['id']])
        delete views[data['id']]
    })
    //获取ws返回的昵称并 设置用户昵称
    ipcMain.on('set_name', async (event, arg) => {
        console.log('翻译信息L', arg)
        var uid = store.get(arg['user'] + '_leange')
        var temps = 'auto'
        // 如果 uid 有内容则返回 uid，否则返回 temps
        var result = uid ? uid : temps
        arg['lg'] = result
        console.log('用户信息：', arg)
        mainWindow.webContents.send('show_name', arg)
    })
    //更新用户昵称
    ('update_name', async (event, arg) => {
        mainWindow.webContents.send('user-loading', true)

        views[views.on].webContents.send('save_name_' + arg['id'].toString(), arg)

        var send = {
            type: 'name',
            uid: arg['uid'].toString(),
            name: arg['name']
        }
        socket.emit('Custorm', send)
    })

    ipcMain.on('view_server', async (event, arg) => {
        console.log('请求信息', arg, views[views.on])
        //备份
        if (arg['type'] == 'backup') {
            console.log('开始备份')
            views[views.on].webContents.send('backup_start')
        }

        //恢复
        if (arg['type'] == 'recovd') {
            const backupFilePath = join(
                app.getPath('appData'),
                'haima/backup/' + arg['name'].toString() + '.json'
            )

            const data = fs.readFileSync(backupFilePath, 'utf-8') // 读取备份文件
            console.log('读取到的备份信息', data)
            views[views.on].webContents.send('recovd', JSON.parse(data))
        }

        //初始化
        if (arg['type'] == 'init') {
            console.log('初始化进行')
            views[views.on].webContents.send('server_init')
        }
    })

    ipcMain.on('check_updates', async (event, arg) => {
        autoUpdateInit(mainWindow)
    })

    //发送位置
    ipcMain.on('send_location', async (event, arg) => {
        views[views.on].webContents.send('send_location_' + arg['id'].toString(), arg)
    })
    ipcMain.on('send_audio', async (event, arg) => {
        views[views.on].webContents.send('send_audio_' + arg['id'].toString(), arg)
    })

    //退出软件
    ipcMain.on('window_quit', async (event, arg) => {
        app.quit()
    })

    ipcMain.on('set_is_translate', (ev, isTranslate) => {
        views[views.on].webContents.send('ws_is_translate', isTranslate)
    })

    ipcMain.on('set_is_name', (ev, isTranslate) => {
        views[views.on].webContents.send('ws_is_name', isTranslate)
    })

    ipcMain.on('open_dev', () => {
        views[views.on].webContents.openDevTools()
    })

    ipcMain.on('open_load', () => {
        views[views.on].webContents.send('ws_open_load')
    })

    ipcMain.on('set-version', (ev, title) => {
        mainWindow.setTitle(`${title}-version${app.getVersion()}`)
    })

    //获取客户的信息记录
    ipcMain.on('get_ws_info', async (event, arg) => {
        console.log('客户原始信息', arg)

        mainWindow.webContents.send('user-loading', true)
        var send = {
            type: 'info',
            id: arg['id'].toString(),
            phone: arg['phone'],
            name: arg['name'],
            avatar: arg['avatar']
        }

        socket.emit('Custorm', send)
    })

    //页面设置翻译
    ipcMain.on('set_fy', async (event, arg) => {
        store.set(arg['user'] + '_set_fy', arg['is_fy'])
    })
    // 实时翻译页设置

    ipcMain.on('st_fy', async (event, arg) => {
        console.log('接收到实时翻译请求:', arg) // 输出接收到的参数
        store.set(arg['user'] + '_ss_fy', arg['ss_fy'])
        mainWindow.webContents.send('st_fy', arg['ss_fy'])
        console.log('实时翻译状态已更新:', arg['user'] + 'ss_fy', arg['ss_fy']) // 输出存储后的状态
        views[views.on].webContents.send('st_fy', arg['ss_fy'])

    })

    ipcMain.on('set_language', async (event, arg) => {
        store.set(arg['user'] + '_language', arg['lg'])
    })
    //设置备注
    ipcMain.on('set_remark', async (event, arg) => {
        console.log('设置备注', arg)
        var send = {
            type: 'set_remark',
            uid: arg['uid'].toString(),
            remark: arg['remarkf']
        }
        socket.emit('Custorm', send)
    })

    //ws_send
    ipcMain.on('ws_send', async (event, arg) => {
        var type = arg['ws_type']
        delete arg['ws_type']
        console.log(type, arg)
        socket.emit(type, arg)
        if (arg.type == 'proxy') proxy_data[`${arg.id}`] = arg.proxy
    })

    // 初始化托盘
    const tray = new HTray(mainWindow)
    tray.show()
    // var tray = new Tray("resources/icon_32.png");

    // // 创建右键菜单项
    // const contextMenu = Menu.buildFromTemplate([
    //     {label:'隐藏/打开', click() {
    //             if (mainWindow.isVisible()) {
    //                 mainWindow.hide();
    //             } else {
    //                 mainWindow.show();
    //             }
    //         }},
    //     {label: "联系客服", click() {
    //             shell.openExternal("https://t.me/haima006")
    //         }},
    //     {label: "海马官网", click() {
    //             shell.openExternal("https://web.haimapro.com/")
    //         }},
    //     {label: `版本号 v${app.getVersion()}`},
    //     {
    //         label: "帮助文档", click() {
    //             n.shell.openExternal("https://doc.haimapro.com/")
    //         }
    //     },
    //     { label: '退出', role: 'normal',click(){
    //             mainWindow.webContents.send('window_quit',[]),mainWindow.show()
    //         } }
    // ]);

    // // 将菜单绑定到托盘图标上
    // tray.setContextMenu(contextMenu);
    // // 可选：设置鼠标悬停时的提示信息
    // tray.setToolTip('海马-计数器');
    // tray.on('double-click', () => {
    //     if (mainWindow) {
    //         if (mainWindow.isVisible()) {
    //             mainWindow.hide();
    //         } else {
    //             mainWindow.show();
    //         }
    //     }
    // });

    //右侧就是可选了

    function set_size() {
        mainWindow.getBrowserViews()?.forEach((t) => {
            ;((mainWindow) => {
                const { x: t } = mainWindow.getBounds()
                return -2e4 === t || 0 === t
            })(t) || resize_mt(t, mainWindow)
        })
    }

    app.on('resize', function() {
        set_size()
    })
}

ipcMain.on('set_global_realtime_translate', (event, status) => {
    console.log('设置全局实时翻译开关:', status)
    store.set('global_realtime_translate', status)
})

ipcMain.handle('get_global_realtime_translate', async () => {
    const val = store.get('global_realtime_translate', true) // 默认开启
    return val
})


ipcMain.handle('get-is_google', (ev) => {
    return is_google
})
ipcMain.handle('get_user_fy_setting', async (event, user) => {
    const value = store.get(user + '_ss_fy', false) // 默认 false
    return value
})


ipcMain.on('backup_end', async (ev, arga) => {
    console.log('备份的数据', arga)
    const { promisify } = require('util')
    const writeFile = promisify(fs.writeFile)
    const directoryPath = path.join(process.env.APPDATA, 'haima', 'backup')
    const filePath = path.join(directoryPath, arga['p'].toString() + '.json')

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true })
    }

    await writeFile(
        join(app.getPath('appData'), 'haima/backup/' + arga['p'].toString() + '.json'),
        arga['json'],
        'utf8'
    )

    console.log('备份完成', arga)
})

ipcMain.on('set_is_google', (ev, ststus) => {
    is_google = ststus
    is_google = 0
})

ipcMain.on('copy_img', async (event, arg) => {
    console.log('复制图片', arg)
    const image = nativeImage.createFromBuffer(arg['info'])

    clipboard.writeImage(image)
})

//同步新消息标签/消息同步至云端
ipcMain.on('ws_login', async (event, arg) => {
    const os = require('os')
    const crypto = require('crypto')

    const cpuInfo = os.cpus()[0].model
    const networkInfo = Object.values(os.networkInterfaces()).reduce(
        (r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.mac), [])),
        []
    )
    const osInfo = os.platform() + os.release()

    const machineCode = cpuInfo + networkInfo + osInfo

    const hash = crypto.createHash('md5')
    hash.update(machineCode)
    const machineCodeHash = hash.digest('hex')

    if (arg['s'] == true) {
        var proxy = arg['proxy']
        console.log(proxy)
        const HttpProxyAgent = require('http-proxy-agent')
        // 创建代理代理对象
        var agent = new HttpProxyAgent(proxy)
    } else {
        var agent = null
    }
    console.log('海马server', agent)
    socket = io(arg['server'], {
        query: {
            token: arg['user'],
            version: app.getVersion(),
            systemcode: machineCodeHash
        },

        transports: ['websocket'],
        agent: agent // 设置代理
    })

    // socket = io("http://172.23.191.233:8080?token="+arg['user'], {transports: ['websocket']});
    socket.on('connect', function() {
        console.log('连接成功')

        mainWindow.webContents.send('login_er', '服务成功')
    })

    // 监听连接错误（连接尝试失败）
    socket.on('connect_error', function(error) {
        console.log(error)
        if (error.description) {
            // 获取所有符号属性
            const symbols = Object.getOwnPropertySymbols(error.description)

            // 查找特定的符号属性 [Symbol(kError)]
            const kErrorSymbol = symbols.find((symbol) => symbol.toString() === 'Symbol(kError)')

            if (kErrorSymbol) {
                // 获取 Error 对象
                const internalError = error.description[kErrorSymbol]

                // 输出详细的错误信息

                mainWindow.webContents.send('login_er', '连接错误：' + internalError.message)
            } else {
                mainWindow.webContents.send('login_er', '连接错误：' + error.message)
            }
        }
    })

    // 监听任何错误（包括连接错误）
    socket.on('error', function(error) {
        console.log('错误', error.message)

        mainWindow.webContents.send('login_er', '错误：' + error.message)
    })
    // 监听任何错误（包括连接错误）
    socket.on('translate', function(response) {
        console.log('[翻译结果]', response)

        var arg = response['param']
        arg['result'] = response.result.text
        arg['types'] = response.result.source

        var uid = store.get(arg['user'] + '_uid')
        var temps = 'auto'
        if (uid) {
            temps = store.get(uid)
        }

        switch (response.param.type) {
            case 'chatgpt':
                if (uid && temps == 'auto' && arg['types'] != 'auto') {
                    store.set(uid, arg['types'])

                    mainWindow.send('set_langs', { id: arg['user'], lg: arg['types'] })
                }
                views[arg['id']].webContents.send('chatgpt-result_' + arg['id'], arg)

                break
            case 'chatgpt_send':
                if (uid && temps == 'auto') {
                    if (typeof arg['types'] != 'undefined') {
                        if (arg['types'] != 'auto') {
                            store.set(uid.toString(), arg['types'])
                        }
                    }
                }

                // console.log("翻译发送结果：",arg);
                views[arg['id']].webContents.send('chatgpt-send_chat_' + arg['id'], arg)

                break
        }
    })

    // 设置当前端口数量
    socket.on('view_count', function(data) {
        mainWindow.webContents.send('view_count', data)
    })

    // 更新客户信息
    socket.on('set_ws_info', function(data) {
        // 先检查 data['info'] 和 data['info']['id'] 是否存在
        const infoId = data?.info?.id

        // 如果 infoId 存在，则从 store 中获取相应的值，否则返回 'auto'
        const result = infoId ? store.get(infoId)?.[infoId] ?? 'auto' : 'auto'

        data['info']['language'] = result
        // mainWindow.webContents.send('user-loading', true)

        console.log('sket返回的ws信息', data)
        var r = mainWindow.webContents.send('set_ws_info', data)
        console.log('发送结果', r)
    })

    // 添加新窗口
    socket.on('add_win', function(data) {
        // console.log('响应type: add')
        mainWindow.webContents.send('add_win', data)
    })
    socket.on('add_win_hx', function(data) {
        Object.keys(data).forEach((key) => {
            var item = data[key]
            var new_id = item.id
            var hx_id = item.hx_id
            const sourceDir = getRoamingPath() + '\\haixiang\\Partitions\\whatsapp_' + hx_id // 源文件夹路径
            const targetDir = app.getPath('userData') + '\\Partitions\\whatsapp_gyxz' + new_id // 目标文件夹路径
            console.log('海象', new_id, hx_id)
            fs.rename(sourceDir, targetDir, (err) => {
                if (err) {
                    console.error('移动文件夹时出错:', err)
                } else {
                    console.log('文件夹已成功移动并重命名！')
                }
            })
        })
        mainWindow.webContents.send('add_win_hx', data)
    })
    socket.on('ws_user_list', function(data) {
        mainWindow.webContents.send('ws_user_list', data)
    })

    socket.on('user_login_r', function(data) {
        is_google = data.is_google
        is_google = 0
        console.log('是否海马', is_google, data)

        mainWindow.webContents.send('login_result', data)
    })

    socket.on('end', function(data) {
        // app.exit()

        mainWindow.webContents.send('login_er', '断开连接')
        console.log('ends')
    })
    // 监听 disconnect 事件
    socket.on('disconnect', (reason) => {
        console.log('已断开连接，原因:', reason)

        mainWindow.webContents.send('login_er', '断开连接' + reason)
    })
})
ipcMain.on('new_msg', async (event, arg) => {
    console.log('主进程有新消息了，传递', arg)
    mainWindow.send('ws_new_msg', arg)
    socket.emit('Syncmsg', arg)
})
// 添加测试
ipcMain.on('new_msg', (event, arg) => {
    console.log('✅ [主进程] 接收到渲染进程的新消息:', arg)
})
// 测试完成
// 新消息添加
ipcMain.on('new_msg', (event, arg) => {
    const msgWindowId = arg.id
    const activeWindowId = views.on?.toString() // 当前激活窗口

    if (msgWindowId !== activeWindowId) {
        badgeCount++

        // 你也可以发事件给 render，触发声音、托盘闪烁等
        mainWindow.webContents.send('show-notification-dot', { id: msgWindowId })
    }
})
// 添加结束
ipcMain.on('login_end', async (event, arg) => {
    socket.disconnect()
})

const { Mutex } = require('async-mutex')
const mutex = new Mutex()
//聊天记录翻译
ipcMain.on('chatgpt', async (event, arg) => {
    if (typeof arg['msg'] != 'string') {
        return
    }
    if (arg['msg'] == '') {
        return
    }

    var uid = store.get(arg['user'] + '_leange')
    var temp = 'auto'

    // 如果 uid 有内容则返回 uid，否则返回 temps
    var result = uid ? uid : temp

    // 或者更简洁写法
    var temps = uid || temp
    const param = { to: 'zh' }
    if (temps != 'auto') {
        param['form'] = temps
    }

    arg['param'] = param
    arg['type'] = 'chatgpt'

    if (is_google == 1) {
        // console.log('云端翻译');
        socket.emit('Translated', arg)
    } else {
        // console.log('本地翻译');
        var result = await translateTextFree(arg['msg'], param, false)
        if (!result.types) {
            result['dataId'] = arg['dataId']
            views[arg['id']].webContents.send('chatgpt-result_' + arg['id'], result)
            return
        }
        console.log(temps, arg['user'] + '_leange', result['types'])
        if (temps == 'auto' && result['types'] != 'auto') {
            store.set(arg['user'] + '_leange', result['types'])
            mainWindow.send('set_langs', { id: arg['user'], lg: result['types'] })
        }
        arg['result'] = result.result
        arg['types'] = result.types
        views[arg['id']].webContents.send('chatgpt-result_' + arg['id'], arg)
    }
})

//对话窗口翻译
let last_msg
const chat_send = useDebounceFn(async (event, arg) => {
    arg['msg'] = arg['msg'].replace(/^\s*|\s*$/g, '')
    if (arg['msg' == last_msg]) return
    last_msg = arg['msg']

    if (arg['msg'] == '') {
        arg['result'] = ''
        arg['types'] = 'zh-Cn'
        event.sender.send('chatgpt-send_chat_' + arg['id'], arg)
        return
    }

    if (store.get(arg['user'] + '_set_fy') == 0) {
        // console.log("设置不翻译，返回原文咯");
        arg['result'] = arg['msg']
        arg['types'] = 'zh-Cn'
        event.sender.send('chatgpt-send_chat_' + arg['id'], arg)
        return
    }
    var uid = store.get(arg['user'] + '_leange')
    var temps = 'auto'

    // 如果 uid 有内容则返回 uid，否则返回 temps
    var result = uid ? uid : temps

    // 或者更简洁写法
    var result = uid || temps
    temps = result
    // console.log('发送,语种：',temps)
    const param = { from: 'zh-CN', proxy: proxy_data[arg.id] }
    if (temps == 'auto') {
        param['to'] = 'en'
    } else {
        param['to'] = temps
    }

    arg['param'] = param
    arg['type'] = 'chatgpt_send'

    console.log('本地', arg['msg'])
    var result = await translateTextFree(arg['msg'], param, false)
    console.log('先测1', result)
    arg['result'] = result.result
    arg['types'] = result.types

    if (uid && temps == 'auto') {
    }

    console.log('翻译发送结果：', arg)
    views[arg['id']].webContents.send('chatgpt-send_chat_' + arg['id'], arg)
}, 200)
ipcMain.on('chatgpt_send', chat_send)

//todo::获取到聊天窗口的位置信息或者语音消息-----未完成：语言翻译为文字
ipcMain.on('result_ws_other', async (event, arg) => {
    var uid = store.get(arg['user'] + '_uid')
    console.log('其他信息', uid, arg, arg['id'])
    if (arg['type'] == 'location') {
        console.log('传递位置')
        mainWindow.send('set_location', { id: arg['user'], lg: arg['postion'] })
    }
    if (arg['type'] == 'ptt') {
        //语音消息
        console.log('获取到了语音消息', arg['user'], arg['video'])
        // event.sender.send('chatgpt-result_' + arg['id'], arg);
    }
})

//success:更新登陆账户的号码，昵称，头像等信息
ipcMain.on('set_ws_info', async (event, arg) => {
    console.log('用户信息：', arg)
    // mainWindow.webContents.send('user-loading', true)
    mainWindow.send('set_ws_info_new', arg)
    arg['type'] = 'update_info'
    socket.emit('Whats', arg)
})

ipcMain.on('ws-user-loading', (ev, bol) => {
    console.log(bol)
    mainWindow.webContents.send('user-loading', bol)
})

//设置客户的语种
ipcMain.on('set_language', (event, data) => {
    var send = {
        type: 'set_language',
        uid: data['uid'].toString(),
        language: data['lg'],
        is_fy: data['is_fy']
    }
    socket.emit('Custorm', send)
    console.log('设置语种：', data['user'], data['uid'].toString(), data['lg'])
    store.set(data['user'] + '_leange', data['lg'])
})

ipcMain.on('close-window-all', () => {
    quitStatus = true
    mainWindow.close()
    quitView.close()
    app.quit()
})

const storage = require('electron-localstorage')

ipcMain.on('save_google', (event, data) => {
    console.log(data)
    storage.setItem('google', data.key)
    storage.setItem('google_pp_r', data.pp)
})
ipcMain.on('google_t', async (event, data) => {
    const param = { to: 'zh-CN' }
    var result = await translateTextFree(data['key'], param, true)
    console.log('测试结果', result)
    mainWindow.webContents.send('google_ts', { str: JSON.stringify(result) })
})
ipcMain.on('get_p', async () => {
    const { getProxySettings, getAndTestProxySettings } = require('get-proxy-settings')

    async function basic() {
        const proxy = await getProxySettings()
        return proxy
    }

    var temp = await basic()
    var proxy = `${temp.http}`
    console.log(proxy)
    mainWindow.webContents.send('proxys', proxy)
})

console.log('谷歌信息：', storage.getItem('google'))
// 退出弹窗
let quitView = null
let quitStatus = false
const quitWinwod = () => {
    if (quitView) return quitView
    quitView = new BrowserWindow({
        width: 350,
        height: 200,
        autoHideMenuBar: true,
        icon,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            // 禁用同源策略，允许跨域请求
            webSecurity: false,
            // 禁止build环境使用DevTool
            devTools: is.dev
        },
        transparent: true,
        backgroundColor: '#00000000', // 透明色
        frame: false, // 可选，去掉窗口边框
        resizable: false, // 禁止修改窗口大小
        menuBarVisible: false, // 隐藏菜单栏
        titleBarStyle: 'hidden' // 隐藏标题栏
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        quitView.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/quitView.html')
    } else {
        quitView.loadFile(join(__dirname, '../renderer/quitView.html'))
    }
    quitView.on('closed', () => {
        quitView = null
    })
    quitView.on('ready-to-show', () => {
        quitView.show()
    })
    return quitView
}

// 程序单例模式
let myWindow = null
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    // 如果已经有同样的该程序正在运行，则不启动
    app.quit()
} else {
    // 如果检测到有同样的该程序正在试图启动...
    app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
        if (myWindow) {
            // 弹出系统提示对话框
            dialog.showMessageBox({
                message: '此程序已经正在运行'
            })
            // 如果该程序窗口处于最小化状态，则恢复窗口
            if (myWindow.isMinimized()) myWindow.restore()
            // 将该程序窗口置为当前聚焦态
            myWindow.focus()
        }
    })

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(async () => {
        // Set app user model id for windows

        electronApp.setAppUserModelId('com.haimapro')

        // Default open or close DevTools by F12 in development
        // and ignore CommandOrControl + R in production.
        // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window)
        })

        myWindow = createWindow()

        mainWindow.on('close', (e) => {
            if (quitStatus) return
            e.preventDefault() // 阻止默认行为
            quitWinwod().show() // 弹出确认退出窗口
            // mainWindow.webContents.send('window_quit',[]),mainWindow.show()
            // mainWindow.hide(); // 隐藏窗口而非关闭
        })

        app.on('activate', function() {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })
}
