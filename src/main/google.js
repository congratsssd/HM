import HttpsProxyAgent from 'https-proxy-agent'
import axios from 'axios'
import { Chatgpt } from './chatgpt'
import { fyzj_new } from './fyzj'
import { GoogleZ } from './google_z'
const tunnel = require('tunnel')
const google = require('@vitalets/google-translate-api')
const SocksProxyAgents = require('socks-proxy-agent')

const storage = require('electron-localstorage')
const { getProxySettings, getAndTestProxySettings } = require('get-proxy-settings')

async function basic() {
    const proxy = await getProxySettings()
    return proxy
}

// 函数：使用代理执行翻译
async function translateTextFree(text, targetLanguage, alls = false) {
    if (storage.getItem('google') && storage.getItem('google').startsWith('sk-')) {
        console.log(storage.getItem('google'), '人设：', storage.getItem('google_pp_r'))
        return await Chatgpt(text, targetLanguage)
    }

    if (storage.getItem('google') == 'gyxz') {
        return await hm_fy(text, targetLanguage)
    }
    if (storage.getItem('google') == 'fyzj') {
        return await fyzj_new(text, targetLanguage)
    }
    if (storage.getItem('google') == 'local') {
        return await translateTextWithProxy(text, targetLanguage)
    }

    var temp = await basic()
    var proxy = `${temp.http}`
    console.log('代理地址', proxy)
    var agent = new HttpsProxyAgent(proxy)
    if (storage.getItem('google') == 'lyj') {
        return await GoogleZ(text, targetLanguage, agent)
    }

    try {
        console.log(text)
        const param = {
            q: text,
            target: targetLanguage['to'],
            format: 'text'
        }

        if (targetLanguage['from']) {
            param['source'] = targetLanguage['from']
        }

        // 使用axios发送包含代理的请求
        const response = await axios.post(
            `https://translation.googleapis.com/language/translate/v2?key=` +
                storage.getItem('google'),
            param,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                httpsAgent: agent
            }
        )
        console.log('翻译结果', JSON.stringify(response.data))
        if (alls == true) {
            return { result: response.data }
        }

        //{"result":{"data":{"translations":[{"translatedText":"你好","detectedSourceLanguage":"en"}]}}}
        var vtrs = response.data.data.translations[0].translatedText.length > 1
        var r = response.data.data.translations[0].detectedSourceLanguage
        if (typeof r != 'string') {
            if (vtrs) {
                r = 'en'
            }
        }
        return {
            result: response.data.data.translations[0].translatedText,
            types: r
        }
    } catch (error) {
        return { result: '翻译失败:' + error.toString(), types: '失败' }
    }
}

const googleTranslator = (text, options = {}) =>
    google(text, options, {
        agent: tunnel.httpsOverHttp({
            proxy: {
                host: '127.0.0.1', // 代理 ip
                port: 7890, // 代理 port
                headers: {
                    'User-Agent': 'Node'
                }
            }
        })
    })
// 定义可用的接口地址列表
const apiEndpoints = [
    'https://translate.google.com.sg/translate_a/single', // 新加坡
    'https://translate.google.com.hk/translate_a/single', // 香港
    'https://translate.google.com.tw/translate_a/single', // 台湾
    'https://translate.google.co.jp/translate_a/single', // 日本
    'https://translate.google.co.uk/translate_a/single', // 英国
    'https://translate.google.co.in/translate_a/single', // 印度
    'https://translate.google.com.au/translate_a/single', // 澳大利亚
    'https://translate.google.ca/translate_a/single' // 加拿大
]

// 随机选择一个接口地址
function getRandomEndpoint() {
    const randomIndex = Math.floor(Math.random() * apiEndpoints.length)
    return apiEndpoints[randomIndex]
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

async function translateTextWithProxy(text, targetLanguage) {
    // 构建请求URL
    var sl = targetLanguage['to']
    var source = 'auto'
    if (targetLanguage['from']) {
        source = targetLanguage['from']
    }
    console.log('开始翻译')

    var temp = await basic()
    var proxy = `${temp.http}`
    console.log('代理地址', proxy)
    var agent = new HttpsProxyAgent(proxy)

    var url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${sl}&dt=t&q=${encodeURIComponent(
        text
    )}`
    url = `${getRandomEndpoint()}?client=gtx&sl=${source}&tl=${sl}&dt=t&q=${encodeURIComponent(
        text
    )}`
    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            httpsAgent: agent
        })
        // 解析JSON格式的响应数据
        var data = response.data
        // 提取翻译结果
        var translatedText = ''
        data[0].forEach((item) => {
            translatedText += item[0]
        })
        var types = data[2]

        // console.log(types, translatedText)

        return { result: translatedText, types: types }
    } catch (error) {
        console.log('翻译超时1')
        return { result: '翻译失败:' + error.toString(), types: false }
    }
}

async function hm_fy(text, targetLanguage) {
    // 构建请求URL
    var sl = targetLanguage['to']
    var source = 'auto'
    if (targetLanguage['from']) {
        source = targetLanguage['from']
    }
    if (sl.toLowerCase() == 'zh-cn') {
        sl = 'zh'
    }
    if (source.toLowerCase() == 'zh-cn') {
        source = 'zh'
    }
    console.log('开始翻译-海马', text)

    try {
        var datas = JSON.stringify({
            q: text,
            source: source,
            target: sl,
            format: 'text',
            alternatives: 3,
            api_key: ''
        })

        const fetch = require('node-fetch')
        const res = await fetch('https://fy.haimapro.com/translate', {
            method: 'POST',
            body: datas,
            headers: { 'Content-Type': 'application/json' }
        })

        var result = await res.json()

        console.log('翻译', result)
        if (result.error) {
            return { result: '翻译失败:' + result.error, types: false }
        }

        return { result: result.translatedText, types: result.detectedLanguage?.language ?? 'en' }
    } catch (error) {
        console.log('翻译超时2')
        return { result: '翻译失败:' + error.toString(), types: false }
    }
}

const translateRun = async (inputJson, options) => {
    const r = await googleTranslator(inputJson, options)
    return { success: true, result: r.text, types: r.from.language.iso }
}
export { translateTextWithProxy, translateRun, translateTextFree }
