<template>
  <div>
    <!-- 查询 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="申请日期:">
        <el-date-picker v-model="queryForm.createTime" type="date" placeholder="请选择申请日期" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="所属单位:">
        <el-input v-model.trim="queryForm.company" clearable placeholder="请输入所属单位" />
      </el-form-item>
      <el-form-item label="费用分类:">
        <el-select v-model="queryForm.type" filterable placeholder="请选择费用分类" clearable>
          <el-option v-for="item in expenseTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单号:">
        <el-select v-model="queryForm.orderCode" filterable placeholder="请选择订单号" clearable>
          <el-option v-for="item in orderOptions" :key="item.code" :label="item.code" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="金额:">
        <el-input v-model.trim="queryForm.price" clearable placeholder="请输入金额" />
      </el-form-item>
      <el-form-item label="付款方式:">
        <el-select v-model="queryForm.paymentWay" filterable placeholder="请选择付款方式" clearable>
          <el-option v-for="item in expensePaymentWayOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="报销日期:">
        <el-date-picker v-model="queryForm.receiptDate" type="date" placeholder="请选择报销日期" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pageChange(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作 -->
    <div class="table-up-button">
      <el-button type="primary" @click="openForm()">添加</el-button>
    </div>
    <!-- 列表 -->
    <el-table v-loading="$store.getters.loading" :data="expenses" border tooltip-effect="dark">
      <el-table-column align="center" label="申请日期" show-overflow-tooltip prop="createTime" />
      <el-table-column align="center" label="申请人" show-overflow-tooltip prop="createUser" />
      <el-table-column align="center" label="所属单位" show-overflow-tooltip prop="company" />
      <el-table-column align="center" label="费用分类" show-overflow-tooltip prop="typeName" />
      <el-table-column align="center" label="订单号" show-overflow-tooltip prop="orderCode" />
      <el-table-column align="center" label="金额" show-overflow-tooltip prop="price" />
      <el-table-column align="center" label="付款方式" show-overflow-tooltip prop="paymentWayName" />
      <el-table-column align="center" label="报销日期" show-overflow-tooltip prop="receiptDate" />
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" :disabled="scope.row.submitted" @click="openForm(scope.row)">修改</el-button>
          <el-button type="text" :disabled="scope.row.submitted" @click="submitExpense(scope.row.id)">提交</el-button>
          <el-button type="text" :disabled="scope.row.submitted" @click="deleteExpense(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :current-page.sync="page.pageNum" @current-change="pageChange" @size-change="sizeChange" />
    <!-- 表单 -->
    <dialogs v-model="dialogVisible" :title="'费用管理表单'" @submitClick="saveExpense">
      <el-form ref="expenseForm" :model="expenseForm" label-width="120px" :rules="rules">
        <el-form-item label="申请日期:" prop="createTime">
          <el-date-picker v-model="expenseForm.createTime" type="date" placeholder="请选择申请日期" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="所属单位:" prop="company">
          <el-input v-model.trim="expenseForm.company" clearable placeholder="请输入所属单位" />
        </el-form-item>
        <el-form-item label="费用分类:" prop="type">
          <el-select v-model="expenseForm.type" filterable placeholder="请选择费用分类">
            <el-option v-for="item in expenseTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号:" prop="orderCode">
          <el-select v-model="expenseForm.orderCode" filterable placeholder="请选择订单号">
            <el-option v-for="item in orderOptions" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额:" prop="price">
          <el-input v-model.trim="expenseForm.price" clearable placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="订单付款方式:" prop="paymentWay">
          <el-select v-model="expenseForm.paymentWay" filterable placeholder="请选择付款方式">
            <el-option v-for="item in expensePaymentWayOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="报销日期:" prop="receiptDate">
          <el-date-picker v-model="expenseForm.receiptDate" type="date" placeholder="请选择报销日期" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model.trim="expenseForm.remark" clearable placeholder="请输入备注" />
        </el-form-item>
      </el-form>
    </dialogs>
  </div>
</template>

<script>
import { findAllDictionary } from '@/api/dictionary'
import { findAllOrder } from '@/api/order'
import { findExpenseByPageAndCondition, createExpense, updateExpense, deleteExpense, submitExpense } from '@/api/expense'
import Pagination from '@/components/Pagination'
import Dialogs from '@/components/Dialogs'
import { getAccount } from '@/utils/storage'

export default {
  components: {
    Dialogs,
    Pagination
  },
  data () {
    return {
      // 查询表单
      queryForm: {
        createTime: null,
        createUser: getAccount(),
        orderDate: null,
        company: null,
        type: null,
        orderCode: null,
        price: null,
        paymentWay: null,
        receiptDate: null
      },
      // 数据字典
      dictionary: {},
      // 订单数据
      orderOptions: [],
      // 费用类型的下拉列表数据
      expenseTypeOptions: [],
      // 支付方式的下拉列表数据
      expensePaymentWayOptions: [],
      // 列表数据
      expenses: [],
      // 分页信息
      page: {
        pageSize: 10,
        pageNum: 1,
        sortColumn: 'create_time desc'
      },
      totalCount: 0,
      // 弹出框状态
      dialogVisible: false,
      // 订单表单
      expenseForm: {
        id: null,
        createTime: null,
        orderDate: null,
        company: null,
        type: null,
        orderCode: null,
        price: null,
        paymentWay: null,
        receiptDate: null,
        remark: null
      },
      // 订单表单规则
      rules: {
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        company: [
          { required: true, message: '请填写所属公司', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择费用类型', trigger: 'change' }
        ],
        orderCode: [
          { required: true, message: '请选择订单编号', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入订单金额', trigger: 'blur' }
        ],
        paymentWay: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        receiptDate: [
          { required: true, message: '请选择报销日期', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    // 订单数据
    findAllOrder().then(resp => {
      this.orderOptions = resp
    })
    // 查询字典信息
    findAllDictionary().then(resp => {
      this.dictionary = resp
      this.expenseTypeOptions = resp['EXPENSE_TYPE']
      this.expensePaymentWayOptions = resp['EXPENSE_PAYMENT_WAY']
    })
    this.getList()
  },
  methods: {
    // 刷新列表
    getList () {
      // 查询订单信息
      const page = Object.assign({}, this.page)
      const params = Object.assign({}, this.queryForm)
      console.info(params)
      params.page = page
      findExpenseByPageAndCondition(params).then(resp => {
        this.expenses = resp.record
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
      if (this.$refs['expenseForm'] !== undefined) {
        this.$refs['expenseForm'].resetFields()
      }
      if (row) {
        row.type += ''
        row.paymentWay += ''
        Object.assign(this.expenseForm, row)
      }
    },
    // 保存费用信息
    saveExpense () {
      this.$refs['expenseForm'].validate((valid) => {
        if (!valid) return
        const params = Object.assign({}, this.expenseForm)
        if (!params.id) {
          createExpense(params).then(() => {
            this.dialogVisible = false
            this.$message.success('添加订单成功')
            this.pageChange(1)
          })
        } else {
          updateExpense(params).then(() => {
            this.dialogVisible = false
            this.$message.success('修改订单成功')
            this.pageChange(1)
          })
        }
      })
    },
    // 删除订单信息
    deleteExpense (id) {
      this.$confirm('是否确定要删除该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            deleteExpense(id).then(() => {
              done()
              this.$message.success('删除订单成功')
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
    },
    submitExpense (id) {
      this.$confirm('是否确定要提交该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            submitExpense(id).then(() => {
              done()
              this.$message.success('提交订单成功')
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
