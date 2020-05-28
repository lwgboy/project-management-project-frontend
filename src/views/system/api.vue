<template>
  <div>
    <!-- 列表 -->
    <el-table
      ref="roleTable"
      v-loading="$store.getters.loading"
      :data="dataTable"
      border
      tooltip-effect="dark"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        label="英文名称"
        show-overflow-tooltip
        prop="roleCode"
      />
      <el-table-column
        align="center"
        label="中文名称"
        show-overflow-tooltip
        prop="roleName"
      />
      <el-table-column
        align="center"
        label="备注"
        show-overflow-tooltip
        prop="roleRemark"
      />
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-has="'authorizationApi'" type="text" @click="openAuthorizationApiWindow(scope.row.id)">授权API</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>

    <!-- 分页 -->
    <pagination :total="totalCount" :current-page.sync="page.pageNum" @current-change="pageChange" @size-change="sizeChange" />

    <!-- 添加、修改 -->
    <dialogs v-model="dialogFormVisible" :title="title" @submitClick="submitClick">
      <el-form ref="roleForm" :model="roleForm" label-width="85px" @submit.native.prevent>
        <el-form-item label="API路径:" prop="roleRemark">
          <el-input v-model.trim="roleForm.apis" placeholder="请输入要授权的API地址，以分号分割" :autosize="{ minRows: 4, maxRows: 10}" type="textarea" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
    </dialogs>
  </div>
</template>

<script>
import { getRolePageList, findApi, saveApi } from '@/api/system'
import Dialogs from '@/components/Dialogs'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Dialogs,
    Pagination
  },
  data () {
    return {
      dataTable: [],
      page: {
        pageSize: 10,
        pageNum: 1
      },
      totalCount: 0,
      dialogFormVisible: false,
      roleForm: {
        roleId: '',
        apis: ''
      },
      form: {
        roleId: '',
        apis: ''
      },
      title: '设置API权限',
      saveLoading: false
    }
  },
  watch: {
    dialogUserVisible (val) {
      if (val) return
      this.$nextTick(() => {
        this.$refs.transfer.clearQuery('left')
        this.$refs.transfer.clearQuery('right')
      })
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取列表
    getList () {
      this.$store.commit('SET_LOADING', 'loading')
      const params = {
        page: Object.assign({}, this.page)
      }
      getRolePageList(params).then(res => {
        this.dataTable = res.record
        this.totalCount = res.totalCount
      })
    },
    // 选择每页展示多少条
    sizeChange (pageSize) {
      this.page.pageSize = pageSize
      this.getList()
    },
    // 点击某一页
    pageChange (pageNum) {
      this.page.pageNum = pageNum
      this.getList()
    },
    // 点击授权API按钮
    async openAuthorizationApiWindow (id) {
      this.roleForm = Object.assign({}, this.form)
      this.dialogFormVisible = true
      this.roleForm.roleId = id
      this.$store.commit('SET_LOADING', 'dialogLoading')
      this.roleForm.apis = (await findApi(id)).join(';')
    },
    // 添加、修改提交
    submitClick () {
      this.$store.commit('SET_LOADING', 'buttonLoading')
      const params = Object.assign({}, this.roleForm)
      params.apis = params.apis.split(';')
      saveApi(params).then(() => {
        this.dialogFormVisible = false
        this.$message.success('保存成功!')
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  vertical-align: middle;
  justify-content: space-between;
  font-size: 14px;
}
</style>
