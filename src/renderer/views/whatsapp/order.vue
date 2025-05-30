<template>
    <el-row>
        <el-col :span="24">
            <h3 align="center">快速下单</h3>
        </el-col>
    </el-row>
    <el-form :model="form" label-width="120px">
        <el-form-item label="原订单号" v-if="old_id > -1">
            <div style="display: flex; align-items: center">
                <el-input v-model="old_id"></el-input>
                <el-switch v-model="is_fg" inline-prompt inactive-text="首购" active-text="复购" />
            </div>
        </el-form-item>
        <el-form-item label="客户Ws">
            <el-input v-model="user_ws" disabled="true" />
        </el-form-item>

        <el-form-item label="加粉日期">
            <el-input v-model="add_time" disabled="true" />
        </el-form-item>
        <el-form-item label="客户名称">
            <el-input v-model="name" />
        </el-form-item>

        <el-form-item label="客户电话">
            <el-input v-model="mobile" />
        </el-form-item>
        <el-form-item label="报价">
            <el-input v-model="price" />
        </el-form-item>

        <el-form-item label="国家">
            <el-select
                v-model="city"
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

        <el-form-item label="经纬度">
            <el-input v-model="latlng" />
        </el-form-item>

        <el-form-item label="收货地址">
            <el-input v-model="address" type="textarea" />
        </el-form-item>

        <el-form-item label="备注">
            <el-input v-model="remark" type="textarea" />
        </el-form-item>
        <el-form-item label="聊天记录">
            <el-button type="primary" @click="SaveRemark">获取聊天记录</el-button>
        </el-form-item>

        <el-form-item>
            <el-button style="width: 100%" type="success" @click="saveProxy">下单</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            //是否复购
            is_fg: false,
            //原始订单号
            old_id: -1,
            //主页名称
            page: '',
            //客户在主页的名称
            sale_name: '',
            //服务的ws
            server_ws: '',
            //客户的ws
            user_ws: '',
            //客户电话
            mobile: '',
            //客户名称
            name: '',
            //客户国家
            city: '',
            //收货地址
            address: '',
            //经纬度
            latln: '',
            //报价
            price: 0,
            //加粉日期
            add_time: '',
            //订单备注
            remrak: '',
            //聊天记录
            msgs: [],
            //经纬度
            latlng: ''
        }
    },
    mounted() {},
    methods: {
        submitForm() {}
    }
}
</script>
