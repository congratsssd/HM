import HttpsProxyAgent from 'https-proxy-agent'
import axios from 'axios'
var n = function (e, t) {
        for (var r = 0; r < t.length - 2; r += 3) {
            var n = t.charAt(r + 2)
            ;(n = 'a' <= n ? n.charCodeAt(0) - 87 : Number(n)),
                (n = '+' == t.charAt(r + 1) ? e >>> n : e << n),
                (e = '+' == t.charAt(r) ? e + n : e ^ n)
        }
        return e
    },
    i = function () {
        return (i =
            Object.assign ||
            function (e) {
                for (var t, r = 1, n = arguments.length; r < n; r++)
                    for (var i in (t = arguments[r]))
                        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i])
                return e
            }).apply(this, arguments)
    },
    a = {
        client: 'gtx',
        from: 'auto',
        to: 'en',
        hl: 'en',
        tld: 'com'
    }

function o(e, t) {
    var r = i(i({}, a), t),
        o = {
            client: r.client,
            sl: r.from,
            tl: r.to,
            hl: r.hl,
            ie: 'UTF-8',
            oe: 'UTF-8',
            otf: '1',
            ssel: '0',
            tsel: '0',
            kc: '7',
            q: e,
            tk: (function (e) {
                for (var t = [], r = 0, i = 0; i < e.length; i++) {
                    var a = e.charCodeAt(i)
                    128 > a
                        ? (t[r++] = a)
                        : (2048 > a
                              ? (t[r++] = (a >> 6) | 192)
                              : (55296 == (64512 & a) &&
                                i + 1 < e.length &&
                                56320 == (64512 & e.charCodeAt(i + 1))
                                    ? ((a =
                                          65536 + ((1023 & a) << 10) + (1023 & e.charCodeAt(++i))),
                                      (t[r++] = (a >> 18) | 240),
                                      (t[r++] = ((a >> 12) & 63) | 128))
                                    : (t[r++] = (a >> 12) | 224),
                                (t[r++] = ((a >> 6) & 63) | 128)),
                          (t[r++] = (63 & a) | 128))
                }
                var o = 0
                for (r = 0; r < t.length; r++) (o += t[r]), (o = n(o, '+-a^+6'))
                return (
                    0 > (o = 0 ^ n(o, '+-3^+b+-f')) && (o = 2147483648 + (2147483647 & o)),
                    (o %= 1e6).toString() + '.' + o.toString()
                )
            })(e)
        },
        s = new URLSearchParams(o)
    return (
        ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'].forEach(function (e) {
            return s.append('dt', e)
        }),
        'https://translate.google.'.concat(r.tld, '/translate_a/single?').concat(s)
    )
}
function u(e, t) {
    void 0 === t && (t = !1)
    var r = {
        text: '',
        pronunciation: '',
        from: {
            language: {
                didYouMean: !1,
                iso: ''
            },
            text: {
                autoCorrected: !1,
                value: '',
                didYouMean: !1
            }
        }
    }
    if (
        (e[0].forEach(function (e) {
            e[0] ? (r.text += e[0]) : e[2] && (r.pronunciation += e[2])
        }),
        e[2] === e[8][0][0]
            ? (r.from.language.iso = e[2])
            : ((r.from.language.didYouMean = !0), (r.from.language.iso = e[8][0][0])),
        e[7] && e[7][0])
    ) {
        var n = e[7][0]
        ;(n = (n = n.replace(/<b><i>/g, '[')).replace(/<\/i><\/b>/g, ']')),
            (r.from.text.value = n),
            !0 === e[7][5] ? (r.from.text.autoCorrected = !0) : (r.from.text.didYouMean = !0)
    }
    return t && (r.raw = e), r
}

async function GoogleZ(text, targetLanguage, agent) {
    // 构建请求URL
    var url = o(text, targetLanguage)
    try {
        const startTime = Date.now() // 开始时间

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            httpsAgent: agent
        })
        const endTime = Date.now() // 结束时间
        const duration = endTime - startTime // 耗时，单位为毫秒

        // 解析JSON格式的响应数据
        var data = response.data

        console.log('翻译结果：', data)
        var result = u(data)
        return { cost: duration, result: result.text, types: result.from.language.iso }
    } catch (error) {
        console.log('翻译超时失败')
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
export { GoogleZ }
