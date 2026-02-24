<template>
  <div class="custom-margin-20">
    <custom-page
      ref="page"
      :data="data"
      :search.sync="search"
      :rules="rules"
      :placeholder="$t('toolOrder.enterMachineCode').toString()"
      :empty-data="emptyData"
      mode="read"
      :show-search="false"
      drawer-size="30%"
      @refresh="getList"
      @query="query"
      @add="doAdd"
      @edit="doEdit"
      @delete="doDelete"
      @current="currentData = $event"
      @click-add="clickAdd"
    >
      <template v-slot:add_search>
        <el-select v-model="search.order_status" placeholder="请选择" size="mini">
          <el-option
            v-for="item in order_status_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template v-slot:primary>
        <el-table-column align="center" :label="$t('toolOrder.fee').toString()" min-width="80" prop="fee" />
        <el-table-column align="center" :label="$t('toolOrder.add_account_num').toString()" min-width="50" prop="add_account_num" />
        <el-table-column align="center" :label="$t('toolOrder.add_day_num').toString()" min-width="50" prop="add_day_num" />
        <el-table-column align="center" :label="$t('toolOrder.order_status').toString()" min-width="80" prop="order_status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_status === 1" type="info">未付款</el-tag>
            <el-tag v-else-if="scope.row.order_status === 2">付款未确认</el-tag>
            <el-tag v-else type="3">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('toolOrder.create_time').toString()" min-width="120" prop="create_time" />
        <el-table-column align="center" :label="$t('toolOrder.pay_time').toString()" min-width="120" prop="pay_time" />
        <el-table-column align="center" :label="$t('toolOrder.finish_time').toString()" min-width="80" prop="finish_time" />
      </template>

      <template v-slot:addOrEdit="{ current }">

        <el-form-item :label="$t('toolOrder.code').toString()" prop="code">
          <el-input
            v-model="current.code"
          />
        </el-form-item>
        <el-form-item :label="$t('toolOrder.fee').toString()" prop="fee">
          <el-tag>{{ current.fee }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('toolOrder.account_price').toString()" prop="account_price">
          <el-tag>{{ current.account_price }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('toolOrder.add_account_num').toString()" prop="add_account_num">
          <el-input-number
            v-model.number="current.add_account_num"
            :min="1"
            :max="99"
          />
        </el-form-item>
        <el-form-item :label="$t('toolOrder.day_price').toString()" prop="account_price">
          <el-tag>{{ current.day_price }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('toolOrder.add_day_num').toString()" prop="add_day_num">
          <el-input-number
            v-model="current.add_day_num"
            :min="1"
            :max="99"
          />
        </el-form-item>
      </template>

      <template v-slot:view="{ current }">

        <el-form-item :label="$t('toolOrder.code').toString()" prop="code">
          {{ current.code }}
        </el-form-item>
        <el-form-item :label="$t('toolOrder.fee').toString()" prop="fee">
          {{ current.fee }}
        </el-form-item>
        <el-form-item :label="$t('toolOrder.account_price').toString()" prop="account_price">
          <el-tag>{{ current.account_price }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('toolOrder.add_account_num').toString()" prop="add_count_num">
          {{ current.add_account_num }}
        </el-form-item>
        <el-form-item :label="$t('toolOrder.day_price').toString()" prop="day_price">
          <el-tag>{{ current.day_price }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('toolOrder.add_day_num').toString()" prop="add_day_num">
          {{ current.add_day_num }}
        </el-form-item>
        <el-form-item :label="$t('toolOrder.order_status').toString()" prop="order_status">
          <el-tag v-if="current.order_status === 1" type="info">未付款</el-tag>
          <el-tag v-else-if="current.order_status === 2">付款未确认</el-tag>
          <el-tag v-else type="3">已完成</el-tag>
        </el-form-item>
        <el-form-item :label="$t('toolOrder.create_time').toString()" prop="create_time">
          {{ current.create_time }}
        </el-form-item>
        <el-form-item :label="$t('toolOrder.pay_time').toString()" prop="pay_time">
          {{ current.pay_time }}
        </el-form-item>
        <el-form-item :label="$t('toolOrder.finish_time').toString()" prop="finish_time">
          {{ current.finish_time }}
        </el-form-item>
      </template>

      <template v-slot:action="{ row }">
        <el-button -if="mode === 'write'" type="primary" size="mini" @click="clickUploadPayVoucher(row)">
          {{ $t("toolOrder.uploadPayVoucher") }}
        </el-button>
      </template>
    </custom-page>
    <el-drawer
      ref="payPayVoucher"
      :visible.sync="showPayVoucher"
      :show-close="false"
      :destroy-on-close="true"
      :wrapper-closable="false"
      size="30%"
    >
      <template v-slot:title>
        <h3>{{ $t("toolOrder.pay_voucher") }}</h3>
        <el-button size="mini" @click="clickPayVoucherClose">
          {{ $t("common.close") }}
        </el-button>
        <el-button size="mini" type="primary" native-type="submit" @click="clickPayVoucherConfirm">
          {{ $t("common.confirm") }}
        </el-button>
      </template>
      <el-divider class="custom-margin-2" />

      <div class="custom-margin-12">
        <el-form
          ref="drawerForm"
          class="custom-margin-20"
          :model="currentData"
          label-width="120px"
          size="mini"
        >
          <el-form-item :label="$t('toolOrder.code').toString()" prop="code">
            {{ currentData.code }}
          </el-form-item>
          <el-form-item :label="$t('toolOrder.fee').toString()" prop="fee">
            {{ currentData.fee }}
          </el-form-item>
          <el-form-item :label="$t('toolOrder.account_price').toString()" prop="account_price">
            <el-tag>{{ currentData.account_price }}</el-tag>
          </el-form-item>
          <el-form-item :label="$t('toolOrder.add_account_num').toString()" prop="add_count_num">
            {{ currentData.add_account_num }}
          </el-form-item>
          <el-form-item :label="$t('toolOrder.day_price').toString()" prop="day_price">
            <el-tag>{{ currentData.day_price }}</el-tag>
          </el-form-item>
          <el-form-item :label="$t('toolOrder.add_day_num').toString()" prop="add_day_num">
            {{ currentData.add_day_num }}
          </el-form-item>
          <el-form-item>
            <el-image :src="require('@/assets/pay/wx_pay.jpg')" />
          </el-form-item>
        </el-form>

      </div>

    </el-drawer>
  </div>
</template>

<script>
import {
  queryToolOrderByMachineCode,
  addToolOrder,
  updateToolOrder,
  deleteToolOrder,
  payToolOrder
} from '@/api/tool_order'
import {
  queryToolConfigPrice
} from '@/api/tool_config'
import CustomPage from '@/components/CustomPage'
import { getUserCode, setUserCode } from '@/utils/auth'
export default {
  name: 'AdminToolOrder',
  components: { CustomPage },
  data() {
    return {
      /**
       * 数据
       */
      data: [],
      /**
       *
       */
      order_status_options: [
        {
          value: 1,
          label: '未付款'
        },
        {
          value: 2,
          label: '付款未确认'
        },
        {
          value: 3,
          label: '已确认'
        }
      ],
      /**
       *
       */
      prices: { 'account_price': 0.1, 'day_price': 0.2 },
      /**
       * 搜索
       */
      search: {
        name: '',
        order_status: 2
      },
      /**
       * 校验规则
       */
      rules: {
        code: [
          { required: true, message: this.$t('toolOrder.enterMachineCode'), trigger: 'blur' }
        ],
        add_account_num: [
          { required: true, message: this.$t('toolOrder.enterAddCountNum'), trigger: 'blur' }
        ],
        add_day_num: [
          { required: true, message: this.$t('toolOrder.enterAddDayNum'), trigger: 'blur' }
        ]
      },
      /**
       * 当前数据
       */
      currentData: {},
      /**
       * 空数据
       */
      emptyData: {
        account_price: '0.1',
        day_price: '0.1'
      },
      /**
       * 显示付款凭证
       */
      showPayVoucher: false
    }
  },
  watch: {
    currentData: {
      handler(value) {
        let fee = 0
        if (value.add_account_num > 0) {
          fee = value.add_account_num * parseFloat(value.account_price)
        }
        if (value.add_day_num) {
          fee += value.add_day_num * parseFloat(value.day_price)
        }
        this.currentData.fee = this._.round(fee, 2)
      },
      deep: true
    }
  },
  mounted() {
    queryToolConfigPrice().then((res) => {
      this.emptyData.day_price = res.data.day_price
      this.emptyData.account_price = res.data.account_price
    })
    this.getList()
  },
  methods: {
    /**
     * 获取数据
     */
    getList() {
      let userCode = getUserCode()
      if (this.search.name) {
        userCode = this.search.name
      } else if (userCode) {
        this.search.name = userCode
      }
      if (userCode) {
        this.$refs.page.loading = true
        queryToolOrderByMachineCode(userCode)
          .then(res => {
            this.data = res.data
            setUserCode(userCode)
          })
          .finally(() => { this.$refs.page.loading = false })
      }
    },
    /**
     * 编辑
     * @param data
     */
    doEdit(data) {
      updateToolOrder(data)
        .then(() => {
          this.$refs.page.clickClose()
          this.getList()
        })
    },
    /**
     * 添加
     * @param data
     */
    doAdd(data) {
      data.fee = self._.toString(data.fee)
      console.log(data)
      addToolOrder(data)
        .then(() => {
          this.$refs.page.clickClose()
          this.getList()
        })
        .catch(() => {
          queryToolConfigPrice().then((res) => {
            this.emptyData.day_price = res.data.day_price
            this.emptyData.account_price = res.data.account_price
          })
        })
    },
    /**
     * 删除
     * @param data
     */
    doDelete(data) {
      deleteToolOrder(data.id)
        .finally(() => this.getList())
    },
    /**
     * 响应查询
     */
    query() {
      this.getList()
    },
    /**
     * 响应增加
     */
    clickAdd() {
      this.emptyData.code = this.search.name
    },
    /**
     * 关闭付款
     */
    clickPayVoucherClose() {
      this.$refs.payPayVoucher.closeDrawer()
    },
    /**
     * 确认付款
     */
    clickPayVoucherConfirm() {
      payToolOrder(this.currentData.id)
        .then(() => {
          this.getList()
          this.showPayVoucher = false
        })
    },
    /**
     * 点击付款
     * @param data
     */
    clickUploadPayVoucher(data) {
      this.currentData = data
      this.showPayVoucher = true
    }
  }
}
</script>

<style scoped>
/deep/.el-drawer__header{
  background-color: rgb(245,245,245);
  padding:0 20px;
  height: 50px;
  color: #000000;
  margin-bottom: 0;
}
/deep/.el-drawer__title{
  font-size: 20px;
}
</style>
