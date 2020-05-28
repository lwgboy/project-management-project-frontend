<template>
  <div>
    <el-row :gutter="12">
      <!-- 左侧菜单tree -->
      <el-col :span="8">
        <el-card v-loading="$store.getters.loading">
          <div slot="header">
            <el-button type="success" icon="el-icon-plus" circle size="small" @click="addBrotherClick" />
            <el-button type="success" icon="el-icon-arrow-right" circle size="small" @click="addChildrenClick" />
            <el-button type="danger" icon="el-icon-delete" circle size="small" @click="deleteClick" />
          </div>
          <el-tree
            ref="menuTree"
            :data="menuList"
            node-key="id"
            :props="props"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            @node-click="treeItemClick"
          />
        </el-card>
      </el-col>
      <!-- 右侧form -->
      <el-col :span="16">
        <el-card style="margin-bottom: 20px;">
          <div slot="header">
            <span>菜单管理 {{ title }}</span>
          </div>
          <el-form ref="menuForm" :model="menuForm" label-width="80px" :rules="rules">
            <el-form-item label="名称:" prop="menuTitle">
              <el-input v-model.trim="menuForm.menuTitle" :disabled="disabled" placeholder="请输入菜单名称" />
            </el-form-item>
            <el-form-item label="路径:" prop="menuPath">
              <el-input v-model.trim="menuForm.menuPath" :disabled="disabled" placeholder="请输入路径" />
            </el-form-item>
            <el-form-item label="排序:" prop="menuSort">
              <el-input-number v-model="menuForm.menuSort" :disabled="disabled" :min="1" :max="99" />
            </el-form-item>
            <el-form-item label="图标:" prop="menuIcon">
              <el-input v-model.trim="menuForm.menuIcon" :disabled="disabled" placeholder="请输入图标名称" />
            </el-form-item>
            <el-form-item label="备注:" prop="menuRemark">
              <el-input v-model.trim="menuForm.menuRemark" :autosize="{ minRows: 4, maxRows: 10}" type="textarea" maxlength="200" :disabled="disabled" placeholder="请输入备注" show-word-limit />
            </el-form-item>
            <el-form-item>
              <el-button v-if="showButton" type="default" @click="editClick">{{ disabled ? '编辑' : '取消' }}</el-button>
              <el-button type="primary" :loading="$store.getters.dialogLoading" :disabled="disabled" @click="submitClick">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <button-list v-if="menuForm.menuLevel === 2" :menu="menuData" />
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { getAllMenuList, addMenu, updateMenu, deleteMenu } from '@/api/system'
import { copyObject } from '@/utils/index'
import ButtonList from './components/buttonList'

