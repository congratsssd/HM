import HttpsProxyAgent from 'https-proxy-agent'
import axios from 'axios'

async function fyzj_new(text, targetLanguage) {
    // 构建请求URL
    var url = 'http://www.trans-home.com/api/index/translate?token=L2I3jmi3mKEYv0k9FQxS'

    try {
        const startTime = Date.now() // 开始时间
        var data = {
            keywords: text,
            targetLanguage: targetLanguage
        }
        data = `keywords=${text}&targetLanguage=${targetLanguage.to}`
        console.log(data)
        const response = await axios.post(url, data, {
            headers: {}
        })
        const endTime = Date.now() // 结束时间
        const duration = endTime - startTime // 耗时，单位为毫秒

        // 解析JSON格式的响应数据
        var data = response.data

        console.log('翻译结果：', data)
        return { cost: duration, result: data.data.text, types: 'auto' }
    } catch (error) {
        console.log('翻译超时失败', error.response.data)
        let originalText = ''
        if (error.response && error.response.data && error.response.data.body) {
            originalText = error.response.data.body
        }
        return {
            result: '翻译失败:' + error.toString() + (originalText ? ', 原文:' + originalText : ''),
            types: false
        }
    }
}
export { fyzj_new }
