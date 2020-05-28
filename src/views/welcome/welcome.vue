<template>
  <div class="welcome">
    <p>WELCOME</p>
    <p>欢迎使用项目管理系统</p>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {}
  },
  created () {
    // 动态加载菜单时增加了欢迎页和404页面
    if (this.$store.getters.routers.length <= 2) {
      this.$message.error('暂无菜单，请通知管理员添加菜单权限!')
    }
  }
}
</script>
<style lang="scss" scoped>
.welcome {
  padding-top: 200px;
  padding-left: 200px;
  p {
    font-size: 30px;
    &:nth-of-type(1) {
      font-size: 28px;
    }
    &:nth-of-type(2) {
      font-weight: bold;
    }
  }
}
</style>