export default {
  components: {
    ButtonList
  },
  data () {
    return {
      title: '',
      props: {
        label: 'menuTitle',
        icon: 'menuIcon',
        children: 'children'
      },
      menuList: [],
      menuForm: {},
      disabled: true,
      showButton: false,
      buttonFlag: 'brother', // chldren 点击的是增加子菜单按钮 brother是点击兄弟菜单
      form: {
        id: '',
        menuLevel: 1,
        menuPid: '',
        menuTitle: '',
        menuIcon: '',
        menuPath: '',
        menuSort: '',
        menuRemark: ''
      },
      menuData: {}, // 传递给按钮列表的数据
      currentSelectKey: null, // 当前选中的tree节点
      rules: {
        menuTitle: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在3到50个字符', trigger: 'blur' }
        ],
        menuPath: [
          { required: true, message: '请输入路径', trigger: 'blur' },
          { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
        ],
        menuSort: [
          { type: 'number', required: true, message: '请输入排序编号', trigger: 'blur' }
        ],
        menuIcon: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        menuRemark: [
          { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.menuForm = Object.assign({}, this.form)
    this.getMenuTreeList()
  },
  methods: {
    // 获取菜单列表
    getMenuTreeList () {
      this.$store.commit('SET_LOADING', 'loading')
      getAllMenuList().then(res => {
        this.menuList = res
        this.$nextTick(() => { // 设置当前选中的节点
          this.$refs['menuTree'].setCurrentKey(this.currentSelectKey)
        })
      })
    },
    // 点击菜单项
    treeItemClick (data, node) { // node用来获取菜单的层级
      this.title = ''
      this.showButton = true
      this.disabled = true
      this.$refs['menuForm'].resetFields()
      copyObject(this.form, data, this.menuForm)
      this.menuForm.menuLevel = node.level
      // 保存当前选中的节点
      this.currentSelectKey = this.$refs['menuTree'].getCurrentKey()
      // 保存一份数据传给buttonList用，以免在添加子菜单时给level加1后buttonList报错
      this.menuData = {
        id: data.id,
        level: node.level
      }
    },
    // 验证是否点击过菜单节点
    validateCurrentNode () {
      const currentNode = this.$refs['menuTree'].getCurrentNode()
      if (!currentNode) {
        this.$message.error('请选择一个菜单节点!')
        return false
      }
      return true
    },
    // 增加兄弟菜单
    addBrotherClick () {
      if (!this.validateCurrentNode()) return
      this.showButton = true
      this.disabled = false
      this.buttonFlag = 'brother'
      this.menuForm = Object.assign({}, this.form)
      this.menuForm.menuPid = this.$refs['menuTree'].getCurrentNode().menuPid
      this.title = ' — 添加 【' + this.$refs['menuTree'].getCurrentNode().menuTitle + '】 的同级菜单'
    },
    // 增加子菜单
    addChildrenClick () {
      if (!this.validateCurrentNode()) return
      this.showButton = true
      this.disabled = false
      this.buttonFlag = 'children'
      this.menuForm = Object.assign({}, this.form)
      this.menuForm.menuPid = this.$refs['menuTree'].getCurrentNode().id
      this.title = ' — 添加 【' + this.$refs['menuTree'].getCurrentNode().menuTitle + '】 的子菜单'
    },
    // 删除当前菜单项
    deleteClick () {
      if (!this.validateCurrentNode()) return
      this.$confirm('是否确定要删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            deleteMenu(this.$refs['menuTree'].getCurrentNode().id).then(res => {
              done()
              this.$message.success('删除成功!')
              instance.confirmButtonLoading = false
              this.disabled = true
              this.showButton = false
              this.title = ''
              this.currentSelectKey = null
              this.$refs['menuForm'].resetFields()
              this.getMenuTreeList()
            }).catch(() => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      }).catch(() => {})
    },
    // 点击编辑、取消按钮
    editClick () {
      if (!this.validateCurrentNode()) return
      this.disabled = !this.disabled
      if (this.title) { // 如果title证明是添加菜单，编辑或者取消的时候恢复之前选中的菜单和按钮数据
        this.title = ''
        this.$refs['menuForm'].resetFields()
        const data = this.$refs['menuTree'].getCurrentNode()
        copyObject(this.form, data, this.menuForm)
        this.menuData = {
          id: data.id,
          level: data.menuLevel
        }
      }
    },
    // 提交
    submitClick () {
      if (!this.validateCurrentNode()) return
      this.$refs['menuForm'].validate((valid) => {
        if (!valid) return
        this.$store.commit('SET_LOADING', 'dialogLoading')
        const menu = Object.assign({}, this.menuForm)
        if (this.buttonFlag === 'children') {
          menu.menuLevel = menu.menuLevel + 1
        }
        if (!menu.id) {
          addMenu(menu).then(res => {
            this.$message.success('添加成功!')
            this.resetData()
          })
        } else {
          updateMenu(menu).then(res => {
            this.$message.success('修改成功!')
            this.resetData()
          })
        }
      })
    },
    // 初始化数据，获取菜单列表
    resetData () {
      this.disabled = true
      this.title = ''
      this.getMenuTreeList()
    }
  }
}
</script>
