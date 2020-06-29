<template>
  <div>
    <!-- 查询 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="客户名称:">
        <el-select v-model="queryForm.customerId" filterable placeholder="请选择客户" clearable>
          <el-option v-for="item in customerOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="下单日期:">
        <el-date-picker v-model="queryForm.createTime" type="date" placeholder="请选择下单日期" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="申请人:">
        <el-input v-model.trim="queryForm.createUser" clearable placeholder="请输入申请人" />
      </el-form-item>
      <el-form-item label="订单号:">
        <el-select v-model="queryForm.orderCode" filterable placeholder="请选择订单号" clearable>
          <el-option v-for="item in orderOptions" :key="item.code" :label="item.code" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="报价单号:">
        <el-input v-model.trim="queryForm.quoteCode" clearable placeholder="请输入报价编号" />
      </el-form-item>
      <el-form-item label="报价日期:">
        <el-date-picker v-model="queryForm.quoteDate" type="date" placeholder="请选择报价日期" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="所属部门:">
        <el-input v-model.trim="queryForm.department" clearable placeholder="请输入所属部门" />
      </el-form-item>
      <el-form-item label="报价状态:">
        <el-select v-model="queryForm.quoted" filterable placeholder="请选择报价状态" clearable>
          <el-option v-for="item in quotedOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="货品及劳务名称:">
        <el-input v-model.trim="queryForm.name" clearable placeholder="请输入货品及劳务名称" />
      </el-form-item>
      <el-form-item label="货品类别:">
        <el-select v-model="queryForm.goodsCategory" filterable placeholder="请选择报价状态" clearable>
          <el-option v-for="item in goodsCategoryOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="品牌:">
        <el-input v-model.trim="queryForm.goodsBrand" clearable placeholder="请输入品牌" />
      </el-form-item>
      <el-form-item label="型号:">
        <el-input v-model.trim="queryForm.goodsModel" clearable placeholder="请输入型号" />
      </el-form-item>
      <el-form-item label="数量:">
        <el-input v-model.trim="queryForm.quantity" clearable placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="采购单价:">
        <el-input v-model.trim="queryForm.price" clearable placeholder="请输入单价" />
      </el-form-item>
      <el-form-item label="价税合计:">
        <el-input v-model.trim="queryForm.tax" clearable placeholder="请输入税价" />
      </el-form-item>
      <el-form-item label="付款情况:">
        <el-select v-model="queryForm.paymentType" placeholder="请选择付款情况" clearable>
          <el-option v-for="item in paymentTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="付款方式:">
        <el-select v-model="queryForm.paymentWay" placeholder="请选择付款方式" clearable>
          <el-option v-for="item in paymentWayOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="成本合计:">
        <el-input v-model.trim="queryForm.cost" clearable placeholder="请输入成本合计" />
      </el-form-item>
      <el-form-item label="付款日期:">
        <el-date-picker v-model="queryForm.paymentDate" type="date" placeholder="请选择付款日期" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="采购商名称:">
        <el-input v-model.trim="queryForm.purchaserName" clearable placeholder="请输入采购商名称" />
      </el-form-item>
      <el-form-item label="联系方式:">
        <el-input v-model.trim="queryForm.contact" clearable placeholder="请输入联系方式" />
      </el-form-item>
      <el-form-item label="进项票种类:">
        <el-select v-model="queryForm.inputTicketType" placeholder="请选择进项票种类" clearable>
          <el-option v-for="item in inputTicketTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="进项票状态:">
        <el-select v-model="queryForm.inputTicketState" placeholder="请选择进项票种类" clearable>
          <el-option v-for="item in inputTicketStateOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pageChange(1)">查询</el-button>
        <el-button type="primary" @click="exportPurchase">导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table v-loading="$store.getters.loading" :data="purchases" border tooltip-effect="dark" :row-class-name="tableRowClassName" style="width: 100%" show-summary :summary-method="getSummaries">
      <el-table-column align="center" label="客户名称" show-overflow-tooltip prop="customerName" />
      <el-table-column align="center" label="创建日期" show-overflow-tooltip prop="createTime" />
      <el-table-column align="center" label="申请人" show-overflow-tooltip prop="createUser" />
      <el-table-column align="center" label="订单编号" show-overflow-tooltip prop="orderCode" />
      <el-table-column align="center" label="报价单号" show-overflow-tooltip prop="quoteCode" />
      <el-table-column align="center" label="所属部门" show-overflow-tooltip prop="department" />
      <el-table-column align="center" label="是否报价" show-overflow-tooltip prop="quoted" :formatter="quotedFormat" />
      <el-table-column align="center" label="货物及劳务名称" show-overflow-tooltip prop="name" />
      <el-table-column align="center" label="货品类型" show-overflow-tooltip prop="goodsCategoryName" />
      <el-table-column align="center" label="品牌" show-overflow-tooltip prop="goodsBrand" />
      <el-table-column align="center" label="型号" show-overflow-tooltip prop="goodsModel" />
      <el-table-column align="center" label="数量" show-overflow-tooltip prop="quantity" />
      <el-table-column align="center" label="单价" show-overflow-tooltip prop="price" />
      <el-table-column align="center" label="税价" show-overflow-tooltip prop="tax" />
      <el-table-column align="center" label="付款情况" show-overflow-tooltip prop="paymentTypeName" />
      <el-table-column align="center" label="付款方式" show-overflow-tooltip prop="paymentWayName" />
      <el-table-column align="center" label="成本" show-overflow-tooltip prop="cost" />
      <el-table-column align="center" label="付款日期" show-overflow-tooltip prop="paymentDate" />
      <el-table-column align="center" label="采购商名称" show-overflow-tooltip prop="purchaserName" />
      <el-table-column align="center" label="联系方式" show-overflow-tooltip prop="contact" />
      <el-table-column align="center" label="进项票种类" show-overflow-tooltip prop="inputTicketTypeName" />
      <el-table-column align="center" label="进项票状态" show-overflow-tooltip prop="inputTicketStateName" />
      <el-table-column align="center" label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="openForm(scope.row)">修改</el-button>
          <el-button type="text" @click="deletePurchase(scope.row.id)">删除</el-button>
          <el-button type="text" @click="openUpload(scope.row.id)">上传</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :current-page.sync="page.pageNum" @current-change="pageChange" @size-change="sizeChange" />
    <!-- 表单 -->
    <dialogs v-model="dialogVisible" :title="'采购管理表单'" @submitClick="savePurchase">
      <el-form ref="purchaseForm" :model="purchaseForm" label-width="130px" :rules="rules">
        <el-form-item label="客户名称:" prop="customerId">
          <el-select v-model="purchaseForm.customerId" filterable placeholder="请选择客户">
            <el-option v-for="item in customerOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期:" prop="createTime">
          <el-date-picker v-model.trim="purchaseForm.createTime" type="date" placeholder="请选择创建日期" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="创建人:" prop="createUser">
          <el-input v-model.trim="purchaseForm.createUser" clearable placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="订单号:" prop="orderCode">
          <el-select v-model="purchaseForm.orderCode" filterable placeholder="请选择订单号" @change="findOrderByCode">
            <el-option v-for="item in orderOptions" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单日期">
          <el-date-picker v-model.trim="purchaseForm.orderDate" type="date" placeholder="请选择订单日期" value-format="yyyy-MM-dd HH:mm:ss" disabled />
        </el-form-item>
        <el-form-item label="订单金额:">
          <el-input v-model.trim="purchaseForm.orderPrice" clearable placeholder="请输入订单金额" disabled />
        </el-form-item>
        <el-form-item label="订单文件:">
          <el-card class="box-card">
            <div v-for="o in orderImages" :key="o.id">
              <el-link :href="o.url" target="_blank">{{ o.name }}</el-link>
            </div>
          </el-card>
        </el-form-item>
        <el-form-item label="报价单号:" prop="quoteCode">
          <el-input v-model.trim="purchaseForm.quoteCode" clearable placeholder="请输入报价单号" />
        </el-form-item>
        <el-form-item label="报价日期:" prop="quoteDate">
          <el-date-picker v-model.trim="purchaseForm.quoteDate" type="date" placeholder="请选择报价日期" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="所属部门:" prop="department">
          <el-input v-model.trim="purchaseForm.department" clearable placeholder="请输入所属部门" />
        </el-form-item>
        <el-form-item label="报价状态:" prop="quoted">
          <el-select v-model="purchaseForm.quoted" filterable placeholder="请选择报价状态">
            <el-option v-for="item in quotedOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="货品及劳务名称:" prop="name">
          <el-input v-model.trim="purchaseForm.name" clearable placeholder="请输入货品及劳务名称" />
        </el-form-item>
        <el-form-item label="货品类别:" prop="goodsCategory">
          <el-select v-model="purchaseForm.goodsCategory" filterable placeholder="请选择报价状态">
            <el-option v-for="item in goodsCategoryOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌:" prop="goodsBrand">
          <el-input v-model.trim="purchaseForm.goodsBrand" clearable placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="型号:" prop="goodsModel">
          <el-input v-model.trim="purchaseForm.goodsModel" clearable placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="数量:" prop="quantity">
          <el-input v-model.trim="purchaseForm.quantity" clearable placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="采购单价:" prop="price">
          <el-input v-model.trim="purchaseForm.price" clearable placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="价税合计:" prop="tax">
          <el-input v-model.trim="purchaseForm.tax" clearable placeholder="请输入税价" />
        </el-form-item>
        <el-form-item label="付款情况:" prop="paymentType">
          <el-select v-model="purchaseForm.paymentType" placeholder="请选择付款情况">
            <el-option v-for="item in paymentTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="付款方式:" prop="paymentWay">
          <el-select v-model="purchaseForm.paymentWay" placeholder="请选择付款方式">
            <el-option v-for="item in paymentWayOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="成本合计:" prop="cost">
          <el-input v-model.trim="purchaseForm.cost" clearable placeholder="请输入成本合计" />
        </el-form-item>
        <el-form-item label="付款日期:" prop="paymentDate">
          <el-date-picker v-model="purchaseForm.paymentDate" type="date" placeholder="请选择付款日期" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="采购商名称:" prop="purchaserName">
          <el-input v-model.trim="purchaseForm.purchaserName" clearable placeholder="请输入采购商名称" />
        </el-form-item>
        <el-form-item label="联系方式:" prop="contact">
          <el-input v-model.trim="purchaseForm.contact" clearable placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="进项票种类:" prop="inputTicketType">
          <el-select v-model="purchaseForm.inputTicketType" placeholder="请选择进项票种类">
            <el-option v-for="item in inputTicketTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="进项票状态:" prop="inputTicketState">
          <el-select v-model="purchaseForm.inputTicketState" placeholder="请选择进项票种类">
            <el-option v-for="item in inputTicketStateOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </dialogs>
    <dialogs v-model="uploadVisible" :title="'上传'" @submitClick="upload">
      <el-upload ref="upload" :auto-upload="false" action="fake action" multiple :file-list="purchaseImages" :on-change="uploadChange" :on-remove="remove" :on-preview="preview">
        <el-button type="primary">点击上传</el-button>
      </el-upload>
      <br>
    </dialogs>
  </div>
