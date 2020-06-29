<template>
  <div>
    <!-- 查询 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="客户名称:">
        <el-select v-model="queryForm.customerId" filterable placeholder="请选择客户" clearable>
          <el-option v-for="item in customerOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单类型:">
        <el-select v-model="queryForm.type" filterable placeholder="请选择订单类型" clearable>
          <el-option v-for="item in orderTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单日期:">
        <el-date-picker v-model="queryForm.orderDate" type="date" placeholder="请选择订单日期" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="订单编号:">
        <el-input v-model.trim="queryForm.code" clearable placeholder="请输入订单编号" />
      </el-form-item>
      <el-form-item label="货物名称:">
        <el-input v-model.trim="queryForm.name" clearable placeholder="请输入货物及劳务名称" />
      </el-form-item>
      <el-form-item label="订单税率:">
        <el-select v-model="queryForm.taxRate" filterable placeholder="请选择税率" clearable>
          <el-option v-for="item in taxRateOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单金额:">
        <el-input v-model.trim="queryForm.price" clearable placeholder="请输入订单金额" />
      </el-form-item>
      <el-form-item label="订单状态:">
        <el-select v-model="queryForm.closed" placeholder="请选择订单状态" clearable>
          <el-option v-for="item in orderStateOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="开票日期:">
        <el-date-picker v-model="queryForm.createDate" type="date" placeholder="请选择开票日期" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="销项票种类:">
        <el-select v-model="queryForm.salesTicketType" placeholder="请选择销项票种类">
          <el-option v-for="item in salesTicketTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="销项票号码:">
        <el-input v-model.trim="queryForm.salesTicketCode" clearable placeholder="请输入销项票号码" />
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
    <el-table v-loading="$store.getters.loading" :data="orders" border tooltip-effect="dark" :row-class-name="tableRowClassName" style="width: 100%" show-summary :summary-method="getSummaries">
      <el-table-column align="center" label="客户名称" show-overflow-tooltip prop="customerName" />
      <el-table-column align="center" label="编号" show-overflow-tooltip prop="customerNumber" />
      <el-table-column align="center" label="订单类型" show-overflow-tooltip prop="typeName" />
      <el-table-column align="center" label="订单日期" show-overflow-tooltip prop="orderDate" />
      <el-table-column align="center" label="订单号" show-overflow-tooltip prop="code" />
      <el-table-column align="center" label="货物及劳务名称" show-overflow-tooltip prop="name" />
      <el-table-column align="center" label="税率" show-overflow-tooltip prop="taxRateName" />
      <el-table-column align="center" label="订单金额" show-overflow-tooltip prop="price" />
      <el-table-column align="center" label="订单状态" show-overflow-tooltip prop="closed" :formatter="closedFormat" />
      <el-table-column align="center" label="开票日期" show-overflow-tooltip prop="createDate" />
      <el-table-column align="center" label="销项票种类" show-overflow-tooltip prop="salesTicketTypeName" />
      <el-table-column align="center" label="销项票号码" show-overflow-tooltip prop="salesTicketCode" />
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" :disabled="scope.row.submitted" @click="openForm(scope.row)">修改</el-button>
          <el-button type="text" :disabled="scope.row.submitted" @click="submitOrder(scope.row.id)">提交</el-button>
          <el-button type="text" :disabled="scope.row.submitted" @click="deleteOrder(scope.row.id)">删除</el-button>
          <el-button type="text" @click="openUpload(scope.row.id)">上传</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :current-page.sync="page.pageNum" @current-change="pageChange" @size-change="sizeChange" />
    <!-- 表单 -->
    <dialogs v-model="dialogVisible" :title="'订单管理表单'" @submitClick="saveOrder">
      <el-form ref="orderForm" :model="orderForm" label-width="100px" :rules="rules">
        <el-form-item label="客户名称:" prop="customerId">
          <el-select v-model="orderForm.customerId" filterable placeholder="请选择客户">
            <el-option v-for="item in customerOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型:" prop="type">
          <el-select v-model="orderForm.type" filterable placeholder="请选择订单类型">
            <el-option v-for="item in orderTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单日期:" prop="orderDate">
          <el-date-picker v-model.trim="orderForm.orderDate" type="date" placeholder="请选择订单日期" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="订单号:" prop="code">
          <el-input v-model.trim="orderForm.code" clearable placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="货物名称:" prop="name">
          <el-input v-model.trim="orderForm.name" clearable placeholder="请输入货物及劳务名称" />
        </el-form-item>
        <el-form-item label="订单税率:" prop="taxRate">
          <el-select v-model.trim="orderForm.taxRate" filterable placeholder="请选择税率">
            <el-option v-for="item in taxRateOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单金额:" prop="price">
          <el-input v-model.trim="orderForm.price" clearable placeholder="请输入订单金额" />
        </el-form-item>
        <el-form-item label="订单状态:" prop="closed">
          <el-select v-model.trim="orderForm.closed" placeholder="请选择订单状态">
            <el-option v-for="item in orderStateOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="开票日期:" prop="createDate">
          <el-date-picker v-model.trim="orderForm.createDate" type="date" placeholder="请选择开票日期" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="销项票种类:" prop="salesTicketType">
          <el-select v-model.trim="orderForm.salesTicketType" placeholder="请选择销项票种类">
            <el-option v-for="item in salesTicketTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="销项票号码:" prop="salesTicketCode">
          <el-input v-model.trim="orderForm.salesTicketCode" clearable placeholder="请输入销项票号码" />
        </el-form-item>
      </el-form>
    </dialogs>
    <dialogs v-model="uploadVisible" :title="'上传'" @submitClick="upload">
      <el-upload ref="upload" :auto-upload="false" action="fake action" multiple :file-list="orderImages" :on-change="uploadChange" :on-remove="remove" :on-preview="preview">
        <el-button type="primary">点击上传</el-button>
      </el-upload>
      <br>
    </dialogs>
  </div>
