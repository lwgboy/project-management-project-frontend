<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form">
      <div class="title-container">
        <h3 class="title">项目管理系统-0.9.4.BATE</h3>
      </div>
      <el-form-item prop="userAccount">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userAccount"
          v-model.trim="loginForm.userAccount"
          placeholder="请输入账号"
          type="text"
        />
      </el-form-item>
      <el-form-item prop="userSecret">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="userSecret"
          v-model.trim="loginForm.userSecret"
          :type="passwordType"
          placeholder="请输入密码"
          @keyup.enter.native="loginClick"
        />
        <span class="show-pwd" @click="showPasswordClick">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="$store.getters.buttonLoading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="loginClick">登录</el-button>

    </el-form>
  </div>
</template>

<script>
import { isUserName, isPassword } from '@/utils/validate'
import Md5 from 'js-md5'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        userAccount: '',
        userSecret: ''
      },
      rules: {
        userAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { pattern: isUserName(), message: '请输入6-20位字母数字', trigger: 'blur' }
        ],
        userSecret: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: isPassword(), message: '请输入6-16位字母数字', trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler (route) {
        this.redirect = route.query && route.query.redirect
      }
    }
  },
  methods: {
    showPasswordClick () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$refs.userSecret.focus()
    },
    loginClick () {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return
        this.$store.commit('SET_LOADING', 'buttonLoading')
        const params = Object.assign({}, this.loginForm)
        params.userSecret = Md5(params.userSecret)
        this.$store.dispatch('user/Login', params).then((res) => {
          this.$router.push({ path: this.redirect || '/' })
        })
      })
    }
  }
}
</script>

<style lang="scss">
@supports (-webkit-mask: none) and (not (cater-color: #fff)) {
  .login-container .el-input input {
    color: #fff;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 50px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      height: 50px;
      line-height: 50px;
      color: #fff;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #283443 inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item__content {
    line-height: 0px;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #eee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 17px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
}
</style>