</template>

<script>
import { findAllCustomer } from '@/api/customer'
import { findAllOrder, findOrderByCode, findOrderImageByCode } from '@/api/order'
import { findPurchaseByPageAndCondition, createPurchase, updatePurchase, deletePurchase, submitPurchase, exportPurchase, findPurchaseImageById, uploadPurchaseImages, removePurchaseImages } from '@/api/purchase'
import { findAllDictionary } from '@/api/dictionary'
import Pagination from '@/components/Pagination'
import Dialogs from '@/components/Dialogs'
import { download } from '@/utils/download'

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
        createTime: null,
        createUser: null,
        orderCode: null,
        quoteCode: null,
        quoteDate: null,
        department: null,
        quoted: null,
        name: null,
        goodsCategory: null,
        goodsBrand: null,
        goodsModel: null,
        quantity: null,
        price: null,
        tax: null,
        paymentType: null,
        paymentWay: null,
        cost: null,
        paymentDate: null,
        purchaserName: null,
        contact: null,
        inputTicketType: null,
        inputTicketState: null
      },
      // 客户公司下拉列表的数据
      customerOptions: [],
      // 订单的下拉列表数据
      orderOptions: [],
      // 数据字典
      dictionary: {},
      // 报价状态
      quotedOptions: [
        { id: true, name: '已报价' },
        { id: false, name: '未完成' }
      ],
      // 货品类别的下拉列表数据
      goodsCategoryOptions: [],
      // 付款情况的下拉列表数据
      paymentTypeOptions: [],
      // 付款方式的下拉列表数据
      paymentWayOptions: [],
      // 销项票种类的下拉列表数据
      inputTicketTypeOptions: [],
      // 销项票号码的下拉列表数据
      inputTicketStateOptions: [],
      // 列表数据
      purchases: [],
      orderImages: [],
      // 分页信息
      page: {
        pageSize: 10,
        pageNum: 1,
        sortColumn: 'customer_id asc, create_time asc'
      },
      totalCount: 0,
      // 弹出框状态
      dialogVisible: false,
      uploadVisible: false,
      purchaseImageId: null,
      purchaseImages: [],
      // 采购单表单
      purchaseForm: {
        id: null,
        customerId: null,
        createTime: null,
        createUser: null,
        orderCode: null,
        quoteCode: null,
        quoteDate: null,
        department: null,
        quoted: null,
        name: null,
        goodsCategory: null,
        goodsBrand: null,
        goodsModel: null,
        quantity: null,
        price: null,
        tax: null,
        paymentType: null,
        paymentWay: null,
        cost: null,
        paymentDate: null,
        purchaserName: null,
        contact: null,
        inputTicketType: null,
        inputTicketState: null,
        orderDate: null,
        orderPrice: null
      },
      // 订单表单规则
      rules: {
        customerId: [
          { required: true, message: '请选择客户信息', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        createUser: [
          { required: true, message: '请输入创建人', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入货品及劳务名称', trigger: 'blur' }
        ],
        goodsCategory: [
          { required: true, message: '请选择货品类型', trigger: 'change' }
        ],
        goodsBrand: [
          { required: true, message: '请输入货品品牌', trigger: 'blur' }
        ],
        goodsModel: [
          { required: true, message: '请输入货品型号', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请输入货品数量', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入采购单价', trigger: 'blur' }
        ],
        tax: [
          { required: true, message: '请输入价税合计', trigger: 'blur' }
        ],
        paymentType: [
          { required: true, message: '请选择付款情况', trigger: 'change' }
        ],
        paymentWay: [
          { required: true, message: '请选择付款方式', trigger: 'change' }
        ],
        cost: [
          { required: true, message: '请输入成本合计', trigger: 'blur' }
        ],
        purchaserName: [
          { required: true, message: '请输入采购商名称', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 查询客户信息
    findAllCustomer().then(resp => {
      this.customerOptions = resp
    })
    findAllOrder().then(resp => {
      this.orderOptions = resp
    })
    // 查询字典信息
    findAllDictionary().then(resp => {
      this.dictionary = resp
      this.goodsCategoryOptions = resp['PURCHASE_GOODS_CATEGORY']
      this.paymentTypeOptions = resp['PURCHASE_PAYMENT_TYPE']
      this.paymentWayOptions = resp['PURCHASE_PAYMENT_WAY']
      this.inputTicketTypeOptions = resp['PURCHASE_INPUT_TICKET_TYPE']
      this.inputTicketStateOptions = resp['PURCHASE_INPUT_TICKET_STATE']
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
      findPurchaseByPageAndCondition(params).then(resp => {
        this.purchases = resp.record
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
        if (!values.every(value => isNaN(value)) && (index === 12)) {
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
    quotedFormat (row, column) {
      return row.quoted === true ? '已报价' : '未报价'
    },
    // 行颜色
    tableRowClassName ({ row, rowIndex }) {
      return row.orderCode === '' ? 'warning-row' : 'success-row'
    },
    // 打开表单
    openForm (row) {
      this.dialogVisible = true
      if (this.$refs['purchaseForm'] !== undefined) {
        this.$refs['purchaseForm'].resetFields()
        this.orderImages.length = 0
      }
      if (row) {
        row.customerId += ''
        row.goodsCategory += ''
        row.paymentType += ''
        row.paymentWay += ''
        row.inputTicketType += ''
        row.inputTicketState += ''
        console.info(row.orderCode)
        this.findOrderByCode(row.orderCode)
        Object.assign(this.purchaseForm, row)
        if (row.orderCode) {
          findOrderImageByCode(row.orderCode).then(resp => {
            this.orderImages = resp
          })
        }
      }
    },
    findOrderByCode (val) {
      findOrderByCode(val).then(resp => {
        this.purchaseForm.orderPrice = resp.price
        this.purchaseForm.orderDate = resp.orderDate
        findOrderImageByCode(val).then(resp => {
          this.orderImages = resp
        })
      })
    },
    // 保存订单信息
    savePurchase () {
      this.$refs['purchaseForm'].validate((valid) => {
        if (!valid) return
        const params = Object.assign({}, this.purchaseForm)
        if (!params.id) {
          createPurchase(params).then(() => {
            this.dialogVisible = false
            this.$message.success('添加采购单成功')
            this.pageChange(1)
          })
        } else {
          updatePurchase(params).then(() => {
            this.dialogVisible = false
            this.$message.success('修改采购单成功')
            this.pageChange(1)
          })
        }
      })
    },
    // 删除订单信息
    deletePurchase (id) {
      this.$confirm('是否确定要删除该采购单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            deletePurchase(id).then(() => {
              done()
              this.$message.success('删除采购单成功')
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
    submitPurchase (id) {
      this.$confirm('是否确定要提交该采购单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            submitPurchase(id).then(() => {
              done()
              this.$message.success('提交采购单成功')
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
    exportPurchase () {
      exportPurchase(Object.assign({}, this.queryForm)).then(resp => {
        download(resp, 'PurchaseList.xlsx')
      })
    },
    // 上传图片
    openUpload (id) {
      this.uploadVisible = true
      this.purchaseImageId = id
      findPurchaseImageById(id).then(resp => {
        this.purchaseImages = resp
      })
    },
    remove (file, fileList) {
      removePurchaseImages(file.id)
    },
    uploadChange (file, fileList) {
      this.purchaseImages = fileList
    },
    upload () {
      const formData = new FormData()
      this.purchaseImages.forEach(item => {
        formData.append('files', item.raw)
      })
      uploadPurchaseImages(this.purchaseImageId, formData).then(() => {
        this.$message.success('上传成功')
        this.uploadVisible = false
      })
    },
    preview (file) {
      window.open(file.url, '_blank')
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