</template>

<script>
import { findAllCustomer } from '@/api/customer'
import { findAllDictionary } from '@/api/dictionary'
import { findOrderByPageAndCondition, createOrder, updateOrder, deleteOrder, submitOrder, findOrderImageById, uploadOrderImages, removeOrderImages } from '@/api/order'
import Pagination from '@/components/Pagination'
import Dialogs from '@/components/Dialogs'

export default {
  components: {
    Dialogs,
    Pagination
  },
  data () {
    return {
      // 查询表单
      queryForm: {
        customerId: null,
        type: null,
        orderDate: null,
        code: null,
        name: null,
        taxRate: null,
        price: null,
        closed: null,
        createDate: null,
        salesTicketType: null,
        salesTicketCode: null
      },
      // 客户公司下拉列表的数据
      customerOptions: [],
      // 数据字典
      dictionary: {},
      // 订单类型的下拉列表数据
      orderTypeOptions: [],
      // 订单状态的下拉列表数据
      orderStateOptions: [
        { id: false, name: '未完成' },
        { id: true, name: '已完成' }
      ],
      // 税率的下拉列表数据
      taxRateOptions: [],
      // 销项票种类的下拉列表数据
      salesTicketTypeOptions: [],
      // 列表数据
      orders: [],
      // 分页信息
      page: {
        pageSize: 10,
        pageNum: 1,
        sortColumn: 'order_date desc'
      },
      totalCount: 0,
      // 弹出框状态
      dialogVisible: false,
      uploadVisible: false,
      // 订单表单
      orderForm: {
        id: null,
        customerId: null,
        type: null,
        orderDate: null,
        code: null,
        name: null,
        taxRate: null,
        price: null,
        closed: null,
        createDate: null,
        salesTicketType: null,
        salesTicketCode: null
      },
      orderImageId: null,
      orderImages: [],
      // 订单表单规则
      rules: {
        customerId: [
          { required: true, message: '请选择客户信息', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        orderDate: [
          { required: true, message: '请选择订单日期', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入订单号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入货物及劳务名称', trigger: 'blur' }
        ],
        taxRate: [
          { required: true, message: '请选择税率', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入订单金额', trigger: 'blur' }
        ],
        closed: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        createDate: [
          { required: true, message: '请选择开票日期', trigger: 'change' }
        ],
        salesTicketType: [
          { required: true, message: '请选择销项票种类', trigger: 'change' }
        ],
        salesTicketCode: [
          { required: true, message: '请选择销项票编号', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 查询客户信息
    findAllCustomer().then(resp => {
      this.customerOptions = resp
    })
    // 查询字典信息
    findAllDictionary().then(resp => {
      this.dictionary = resp
      this.orderTypeOptions = resp['ORDER_TYPE']
      this.taxRateOptions = resp['ORDER_TAX_RATE']
      this.salesTicketTypeOptions = resp['PURCHASE_INPUT_TICKET_TYPE']
    })
    this.getList()
  },
  methods: {
    // 刷新列表
    getList () {
      // 查询订单信息
      const page = Object.assign({}, this.page)
      const params = Object.assign({}, this.queryForm)
      params.page = page
      findOrderByPageAndCondition(params).then(resp => {
        this.orders = resp.record
        this.totalCount = resp.totalCount
      })
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value)) && (index === 7)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
        } else {
          sums[index] = ''
        }
      })
      return sums
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
    // 过滤器
    closedFormat (row, column) {
      return row.closed === true ? '已完成' : '未完成'
    },
    // 行颜色
    tableRowClassName ({ row, rowIndex }) {
      return row.closed === true ? 'success-row' : 'warning-row'
    },
    // 打开表单
    openForm (row) {
      this.dialogVisible = true
      if (this.$refs['orderForm'] !== undefined) {
        this.$refs['orderForm'].resetFields()
      }
      if (row) {
        row.customerId += ''
        row.type += ''
        row.taxRate += ''
        row.salesTicketType += ''
        Object.assign(this.orderForm, row)
      }
    },
    // 上传图片
    openUpload (id) {
      this.uploadVisible = true
      this.orderImageId = id
      findOrderImageById(id).then(resp => {
        this.orderImages = resp
      })
    },
    remove (file, fileList) {
      removeOrderImages(file.id)
    },
    uploadChange (file, fileList) {
      this.orderImages = fileList
    },
    upload () {
      // this.$refs.upload.submit()
      const formData = new FormData()
      this.orderImages.forEach(item => {
        formData.append('files', item.raw)
      })
      uploadOrderImages(this.orderImageId, formData).then(() => {
        this.$message.success('上传成功')
        this.uploadVisible = false
      })
    },
    preview (file) {
      window.open(file.url, '_blank')
    },
    // 保存订单信息
    saveOrder () {
      this.$refs['orderForm'].validate((valid) => {
        if (!valid) return
        const params = Object.assign({}, this.orderForm)
        if (!params.id) {
          createOrder(params).then(() => {
            this.dialogVisible = false
            this.$message.success('添加订单成功')
            this.pageChange(1)
          })
        } else {
          updateOrder(params).then(() => {
            this.dialogVisible = false
            this.$message.success('修改订单成功')
            this.pageChange(1)
          })
        }
      })
    },
    // 删除订单信息
    deleteOrder (id) {
      this.$confirm('是否确定要删除该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            deleteOrder(id).then(() => {
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
    submitOrder (id) {
      this.$confirm('是否确定要提交该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            submitOrder(id).then(() => {
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
