<template>
  <el-upload
    ref="upload"
    class="upload-file"
    :style="uploadStyle"
    :action="actions"
    :name="name"
    :headers="headers"
    :on-success="successUpload"
    :on-change="changeUpload"
    :on-error="errorUpload"
    :disabled="loading"
    :before-upload="beforeUpload"
    :with-credentials="true"
    :show-file-list="false"
  >
    <el-button :type="buttonType" :loading="loading">{{ buttonText }}</el-button>
  </el-upload>
</template>

<script>
import { getHeaders } from '@/utils/headers'
export default {
  name: 'uploadFile',
  props: {
    value: {
      type: String,
      default: ''
    },
    requestUri: { // 文件导入需要传更换这个默认值，其它地方用到文件上传时都会返回个地址
      type: String,
      default: '/mgt/news/v1/imgFileUpload'
    },
    name: {
      type: String,
      default: 'multipartFiles'
    },
    uploadStyle: {
      type: String,
      default: ''
    },
    buttonType: {
      type: String,
      default: 'primary'
    },
    buttonText: {
      type: String,
      default: '上传软件包'
    }
  },
  data () {
    return {
      headers: getHeaders(),
      url: '',
      size: '',
      loading: false
    }
  },
  computed: {
    actions () {
      return process.env.VUE_APP_BASE_API + this.requestUri
    }
  },
  methods: {
    beforeUpload (file) {
      this.size = (file.size / 1024 / 1024).toFixed(2)
    },
    successUpload (res) {
      // 上传成功分两种情况，1.上传文件会有一个地址返回是数组['url']取数据的第一项就是需要的地址 2.导入文件返回的是空{}
      if (res.code === 20000) {
        const arr = Object.keys(res.data)
        // 当arr的length为0时，证明返回的是{} 给个file是为了给父组件相对应的操作事件
        this.url = arr.length === 0 ? 'file' : res.data[0]
      } else {
        this.url = ''
        const msg = !res.msg ? res.desc : res.msg
        this.$message.error(msg)
      }
      this.$refs.upload.clearFiles()
      this.$emit('change', { url: this.url, size: this.size })
    },
    errorUpload () {
      this.$message.error('文件上传失败，请重新上传')
    },
    changeUpload (file, fileList) {
      if (fileList.length > 0) {
        this.url = ''
        this.loading = true
      } else {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-file {
  display: inline-block;
  margin-left: 10px;
}
</style>

