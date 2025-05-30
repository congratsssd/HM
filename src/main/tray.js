import { app, Menu, Tray, nativeImage } from 'electron'
import path from 'path'

class HTray {
    constructor(mainWindow) {
        this.mainWindow = mainWindow
        this.tray = null
        this.normalImage = nativeImage.createFromPath(
            path.join(__dirname, '../../resources/icon_32.png')
        ) // 托盘图标
    }

    createMenu() {
        const trayMenuTemplate = [
            {
                label: '隐藏/打开',
                click: () => {
                    if (this.mainWindow.isVisible()) {
                        this.mainWindow.hide()
                    } else {
                        this.mainWindow.show()
                    }
                }
            },
            {
                label: '联系客服',
                click: () => {
                    shell.openExternal('https://t.me/haima006')
                }
            },
            {
                label: '海马官网',
                click: () => {
                    shell.openExternal('https://web.haimapro.com/')
                }
            },
            {
                label: `版本号 v${app.getVersion()}`
            },
            {
                label: '帮助文档',
                click: () => {
                    n.shell.openExternal('https://doc.haimapro.com/')
                }
            },
            {
                label: '退出',
                role: 'normal',
                click: () => {
                    this.mainWindow.webContents.send('window_quit')
                    this.mainWindow.show()
                }
            }
        ]
        const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
        this.tray.setToolTip('海马-计数器')
        this.tray.setContextMenu(contextMenu)
    }

    show() {
        this.tray = new Tray(this.normalImage)
        this.createMenu()
        this.tray.on('double-click', () => {
            this.openWindow()
        })
    }

    openWindow() {
        this.mainWindow.isVisible() ? this.mainWindow.hide() : this.mainWindow.show()
        this.mainWindow.setSkipTaskbar(false)
    }
}

export default HTray
