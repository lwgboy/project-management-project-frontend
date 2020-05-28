<template>
  <div>
    <!-- 查询 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="操作时间:">
        <el-date-picker
          v-model="queryForm.date"
          type="datetimerange"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="——"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
        />
      </el-form-item>
      <el-form-item label="操作账号:">
        <el-input v-model.trim="queryForm.account" clearable class="query-input-width" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="模块:">
        <el-input v-model.trim="queryForm.module" clearable class="query-input-width" placeholder="请输入模块" />
      </el-form-item>
      <el-form-item label="描述:">
        <el-input v-model.trim="queryForm.description" clearable class="query-input-width" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="访问IP:">
        <el-input v-model.trim="queryForm.srcIp" clearable class="query-input-width" placeholder="请输入访问IP" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pageChange(1)">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table
      v-loading="$store.getters.loading"
      :data="dataTable"
      border
      tooltip-effect="dark"
    >
      <el-table-column
        align="center"
        label="操作账号"
        show-overflow-tooltip
        prop="account"
      />
      <el-table-column
        align="center"
        label="模块"
        show-overflow-tooltip
        prop="module"
      />
      <el-table-column
        align="center"
        label="描述"
        show-overflow-tooltip
        prop="description"
      />
      <el-table-column
        align="center"
        label="访问IP"
        show-overflow-tooltip
        prop="srcIp"
      />
      <el-table-column
        align="center"
        label="操作时间"
        width="160"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime | formatTime }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-popover
            placement="left-start"
            width="200"
            trigger="click"
            :content="detail"
          >
            <el-button slot="reference" v-has="'check'" type="text" @click="detailClick(scope.row.id)">查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :current-page.sync="page.pageNum" @current-change="pageChange" @size-change="sizeChange" />
  </div>
</template>

<script>
import { getLogPageList, getLogById } from '@/api/system'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data () {
    return {
      dialogVisible: false,
      dataTable: [],
      queryForm: {
        account: '',
        module: '',
        description: '',
        srcIp: '',
        date: []
      },
      page: {
        pageSize: 10,
        pageNum: 1
      },
      totalCount: 0,
      detail: ''
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取列表
    getList () {
      this.$store.commit('SET_LOADING', 'loading')
      const page = Object.assign({}, this.page)
      const params = Object.assign({}, this.queryForm)
      params.page = page
      delete params.date
      if (this.queryForm.date && this.queryForm.date.length > 0) {
        params.startCreateTime = this.queryForm.date[0]
        params.endCreateTime = this.queryForm.date[1]
      } else {
        params.startCreateTime = ''
        params.endCreateTime = ''
      }
      getLogPageList(params).then(res => {
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
    detailClick (id) {
      this.detail = '加载中...'
      getLogById(id).then(res => {
        this.detail = res
      })
    }
  }
}
</script>
