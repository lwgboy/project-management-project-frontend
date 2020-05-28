<template>
  <div>
    <el-card>
      <div slot="header" class="clear-fix">
        <span>按钮管理</span>
        <el-button style="float: right;padding: 0;" type="text" @click="editClick()">添加</el-button>
      </div>
      <el-table
        :data="dataTable"
        border
        tooltip-effect="dark"
      >
        <el-table-column
          align="center"
          label="标识符"
          prop="buttonTitle"
        />
        <el-table-column
          align="center"
          label="备注"
          show-overflow-tooltip
          prop="buttonRemark"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="editClick(scope.row)">修改</el-button>
            <el-button type="text" @click="deleteClick(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <!-- 添加、修改 -->
    <dialogs v-model="dialogVisible" :title="title" @submitClick="submitClick">
      <el-form ref="buttonForm" :model="buttonForm" label-width="70px" :rules="rules">
        <el-form-item label="标识符:" prop="buttonTitle">
          <el-input v-model.trim="buttonForm.buttonTitle" placeholder="请输入标识符" />
        </el-form-item>
        <el-form-item label="备注:" prop="buttonRemark">
          <el-input
            v-model.trim="buttonForm.buttonRemark"
            :autosize="{ minRows: 4, maxRows: 10}"
            type="textarea"
            maxlength="200"
            placeholder="请输入备注"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </dialogs>
  </div>
</template>

<script>
import { getButtonListByMenuId, addButton, updateButton, deleteButton } from '@/api/system'
import { copyObject } from '@/utils/index'
import Dialogs from '@/components/Dialogs'
export default {
  components: {
    Dialogs
  },
  props: {
    menu: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      dataTable: [],
      dialogVisible: false,
      form: {
        id: '',
        menuId: '',
        buttonTitle: '',
        buttonRemark: ''
      },
      title: '',
      buttonForm: {},
      rules: {
        buttonTitle: [
          { required: true, message: '请输入标识符', trigger: 'blur' },
          { pattern: /^[a-zA-Z]{1,20}$/, message: '请输入字母，限制20个字符', trigger: 'blur' }
        ],
        buttonRemark: [
          { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    menu: {
      deep: true,
      immediate: true,
      handler (val) {
        // 传进来的对象包括菜单id和level
        this.dataTable = []
        if (val.level === 2) {
          this.getList()
        }
      }
    }
  },
  methods: {
    getList () {
      getButtonListByMenuId(this.menu.id).then(res => {
        this.dataTable = res
      })
    },
    editClick (row) {
      this.dialogVisible = true
      if (this.$refs['buttonForm'] !== undefined) {
        this.$refs['buttonForm'].resetFields()
      }
      this.buttonForm = Object.assign({}, this.form)
      if (!row) {
        this.title = '添加按钮信息'
      } else {
        this.title = '修改按钮信息'
        copyObject(this.form, row, this.buttonForm)
      }
    },
    // 添加、修改提交
    submitClick () {
      this.$refs['buttonForm'].validate((valid) => {
        if (!valid) return
        this.$store.commit('SET_LOADING', 'buttonLoading')
        const params = Object.assign({}, this.buttonForm)
        params.menuId = this.menu.id
        if (!params.id) {
          addButton(params).then(() => {
            this.dialogVisible = false
            this.$message.success('添加成功!')
            this.getList()
          })
        } else {
          updateButton(params).then(() => {
            this.dialogVisible = false
            this.$message.success('修改成功!')
            this.getList()
          })
        }
      })
    },
    deleteClick (id) {
      this.$confirm('是否确定要删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            deleteButton(id).then(res => {
              done()
              this.$message.success('删除成功!')
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
