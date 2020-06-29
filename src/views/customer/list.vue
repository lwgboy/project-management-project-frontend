<template>
  <div>
    <!-- 操作 -->
    <div class="table-up-button">
      <el-button type="primary" @click="openForm()">添加</el-button>
    </div>
    <!-- 列表 -->
    <el-table v-loading="$store.getters.loading" :data="customers" border tooltip-effect="dark">
      <el-table-column align="center" label="名称" show-overflow-tooltip prop="name" />
      <el-table-column align="center" label="创建人" show-overflow-tooltip prop="createUser" />
      <el-table-column align="center" label="创建时间" show-overflow-tooltip prop="createTime" />
      <el-table-column align="center" label="修改人" show-overflow-tooltip prop="modifyUser" />
      <el-table-column align="center" label="修改时间" show-overflow-tooltip prop="modifyTime" />
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" :disabled="scope.row.submitted" @click="openForm(scope.row)">修改</el-button>
          <el-button type="text" :disabled="scope.row.submitted" @click="deleteCustomer(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :current-page.sync="page.pageNum" @current-change="pageChange" @size-change="sizeChange" />
    <!-- 表单 -->
    <dialogs v-model="dialogVisible" :title="'客户管理表单'" @submitClick="saveCustomer">
      <el-form ref="customerForm" :model="customerForm" label-width="60px" :rules="rules">
        <el-form-item label="名称:" prop="name">
          <el-input v-model.trim="customerForm.name" clearable placeholder="请输入名称" />
        </el-form-item>
      </el-form>
    </dialogs>
  </div>
</template>

<script>
import { createCustomer, updateCustomer, deleteCustomer, findCustomer } from '@/api/customer'
import Pagination from '@/components/Pagination'
import Dialogs from '@/components/Dialogs'

export default {
  components: {
    Dialogs,
    Pagination
  },
  data () {
    return {
      // 分页信息
      page: {
        pageSize: 10,
        pageNum: 1,
        sortColumn: 'create_time desc'
      },
      customers: [],
      totalCount: 0,
      // 弹出框状态
      dialogVisible: false,
      // 订单表单
      customerForm: {
        id: null,
        name: null
      },
      // 订单表单规则
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 刷新列表
    getList () {
      // 查询订单信息
      const page = Object.assign({}, this.page)
      const params = Object.assign({}, {})
      params.page = page
      console.info(params)
      findCustomer(params).then(resp => {
        this.customers = resp.record
        this.totalCount = resp.totalCount
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
    // 打开表单
    openForm (row) {
      this.dialogVisible = true
      if (this.$refs['customerForm'] !== undefined) {
        this.$refs['customerForm'].resetFields()
      }
      if (row) {
        Object.assign(this.customerForm, row)
      }
    },
    // 保存费用信息
    saveCustomer () {
      this.$refs['customerForm'].validate((valid) => {
        if (!valid) return
        const params = Object.assign({}, this.customerForm)
        if (!params.id) {
          createCustomer(params).then(() => {
            this.dialogVisible = false
            this.$message.success('添加成功')
            this.pageChange(1)
          })
        } else {
          updateCustomer(params).then(() => {
            this.dialogVisible = false
            this.$message.success('修改成功')
            this.pageChange(1)
          })
        }
      })
    },
    // 删除订单信息
    deleteCustomer (id) {
      this.$confirm('是否确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            deleteCustomer(id).then(() => {
              done()
              this.$message.success('删除成功')
              instance.confirmButtonLoading = false
              this.pageChange(1)
            }).catch(() => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      }).catch(() => {})
    }
  }
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
