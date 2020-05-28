<template>
  <div>
    <!-- 顶部buttom -->
    <div class="table-up-button">
      <el-button v-has="'add'" type="primary" @click="editClick()">添加</el-button>
      <el-button v-has="'batchDelete'" type="danger" :disabled="!roleSelection.length" @click="deleteBatchClick()">批量删除</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      ref="roleTable"
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
          <el-button v-has="'edit'" type="text" @click="editClick(scope.row)">修改</el-button>
          <el-button v-has="'delete'" type="text" @click="deleteClick(scope.row.id)">删除</el-button>
          <el-button v-has="'authorizationUser'" type="text" @click="editRoleUserClick(scope.row.id)">授权用户</el-button>
          <el-button v-has="'authorizationMenu'" type="text" @click="editRoleMenuClick(scope.row.id)">授权菜单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>

    <!-- 分页 -->
    <pagination :total="totalCount" :current-page.sync="page.pageNum" @current-change="pageChange" @size-change="sizeChange" />

    <!-- 添加、修改 -->
    <dialogs v-model="dialogFormVisible" :title="title" @submitClick="submitClick">
      <el-form ref="roleForm" :model="roleForm" label-width="85px" :rules="rules" @submit.native.prevent>
        <el-form-item label="英文名称:" prop="roleCode">
          <el-input v-model.trim="roleForm.roleCode" placeholder="请输入英文名称(限大写字母)" @input="upperRoleCod" />
        </el-form-item>
        <el-form-item label="中文名称:" prop="roleName">
          <el-input v-model.trim="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注:" prop="roleRemark">
          <el-input v-model.trim="roleForm.roleRemark" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}" type="textarea" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
    </dialogs>

    <!-- 选择人员 -->
    <dialogs v-model="dialogUserVisible" title="授权用户" @submitClick="submitRoleUserClick">
      <el-transfer
        ref="transfer"
        v-model="userSelector"
        v-loading="$store.getters.dialogLoading"
        :titles="['待选', '已选']"
        filterable
        filter-placeholder="请输入关键词"
        :data="allUserList"
        :props="{
          key: 'id',
          value: 'id',
          label: 'userAccount'
        }"
      />
    </dialogs>
    <!-- 选择权限菜单和按钮权限 -->
    <dialogs v-model="dialogMenuVisible" width="950px" title="授权菜单" @submitClick="submitRoleMenuClick" @closeClick="closeClick">
      <el-card v-loading="$store.getters.dialogLoading" class="box-card" shadow="never">
        <el-tree
          ref="menuTree"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :data="allMenuList"
          :props="{
            label: 'menuTitle',
            children: 'children'
          }"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span v-if="node.level === 2">
              <el-checkbox-group v-model="selectedButtonPermission">
                <el-checkbox v-for="group in data.buttons" :key="group.id" :label="group.id">{{ group.buttonTitle }}</el-checkbox>
              </el-checkbox-group>
            </span>
          </span>
        </el-tree>
      </el-card>
    </dialogs>
  </div>
</template>

<script>
import { getRolePageList, addRole, updateRole, deleteRole, batchDeleteRole, getRoleUserListById, updateRoleUser, getRoleMenuListById, getAllMenuList, getAllUserList, updateRoleMenu, isExistedRoleCode, isExistedRoleName } from '@/api/system'
import { copyObject } from '@/utils/index'
import Dialogs from '@/components/Dialogs'
import Pagination from '@/components/Pagination'
import { upper } from '@/filters'

