<template>
  <div class="custom-margin-20">
    <custom-page
      ref="page"
      :data="data"
      :search.sync="search"
      :rules="rules"
      :placeholder="$t('toolUser.enterMachineCode').toString()"
      :empty-data="emptyData"
      drawer-size="30%"
      @refresh="getList"
      @query="query"
      @add="doAdd"
      @edit="doEdit"
      @delete="doDelete"
      @current="currentData = $event"
      @click-add="clickAdd"
    >
      <template v-slot:primary>
        <el-table-column align="center" :label="$t('toolUser.code').toString()" min-width="80" prop="code" />
        <el-table-column align="center" :label="$t('toolUser.life_time').toString()" min-width="100" prop="life_time">
          <template slot-scope="scope">
            <el-tag>{{ dayjs(scope.row.life_time).format('YYYY-MM-DD HH:mm:ss') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('toolUser.account_num').toString()" min-width="50" prop="account_num">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.account_num }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('toolUser.create_time').toString()" min-width="80" prop="create_time">
          <template slot-scope="scope">
            {{ dayjs(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('toolUser.update_time').toString()" min-width="80" prop="update_time">
          <template slot-scope="scope">
            {{ scope.row.update_time ? dayjs(scope.row.update_time).format('YYYY-MM-DD HH:mm:ss') : null }}
          </template>
        </el-table-column>
      </template>

      <template v-slot:addOrEdit="{ current }">

        <el-form-item :label="$t('toolUser.code').toString()" prop="code">
          <el-input v-model="current.code" />
        </el-form-item>
        <el-form-item :label="$t('toolUser.life_time').toString()" prop="life_time">
          <el-date-picker
            v-model="current.life_time"
            type="datetime"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item :label="$t('toolUser.account_num').toString()" prop="account_num">
          <el-input-number
            v-model.number="current.account_num"
            :min="1"
            :max="99"
          />
        </el-form-item>
      </template>

      <template v-slot:view="{ current }">

        <el-form-item :label="$t('toolUser.code').toString()" prop="code">
          {{ current.code }}
        </el-form-item>
        <el-form-item :label="$t('toolUser.life_time').toString()" prop="life_time">
          <el-tag>{{ dayjs(current.life_time).format('YYYY-MM-DD HH:mm:ss') }}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('toolUser.account_num').toString()" prop="account_num">
          <el-tag>{{ current.account_num }}</el-tag>
        </el-form-item>
      </template>

    </custom-page>
  </div>
</template>

<script>
import { createToolUser, queryToolUser, queryToolUserByCode, removeToolOrder, renewToolOrder } from '@/api/tool_user'
import CustomPage from '@/components/CustomPage'

export default {
  name: 'ToolUser',
  components: { CustomPage },
  data() {
    return {
      /**
       * 数据
       */
      data: [],
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
          { required: true, message: this.$t('toolUser.enterMachineCode'), trigger: 'blur' }
        ],
        account_num: [
          { required: true, message: this.$t('toolUser.enterCountNum'), trigger: 'blur' }
        ],
        life_time: [
          { required: true, message: this.$t('toolUser.enterLifeTime'), trigger: 'blur' }
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
  mounted() {
  },
  methods: {
    /**
     * 获取数据
     */
    getList() {
      this.$refs.page.loading = true
      if (this.search.name) {
        queryToolUserByCode(this.search.name)
          .then(res => {
            this.data = res.data
          })
          .finally(() => { this.$refs.page.loading = false })
      } else {
        queryToolUser()
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
      renewToolOrder(data)
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
      createToolUser(data)
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
      removeToolOrder(data.code)
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
