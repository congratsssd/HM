const path = require('path')
const os = require('os')
const fs = require('fs-extra')
export function HaixiangList(sourceDir) {
    return new Promise((resolve, reject) => {
        const user_list = []
        fs.readdir(sourceDir, (err, files) => {
            if (err) {
                reject(err)
                return
            }
            const promises = files.map((file) => {
                const filePath = path.join(sourceDir, file)
                return new Promise((resolve, reject) => {
                    fs.stat(filePath, (err, stats) => {
                        if (err) {
                            reject(err)
                            return
                        }
                        if (stats.isDirectory() && file.includes('whatsapp')) {
                            const ids = file.split('_')
                            user_list.push({ type: ids[0], id: ids[1] })
                            console.log('文件夹:', ids)
                        }
                        resolve()
                    })
                })
            })
            Promise.all(promises)
                .then(() => resolve(user_list))
                .catch(reject)
        })
    })
}
export function HaixiangConfig(sourceDir) {
    const idMap = {}
    try {
        const data = fs.readFileSync(sourceDir, 'utf8')
        const jsonArray = data
            .split('\n')
            .map((line) => {
                if (line.length > 3) {
                    try {
                        return JSON.parse(line)
                    } catch (err) {
                        console.log('解析异常', line)
                        console.error('解析JSON时出错:', err)
                        return null
                    }
                }
            })
            .filter(Boolean)
        jsonArray.forEach((obj) => {
            const id = obj._id
            if (id) {
                idMap[id] = obj
            }
        })
    } catch (err) {
        console.error('读取文件时出错:', err)
    }
    return idMap
}
