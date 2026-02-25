<template>
  <div class="custom-margin-20">
    <custom-page
      ref="page"
      :data="data"
      :search.sync="search"
      :placeholder="$t('toolOrder.enterMachineCode').toString()"
      :empty-data="emptyData"
      mode="read"
      :show-search="false"
      drawer-size="30%"
      @refresh="getList"
      @query="query"
      @current="currentData = $event"
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
  </div>
</template>

<script>
import {
  queryToolOrderByOrderStatus
} from '@/api/tool_order'
import CustomPage from '@/components/CustomPage'

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
        order_status: 2
      },
      /**
       * 当前数据
       */
      currentData: {},
      /**
       * 空数据
       */
      emptyData: {
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    /**
     * 获取数据
     */
    getList() {
      this.$refs.page.loading = true
      queryToolOrderByOrderStatus(this.search.order_status)
        .then(res => {
          this.data = res.data
        })
        .finally(() => {
          this.$refs.page.loading = false
        })
    },
    /**
     * 响应查询
     */
    query() {
      this.getList()
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
