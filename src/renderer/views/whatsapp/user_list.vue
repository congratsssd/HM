<template>
    <div class="user-list">
        <!-- left -->
        <div class="left-nav">
            <h3 class="bottom10 title" style="margin: 10px">WhatsApp</h3>
            <el-button
                v-loading="addLoading"
                :disabled="addLoading"
                class="bottom10"
                style="margin: 10px"
                @click="add"
                type="primary"
                size="large"
                :icon="'Plus'"
            >
<!--                新建会话-->
            </el-button>

            <div class="scrollable">
                <div v-for="user in user_list" :key="user.id" class="list-itme"
                    :class="{ 'is-active': user.id === selectedUserId }"
                    @click="toggleActive(user)"
                >
                    <div class="list-itme-left">

                        <el-avatar :size="70" :src="user.avatar" />

                        <div class="list-itme-left-text">

                            <span :key="user.name" class="user-name text-ellipsis" >
                                 {{ user.name || ' 加载中...' }}
                            </span>
                            <span class="user-phone text-ellipsis">{{ user.phone }}</span><!--id-->

                            <el-badge :value="user.count" class="item" v-if="user.count > 0">
                                <span>
                                    <el-tag size="small" type="danger" v-if="user.open === 0"
                                        >未开启-{{ user.id }}</el-tag
                                    >
                                    <el-tag class="mx-1" size="small" type="success" v-else
                                        >运行中-{{ user.id }}</el-tag
                                    >
                                </span>
                            </el-badge>
                            <span v-else>
                                <el-tag size="small" type="danger" v-if="user.open === 0"
                                    >未开启-{{ user.id }}</el-tag
                                >
                                <el-tag class="mx-1" size="small" type="success" v-else
                                    >运行中-{{ user.id }}</el-tag
                                >
                            </span>
                            <span class="user-phone text-ellipsis"
                                >联系人：{{ user.contanct_list }}</span>

                        </div>
                    </div>
                    <div class="list-itme-bottom">
                        <el-dropdown>
                            <span>
                                <el-icon :size="20">
                                    <ArrowDownBold />
                                </el-icon>
                            </span>
                            <template #dropdown>
    <!--                                创建下拉菜单-->
                                <el-dropdown-menu>
                                    <el-dropdown-item
                                        @click="set_sz(2, user.id)"
                                        :disabled="user.open == 1"
                                    >
                                        代理
                                    </el-dropdown-item>

                                    <el-dropdown-item
                                        divided
                                        v-if="user.open === 0"
                                        @click="StartWindow(user)"
                                        :disabled="use.status"
                                    >
                                        <el-text class="mx-1" type="success"> 启动 </el-text>
<!--                                        el-text方法，Element UI 的一个组件，它用于展示文本，并可以通过 type 属性来设置文本的颜色和样式-->
                                    </el-dropdown-item>
                                    <template v-else>
                                        <el-dropdown-item divided @click="CloseWindow(user)">
                                            <el-text class="mx-1" type="warning"> 关闭 </el-text>
                                        </el-dropdown-item>

                                        <el-dropdown-item @click="openLoad()" divided>
                                            刷新
                                        </el-dropdown-item>

                                        <el-dropdown-item @click="view_init" divided>
                                            初始化
                                        </el-dropdown-item>

                                        <el-dropdown-item @click="backup(user.phone)" divided>
                                            备份联系人
                                        </el-dropdown-item>

                                        <el-dropdown-item @click="recovd(user.phone)" divided>
                                            恢复联系人
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            v-if="loginHny === 1"
                                            @click="handleDev"
                                            divided
                                        >
                                            开发者工具
                                        </el-dropdown-item>
                                    </template>
                                    <el-dropdown-item
                                        @click="DelWindo(user.id)"
                                        :disabled="user.open == 1"
                                        divided
                                    >
                                        <el-text class="mx-1" type="danger">删除</el-text>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </div>
        <!-- 会话 -->
        <div id="main">
            <el-row
                v-loading="mainLoading"
                element-loading-text="加载中，如时间过长可关闭重新启动"
                type="flex"
                class="full-height"
                justify="center"
                align="middle"
            >
                <el-col :span="19">
                    <el-result title="未选择会话">
                        <template #icon>
                            <img
                                src="@renderer/common/png/watting.png"
                                style="width: 600px; height: 600px"
                            />
                        </template>
                    </el-result>
                </el-col>
            </el-row>
        </div>
        <!-- right -->
        <div v-show="sert !== 0" style="width: 300px">
            <div v-if="set_act === 1">
                <el-row>
                    <el-col :span="24">
                        <h3 class="bottom10" align="center">基础信息</h3>
                    </el-col>
                </el-row>
                <el-form :model="form" v-loading="userLoading" label-width="90px">
                    <el-form-item label="进粉时间">
                        <el-input v-model="user_info.create_time" disabled="true" />
                    </el-form-item>

                    <el-form-item label="手机号">
                        <el-input v-model="user_info.user" :disabled="true" />
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="user_info.name" type="textarea"></el-input>
                        <el-button type="danger" @click="saveUserName">修改</el-button>
                        <el-button type="success" v-if="is_hny == 1" @click="cv"
                            >审单连接</el-button
                        >
                    </el-form-item>

                    <el-form-item label="语种">
                        <el-select
                            v-model="user_info.language"
                            filterable
                            placeholder="Select"
                            style="width: 240px"
                            @change="get_lang"
                        >
                            <el-option
                                v-for="item in langue"
                                :key="item[0]"
                                :label="item[1]"
                                :value="item[0]"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="翻译">
                        <!--                    <el-select-->
                        <!--                        v-model="user_info.fy_select"-->
                        <!--                        filterable-->
                        <!--                        placeholder="Select"-->
