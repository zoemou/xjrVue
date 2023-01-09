import Mock from 'mockjs'
const top = [{
  label: "首页",
  path: "/wel/index",
  icon: 'el-icon-document',
  meta: {
    i18n: 'dashboard',
  },
  parentId: 0
},
  {
    label: "官网",
    icon: 'el-icon-document',
    meta: {
      menu: false,
      i18n: 'website',
    },
    path: "https://avuejs.com",
    parentId: 1
  },
  {
    label: "测试",
    icon: 'el-icon-document',
    path: "/test/index",
    meta: {
      i18n: 'test',
    },
    parentId: 2
  },
  {
    label: "更多",
    icon: 'el-icon-document',
    path: "/wel/dashboard",
    meta: {
      menu: false,
      i18n: 'more',
    },
    parentId: 3
  }]
const first = [{
  label: "快速开发",
  path: '/QuickDevelopment',
  component: 'views/QuickDevelopment',
  icon: 'icon-caidan',
  meta: {
    i18n: 'QuickDevelopment',
  },
  children: [
    {
      label: "快速开发向导",
      path: '/PCDevGuide',
      component: 'views/QuickDevelopment/PCDevGuide',
      icon: 'icon-caidan',
      children: []
    },
    {
      label: "代码生成器",
      path: '/Code',
      component: 'views/QuickDevelopment/Code',
      icon: 'icon-caidan',
      meta: {
        i18n: 'Code',
      }
    },
    {
      label: "自定义表单",
      path: '/Form',
      component: 'views/QuickDevelopment/Form',
      icon: 'icon-caidan',
      meta: {
        i18n: 'Form',
      },
      children: [
        {
          label: "表单设计",
          path: '/CustmerForm',
          component: 'views/QuickDevelopment/Form/CustmerForm',
          icon: 'icon-caidan',
          children: []
        },
        {
          label: "表单管理",
          path: '/Form',
          component: 'views/QuickDevelopment/Form/Form',
          icon: 'icon-caidan',
          children: []
        }
      ]
    },{
      label: "数据管理",
      path: '/DatabaseManage',
      component: 'views/QuickDevelopment/DatabaseManage',
      icon: 'icon-caidan',
      children: [
        {
          label: "数据库连接",
          path: '/DatabaseLink',
          component: 'views/QuickDevelopment/DatabaseManage/DatabaseLink',
          icon: 'icon-caidan',
          children: []
        },
        {
          label: "数据表管理",
          path: '/DatabaseTable',
          component: 'views/QuickDevelopment/DatabaseManage/DatabaseTable',
          icon: 'icon-caidan',
          children: []
        },
        {
          label: "数据源管理",
          path: '/DataSource',
          component: 'views/QuickDevelopment/DatabaseManage/DataSource',
          icon: 'icon-caidan',
          children: []
        },
        {
          label: "常用字段",
          path: '/DatabaseField',
          component: 'views/QuickDevelopment/DatabaseManage/DatabaseField',
          icon: 'icon-caidan',
          children: []
        }
      ]
    },
	{
		label: "代码生成器",
		path: '/Code',
        component: 'views/QuickDevelopment/Code',
        icon: 'icon-caidan',
        children: []
	}
  ]
},
  {
    label: "系统管理",
    path: '/SystemManagement',
    component: 'views/SystemManagement',
    icon: 'icon-caidan',
    meta: {
      i18n: 'SystemManagement',
    },
    children: [
      {
        label: "菜单管理",
        path: '/MenuManagement',
        component: 'views/SystemManagement/MenuManagement',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "数据字典",
        path: '/DataItem',
        component: 'views/SystemManagement/DataItem',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "多语言管理",
        path: '/Language',
        component: 'views/SystemManagement/Language',
        icon: 'icon-caidan',
        meta: {
          i18n: 'language',
        },
        children: [
          {
            label: "语言类型维护",
            path: '/LanguageType',
            component: 'views/SystemManagement/Language/LanguageType',
            icon: 'icon-caidan',
            children: []
          },
          {
            label: "数据字典翻译",
            path: '/DataDictionary',
            component: 'views/SystemManagement/Language/DataDictionary',
            icon: 'icon-caidan',
            children: []
          },
          {
            label: "菜单功能翻译",
            path: '/MenuFunction',
            component: 'views/SystemManagement/Language/MenuFunction',
            icon: 'icon-caidan',
            children: []
          },
          {
            label: "翻译管理",
            path: '/Translation',
            component: 'views/SystemManagement/Language/Translation',
            icon: 'icon-caidan',
            children: []
          }
        ]
      },
      {
        label: "企业微信",
        path: '/Wechart',
        component: 'views/Wechart',
        icon: 'icon-caidan',
        meta: {
          i18n: 'organization',
        },
        children: [
          {
            label: "企业微信用户",
            path: '/UserManagement',
            component: 'views/Wechart/UserManagement',
            icon: 'icon-caidan',
            children: []
          },
          {
            label: "企业微信部门",
            path: '/DepartmentManagement',
            component: 'views/Wechart/DepartmentManagement',
            icon: 'icon-caidan',
            children: []
          }
        ]
      },
      {
        label: "钉钉",
        path: '/DingTalk',
        component: 'views/DingTalk',
        icon: 'icon-caidan',
        meta: {
          i18n: 'organization',
        },
        children: [
          {
            label: "钉钉用户",
            path: '/UserManagement',
            component: 'views/DingTalk/UserManagement',
            icon: 'icon-caidan',
            children: []
          },
          {
            label: "钉钉部门",
            path: '/DepartmentManagement',
            component: 'views/DingTalk/DepartmentManagement',
            icon: 'icon-caidan',
            children: []
          }
        ]
      },
      {
        label: "自动编码",
        path: '/CodeRule',
        component: 'views/SystemManagement/CodeRule',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "系统日志",
        path: '/Log',
        component: 'views/SystemManagement/Log',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "数据权限",
        path: '/DataAuthorize',
        component: 'views/SystemManagement/DataAuthorize',
        icon: 'icon-caidan',
        children: [
          {
            label: "普通权限",
            path: '/PrimaryAuthorize',
            component: 'views/SystemManagement/DataAuthorize/PrimaryAuthorize',
            icon: 'icon-caidan',
            children: []
          },
          {
            label: "自定义表单权限",
            path: '/DataAuthorize',
            component: 'views/SystemManagement/DataAuthorize/DataAuthorize',
            icon: 'icon-caidan',
            children: []
          }
        ]
      },
      {
        label: "行政区域",
        path: '/AreaManager',
        component: 'views/SystemManagement/AreaManager',
        icon: 'icon-caidan',
        children: []
      },
      {
        label:"计划任务",
        path:'/TaskScheduling',
        component: 'views/SystemManagement/TaskScheduling',
        icon: 'icon-caidan',
        children: [{
          label: "任务设计",
          path: '/TaskDesign',
          component: 'views/SystemManagement/TaskScheduling/TaskDesign',
          icon: 'icon-caidan',
          children: []
        },{
          label: "任务日志",
          path: '/TaskLog',
          component: 'views/SystemManagement/TaskScheduling/TaskLog',
          icon: 'icon-caidan',
          children: []
        }]
      },
      {
        label:"导入导出模板",
        path:'/ImportAndExport',
        component: 'views/SystemManagement/ImportAndExport',
        icon: 'icon-caidan',
        children: [{
          label: "导入配置",
          path: '/ExcelImport',
          component: 'views/SystemManagement/ImportAndExport/ExcelImport',
          icon: 'icon-caidan',
          children: []
        },{
          label: "导出配置",
          path: '/ExcelExport',
          component: 'views/SystemManagement/ImportAndExport/ExcelExport',
          icon: 'icon-caidan',
          children: []
        }]
      },
      {
        label: "接口管理",
        path: '/InterfaceManage',
        component: 'views/SystemManagement/InterfaceManage',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "接口服务测试",
        path: '/InterfaceAPI',
        component: 'views/SystemManagement/InterfaceAPI',
        icon: 'icon-caidan',
        children: []
      }
    ]
  },{
    label: "组织架构",
    path: '/Organization',
    component: 'views/Organization',
    icon: 'icon-caidan',
    meta: {
      i18n: 'organization',
    },
    children: [
      {
        label: "用户管理",
        path: '/UserManagement',
        component: 'views/Organization/UserManagement',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "角色管理",
        path: '/RoleManagement',
        component: 'views/Organization/RoleManagement',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "岗位管理",
        path: '/PostManagement',
        component: 'views/Organization/PostManagement',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "公司管理",
        path: '/CompanyManagement',
        component: 'views/Organization/CompanyManagement',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "部门管理",
        path: '/DepartmentManagement',
        component: 'views/Organization/DepartmentManagement',
        icon: 'icon-caidan',
        children: []
      }
    ]
  },{
    label: "工作流程",
    path: '/WorkFlow',
    component: 'views/WorkFlow',
    icon: 'icon-caidan',
    meta: {
      i18n: 'language',
    },
    children: [
      {
        label: "电子签章",
        path: '/PrivateStampInfo',
        component: 'views/WorkFlow/PrivateStampInfo',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "公共签章",
        path: '/PublicStampInfo',
        component: 'views/WorkFlow/PublicStampInfo',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "流程设计",
        path: '/WFDesign',
        component: 'views/WorkFlow/WFDesign',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "流程任务",
        path: '/WFProcess',
        component: 'views/WorkFlow/WFProcess',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "流程委托",
        path: '/WFDelegate',
        component: 'views/WorkFlow/WFDelegate',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "流程监控",
        path: '/WFMonitor',
        component: 'views/WorkFlow/WFMonitor',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "流程发起",
        path: '/WFLaunch',
        component: 'views/WorkFlow/WFLaunch',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "专项菜单",
        path: '/WFMenu',
        component: 'views/WorkFlow/WFMenu',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "生成的菜单",
        path: '/WFPreview',
        component: 'views/WorkFlow/WFPreview',
        icon: 'icon-caidan',
        children: []
      }   
    ]
  },{
    label: "手机开发",
    path: '/MobileDevelopment',
    component: 'views/MobileDevelopment',
    icon: 'icon-caidan',
    meta: {
      i18n: 'language',
    },
    children: [
      {
        label: "移动应用设计",
        path: '/AppDesign',
        component: 'views/MobileDevelopment/AppDesign',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "移动功能管理",
        path: '/ModuleCode',
        component: 'views/MobileDevelopment/ModuleCode',
        icon: 'icon-caidan',
        children: []
      }
    ]
  },{
    label: "专业报表",
    path: '/ReportModule',
    component: 'views/ReportModule',
    icon: 'icon-caidan',
    meta: {
      i18n: 'reportmoudle',
    },
    children: [
      {
        label: "报表设计",
        path: '/ReportDesign',
        component: 'views/ReportModule/ReportDesign',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "报表管理",
        path: '/ReportManage',
        component: 'views/ReportModule/ReportManage',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "报表发布",
        path: '/ReportRelease',
        component: 'views/ReportModule/ReportRelease',
        icon: 'icon-caidan',
        children: []
      }
    ]
  },{
    label: "商业智能",
    path: '/BusinessIntelligence',
    component: 'views/BusinessIntelligence',
    icon: 'icon-caidan',
    meta: {
      i18n: 'language',
    },
    children: [
      {
        label: "BI设计",
        path: 'http://192.168.0.150:8081', //
        component: 'views/BusinessIntelligence/DataChart', //
        icon: 'icon-caidan',
		target:'open',
        children: []
      },
      {
        label: "看板发布",
        path: '/DataChartElease',
        component: 'views/BusinessIntelligence/DataChartElease',
        icon: 'icon-caidan',
        children: []
      }
    ]
  },{
    label: "OA办公",
    path: '/OfficeAutomation',
    component: 'views/OfficeAutomation',
    icon: 'icon-caidan',
    meta: {
      i18n: 'officeautomation',
    },
    children: [
      {
        label: "日程管理",
        path: '/Schedule',
        component: 'views/OfficeAutomation/Schedule',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "新闻管理",
        path: '/News',
        component: 'views/OfficeAutomation/News',
        icon: 'icon-caidan',
        children: []
      },
      {
        label: "通知公告",
        path: '/Notice',
        component: 'views/OfficeAutomation/Notice',
        icon: 'icon-caidan',
        children: []
      }
    ]
  }]

const second = []
const third = [{
  label: "测试页面",
  path: '/test',
  component: 'views/test',
  icon: 'icon-caidan',
  meta: {
    i18n: 'test',
  },
  children: []
},{
  label: "代码生成器",
  path: '/TestCode',
  component: 'views/TestCode',
  icon: 'icon-caidan',
  meta: {
    i18n: 'TestCode',
  },
  children: []
},{
  label: "生成代码",
  path: '/CodePage',
  component: 'views/QuickDevelopment/Code/CodePage',
  icon: 'icon-caidan',
  meta: {
    i18n: 'CodePage',
  },
  children: []
},
  {
    label: "xjr组件",
    path: '/CodeTest',
    component: 'views/QuickDevelopment/Code/CodeTest',
    icon: 'icon-caidan',
    meta: {
      i18n: 'CodeTest',
    },
    children: []
  }]
export default ({ mock }) => {
  if (!mock) return;
  let menu = [first, second, third];
  Mock.mock('/user/getMenu', 'get', (res) => {
    let body = JSON.parse(res.body);
    return {
      data: menu[body.type] || []
    }
  })
  Mock.mock('/user/getTopMenu', 'get', () => {
    return {
      data: top
    }
  })

}