export default {
  components: {
    Dialogs,
    Pagination
  },
  data () {
    const codeIsExist = (rule, value, callback) => {
      const param = Object.assign({}, { id: this.roleForm.id, context: 'ROLE_' + value })
      isExistedRoleCode(param).then(res => {
        if (res) {
          callback(new Error('英文名称已存在'))
        } else {
          callback()
        }
      })
    }
    const nameIsExist = (rule, value, callback) => {
      const param = Object.assign({}, { id: this.roleForm.id, context: value })
      isExistedRoleName(param).then(res => {
        if (res) {
          callback(new Error('中文名称已存在'))
        } else {
          callback()
        }
      })
    }
    return {
      dataTable: [],
      page: {
        pageSize: 10,
        pageNum: 1
      },
      totalCount: 0,
      dialogFormVisible: false,
      roleForm: {},
      title: '',
      allUserList: [],
      allMenuList: [],
      dialogUserVisible: false,
      dialogMenuVisible: false,
      saveLoading: false,
      form: {
        id: '',
        roleCode: '',
        roleName: '',
        roleRemark: ''
      },
      roleSelection: [],
      rules: {
        roleCode: [
          { required: true, message: '请输入英文名称', trigger: 'blur' },
          { pattern: /^[A-Z]{1,20}$/, message: '请输入大写字母，限制20个字符', trigger: 'blur' },
          { validator: codeIsExist, trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入中文名称', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在2到25个字符', trigger: 'blur' },
          { validator: nameIsExist, trigger: 'blur' }
        ],
        roleRemark: [
          { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
        ]
      },
      roleId: '',
      users: [],
      userSelector: [],
      menus: [],
      selectedButtonPermission: []
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
  async mounted () {
    this.allUserList = await getAllUserList()
    this.allMenuList = await getAllMenuList()
  },
  methods: {
    // 角色英文名小写转大写
    upperRoleCod (value) {
      this.roleForm.roleCode = upper(value)
    },
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
    // 点击添加、编辑按钮
    editClick (row) {
      this.dialogFormVisible = true
      if (this.$refs['roleForm'] !== undefined) {
        this.$refs['roleForm'].resetFields()
      }
      this.roleForm = Object.assign({}, this.form)
      if (!row) {
        this.title = '添加角色信息'
      } else {
        this.title = '修改角色信息'
        copyObject(this.form, row, this.roleForm)
        this.roleForm.roleCode = this.roleForm.roleCode.replace('ROLE_', '')
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
      this.roleSelection = val
    },
    // 添加、修改提交
    submitClick () {
      this.$refs['roleForm'].validate((valid) => {
        if (!valid) return
        this.$store.commit('SET_LOADING', 'buttonLoading')
        const params = Object.assign({}, this.roleForm)
        params.roleCode = 'ROLE_' + params.roleCode
        if (!params.id) {
          addRole(params).then(() => {
            this.dialogFormVisible = false
            this.$message.success('添加成功!')
            this.pageChange(1)
          })
        } else {
          updateRole(params).then(() => {
            this.dialogFormVisible = false
            this.$message.success('修改成功!')
            this.getList()
          })
        }
      })
    },
    // 删除
    deleteClick (id) {
      this.$confirm('是否确定要删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            deleteRole(id).then(res => {
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
    deleteBatchClick () {
      this.$confirm('是否确认要删除这些角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            const params = this.roleSelection.map(item => item.id)
            batchDeleteRole(params).then(res => {
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
    // 点击授权用户按钮
    async editRoleUserClick (id) {
      this.dialogUserVisible = true
      this.roleId = id
      this.$store.commit('SET_LOADING', 'dialogLoading')
      this.userSelector = await getRoleUserListById(id)
    },
    // 提交授权用户
    submitRoleUserClick () {
      this.$store.commit('SET_LOADING', 'buttonLoading')
      updateRoleUser({ userIds: this.userSelector, id: this.roleId }).then(res => {
        this.dialogUserVisible = false
        this.$message.success('授权用户成功!')
      })
    },
    // 点击授权菜单按钮
    async editRoleMenuClick (id) {
      this.dialogMenuVisible = true
      this.roleId = id
      this.$store.commit('SET_LOADING', 'dialogLoading')
      const menuSelector = await getRoleMenuListById(id)
      this.$refs.menuTree.setCheckedKeys(menuSelector.menus)
      this.selectedButtonPermission = menuSelector.buttons
      // 默认展开所有的tree
      for (var i = 0; i < this.$refs.menuTree.store._getAllNodes().length; i++) {
        this.$refs.menuTree.store._getAllNodes()[i].expanded = true
      }
    },
    // 关闭授权菜单弹框时选中清空的tree
    closeClick () {
      this.$refs.menuTree.setCheckedKeys([])
      this.selectedButtonPermission = []
    },
    // 提交角色菜单权限
    submitRoleMenuClick () {
      // 获取半选中节点ids和选中节点ids
      const parentIds = this.$refs.menuTree.getHalfCheckedKeys()
      const childIds = this.$refs.menuTree.getCheckedKeys()
      const menus = parentIds.concat(childIds).map(item => {
        return { id: item, functionType: 0 }
      })
      const buttons = this.selectedButtonPermission.map(item => {
        return { id: item, functionType: 1 }
      })
      const functions = menus.concat(buttons)
      if (!menus.length) {
        return this.$message.error('请选择菜单!')
      }
      this.$store.commit('SET_LOADING', 'buttonLoading')
      updateRoleMenu({ functions, id: this.roleId }).then(res => {
        this.dialogMenuVisible = false
        this.$message.success('授权菜单成功!')
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