<!--                                                style="width: 240px"-->
<!--                                                @change="get_lang"-->
<!--                                            >-->
<!--                                                <el-option-->
<!--                                                    v-for="item in fy"-->
<!--                                                    :key="item.value"-->
<!--                                                    :label="item.item"-->
<!--                                                    :value="item.value"-->
<!--                                                />-->
<!--                                            </el-select>-->

                        <el-switch v-model="user_info.is_fy" @change="set_fy" />


                        <el-switch
                            style="--el-switch-on-color: #ef3035"
                            :disabled="true"
                            inline-prompt
                            active-text="重粉！"
                            v-if="user_info.repeatable"
                            v-model="user_info.repeatable"
                        />
                    </el-form-item>
                    <el-form-item label="实时翻译" >
                        <el-switch
                            v-model="user_info.ss_fy"
                            @change="st_fy"
                            inline-prompt
                            active-text="开启"
                            inactive-text="关闭"
                            style="margin-top: 10px"

                        />
                    </el-form-item>

                    <!--                <el-form-item label="经纬度" v-if="user_info.lat!=''">-->

                    <!--                    <el-input v-model="user_info.lat"/>-->
                    <!--                    <el-input v-model="user_info.lng"/>-->
                    <!--                    <el-input type="textarea" v-if="user_info.loc.length>5" v-model="user_info.loc"/>-->
                    <!--                </el-form-item>-->

                    <el-form-item label="备注">
                        <el-input v-model="user_info.remark" type="textarea" />
                        <el-button type="primary" @click="SaveRemark">修改</el-button>
                    </el-form-item>

                    <div class="scrollable_order">
                        <el-timeline v-if="user_history.length > 0" style="margin-left: 10px">
                            <el-timeline-item
                                v-for="(activity, index) in user_history"
                                :key="index"
                                :timestamp="activity.create_time"
                                placement="top"
                            >
                                订单id:{{ activity.id }}-{{ activity.user_name }} <br />
                                报价：{{ activity.price }}{{ activity.type }}<br />
                                状态：{{ activity.express }}-{{ activity.logistics }}<br />
                                备注：<br />{{ activity.remark }}
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </el-form>
            </div>
            <div v-else-if="set_act === 2">
                <el-row>
                    <el-col :span="24">
                        <h3 class="bottom10" align="center">代理设置</h3>
                    </el-col>
                </el-row>
                <el-form :model="form" label-width="90px">
                    <el-form-item label="协议">
                        <el-select v-model="proxy_info.selectedProtocol" placeholder="请选择协议">
                            <el-option
                                v-for="protocol in proxy_info.protocols"
                                :key="protocol"
                                :label="protocol"
                                :value="protocol"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="地址">
                        <el-input v-model="proxy_info.address" placeholder="地址"></el-input>
                    </el-form-item>

                    <el-form-item label="端口">
                        <el-input
                            v-model="proxy_info.port"
                            placeholder="端口"
                            type="number"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            style="width: 100%"
                            type="primary"
                            :loading="proxy_info.check"
                            @click="checkProxy"
                        >
                            {{ proxy_info.check_text }}
                        </el-button>
                    </el-form-item>

                    <el-form-item label="延迟">
                        <el-text :size="large" v-if="proxy_info.times >= 0" type="success">
                            <h2>{{ proxy_info.times }}ms</h2>
                        </el-text>

                        <!-- 当 times 等于 -1 时，应用 "danger" 类 -->
                        <el-text :size="large" v-else type="danger">
                            <h2>{{ proxy_info.times }}ms</h2>
                        </el-text>
                    </el-form-item>

                    <el-form-item label="Ip">
                        <el-text :size="large" v-if="proxy_info.times >= 0" type="success">
                            <h2>{{ proxy_info.ip }}</h2>
                        </el-text>

                        <!-- 当 times 等于 -1 时，应用 "danger" 类 -->
                        <el-text :size="large" v-else type="danger">
                            <h2>
                                {{ proxy_info.ip }}
                            </h2>
                        </el-text>
                    </el-form-item>

                    <el-form-item label="城市">
                        <el-text :size="large" v-if="proxy_info.times >= 0" type="success">
                            <h2>{{ proxy_info.city }}</h2>
                        </el-text>

                        <!-- 当 times 等于 -1 时，应用 "danger" 类 -->
                        <el-text :size="large" v-else type="danger">
                            <h2>
                                {{ proxy_info.city }}
                            </h2>
                        </el-text>
                    </el-form-item>

                    <el-form-item>
                        <el-button
                            style="width: 100%"
                            v-if="proxy_info.times > 0"
                            type="success"
                            @click="saveProxy"
                        >
                            保存-重启窗口生效
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-else-if="set_act === 3">
                <el-row>
                    <el-col :span="24">
                        <h3 class="bottom10" align="center">发送位置</h3>
                    </el-col>
                </el-row>
                <el-form :model="form" label-width="90px">
                    <el-form-item label="经度">
                        <el-input v-model="send_loca.lat" />
                    </el-form-item>
                    <el-form-item label="维度">
                        <el-input v-model="send_loca.lng" />
                    </el-form-item>
                    <el-form-item label="位置信息">
                        <el-input v-model="send_loca.name" type="textarea" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="send_location">发送</el-button>
                    </el-form-item>

                    <!-- 上传语音文件，只允许音频格式，单选 -->
                    <el-form-item label="上传语音">
                        <el-upload
                            :action="uploadUrl"
                            :auto-upload="false"
                            accept="audio/mp3, audio/*"
                            :file-list="audioFileList"
                            :limit="1"
                            :on-change="handleAudioChange"
                            :on-remove="handleRemove"
                            :multiple="false"
                        >
                            <el-button slot="trigger" type="primary">选择语音文件</el-button>
                        </el-upload>

                        <el-button type="primary" @click="send_audio">发送语音</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-else-if="set_act === 4">
                <el-form :model="form" label-width="90px">
                    <el-form-item label="一购客服">
                        <el-input v-model="order.customer_user" />
                    </el-form-item>
                    <el-form-item label="年龄">
                        <el-input v-model="order.year" />
                    </el-form-item>
                    <el-form-item label="订单总额">
                        <el-input v-model="order.cumulative_transaction_amount" />
                    </el-form-item>
                    <el-form-item label="复购次数">
                        <el-input v-model="order.repurchase_count" />
                    </el-form-item>
                    <el-form-item label="需求">
                        <el-input type="textarea" :rows="2" v-model="order.customer_core_need" />
                    </el-form-item>
                    <el-form-item label="当前进度">
                        <el-select v-model="order.current_status" placeholder="请选择">
                            <el-option label="等收货" value="0"></el-option>
                            <el-option label="铺垫期" value="1"></el-option>
                            <el-option label="转化中" value="2"></el-option>
                            <el-option label="发货中" value="3"></el-option>
                            <el-option label="客户死" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" :rows="2" v-model="order.remarks" />
                    </el-form-item>

                    <el-form-item>
                        <el-button :disabled="order.buton" type="primary" @click="save_info">
                            {{ order.button_name }}
                        </el-button>
                    </el-form-item>
                    <el-form-item label="客服">
                        <el-input
                            v-model="order.dailyMaintenance.user"
                            @change="updateLoginKefuName"
                        />
                    </el-form-item>
                    <el-form-item label="日常维护">
                        <el-input type="textarea" :rows="4" v-model="order.dailyMaintenance.info" />
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            :disabled="order.dailyMaintenance.buton"
                            type="primary"
                            @click="send_logs"
                        >
                            {{ order.dailyMaintenance.button_name }}
                        </el-button>
                    </el-form-item>

                    <div class="scrollable_order">
                        <el-timeline v-if="order.hist.length > 0" style="margin-left: 10px">
                            <el-timeline-item
                                v-for="(activity, index) in order.hist"
                                :key="index"
                                :timestamp="activity.create_time"
                                placement="top"
                            >
                                {{ activity.user }}<br />
                                {{ activity.info }}<br />
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </el-form>
            </div>
            <div v-else>
                <el-row>
                    <el-col :span="24">
                        <h3 class="bottom10" align="center">翻译设置</h3>
                    </el-col>
                </el-row>
                <el-form :model="form" label-width="110px">
                    <el-form-item label="翻译方式：">
                        <el-select
                            v-model="translateSelect"
                            placeholder="Select"
                            style="width: 100%"
                        >
                            <el-option label="云端翻译" :value="1" />
                            <el-option label="本地翻译" :value="0" />
                        </el-select>
                    </el-form-item>

                    <!-- 秘钥部分 -->
                    <el-form-item label="秘钥">
                        <el-input
                            type="textarea"
                            v-model="google_key"
                            placeholder="请输入人设描述"
                            rows="4"
                        />
                    </el-form-item>

                    <!-- 人设部分 -->
                    <el-form-item label="人设">
                        <el-input
                            type="textarea"
                            v-model="pp"
                            placeholder="请输入人设描述"
                            rows="4"
                        />
                    </el-form-item>

                    <!-- 统一保存按钮 -->
                    <el-form-item>
                        <el-button type="success" @click="saveG" round>保存</el-button>
                    </el-form-item>

                    <el-form-item label="测试">
                        <el-input v-model="google_t" type="textarea" />

                        <el-button type="success" @click="t" round>测试翻译</el-button>
                    </el-form-item>

                    <el-form-item label="是否开启翻译：">
                        <el-switch
                            v-model="isTranslate"
                            class="mb-2"
                            inline-prompt
                            size="large"
                            active-text="开启"
                            inactive-text="关闭"
                        />
                    </el-form-item>

                    <el-form-item label="自定义昵称">
                        <el-switch
                            v-model="div_name"
                            class="mb-2"
                            inline-prompt
                            size="large"
                            active-text="开启"
                            inactive-text="关闭"
                        />
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="user-right" v-if="isopen">
            <el-menu :default-active="set_act" class="el-menu-vertical-demo" :collapse="true">
                <el-menu-item
                    v-for="(item, index) in menuItems"
                    :key="index"
                    :index="item.id"
                    @click="handleMenuItemClick(index)"
                >
                    <el-icon :size="20">
                        <component :is="item.icon" />
                    </el-icon>
                    <template #title>{{ item.name }}</template>
                </el-menu-item>
            </el-menu>
        </div>
        <el-dialog v-model="dialogTableVisible" title="检测到海象数据" width="70%">
            <el-table :data="gridData">
                <el-table-column property="_id" label="Id" />
                <el-table-column property="type" label="类型" />
                <el-table-column property="item.name" label="用户名" />
                <el-table-column property="item.username" label="号码" />
                <el-table-column property="proxy.protocol" label="协议" />
                <el-table-column property="proxy.host" label="地址" />
                <el-table-column property="proxy.port" label="端口" />
            </el-table>
            <el-button type="success" :loading="dialogTableVisible_l" @click="saveHx" round
                >同步数据</el-button
            >
            <el-button type="primary" @click="CloseHx" round>关闭</el-button>
        </el-dialog>
    </div>
