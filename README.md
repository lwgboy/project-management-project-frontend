# 后台管理系统模板相关说明

## 运行
  ``` bash
  # 克隆项目
  git clone http://192.168.97.190/yesway-framework-technology/yesway-cloud/yesway-cloud-frontend-admin.git

  # 进入项目
  cd yesway-cloud-frontend-admin

  # 安装依赖
  # 可以通过npm或者cnpm安装
  # 安装cnpm: npm install -g cnpm --registry=https://registry.npm.taobao.org
  # cnpm install
  npm install

  # 本地运行
  npm run dev

  # 打包发布(打包的所有文件放在dist目录下)

  # 测试环境
  npm run test

  # 正式环境
  npm run build

  # 一次打包多个环境
  npm run build:all

  # 检测是否符合eslint规则
  npm run lint

  # 服务器配置
  https://router.vuejs.org/zh/guide/essentials/history-mode.html
  ```

## 命名规则
 - 文件夹：在views目录下，以一级菜单名为文件夹名称，下一级文件名以路由名称命名为文件夹名称

        页面里边常用方法/事件命名(常以事件名结尾如:click、change、list): 
          例如：
          1. getList 获取列表数据 
          2. editClick 添加/修改 
          3. submitClick 提交
          4. pageChange 分页 
          5. sizeChange 每页条数  
          6. exportClick 导出
      

 - 接口：在api目录下，以一级菜单名为js文件名 

        接口方法命名规则(常以动作+名称拼接而成):
          例如：消息任务页面
          1. 获取分页列表数据 getMessageTasksPageList
          2. 获取列表数据(不分页) getMessageTasksList
          2. 添加 addMessageTasks
          3. 修改 updateMessageTasks
          4. 删除 deleteMessageTasks
          5. 导出 exportMessageTasks
          6. 通过id获取信息 getMessageTasksById

 - views里边的文件名跟api里边的js文件是对应关系
 - 所有的文件夹和js文件使用驼峰命名法，全局公用vue组件首字母大写


## 功能
``` bash
  - 登录 / 修改密码 / 退出
  - 权限验证
    - 页面权限(用动态路由实现)
    - 按钮权限(用自定义指令实现)
  - 全局功能
    - 全局loading
  - 页面  
    - 欢迎页
    - 用户管理
    - 角色管理
    - 功能管理
    - 操作日志
    
  # 说明:

  # 1.定义在文件src/store/index.js，需要loading显示时直接调用SET_LOADING方法，在axios拦截器里边会统一关闭loading效果,拦截器所在文件src/utils/request.js

  # 2.动态渲染组件时，把当前页面按钮的权限放到meta字段里边了,所在文件src/store/modules/user.js.使用全局自定义指令实现，定义到main.js里边（例如：v-has="'update'" 直接写到按钮标签上）

```
## 目录
``` bash
├── dist                       # 构建产出代码按不同环境区分
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   │   │── system                 # 系统管理模块接口
│   │   └── user                   # 用户相关信息接口
│   ├── assets                 # 图片、字体等静态资源
│   ├── components             # 全局公用组件
│   │   │── upload                 # 上传文件/图片组件
│   │   │── Breadcrumb.vue         # 面包屑组件
│   │   │── Dialogs.vue            # 弹框组件
│   │   │── Hamburger.vue          # 收起/展开菜单按钮组件
│   │   │── Pagination.vue         # 分页组件
│   │   └── SvgIcon.vue            # svg小图标组件
│   ├── filters                # 全局过滤器
│   ├── icons                  # 项目所有svg文件
│   ├── layout                 # 菜单、头部公用组件
│   │   │── components             # 组件
│   │   │   │── sidebar                # 左侧菜单区域
│   │   │   │── index.js               # 组件的入口文件
│   │   │   │── AppMain.vue            # 主要内容区域
│   │   │   │── Narbar.vue             # 头部区域
│   │   │── mixin              # 设置菜单展开收起
│   │   └── index.vue          # 入口文件
│   ├── router                 # 路由
│   ├── store                  # 全局store管理
│   │   │── modules                # 模块数据
│   │   │   │── app.js                 # 设置菜单收起/展开
│   │   │   │── setting.js             # 设置页卡title,固定头部等
│   │   │   │── user.js                # 用户相关
│   │   └── index                  # store入口文件，全局公用数据
│   ├── styles                 # 全局样式
│   │   │── element-ui.scss        # 修改element-ui样式
│   │   │── index.scss             # 全局共用样式
│   │   │── mixin.scss             # mixin样式
│   │   │── sidebar.scss           # 左侧菜单样式
│   │   │── transition.scss        # 动画样式
│   │   └── variables.scss         # 基础样式
│   ├── utils                  # 全局公用方法
│   │   │── auth.js                # 设置token
│   │   │── download.js            # 下载
│   │   │── getPageTitle.js        # 设置页卡title
│   │   │── header.js              # 设置请求头
│   │   │── index.js               # 常用方法
│   │   │── request.js             # axios设置
│   │   │── storage.js             # 本地存储
│   │   │── userAgent.js           # 获取浏览器相关信息
│   │   └── validate.js            # 公用表单验证规则
│   ├── views                  # 所有页面
│   │   │── system                 # 系统管理
│   │   │   │── components             # 当前模块中用到的公用组件
│   │   │   │── function.vue           # 功能管理
│   │   │   │── log.vue                # 操作日志
│   │   │   │── role.vue               # 角色管理
│   │   │   └── user.vue               # 用户管理
│   │   │── user                   # 用户相关的页面
│   │   │   └── login.vue              # 登陆页面
│   │   │── welcome                # 欢迎页
│   │   └── 404.vue            # 404页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件
│   ├── permission.js          # 权限管理
│   └── settings.js            # 设置页卡title,固定头部等
├── .env.xxx                   # 环境变量配置(开发、测试、生产环境)
├── .eslintignore              # eslint忽略文件
├── .eslintrc.js               # eslint配置项
├── .gitignore                 # git忽略文件
├── babel.config.js            # babel配置
├── package.json               # package.json
├── postcss.config.js          # postcss配置
└── vue.config.js              # 运行、打包等基础配置
``` 
 