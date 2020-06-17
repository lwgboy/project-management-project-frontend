<template>
  <div class="tool-pagination clear-fix">
    <!-- <div class="tool-pagination-left">
      <slot name="left" />
    </div> -->
    <el-pagination
      class="tool-pagination-right"
      :layout="layout"
      :page-sizes="pageSizes"
      :page-size.sync="size"
      :current-page.sync="page"
      :total="total"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default () {
        return [1, 10, 20, 50, 100]
      }
    }
  },
  computed: {
    page: {
      get () {
        return this.currentPage
      },
      set (val) {
        this.$emit('update:currentPage', val)
      }
    },
    size: {
      get () {
        return this.pageSize
      },
      set (val) {
        this.$emit('update:pageSize', val)
      }
    }
  },
  methods: {
    pageChange (page) {
      this.$emit('current-change', page)
    },
    sizeChange (size) {
      this.$emit('size-change', size)
    }
  }
}
</script>
<style lang="scss" scoped>
.tool-pagination {
  text-align: right;
  margin: 20px 0;
  &-right {
    float:right;
  }
  &-left {
    float: left;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    span {
      display: inline-block;
      vertical-align: middle;
      margin: 0 10px 0 20px;
    }
  }
}
</style>