</template>
<script>
import '@renderer/common/css/whatsapp.css'

import { nextTick, unref } from 'vue'
import { ElMessage } from 'element-plus'

const { ipcRenderer } = window.electron
import { langue } from '@renderer/langue'




export default {
    name: 'UserList',
    data() {
        return {
            div_name: true,
            uploadUrl: '',
            audioFileList: [],
            google_key: localStorage.getItem('google'),
            isTranslate: true,
            translateSelect: null,
            addLoading: false,
            userLoading: false,
            pp:
                localStorage.getItem('google_pp') ??
                '你是一个精通全球的翻译官，你是一个中国人，你可以准确的识别他们说的语言，并可以将中文翻译成他们的语种发送过去，中文翻译别的语言就只需要给到翻译结果',
            dialogTableVisible: false,
            google_t: 'hello',
            is_hny: 0,
            order: {
                button_name: '保存',
                year: '',
                buton: false,
                customer_user: '获取中',
                dailyMaintenance: {
                    button_name: '维护',
                    buton: false,
                    user: localStorage.getItem('login_kefu_name'),
                    info: ''
                },
                id: '获取中....',
                customer_phone: '',
                customer_core_need: '',
                repurchase_count: '',
                cumulative_transaction_amount: '',
                current_status: '',
                remarks: '',
                hist: []
            },
            loginHny: Number(localStorage.getItem('login_hny')),
            gridData: [],
            dialogTableVisible_l: false,
            send_loca: {
                lat: '51.5179501',
                lng: '-0.058742',
                name: 'Royal London Hospital: Luckes Entrance'
            },
            proxy_info: {
                selectedProtocol: 'https',
                address: '127.0.0.1',
                port: '7890',
                protocols: ['https', 'socks5'],
                id: -1,
                times: 0,
                city: '',
                ip: '',
                check: false,
                check_text: '测试'
            },
            langue: [],
            user_history: [],
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
                language: '',
                remark: '',
                proxy: {
                    type: '',
                    host: '',
                    port: ''
                }
            },
            selectedUserId: null,
            user_list: [],
            isopen: 1,
            main: 21,
            sert: 0,
            use: {
                use: 0,
                port: 0,
                status: true
            },
            proxyString: {
                id: -1,
                urls: ''
            },
            set_act: null,
            user_info: {
                name: '无会话',
                id: 0,
                repeatable: false,
                user: '',
                ws_id: 0,
                language: 'auto',
                lat: '',
                lng: '',
                loc: '',
                is_fy: true,
                create_time: '',
                fy_select: 'google'
            },
            fy: [
                { value: 'google', name: '谷歌' },
                { value: 'chatgpt', name: 'GPT3.5' }
            ],
            menuItems: [
                {
                    id: 0,
                    name: '收缩',
                    icon: 'DArrowRight'
                },
                {
                    id: 1,
                    name: '会话信息',
                    icon: 'ChatDotRound'
                },
                {
                    id: 2,
                    name: '代理设置',
                    icon: 'Setting'
                },
                {
                    id: 3,
                    name: '位置',
                    icon: 'Position'
                },
                {
                    id: 4,
                    name: '跟进',
                    icon: 'avatar'
                },
                {
                    id: 5,
                    name: '翻译设置',
                    icon: 'EditPen'
                }
            ]
        }
    },
    computed: {
        mainLoading() {
            let bol
            this.user_list.forEach((element) => {
                if (element.id !== this.selectedUserId) return
                bol = Boolean(element.open === 1)
            })
            return bol
        }
    },
    mounted() {
        ipcRenderer.invoke('get-is_google').then((result) => {
            console.log('status：' + result, result === 1 ? '云端' : '本地')
            this.translateSelect = result
        })
        ipcRenderer.send('ws_send', {
            ws_type: 'Whats',
            type: 'list'
        })
        console.log('我在监控')
        ipcRenderer.on('set_location', (event, data) => {
            console.log('收到位置', data)
            if (data.id == this.user_info.user) {
                this.user_info.lat = data['lg']['lat']
                this.user_info.lng = data['lg']['lng']
                this.user_info.loc = data['lg']['loc']
            }
            //TODO::待开机测试
            ipcRenderer.send('ws_send', {
                ws_type: 'Custorm',
                type: 'location',
                lg: data['lg'],
                user: data['id']
            })
        })

        ipcRenderer.on('ws_new_msg', (event, data) => {
            console.log('取到新消息', data)
            this.user_list.forEach((item) => {
                if (item.id == data.id) {
                    if (this.selectedUserId != data.id) {
                        if (data.phone != item.user) {
                            console.log('item信息', item, item.count)
                            item.count += 1

                            console.log('item信息', item, item.count)
                        }

                    }
                }
            })
        })
        // 新添加
        ipcRenderer.on('new-message-notify', (event, data) => {
            // 显示通知、播放提示音、闪烁托盘等
            console.log('有新消息提醒：', data)
            new Notification('新消息提醒', {
                body: `来自 ${data.user} 的新消息`
            })
        })
        // 添加结束
        ipcRenderer.on('set_langs', (event, data) => {
            console.log('收到语种', data)

            if (data.id == this.user_info.user) {
                this.user_info.language = data['lg']
                this.get_lang()
            }
        })
        ipcRenderer.send('check_haixiang', '')
        ipcRenderer.on('haixiang_r', (event, result) => {
            console.log('海象数据', result)
            var info = []

            Object.keys(result).forEach((key) => {
                var item = result[key]
                if (item.type == 'whatsapp') {
                    info.push(item)
                }
            })
            console.log('海象', info)
            if (info.length > 0) {
                this.gridData = info
                this.dialogTableVisible = true
            }
        })
        ipcRenderer.on('set_ws_info', (event, result) => {
            console.log('获取到的用户信息', result)
            // console.log(result.id, this.user_info.ws_id)
            // console.log(result)
            if (result.info.phone == this.user_info.user) {
                var temp = localStorage.getItem('login_hny')
                console.log('是否海马', temp)
                this.user_history = []

                if (temp == 1) {
                    this.is_hny = 1
                    this.user_history = result.history
                }
                // this.user_info.repeatable = result.repeatable
                this.user_info.ws_id = result.info.id
                this.user_info.remark = result.info.remark

                this.user_info.name = result.info.nickname
                this.user_info.language = result.info.language
                this.user_info.lat = result.info.lat
                this.user_info.lng = result.info.lng
                this.user_info.lnc = result.info.lnc
                this.user_info.is_fy = result.info.is_fy == 1
                this.user_info.create_time = result.info.create_time
                // 结束加载
                this.userLoading = false
            }
        })

        // 用户信息加载
        ipcRenderer.on('user-loading', (ev, bol) => {
            this.userLoading = false
        })

        ipcRenderer.on('show_name', (event, data) => {
            // debugger
            console.log('ws返回的信息', data)
            this.user_info.name = data['name']
            this.user_info.id = data['id']

            this.order.phone = data['user']
            this.order = {
                button_name: '保存',
                year: '',
                buton: false,
                customer_user: '获取中',
                dailyMaintenance: {
                    button_name: '维护',
                    buton: false,
                    user: localStorage.getItem('login_kefu_name'),
                    text: ''
                },
                id: '获取中....',
                customer_phone: '',
                customer_core_need: '',
                repurchase_count: '',
                cumulative_transaction_amount: '',
                current_status: '',
                remarks: ''
            }
            this.fetchUserData(data['user'])
            this.user_info.user = data['user']
            this.user_info.language = data['lg']

            ipcRenderer.send('get_ws_info', {
                id: data['id'],
                phone: data['user'],
                name: data['name'],
                avatar: data['avatar']
            })
        })

        ipcRenderer.on('view_count', (event, data) => {
            console.log('窗口信息', data)
            this.use.port = data.port
            this.use.use = data.use

            this.check_port()
        })

        ipcRenderer.on('set_ws_info_new', (event, data) => {
            console.log('用户信息', data)
            // this.userLoading = false
            this.user_list.forEach((item) => {
                if (item.id == data['id']) {
                    console.log(data, item)
                    item.avatar = data.avatar
                    item.name = data.name || item.name
                    item.phone = data.phone
                    item.contanct_list = data.contanct_list
                }
            })
            console.log('设置数据信息', data.contanct_list)
            this.storeC(`contanct_len_${data.phone}`, data.contanct_list)
        })

        ipcRenderer.on('add_win', (event, data) => {
            console.log('添加海报', data)
            if (data.code == 200) {
                console.log('添加窗口', data)
                ElMessage({
                    message: '添加窗口成功',
                    type: 'success'
                })
                this.log('添加窗口成功：', data)
                this.addLoading = false
                var temp = {
                    id: data.msg,
                    avatar: '',
                    name: 'WhatsApp',
                    contanct_list: 0,
                    phone: '',
                    // unreadMessages: 0, // 新增未读消息字段
                    country: '',
                    status: 0,
                    remrak: '',
                    proxy: '',
                    urls: 'https:\/\/web.whatsapp.com\/',
                    is_show: 1,
                    is_open: 0,
                    open: 0,
                    type: 'whatsapp',
                    ua: data.ua
                }
                this.user_list.push(temp)

                var temp = this.$getWhatsAppRun('whatsapp_run')

                this.user_list.forEach((item) => {
                    if (typeof temp[item.id] != 'undefined') {
                        item.open = temp[item.id].open
                        item.count = temp[item.id].count
                    } else {
                        item.open = 0
                        item.count = 0
                    }
                    temp[item.id] = item
                })
                this.$storeWhatsAppRun('whatsapp_run', temp)
            } else {
                ElMessage.error(data.msg)
            }
        })

        ipcRenderer.on('add_win_hx', (event, data) => {
            console.log('新增海象', data)

            Object.keys(data).forEach((key) => {
                var item = data[key]
                item.urls = 'https:\/\/web.whatsapp.com\/'
                item.is_show = 1

                item.is_open = 0
                item.open = 0
                this.user_list.push(item)
            })
            ElMessage({
                message: '同步海象数据完成',
                type: 'success'
            })

            var temp = this.$getWhatsAppRun('whatsapp_run')

            this.user_list.forEach((item) => {
                if (typeof temp[item.id] != 'undefined') {
                    item.open = temp[item.id].open
                    item.count = temp[item.id].count
                } else {
                    item.open = 0
                    item.count = 0
                }
                temp[item.id] = item
            })
            this.$storeWhatsAppRun('whatsapp_run', temp)
            this.dialogTableVisible = false
            this.dialogTableVisible_l = false
        })
        ipcRenderer.on('google_ts', (event, data) => {
            console.log('用户列表', data)
            this.google_t = data.str
        })

        ipcRenderer.on('ws_user_list', (event, data) => {
            console.log('用户列表', data)
            var temp = this.$getWhatsAppRun('whatsapp_run')

            data.forEach((item) => {
                if (typeof temp[item.id] != 'undefined') {
                    item.open = temp[item.id].open
                    item.count = temp[item.id].count
                } else {
                    item.open = 0
                    item.count = 0
                }
                var temps = this.storeG('contanct_len_' + String(item.phone)) ?? 0
                item.contanct_list = temps
                temp[item.id] = item
            })
            this.$storeWhatsAppRun('whatsapp_run', temp)
            this.user_list = data
            this.log('用户列表页重新渲染', data)
            this.addLoading = false
            this.update_size()
        })
        ipcRenderer.send('save_google', {
            key: this.google_key,
            pp: this.pp
        })
    },

    methods: {

        // 处理文件选择，验证文件类型，并保证单选
        handleAudioChange(file, fileList) {
            const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg']
            if (!allowedTypes.includes(file.raw.type)) {
                this.$message.error('只能上传音频文件（如 mp3 等）')
                this.audioFileList = []
            } else {
                // 保证只选一个文件（取最后一个文件）
                this.audioFileList = fileList.slice(-1)
            }
        },
        async fetchUserData(mobile) {
            try {
                // 发送 GET 请求
                let response = await fetch(`https://az.jinss.vip/api/hm/index?mobile=${mobile}`)

                // 解析 JSON 响应
                let data = await response.json()

                console.log('ws返回的信息', data)

                this.user_history = data.msg.his
                this.order = data.msg.cus
                this.order.dailyMaintenance = {
                    button_name: '维护',
                    buton: false,
                    user: localStorage.getItem('login_kefu_name'),
                    info: ''
                }
                this.order.button_name = '保存'
            } catch (error) {
                console.error('请求失败:', error)
            }
        },
        // 删除文件时更新列表
        handleRemove(file, fileList) {
            this.audioFileList = fileList
        },
        openLoad() {
            ipcRenderer.send('open_load')
        },
        handleDev() {
            ipcRenderer.send('open_dev')
        },
        check_port() {
            this.use.status = false
            if (this.use.port == 0) {
                this.use.status = true
            } else {
                0
                if (this.use.use >= this.use.port) {
                    this.use.status = true
                }
            }
        },
        async save_info() {
            this.order.button_name = '保存中...'
            this.order.buton = true
            try {
                // 发送 POST 请求，并将 this.order 作为请求体数据（JSON 格式）
                let response = await fetch('https://az.jinss.vip/api/hm/save_info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.order)
                })
                // 解析 JSON 响应
                let data = await response.json()
                // 可根据实际需求处理返回的数据
                console.log(data)
            } catch (error) {
                console.error('保存信息时出错：', error)
            }
            this.order.button_name = '保存'
            this.order.buton = false
        },

        async send_logs() {
            this.order.dailyMaintenance.button_name = '维护中...'
            this.order.dailyMaintenance.buton = true
            try {
                // 发送 POST 请求，并将 this.order 作为请求体数据（JSON 格式）
                let response = await fetch('https://az.jinss.vip/api/hm/save_log', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.order)
                })
                // 解析 JSON 响应
                let data = await response.json()
                // 可根据实际需求处理返回的数据
                console.log(data)
                this.fetchUserData(this.order.customer_phone)
            } catch (error) {
                console.error('保存信息时出错：', error)
            }
            this.order.dailyMaintenance.button_name = '维护'
            this.order.dailyMaintenance.buton = false
        },
        updateLoginKefuName() {
            localStorage.setItem('login_kefu_name', this.order.dailyMaintenance.user)
        },
        send_location() {
            console.log('发送位置')
            var info = {
                lng: this.send_loca.lng,
                lat: this.send_loca.lat,
                id: this.user_info.id,
                name: this.send_loca.name
            }
            ipcRenderer.send('send_location', info)
        },
        send_audio() {
            if (this.audioFileList.length === 0) {
                this.$message.error('请先选择一个语音文件')
                return
            }
            const audioFile = this.audioFileList[0].raw
            const reader = new FileReader()
            reader.onload = (e) => {
                const base64Audio = e.target.result
                console.log('转换后的音频文件：', base64Audio)

                console.log('发送语言')
                var info = {
                    id: this.user_info.id,
                    name: this.send_loca.name,
                    r: base64Audio
                }
                ipcRenderer.send('send_audio', info)
                // 这里可以调用发送语音的接口，比如：
                // WPP.chat.sendFileMessage('[number]@c.us', base64Audio, { type: 'audio', isPtt: true });
                // 转换完成后清空文件列表
                this.audioFileList = []
            }
            reader.readAsDataURL(audioFile)
        },
        async checkProxy() {
            const proxy = {
                type: this.proxy_info.selectedProtocol, // 或 'socks5'
                host: this.proxy_info.address,
                port: this.proxy_info.port
            }

            this.proxy_info.check = true
            this.proxy_info.check_text = '连接中'
            this.proxy_info.text = '检测中'
            var r = await ipcRenderer.invoke('checkProxy', proxy)
            console.log(r)
            if (r['valid']) {
                this.proxy_info.times = r['delay']
                this.proxy_info.ip = r['ip']
                this.proxy_info.city = r['location']
            } else {
                this.proxy_info.times = -1
                this.proxy_info.ip = `连接超时！`
                this.proxy_info.city = ''
            }
            this.proxy_info.check = false

            this.proxy_info.check_text = '测试'
        },
        saveProxy() {
            const proxy = {
                type: this.proxy_info.selectedProtocol, // 或 'socks5'
                host: this.proxy_info.address,
                port: this.proxy_info.port
            }
            const proxyUrl =
                proxy.type === 'socks5'
                    ? `socks5://${proxy.host}:${proxy.port}`
                    : `http://${proxy.host}:${proxy.port}`

            ipcRenderer.send('ws_send', {
                ws_type: 'Whats',
                type: 'proxy',
                id: this.selectedUserId,
                proxy: proxyUrl
            })

            this.user_list.forEach((item) => {
                if (item.id == this.selectedUserId) {
                    item.proxy = proxyUrl
                }
            })
            ElMessage({
                message: '保存完成，请重启窗口',
                type: 'success'
            })
        },
        parseProxy(proxyString) {
            this.id = proxyString.id
            if (proxyString.urls && proxyString.urls.length > 5) {
                const regex = /^(https|socks5):\/\/(.*):(\d+)$/
                const match = proxyString.urls.match(regex)
                if (match) {
                    this.proxy_info.selectedProtocol = match[1]
                    this.proxy_info.address = match[2]
                    this.proxy_info.port = match[3]
                }
            } else {
                this.proxy_info.selectedProtocol = ''
                this.proxy_info.address = ''
                this.proxy_info.port = ''
            }
        },
        saveG() {
            localStorage.setItem('google', this.google_key)
            localStorage.setItem('google_pp', this.pp)
            ipcRenderer.send('save_google', {
                key: this.google_key,
                pp: this.pp
            })
        },
        t() {
            ipcRenderer.send('google_t', {
                key: this.google_t
            })
        },
        saveHx() {
            this.dialogTableVisible_l = true
            ipcRenderer.send('ws_send', {
                ws_type: 'Whats',
                type: 'add_hx',
                data: JSON.stringify(this.gridData)
            })
        },
        CloseHx() {
            this.dialogTableVisible = false
        },
        get_lang() {
            console.log('传递语种')
            ipcRenderer.send('set_language', {
                user: this.user_info.user,
                is_fy: this.user_info.is_fy,
                lg: this.user_info.language,
                uid: this.user_info.ws_id
            })
        },
        handleMenuItemClick(index) {
            // 处理菜单项点击事件的代码，index 是点击菜单项的索引

            console.log(`点击了菜单项${index + 1}`)
            this.set_sz(index)
        },
        update_size() {
            const position = this.getMainPosition()
            position['is'] = this.set_act
            this.log('获取结果', position)
            // 将位置信息存储到本地存储
            ipcRenderer.send('resize-view', position)
        },
        set_fy() {
            if (this.user_info.id > 1) {
                ipcRenderer.send('set_fy', {
                    id: this.user_info.id,
                    user: this.user_info.user,
                    is_fy: this.user_info.is_fy,
                    lg: this.user_info.language
                })
            }
        },
        // 实时翻译
        // st_fy(){
        //     if (this.user_info.id > 1) {
        //         ipcRenderer.send('st_fy', {
        //             id: this.user_info.id,
        //             user: this.user_info.user,
        //             ss_fy: this.user_info.ss_fy
        //         });
        //
        //         if (!this.user_info.ss_fy) {
        //             console.log("实时翻译已关闭");
        //         }
        //     }
        // },
        st_fy() {
            const { id, user, ss_fy } = this.user_info || {}

            if (!id || id <= 1 || !user) {
                console.warn('❌ st_fy: 用户信息无效，跳过发送')
                return
            }

            // 发送设置到主进程
            ipcRenderer.send('st_fy', {
                id,
                user,
                ss_fy
            })

            console.log(`🌐 实时翻译状态：${ss_fy ? '开启 ✅' : '关闭 ⛔'}`)
        },
        //添加完成
        //恢复
        recovd(mobile) {
            ipcRenderer.send('view_server', {
                type: 'recovd',
                name: mobile
            })
        },
        //手动初始化
        view_init() {
            ipcRenderer.send('view_server', {
                type: 'init',
                name: 'init'
            })
        },
        //备份
        backup(mobile) {
            ipcRenderer.send('view_server', {
                type: 'backup',
                name: mobile
            })
        },
        saveUserName() {
            if (this.user_info.id > 1) {
                ipcRenderer.send('update_name', {
                    id: this.user_info.id,
                    uid: this.user_info.ws_id,
                    name: this.user_info.name
                })
            }
        },
        cv() {
            if (this.user_info.id > 1) {
                var code = localStorage.getItem('login_user')
                var url =
                    `http://web.haimapro.com/api/user/code/user/msg_list?sel=${this.user_info.user}&code=${code}&id=` +
                    this.user_info.id
                navigator.clipboard
                    .writeText(url)
                    .then(() => {
                        ElMessage({
                            message: '复制成功！',
                            type: 'success'
                        })
                    })
                    .catch((err) => {
                        console.error('复制失败:', err)
                        ElMessage({
                            message: '复制失败！',
                            type: 'error'
                        })
                    })
            }
        },
        SaveRemark() {
            console.log(this.user_list.ws_id)
            if (this.user_info.id > 0) {
                if (this.user_info.ws_id > 0) {
                    ipcRenderer.send('set_remark', {
                        uid: this.user_info.ws_id,
                        remark: this.user_info.remark
                    })
                }
            }
        },
        set_sz(act, s = false) {
            if (act == 2) {
                if (s) {
                    this.selectedUserId = s
                }

                if (this.selectedUserId > -1) {
                    this.user_list.forEach((item) => {
                        if (item.id == this.selectedUserId) {
                            this.parseProxy({
                                id: item.id,
                                urls: item.proxy
                            })
                        }
                    })
                }
            }
            // 这里尺寸会有变动
            this.set_act = act
            if (act > 0) {
                if (this.isopen == 0) {
                    this.isopen = 1
                }
                this.main = 16
                this.sert = 5
            } else {
                this.main = 21
                this.sert = 0
            }
            nextTick(() => {
                // 在这里执行尺寸变化后的操作
                this.update_size()
                console.log('尺寸已经改变')
            })
        },
        toggleActive(row) {
            console.log(row)
            this.selectedUserId = row.id
            this.parseProxy({
                id: row.id,
                urls: row.proxy
            })
            var temp = this.$getWhatsAppRun('whatsapp_run')
            this.user_list.forEach((item) => {
                if (item.id == row.id) {
                    item.count = 0
                }
            })
            if (temp[row.id]) {
                temp[row.id].count = 0
            }
            this.$storeWhatsAppRun('whatsapp_run', temp)
            if (temp[row.id].open == 1) {
                this.StartWindow(row)
            }

            this.selectedUserId = row.id
        },

        StartWindow(row) {
            // console.log(row.name)
            this.check_port()
            this.selectedUserId = row.id
            var temp = this.$getWhatsAppRun('whatsapp_run')

            if (temp[row.id].open == 1) {
                this.isopen = 1
                ipcRenderer.send('swithMenu', { id: row.id, proxy: row.proxy })
            } else {
                if (this.use.status) {
                    // ipcRenderer.send("dialog_msg", '超过端口数：' + this.use.use + "/" + this.use.port + " 请增加或关闭端口")
                    // return
                }
                console.log(row)

                this.user_list.forEach((item) => {
                    if (item.id == row.id) {
                        item.open = 1
                    }
                })
                this.isopen = 1
                temp[row.id].open = 1
                this.$storeWhatsAppRun('whatsapp_run', temp)
                ipcRenderer.send('StartMenuItem', JSON.stringify(row))
            }
            ipcRenderer.send('ws_send', {
                ws_type: 'Whats',
                type: 'is_open',
                id: row.id,
                is_open: 1
            })

            ElMessage({
                message: '启动窗口完成',
                type: 'success'
            })
        },
        DelWindo(id) {
            console.log('id', id)

            ipcRenderer.send('ws_send', {
                ws_type: 'Whats',
                type: 'is_open',
                id: id,
                is_show: 0
            })
            const updatedUserList = this.user_list.filter((user) => user.id !== id)

            // 将新的数组赋值给 user_list
            this.user_list = updatedUserList
            ElMessage({
                message: '删除窗口完成',
                type: 'success'
            })
        },
        CloseWindow(row) {
            // console.log(row.name)
            var temp = this.$getWhatsAppRun('whatsapp_run')
            temp[row.id].open = 0
            this.user_list.forEach((item) => {
                if (item.id == row.id) {
                    item.open = 0
                }
            })
            this.isopen = 0
            this.set_sz(0)
            this.$storeWhatsAppRun('whatsapp_run', temp)

            ipcRenderer.send('ws_send', {
                ws_type: 'Whats',
                type: 'is_open',
                id: this.selectedUserId,
                is_open: 0
            })

            ipcRenderer.send('CloseMenu', { id: row.id, proxy: row.proxy })

            this.selectedUserId = null
        },
        add() {
            this.addLoading = true
            ipcRenderer.send('ws_send', {
                ws_type: 'Whats',
                type: 'add'
            })
        },

        getMainPosition() {
            const mainElement = document.getElementById('main')
            if (mainElement) {
                const rect = mainElement.getBoundingClientRect()
                var r = {
                    x: Math.round(rect.x),
                    y: Math.round(rect.y),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                }
                console.log(r)
                return r
            }
            return null
        }
    },
    watch: {
        translateSelect() {
            ipcRenderer.send('set_is_google', this.translateSelect)
        },
        isTranslate() {
            ipcRenderer.send('set_is_translate', this.isTranslate)
        },
        div_name() {
            ipcRenderer.send('set_is_name', this.div_name)
        }
    }
}
</script>

<style scoped>
.user-list {
    display: flex;
    width: 100vw;
    height: 100vh;

}
.user-list #main {
    flex: 1;
}
.red-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    margin-left: 5px;
}
.left-nav {
    width: 200px;
    /* padding: 10px; */
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 1px #6e7275;
}

.list-itme .is-active {
    border: none;
    box-shadow: 0 0 3px #1082d3;
}

.bottom10 {
    margin-bottom: 10px !important;
}

.left-nav .title {
    text-shadow: 1px 1px 1px rgb(0 17 78);
    color: #62ccff;
    font-size: 25px;
}

.left-nav .scrollable {
    flex: 1;
    max-height: none;
}

.list-itme {
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
    padding: 10px 5px;
}

.left-nav .is-active {
    background-color: #e9ebed;
}

.list-itme-left {
    flex: 1;
    display: flex;
}

.list-itme-left-text {
    padding-left: 5px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-content: left;
}

.user-phone {
    font-size: 12px !important;
}

.list-itme-bottom {
    cursor: pointer;
    height: 100%;
}

.el-icon svg:focus {
    border: none;
    outline: none !important;
}

.user-right {
    width: 60px;
    color: #000;
}

.text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100px;
}

.user-name {
    font-size: 18px;
}
</style>
