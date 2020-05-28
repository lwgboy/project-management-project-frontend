<template>
  <el-upload
    class="avatar-uploader"
    :action="actions"
    :name="name"
    :headers="headers"
    :show-file-list="false"
    :on-success="successUpload"
    :on-error="errorUpload"
    :with-credentials="true"
    :before-upload="beforeUpload"
  >
    <img v-if="imgUrl" :src="imgUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
    <div slot="tip" class="el-upload__tip tip">{{ message }}</div>
  </el-upload>
</template>

<script>
import { getHeaders } from '@/utils/headers'
export default {
  name: 'uploadImg',
  props: {
    value: {
      type: String,
      default: ''
    },
    requestUri: {
      type: String,
      default: '/mgt/news/v1/imgFileUpload'
    },
    message: {
      type: String,
      default: '（建议图片大小：2M以内，图片格式：支持JPG、PNG）'
    },
    size: { // 单位默认是M，用来限制图片大小
      type: Number,
      default: 2
    },
    name: {
      type: String,
      default: 'multipartFiles'
    }
  },
  data () {
    return {
      headers: getHeaders()
    }
  },
  computed: {
    actions () {
      return process.env.VUE_APP_BASE_API + this.requestUri
    },
    imgUrl () {
      return this.value
    }
  },
  methods: {
    successUpload (res) { // 上传成功
      let url = ''
      if (res.code === 20000) {
        url = res.data[0]
      } else {
        const msg = !res.msg ? res.desc : res.msg
        this.$message.error(msg)
      }
      this.$emit('input', url)
    },
    errorUpload () { // 上传失败
      this.$message.error('图片上传失败，请重新上传')
    },
    beforeUpload (file) { // 上传之前做效验
      const isLt2M = file.size / 1024 / 1024 < this.size
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJPG) { // 只能是jpg或者png的
        this.$message.error('只能上传jpg或者png格式')
      }
      if (!isLt2M) {
        this.$message.error(`上传头像图片大小不能超过 ${this.size}MB!`)
      }
      return isJPG && isLt2M
    }
  }
}
</script>

