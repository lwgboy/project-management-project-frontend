<template>
  <div>
    <!-- 查询 -->
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="账号:">
        <el-input v-model.trim="queryForm.userAccount" clearable class="query-input-width" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="名称:">
        <el-input v-model.trim="queryForm.userName" clearable class="query-input-width" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="电话:">
        <el-input v-model.trim="queryForm.userPhone" clearable class="query-input-width" placeholder="请输入电话" />
      </el-form-item>
      <el-form-item label="邮箱:">
        <el-input v-model.trim="queryForm.userEmail" clearable class="query-input-width" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pageChange(1)">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="table-up-button">
      <el-button v-has="'add'" type="primary" @click="editClick()">添加</el-button>
      <el-button v-has="'batchDelete'" type="danger" :disabled="!userSelection.length" @click="deleteBatchClick()">批量删除</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      v-loading="$store.getters.loading"
      :data="dataTable"
      border
      tooltip-effect="dark"
      @selection-change="selectChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        label="账号"
        show-overflow-tooltip
        prop="userAccount"
      />
      <el-table-column
        align="center"
        label="名称"
        show-overflow-tooltip
        prop="userName"
      />
      <el-table-column
        align="center"
        label="电话"
        show-overflow-tooltip
        prop="userPhone"
      />
      <el-table-column
        align="center"
        label="邮箱"
        show-overflow-tooltip
        prop="userEmail"
      />
      <el-table-column
        align="center"
        label="角色"
        show-overflow-tooltip
        prop="roleName"
      />
      <el-table-column
        align="center"
        label="备注"
        show-overflow-tooltip
        prop="userRemark"
      />
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-has="'edit'" type="text" @click="editClick(scope.row)">修改</el-button>
          <el-button v-has="'delete'" type="text" @click="deleteClick(scope.row.id)">删除</el-button>
          <el-button v-has="'reset'" type="text" @click="resetPasswordClick(scope.row.id)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :current-page.sync="page.pageNum" @current-change="pageChange" @size-change="sizeChange" />

    <!-- 添加、修改 -->
    <dialogs v-model="dialogVisible" :title="title" @submitClick="submitClick">
      <el-form ref="userForm" :model="userForm" label-width="60px" :rules="rules">
        <el-form-item label="账号:" prop="userAccount">
          <el-input v-model.trim="userForm.userAccount" placeholder="请输入账号" :disabled="!!userForm.id" />
        </el-form-item>
        <el-form-item label="名称:" prop="userName">
          <el-input v-model.trim="userForm.userName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="电话:" prop="userPhone">
          <el-input v-model.trim="userForm.userPhone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱:" prop="userEmail">
          <el-input v-model.trim="userForm.userEmail" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色:" prop="roleIds">
          <el-select v-model="userForm.roleIds" multiple placeholder="请选择" class="auto-width">
            <el-option
              v-for="(item, index) in roleOptions"
              :key="index"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="userRemark">
          <el-input v-model.trim="userForm.userRemark" :autosize="{ minRows: 4, maxRows: 10}" type="textarea" maxlength="200" placeholder="请输入备注" show-word-limit />
        </el-form-item>
        <p v-if="!userForm.id"><i style="margin-left: 60px;margin-right: 5px;" class="el-icon-info" />添加成功后,默认登陆密码为‘000000’。</p>
      </el-form>
    </dialogs>
  </div>
</template>

<script>
import { getUserPageList, addUser, updateUser, deleteUser, isExistedUser, isExistedPhone, isExistedEmail, batchDeleteUser, resetPassword, getRoleList } from '@/api/system'
import { isUserName } from '@/utils/validate'
import Dialogs from '@/components/Dialogs'
import Pagination from '@/components/Pagination'
import { isPhone } from '@/utils/validate'
import { copyObject } from '@/utils/index'

