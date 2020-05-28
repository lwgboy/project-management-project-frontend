<template>
  <div style="background:#f0f2f5;margin-top: -20px;height:100%;">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404-parent" :src="img_404" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit-oops">OOPS!</div>
        <div class="bullshit-headline">页面不存在......</div>
        <div class="bullshit-info">请检查您输入的网址是否正确，请点击以下按钮返回主页</div>
        <router-link to="/welcome">
          <el-button round type="primary">返回欢迎页</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import img_404 from '@/assets/404.png'

export default {
  name: 'notFound',
  data () {
    return {
      img_404
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http404 {
  position: relative;
  width: 1200px;
  margin: 20px auto 60px;
  padding: 0 100px;
  overflow: hidden;
  .pic-404 {
    position: relative;
    float: left;
    width: 600px;
    padding: 150px 0;
    overflow: hidden;
    &-parent {
      width: 100%;
    }
  }
  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 150px 0;
    overflow: hidden;
    &-oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      margin-bottom: 20px;
    }
    &-headline {
      font-size: 20px;
      line-height: 24px;
      color: #1482f0;
      margin-bottom: 10px;
    }
    &-info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      margin-bottom: 30px;
    }
    &-return-welcome {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
    }
  }
}
</style>
