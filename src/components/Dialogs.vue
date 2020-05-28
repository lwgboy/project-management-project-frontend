<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" :width="width" :close-on-click-modal="false" @close="closeClick">
      <slot />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="$store.getters.buttonLoading" @click="submitClick">{{ rightButtonText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'dialogs',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '550px'
    },
    rightButtonText: {
      type: String,
      default: '确定'
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    }
  },
  methods: {
    submitClick () {
      this.$emit('submitClick')
    },
    closeClick () {
      this.$emit('input', false)
      this.$emit('closeClick')
    }
  }
}
</script>
