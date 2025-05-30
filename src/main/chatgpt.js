import HttpsProxyAgent from 'https-proxy-agent'
import axios from 'axios'
import storage from 'electron-localstorage'
// 配置代理
const proxy = 'http://127.0.0.1:7890'
const agent = new HttpsProxyAgent(proxy)

// 函数：使用代理执行翻译
async function Chatgpt(arg, types) {
    console.log('目标语种：', types)
    try {
        var pop =
            storage.getItem('google_pp_r') +
            ' 如果是其他语种翻译中文，告诉我对方原来的语种，如果是翻译成auto，那么就是翻译成英语'
        // 设置请求数据，包括模型、用户消息和预设词
        const requestData = {
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: pop },
                { role: 'user', content: arg + '翻译成' + types.to + '语' }
            ],
            temperature: 0,
            top_p: 0.45
        }

        // 使用axios发送包含代理的请求
        const response = await axios.post(
            `https://openkey.cloud/v1/chat/completions`,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ` + storage.getItem('google')
                }
            }
        )
        // 处理 API 响应
        const responseData = response.data

        // 提取生成的文本
        const generatedText = responseData.choices[0].message.content
        console.log('翻译结果：', generatedText)
        return { result: generatedText, types: 'auto', is_gpt: true }
    } catch (error) {
        if (error.response) {
            console.error('gpt翻译错误:', error.response.data) // 输出返回的 body 内容
            return { result: 'gpt翻译失败：' + JSON.stringify(error.response.data), types: 'auto' }
        } else {
            console.error('gpt翻译错误:', error.message) // 输出一般错误信息
        }
        return { result: error.message, types: 'auto' }
        throw error
    }
}

export { Chatgpt }
