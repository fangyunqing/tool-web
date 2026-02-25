<template>
  <div class="custom-margin-20">
    <div class="custom-flex custom-row-between">
      <div v-if="mode === 'write'">
        <el-button
          size="mini"
          icon="el-icon-plus"
          type="primary"
          @click="clickAdd"
        >
          {{ $t("common.plus") }}
        </el-button>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="15">
            <div class="custom-flex custom-row-between">
              <el-input
                v-if="showSearch"
                v-model="search.name"
                size="mini"
                :placeholder="placeholder"
                @keyup.enter.native="clickQuery"
              />
              <slot name="add_search" />
            </div>

          </el-col>
          <el-col :span="3">
            <el-button type="primary" size="mini" @click="clickQuery">
              <i class="el-icon-refresh" />
              {{ $t("common.refresh") }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="custom-margin-top-12">
      <el-table
        v-loading="loading"
        :data="data"
        tooltip-effect="dark"
        height="90vh"
        :row-style="{padding:'5px'}"
        :cell-style="{padding:'5px'}"
        :header-row-style="{padding:'1px'}"
        :header-cell-style="{padding:'1px'}"
        fit
        highlight-current-row
        stripe
      >
        <slot name="primary" />
        <el-table-column fixed="right" align="center" min-width="150">
          <template slot-scope="rowData">
            <el-button-group>
              <el-button type="primary" size="mini" @click="clickView(rowData.row)">
                {{ $t('common.view') }}
              </el-button>
              <el-button -if="mode === 'write'" type="primary" size="mini" @click="clickDelete(rowData.row)">
                {{ $t('common.delete') }}
              </el-button>
              <slot name="action" :row="rowData.row" />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height: 100%">
      <el-drawer
        ref="drawer"
        :visible.sync="showDrawer"
        :show-close="false"
        :destroy-on-close="true"
        :wrapper-closable="false"
        :size="drawerSize"
      >
        <template v-slot:title>
          <h3 v-if="currentState === 'edit'">{{ $t("common.edit") }}</h3>
          <h3 v-else-if="currentState === 'add'">{{ $t("common.plus") }}</h3>
          <h3 v-else>{{ $t("common.view") }}</h3>
          <el-button size="mini" @click="clickClose">
            {{ $t("common.close") }}
          </el-button>
          <el-button v-if="currentState !== 'view'" size="mini" type="primary" native-type="submit" @click="clickConfirm">
            {{ $t("common.confirm") }}
          </el-button>
          <el-button
            v-if="currentState === 'view' && mode === 'write'"
            size="mini"
            type="primary"
            @click="clickEdit"
          >
            {{ $t("common.edit") }}
          </el-button>
          <slot name="title" :current="current" />
        </template>
        <el-divider class="custom-margin-2" />
        <el-scrollbar :style="{'height': drawerFormHeight}">
          <el-form
            ref="drawerForm"
            class="custom-margin-20"
            :model="current"
            label-width="120px"
            size="mini"
            :rules="currentState === 'view' ? {} : rules"
          >
            <slot v-if="currentState === 'view'" name="view" :current="current" />
            <slot v-else name="addOrEdit" :current="current" :currentState="currentState" />
          </el-form>
        </el-scrollbar>
      </el-drawer>
    </div>
  </div>
</template>

<script>

import { MessageBox } from 'element-ui'

export default {
  name: 'CustomPage',
  props: {
    /**
     * 数据
     */
    data: {
      type: Array,
      required: true
    },
    /**
     * 搜索
     */
    search: {
      type: Object,
      required: true
    },
    /**
     * 检验规则
     */
    rules: {
      type: Object,
      default: () => ({})
    },
    /**
     * 占位符
     */
    placeholder: {
      type: String,
      required: true
    },
    /**
     * 空数据
     */
    emptyData: {
      type: Object,
      default: () => ({})
    },
    /**
     * 抽屉的宽度
     */
    drawerSize: {
      type: String,
      default: '30%'
    },
    /**
     * 判断状态是否可编辑
     */
    stateEditable: {
      type: Function,
      default: (row) => { return true }
    },
    /**
     * 模式
     */
    mode: {
      type: String,
      default: 'write'
    },
    /**
     * 显示查询
     */
    showSearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      /**
       * 显示抽屉框
       */
      showDrawer: false,
      /**
       * 目前状态
       */
      currentState: '',
      /**
       * 当前数据
       */
      current: {},
      /**
       * 抽屉高度
       */
      drawerFormHeight: '',
      /**
       * 列表加载
       */
      loading: false
    }
  },
  watch: {
    current: {
      handler(value) {
        this.$emit('current', value)
      },
      deep: true
    }
  },
  mounted() {
    this.drawerFormHeight = `${document.documentElement.clientHeight - 50 - 20}px`
    window.onresize = () => {
      this.drawerFormHeight = `${document.documentElement.clientHeight - 50 - 20}px`
    }
  },
  methods: {
    /**
     * 响应添加
     */
    clickAdd() {
      this.$emit('click-add')
      this.$nextTick(() => {
        this.currentState = 'add'
        this.current = this._.cloneDeep(this.emptyData)
        this.showDrawer = true
      })
    },
    /**
     * 响应刷新
     */
    clickRefresh() {
      this.$emit('refresh')
    },
    /**
     * 响应删除
     * @param data
     */
    clickDelete(data) {
      MessageBox.confirm(`${this.$t('common.isDeleteRecord')}[${data.name}]`, this.$t('common.tip').toString(), {
        confirmButtonText: this.$t('common.confirm').toString(),
        cancelButtonText: this.$t('common.cancel').toString(),
        type: 'warning'
      }).then(() => this.$emit('delete', data))
    },
    /**
     * 响应查看
     * @param data
     */
    clickView(data) {
      this.currentState = 'view'
      this.current = this._.cloneDeep(data)
      this.showDrawer = true
    },
    /**
     * 响应确认
     */
    clickConfirm() {
      this.$emit('current', this.current)
      this.$refs.drawerForm.validate((valid) => {
        if (valid) {
          this.$emit(this.currentState, this.current)
        }
      })
    },
    /**
     * 响应编辑
     */
    clickEdit() {
      this.$emit('clickEdit')
      this.currentState = 'edit'
    },
    /**
     * 同步校验
     * @returns {boolean}
     */
    async drawerFormValidate() {
      try {
        return await this.$refs.drawerForm.validate()
      } catch (error) {
        return false
      }
    },
    /**
     * 响应关闭
     */
    clickClose() {
      this.$refs.drawer.closeDrawer()
    },
    /**
     * 响应查询
     */
    clickQuery() {
      this.$emit('query')
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
