import { app, dialog, ipcMain } from 'electron'
import { join } from 'path'
import { autoUpdater } from 'electron-updater'
import logger from 'electron-log'
import { getLocalData, setLocalData, sleep } from './helper'

export async function autoUpdateInit(myWindow) {
    //打印log到本地
    logger.transports.file.maxSize = 1002430 // 10M
    logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
    // logger.transports.file.resolvePathFn = () => {
    //     // 返回你希望日志文件存储的路径
    //     return join(app.getPath('appData'), 'logs/main.log');
    // };
    autoUpdater.setFeedURL({
        provider: 'generic',
        url: 'http://web.haimapro.com/update/'
    })
    autoUpdater.checkForUpdates()
    autoUpdater.logger = logger
    logger.info('当前版本：', app.getVersion())
    autoUpdater.disableWebInstaller = false
    autoUpdater.autoDownload = false //这个必须写成false，写成true时，我这会报没权限更新，也没清楚什么原因
    autoUpdater.on('error', (error) => {
        console.log('检查更新失败', error)
        logger.error(['检查更新失败', error])
        myWindow.webContents.send('update_version', 500)
    })
    //当有可用更新的时候触发。 更新将自动下载。
    autoUpdater.on('update-available', async (info) => {
        logger.info('检查到有更新，开始下载新版本')
        const { version } = info
        myWindow.webContents.send('requestUpdate', { b: app.getVersion(), a: version })
        ipcMain.handle('whetherOrNotUpdate', (ev, result) => {
            if (result) askUpdate(version, myWindow)
        })
    })
    //当没有可用更新的时候触发。
    autoUpdater.on('update-not-available', () => {
        logger.info('没有可用更新')
        var info = {
            use: app.getVersion(),
            update: false
        }
        myWindow.webContents.send('update_version', info)
        console.log('没有可用更新')
    })
    // 在应用程序启动时设置差分下载逻辑
    autoUpdater.on('download-progress', async (progress) => {
        logger.info('更新中', progress)
        console.log('更新中', progress)
        myWindow.webContents.send('thisDownloadprogress', progress)
    })
    //在更新下载完成的时候触发。
    autoUpdater.on('update-downloaded', async (res) => {
        console.log('下载完成。进行更新')
        logger.info('下载完毕！提示安装更新')

        autoUpdater.quitAndInstall()
    })
}

async function askUpdate(version, myWindow) {
    // const {response} = await dialog.showMessageBox(myWindow,{
    //     type: 'info',
    //     buttons: ['更新'],
    //     title: '软件更新提醒',
    //     message: `检测到最最新版本是 ${version}？`,
    //     defaultId: 2,
    //     cancelId: -1,
    //     textWidth: 300,
    // })
    // logger.info('选中的内容', response,[1].includes(response))
    autoUpdater.downloadUpdate()
    var info = {
        new: version,
        use: app.getVersion(),
        update: true
    }
    myWindow.webContents.send('update_version', info)
    return
    if ([0].includes(response)) {
        console.log('开始更新')
        let updaterData = {
            version: version
        }
        autoUpdater.downloadUpdate()
        logger.info(['更新操作', JSON.stringify(updaterData)], app.getVersion())
        var info = {
            new: version,
            use: app.getVersion(),
            update: true
        }
        myWindow.webContents.send('update_version', info)
    } else {
        logger.info(['更新操作', '关闭更新提醒'])
    }
}
