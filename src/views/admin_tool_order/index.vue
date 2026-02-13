<template>
  <div class="custom-margin-20">
    <custom-page
      ref="page"
      :data="data"
      :search.sync="search"
      :rules="rules"
      :placeholder="$t('toolOrder.enterMachineCode').toString()"
      :empty-data="emptyData"
      drawer-size="30%"
      mode="read"
      @refresh="getList"
      @query="query"
      @add="doAdd"
      @edit="doEdit"
      @delete="doDelete"
      @current="currentData = $event"
      @click-add="clickAdd"
    >
      <template v-slot:primary>
        <el-table-column align="center" :label="$t('toolOrder.code').toString()" min-width="120" prop="code" />
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

      <template v-slot:action>
        <el-tooltip :content="$t('common. ').toString()" placement="top">
          <el-button type="text" @click="showPayVoucher = true">
            <i class="el-icon-delete" />
          </el-button>
        </el-tooltip>
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
        <el-upload
          :before-upload="handleBeforeUpload"
          :before-remove="handleBeforeDelete"
          list-type="picture"
          http-request="() => {}"
          action=""
        >
          <el-button>上传付款凭证</el-button>
        </el-upload>
      </div>

    </el-drawer>
  </div>
</template>

<script>
import {
  queryToolOrderByMachineCode,
  addToolOrder,
  updateToolOrder,
  deleteToolOrder
} from '@/api/tool_order'
import {
  queryToolConfigPrice
} from '@/api/tool_config'
import CustomPage from '@/components/CustomPage'
export default {
  name: 'AdminToolOrder',
  components: { CustomPage },
  props: {
    mode: {
      type: String,
      default: 'write'
    }
  },
  data() {
    return {
      /**
       * 数据
       */
      data: [],
      /**
       *
       */
      prices: { 'account_price': 0.1, 'day_price': 0.2 },
      /**
       * 搜索
       */
      search: {
        name: ''
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
  methods: {
    /**
     * 获取数据
     */
    getList() {
      if (this.search.name) {
        this.$refs.page.loading = true
        queryToolOrderByMachineCode(this.search.name)
          .then(res => {
            this.data = res.data
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
    async clickAdd() {
      const config_price = await queryToolConfigPrice()
      this.emptyData.code = this.search.name
      this.emptyData.account_price = config_price.data.account_price
      this.emptyData.day_price = config_price.data.day_price
    },
    handleBeforeUpload(file) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.currentData.pay_voucher = e.target.result
        }
        reader.onerror = () => {}
        reader.readAsDataURL(file)
        resolve(false)
      })
    },
    handleBeforeDelete() {
      this.currentData.pay_voucher = ''
    },
    clickPayVoucherClose() {
      this.currentData.pay_voucher = ''
      this.$refs.payPayVoucher.closeDrawer()
    },
    clickPayVoucherConfirm() {

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
