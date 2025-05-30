import SocksProxyAgent from 'socks-proxy-agent'

const axios = require('axios')
import HttpsProxyAgent from 'https-proxy-agent'

const SocksProxyAgents = require('socks-proxy-agent')

async function checkProxy(proxy) {
    try {
        const proxyUrl =
            proxy.type === 'socks5'
                ? `socks5://${proxy.host}:${proxy.port}`
                : `http://${proxy.host}:${proxy.port}`
        const agent =
            proxy.type === 'socks5'
                ? new SocksProxyAgents.SocksProxyAgent(proxyUrl)
                : new HttpsProxyAgent(proxyUrl)
        console.log('开始测试', proxyUrl, agent)
        const startTime = Date.now()
        const response = await axios.get('http://ip-api.com/json', {
            proxy: agent ? false : proxy,
            httpAgent: agent,
            timeout: 5000
        })
        const endTime = Date.now()
        console.log({
            valid: true,
            delay: endTime - startTime,
            ip: response.data.query,
            location: `${response.data.city}, ${response.data.country}`
        })
        return {
            valid: true,
            delay: endTime - startTime,
            ip: response.data.query,
            location: `${response.data.city}, ${response.data.country}`
        }
    } catch (error) {
        console.log('Error', error)
        return {
            valid: false,
            delay: null,
            ip: null,
            location: null
        }
    }
}

export { checkProxy }
