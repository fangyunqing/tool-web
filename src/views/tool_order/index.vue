<template>
  <div class="custom-margin-20">
    <custom-page
      ref="page"
      :data="data"
      :search.sync="search"
      :rules="rules"
      :placeholder="$t('toolOrder.enterMachineCode')"
      :empty-data="emptyData"
      drawer-size="30%"
      @refresh="getList"
      @query="query"
      @add="doAdd"
      @edit="doEdit"
      @delete="doDelete"
      @current="currentData = $event"
    >
      <template v-slot:primary>
        <el-table-column align="center" :label="$t('toolOrder.fee')" min-width="120" prop="fee" />
        <el-table-column align="center" :label="$t('toolOrder.add_count_num')" min-width="200" prop="add_count_num" />
        <el-table-column align="center" :label="$t('toolOrder.add_day_num')" min-width="80" prop="add_day_num" />
        <el-table-column align="center" :label="$t('toolOrder.order_status')" min-width="120" prop="order_status" />
        <el-table-column align="center" :label="$t('toolOrder.create_time')" min-width="80" prop="create_time" />
        <el-table-column align="center" :label="$t('toolOrder.pay_time')" min-width="120" prop="pay_time" />
        <el-table-column align="center" :label="$t('toolOrder.finish_time')" min-width="80" prop="finish_time" />
      </template>

      <template v-slot:addOrEdit="{ current }">
        <el-form-item :label="$t('toolOrder.code')" prop="code">
          <el-input
            v-model="current.code"
          />
        </el-form-item>
        <el-form-item :label="$t('toolOrder.fee')" prop="fee">
          <el-input
            v-model="current.fee"
          />
        </el-form-item>
        <el-form-item :label="$t('toolOrder.add_count_num')" prop="add_count_num">
          <el-input
            v-model="current.add_count_num"
          />
        </el-form-item>
        <el-form-item :label="$t('toolOrder.add_day_num')" prop="add_day_num">
          <el-input
            v-model="current.add_day_num"
          />
        </el-form-item>
      </template>

      <template v-slot:view="{ current }">
        <el-form-item :label="$t('toolOrder.code')" prop="code">
          {{ current.code }}
        </el-form-item>
        <el-form-item :label="$t('toolOrder.fee')" prop="fee">
          {{ current.fee }}
        </el-form-item>
        <el-form-item :label="$t('baseHttp.add_count_num')" prop="add_count_num">
          {{ current.add_count_num }}
        </el-form-item>
        <el-form-item :label="$t('baseHttp.add_day_num')" prop="add_day_num">
          {{ current.add_day_num }}
        </el-form-item>
        <el-form-item :label="$t('baseHttp.order_status')" prop="order_status">
          {{ current.order_status }}
        </el-form-item>
        <el-form-item :label="$t('baseHttp.create_time')" prop="create_time">
          {{ current.create_time }}
        </el-form-item>
        <el-form-item :label="$t('baseHttp.pay_time')" prop="pay_time">
          {{ current.pay_time }}
        </el-form-item>
        <el-form-item :label="$t('baseHttp.finish_time')" prop="finish_time">
          {{ current.finish_time }}
        </el-form-item>
      </template>
    </custom-page>
  </div>
</template>

<script>
import {
  queryToolOrderByMachineCode,
  addToolOrder,
  updateToolOrder,
  deleteToolOrder
} from '@/api/tool_order'
import CustomPage from '@/components/CustomPage'
export default {
  name: 'ToolOrder',
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
      data: {},
      /**
       * 搜索
       */
      search: {
        code: ''
      },
      /**
       * 校验规则
       */
      rules: {
        add_count_num: [
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
      }
    }
  },
  methods: {
    /**
     * 获取数据
     */
    getList() {
      queryToolOrderByMachineCode(this.search.code)
        .then(res => {
          this.data = res.data
        })
        .finally(() => {})
    },
    /**
     * 编辑
     * @param data
     */
    doEdit(data) {
      updateToolOrder(data)
        .then((res) => {
          this.$refs.page.clickClose()
          this.getList()
        })
    },
    /**
     * 添加
     * @param data
     */
    doAdd(data) {
      addToolOrder(data)
        .then((res) => {
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
    }
  }
}
</script>

<style scoped>

</style>
