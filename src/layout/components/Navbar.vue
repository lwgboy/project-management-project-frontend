<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click" @command="commandClick">
        <div class="avatar-wrapper">
          {{ name ? name: '用户' }}<i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="year">帐套年份</el-dropdown-item>
          <el-dropdown-item divided command="password">修改密码</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <dialogs v-model="dialogVisible" title="修改密码" @submitClick="submitClick">
      <el-form ref="userForm" :model="userForm" :rules="rules" label-width="80px">
        <el-form-item label="旧密码:" prop="oldSecret">
          <el-input v-model.trim="userForm.oldSecret" type="password" placeholder="旧密码" />
        </el-form-item>
        <el-form-item label="新密码:" prop="newSecret">
          <el-input v-model.trim="userForm.newSecret" type="password" placeholder="新密码" />
        </el-form-item>
      </el-form>
    </dialogs>

    <dialogs v-model="yearVisible" title="帐套年份" @submitClick="setYear">
      <el-form ref="yearForm" :model="yearForm" label-width="80px">
        <el-form-item label="年份:" prop="oldSecret">
          <el-date-picker v-model="yearForm.year" type="year" placeholder="选择年">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </dialogs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Dialogs from '@/components/Dialogs'
import { updatePassword } from '@/api/user'
import { setYear } from '@/api/customer'
import { isPassword } from '@/utils/validate'
import Md5 from 'js-md5'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Dialogs
  },
  data () {
    return {
      dialogVisible: false,
      yearVisible: false,
      yearForm: {
        year: null
      },
      userForm: {
        oldSecret: '',
        newSecret: ''
      },
      rules: {
        oldSecret: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { pattern: isPassword(), message: '请输入6-16位字母数字', trigger: 'blur' }
        ],
        newSecret: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: isPassword(), message: '请输入6-16位字母数字', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'id'
    ])
  },
  methods: {
    setYear () {
      setYear(this.yearForm.year).then(() => {
        this.yearVisible = false
      })
    },
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    commandClick (command) {
      // 修改密码
      if (command === 'password') {
        this.dialogVisible = true
        if (this.$refs['userForm'] !== undefined) {
          this.$refs['userForm'].resetFields()
        }
        return
      }
      if (command === 'year') {
        this.yearVisible = true
        return
      }
      // 退出
      if (command === 'logout') {
        this.$confirm('是否确定退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              this.$store.dispatch('user/Logout').then(() => {
                done()
                instance.confirmButtonLoading = false
                this.$router.push('/login')
              }).catch(() => {
                instance.confirmButtonLoading = false
              })
            } else {
              done()
            }
          }
        }).catch(() => {})
        return
      }
    },
    submitClick () {
      this.$refs['userForm'].validate((valid) => {
        if (!valid) return
        const params = {}
        params.oldSecret = Md5(this.userForm.oldSecret)
        params.newSecret = Md5(this.userForm.newSecret)
        this.$store.commit('SET_LOADING', 'dialogLoading')
        params.id = this.id
        updatePassword(params).then(res => {
          this.dialogVisible = false
          this.$message.success('修改密码成功，请重新登录!')
          this.$store.dispatch('user/ResetToken')
          this.$router.push('/login')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 20px;
      cursor: pointer;
      .el-icon-caret-bottom {
        margin-left: 10px;
      }
    }
  }
}
</style>