export default {
  components: {
    Dialogs,
    Pagination
  },
  data () {
    const accountIsExist = (rule, value, callback) => {
      const param = Object.assign({}, { id: this.userForm.id, context: value })
      isExistedUser(param).then(res => {
        if (res) {
          callback(new Error('账号已存在'))
        } else {
          callback()
        }
      })
    }
    const phoneIsExist = (rule, value, callback) => {
      const param = Object.assign({}, { id: this.userForm.id, context: value })
      isExistedPhone(param).then(res => {
        if (res) {
          callback(new Error('电话号码已存在'))
        } else {
          callback()
        }
      })
    }
    const emailIsExist = (rule, value, callback) => {
      const param = Object.assign({}, { id: this.userForm.id, context: value })
      isExistedEmail(param).then(res => {
        if (res) {
          callback(new Error('电子邮件已存在'))
        } else {
          callback()
        }
      })
    }
    return {
      dialogVisible: false,
      dataTable: [],
      queryForm: {
        userAccount: '',
        userName: '',
        userPhone: '',
        userEmail: ''
      },
      page: {
        pageSize: 10,
        pageNum: 1
      },
      totalCount: 0,
      form: {
        id: '',
        userAccount: '',
        userName: '',
        userPhone: '',
        userEmail: '',
        roleIds: [],
        userRemark: ''
      },
      roleOptions: [],
      title: '',
      userForm: {},
      userSelection: [],
      rules: {
        userAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { pattern: isUserName(), message: '请输入6-20位字母数字', trigger: 'blur' },
          { validator: accountIsExist, trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1到20个字符', trigger: 'blur' }
        ],
        userPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: isPhone(), message: '请输入11位手机号', trigger: 'blur' },
          { validator: phoneIsExist, trigger: 'blur' }
        ],
        userEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
          { validator: emailIsExist, trigger: 'blur' }
        ],
        roleIds: [
          { type: 'array', required: false, message: '请选择角色', trigger: 'change' }
        ],
        userRemark: [
          { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.$store.commit('SET_MULTIPLE_LOADING', 'loading')
    getRoleList().then(res => {
      this.$store.commit('CLOSE_LOADING', 'loadingFlag')
      this.roleOptions = res
      this.getList()
    })
  },
  methods: {
    // 获取列表
    getList () {
      this.$store.commit('SET_LOADING', 'loading')
      const page = Object.assign({}, this.page)
      const params = Object.assign({}, this.queryForm)
      params.page = page
      getUserPageList(params).then(res => {
        this.dataTable = res.record.map(item => {
          item.roleIds = item.roles.map(key => key.id)
          item.roleName = item.roles.map(key => key.roleName).join(',')
          return item
        })
        this.totalCount = res.totalCount
      })
    },
    // 点击添加、编辑按钮
    editClick (row) {
      this.dialogVisible = true
      if (this.$refs['userForm'] !== undefined) {
        this.$refs['userForm'].resetFields()
      }
      this.userForm = Object.assign({}, this.form)
      if (!row) {
        this.title = '添加用户信息'
      } else {
        this.title = '修改用户信息'
        copyObject(this.form, row, this.userForm)
      }
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
    // 勾选
    selectChange (val) {
      this.userSelection = val
    },
    // 添加、修改提交
    submitClick () {
      this.$refs['userForm'].validate((valid) => {
        if (!valid) return
        this.$store.commit('SET_LOADING', 'buttonLoading')
        const params = Object.assign({}, this.userForm)
        params.roles = params.roleIds.map(item => {
          return {
            id: item
          }
        })
        delete params.roleIds
        if (!params.id) {
          addUser(params).then(() => {
            this.dialogVisible = false
            this.$message.success('添加成功!')
            this.pageChange(1)
          })
        } else {
          updateUser(params).then(() => {
            this.dialogVisible = false
            this.$message.success('修改成功!')
            this.getList()
          })
        }
      })
    },
    // 删除
    deleteClick (id) {
      this.$confirm('是否确定要删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            deleteUser(id).then(res => {
              done()
              this.$message.success('删除成功!')
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
    // 批量删除
    deleteBatchClick (ids) {
      this.$confirm('是否确定要删除这些用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            const params = this.userSelection.map(item => item.id)
            batchDeleteUser(params).then(res => {
              done()
              this.$message.success('批量删除成功!')
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
    resetPasswordClick (id) {
      this.$confirm('是否确定将该用户密码重置为“000000”？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            resetPassword(id).then(res => {
              done()
              this.$message.success('密码重置成功!')
              instance.confirmButtonLoading = false
              this.getList()
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
