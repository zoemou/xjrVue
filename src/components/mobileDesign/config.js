import website from '@/config/website'
import i18n from "@/lang";
export const mobileDesignList= [{
  clickName: 'loginDesign',
  //key: 'LoginDesign', // 不可动
  title: i18n.t('mobileDev.loginDesTitle'),
  description: i18n.t('mobileDev.loginDesDescr'),
  img:require('../../../public/img/builder_img6.png')
}, {
  clickName: 'homeDesign',
  //key: 'homeDesign', // 不可动
  title: i18n.t('mobileDev.homeDesTitle'),
  description: i18n.t('mobileDev.homeDesDescr'),
   img:require('../../../public/img/builder_img5.png')
}, 
// {
//   clickName: 'functionDesign',
//   //key: 'FunctionDesign', // 不可动
//   title:i18n.t('mobileDev.FunctionDesTitle'),
//   description:i18n.t('mobileDev.FunctionDesDescr'),
//    img:require('../../../public/img/builder_img4.png')
// },
];
export const mobileCategory=[{
  label:i18n.t('mobileDev.custom'),
  F_ItemDetailId:'customapp',
  children:[]
},{
  label:i18n.t('mobileDev.workflow'),
  F_ItemDetailId:'flowapp',
  children:[]
}];

export const btnList = [
    {
      "id":"",
      "icon":"fa fa-font",
      "name":i18n.t('mobileDev.tableSet.tabTitle'),
      "tips":i18n.t('mobileDev.formRightSide.title'),
      "type": "title"
    },
    {
      "id":"",
      "icon":"fa fa-italic",
      "name":i18n.t('mobileDev.formRightSide.textBox'),
      "tips":i18n.t('mobileDev.formRightSide.textBox'),
      "datatype": "",
      "placeholder":i18n.t('mobileDev.formCenterContainer.placeholderText'),
      "dbdefault": "",
      "field": "",
      "isHide": "0",
      "table": "",
      "verify": "",
      "type": "input",
      "listStyle":{
        "showName":"1",
        "fontStyle":'normal 12px/50px arial',
        "fontSize":12,
        "fontColor":'#999',
        "lineHeight":50,
        "fontStyle1":'normal 12px/30px arial',
        "fontSize1":12,
        "fontColor1":'#999',
        "textAlign":'left',
        "addTag":"0",
        "tagColor":'#f59a23'
      }
    },{
      "id":"",
      "icon":"fa fa-align-justify",
      "name":i18n.t('mobileDev.formRightSide.textArea'),
      "tips":i18n.t('mobileDev.formRightSide.textArea'),
      "datatype": "",
      "dbdefault": "",
      "placeholder":i18n.t('mobileDev.formCenterContainer.placeholderText'),
      "field": "",
      "height": 60,               
      "table": "",
      "verify": "",
      "type": "textarea",
      "listStyle":{
        "showName":"1",
        "fontStyle":'normal 12px/50px arial',
        "fontSize":12,
        "fontColor":'#999',
        "lineHeight":50,
        "fontStyle1":'normal 12px/30px arial',
        "fontSize1":12,
        "fontColor1":'#999',
        "textAlign":'left',
        "addTag":"0",
        "tagColor":'#f59a23'
      }
    },
    {
      "id":"",
      "icon":"fa fa-dot-circle-o",
      "name":i18n.t('mobileDev.formRightSide.singleBox'),
      "tips":i18n.t('mobileDev.formRightSide.singleBox'),
      "table":"",
      "field":"",
      "dataSource":"1",
      "dataItem":"",
      "dataItemName":"",
      "dbdefault":{},
      "showField":"",
      "saveField":"",
      "datatype":"",
      "newOption":[],
	  "verify": "",
      "dataSourceFieldOption":[],
      "type": "radio",
      "listStyle":{
        "showName":"1",
        "fontStyle":'normal 12px/50px arial',
        "fontSize":12,
        "fontColor":'#999',
        "lineHeight":50,
        "fontStyle1":'normal 12px/30px arial',
        "fontSize1":12,
        "fontColor1":'#999',
        "textAlign":'left',
        "addTag":"0",
        "tagColor":'#f59a23'
      }
    },
    {
      "id":"",
      "icon":"fa fa-check-square-o",
      "name":i18n.t('mobileDev.formRightSide.checkbox'),
      "tips":i18n.t('mobileDev.formRightSide.checkbox'),
      "table":"",
      "field":"",
      "dataSource":"1",
      "dataItem":"",
      "dataItemName":"",
      "dbdefault":[],
      "showField":"",
      "saveField":"",
      "datatype":"",
      "newOption":[],
	  "verify": "",
      "dataSourceFieldOption":[],
      "type": "checkbox",
      "listStyle":{
        "showName":"1",
        "fontStyle":'normal 12px/50px arial',
        "fontSize":12,
        "fontColor":'#999',
        "lineHeight":50,
        "fontStyle1":'normal 12px/30px arial',
        "fontSize1":12,
        "fontColor1":'#999',
        "textAlign":'left',
        "addTag":"0",
        "tagColor":'#f59a23'
      }
    },
    {
      "id":"",
      "icon":"fa fa-toggle-down",
      "name":i18n.t('mobileDev.formRightSide.dropDownBox'),
      "tips":i18n.t('mobileDev.formRightSide.dropDownBox'),
      "table":"",
      "field":"",
      "dataSource":"1",
      "placeholder":i18n.t('mobileDev.formCenterContainer.placeholderSelect'),
      "dataItem":"",
      "dataItemName":"",
      "dbdefault":"",
      "showField":"",
      "saveField":"",
      "datatype":"",
      "newOption":[],
	  "verify": "",
      "dataSourceFieldOption":[],
      "type": "select",
      "listStyle":{
        "showName":"1",
        "fontStyle":'normal 12px/50px arial',
        "fontSize":12,
        "fontColor":'#999',
        "lineHeight":50,
        "fontStyle1":'normal 12px/30px arial',
        "fontSize1":12,
        "fontColor1":'#999',
        "textAlign":'left',
        "addTag":"0",
        "tagColor":'#f59a23'
      }
    },
    {
      "id":"",
      "icon":"fa fa-calendar",
      "name":i18n.t('mobileDev.formRightSide.dateBox'),
      "tips":i18n.t('mobileDev.formRightSide.dateBox'),
      "datatype": "",
      "dateformat": "0",
      "dbdefault":'',
      "showValue":'',
      "placeholder":i18n.t('mobileDev.formCenterContainer.placeholderSelect'),
      "field": "",                
      "table": "",
      "verify": "",
      "type": "date",
      "listStyle":{
        "showName":"1",
        "fontStyle":'normal 12px/50px arial',
        "fontSize":12,
        "fontColor":'#999',
        "lineHeight":50,
        "fontStyle1":'normal 12px/30px arial',
        "fontSize1":12,
        "fontColor1":'#999',
        "textAlign":'left',
        "addTag":"0",
        "tagColor":'#f59a23'
      }
    },
    {
      "id":"",
      "icon":"fa fa-calendar",
      "name":i18n.t('mobileDev.formRightSide.timeFrame'),
      "tips":i18n.t('mobileDev.formRightSide.timeFrame'),
      "datatype": "",
      "dbdefault":"",
      "placeholder":i18n.t('mobileDev.formCenterContainer.placeholderSelect'),
      "field": "",                
      "table": "",
      "verify": "",
      "type": "time",
      "listStyle":{
        "showName":"1",
        "fontStyle":'normal 12px/50px arial',
        "fontSize":12,
        "fontColor":'#999',
        "lineHeight":50,
        "fontStyle1":'normal 12px/30px arial',
        "fontSize1":12,
        "fontColor1":'#999',
        "textAlign":'left',
        "addTag":"0",
        "tagColor":'#f59a23'
      }
    },
    {
      "id":"",
      "icon":"fa fa-calendar",
      "name":i18n.t('mobileDev.formRightSide.dateRangeBox'),
      "tips":i18n.t('mobileDev.formRightSide.dateRangeBox'),
      "datatype": "",
      "dateformat": "0",
      "dbdefault":'',
      "placeholder":i18n.t('mobileDev.formCenterContainer.placeholderSelect'),
      "field": "",                
      "table": "",
      "verify": "",
      "type": "daterange",
      "listStyle":{
        "showName":"1",
        "fontStyle":'normal 12px/50px arial',
        "fontSize":12,
        "fontColor":'#999',
        "lineHeight":50,
        "fontStyle1":'normal 12px/30px arial',
        "fontSize1":12,
        "fontColor1":'#999',
        "textAlign":'left',
        "addTag":"0",
        "tagColor":'#f59a23'
      }
    },
    {
      "id":"",
      "icon":"fa fa-edit",
      "name":i18n.t('mobileDev.formRightSide.editor'),
      "tips":i18n.t('mobileDev.formRightSide.editor'),
      "datatype":"",
      "field":"",
      "height":400,
      "table":"",
      "verify":"",
      "dbdefault":"",
      "type":"edit",
      "listStyle":{
        "showName":"1",
        "fontStyle":'normal 12px/50px arial',
        "fontSize":12,
        "fontColor":'#999',
        "lineHeight":50,
        "fontStyle1":'normal 12px/30px arial',
        "fontSize1":12,
        "fontColor1":'#999',
        "textAlign":'left',
        "addTag":"0",
        "tagColor":'#f59a23'
      }
    },
    {
      "id":"",
      "icon":"fa fa-table",
      "name":i18n.t('mobileDev.formRightSide.subform'),
      "tips":i18n.t('mobileDev.formRightSide.subform'),
      "datatype":"",
      "table":"",
      "tableColumn":[],
      "type":"table",
      "option": {
        // "highlightCurrentRow": true,
        // "stripe": true,
        // "header": false,
        // "calcHeight": "auto",//表格高度差（主要用于减去其他部分让表格高度自适应）
        // "height": "150px",//表格高度
        // "maxHeight": "auto",
        // "border": true,
        // "align": "center",
        // "editBtn": false,
        // "page": false,
        // "menu": false,
        "column": [
          // {
          //   "label": "",
          //   "prop": "",
          // }
        ]
      },
      "tableset":{}
    },
    {
      "id":"",
      "icon":"fa fa-paperclip",
      "name":i18n.t('mobileDev.formRightSide.attachmentBox'),
      "tips":i18n.t('mobileDev.formRightSide.attachmentBox'),
      "datatype": "",
      "field": "",
      "table": "",
      "placeholder":i18n.t('mobileDev.formCenterContainer.boxUpload'),
      "dbdefault":undefined,
      "type": "file",
	  "verify": "",
      "listStyle":{
        "showName":"1",
        "fontStyle":'normal 12px/50px arial',
        "fontSize":12,
        "fontColor":'#999',
        "lineHeight":50,
        "fontStyle1":'normal 12px/30px arial',
        "fontSize1":12,
        "fontColor1":'#999',
        "textAlign":'left',
        "addTag":"0",
        "tagColor":'#f59a23'
      }
    },
    {
      "id":"",
      "icon":"fa fa-photo",
      "name":i18n.t('mobileDev.formRightSide.pictureBox'),
      "tips":i18n.t('mobileDev.formRightSide.pictureBox'),
      "datatype": "",
      "field": "",
      "table": "",
      "dbdefault":undefined,
	  "imgLength":12,
      "type": "image",
	  "verify": "",
      "listStyle":{
        "showName":"1",
        "fontStyle":'normal 12px/50px arial',
        "fontSize":12,
        "fontColor":'#999',
        "lineHeight":50,
        "fontStyle1":'normal 12px/30px arial',
        "fontSize1":12,
        "fontColor1":'#999',
        "textAlign":'left',
        "addTag":"0",
        "tagColor":'#f59a23'
      }
    },
    // {
    //   "id":"",
    //   "icon":"fa fa-book",
    //   "name":"信息体",
    //   "tips":"信息体",
    //   "datatype": "",
    //   "field": "",
    //   "table": "",
    //   "type": "info",
    //   "info":"当前公司",
    //   "listStyle":{
    //     "showName":"1",
    //     "fontStyle":'normal 12px/50px arial',
    //     "fontSize":12,
    //     "fontColor":'#999',
    //     "lineHeight":50,
    //     "fontStyle1":'normal 12px/30px arial',
    //     "fontSize1":12,
    //     "fontColor1":'#999',
    //     "textAlign":'left',
    //     "addTag":"0",
    //     "tagColor":'#f59a23'
    //   }
    // }
  ];

  export const viewList =[{
    "id":"",
    "tips":i18n.t('mobileDev.homeRightSide.Carousel'),
    "type":"solidImg",
    "solidType":1,
    "imgs":[],
    "titles":["助你快速打造友好美观的交互原型","助你快速打造友好美观的交互原型","助你快速打造友好美观的交互原型","助你快速打造友好美观的交互原型"],
    "links":[],
    "height":210,
    "initialIndex":0,
    "config":"",
    "sql":"",
    "imgUrl":"",
    "info":"",
    "imgAddr":"",
    "F_DatabaseLinkId":""
  },{
    "id":"",
    "tips":i18n.t('mobileDev.homeRightSide.textCarouselImg'),
    "type":"solidText",
    "bgcolor":"#fff",
    "titles":["助你快速打造友好美观的交互原型","助你快速打造友好美观的交互原型","助你快速打造友好美观的交互原型","助你快速打造友好美观的交互原型"],
    "links":[],
    "height":40,
    "config":"",
    "sql":"",
    "info":"",
    "imgAddr":"",
    "textcolor":["#cccccc","#cccccc","#cccccc","#cccccc"],
    "F_DatabaseLinkId":"",
	"keyfield":""
  },{
    "id":"",
    "tips":i18n.t('mobileDev.homeRightSide.graphicCard'),
    "type":"imgCard",
    "cardType":1,
    "num":2,
    "sql":"",
    "imgUrl":"",
    "info":"",
    "icons1":"",
    "labels1":"",
    "icons2":"",
    "labels2":"",
    "link":"",
    "F_DatabaseLinkId":"",
	"keyfield":""
  },{
    "id":"",
    "tips":i18n.t('mobileDev.homeRightSide.videoCard'),
    "type":"videoPlay",
    "num":1,
    "sql":"",
    "imgUrl":"",
    "info":"",
    "icons1":"",
    "labels1":"",
    "icons2":"",
    "labels2":"",
    "F_DatabaseLinkId":""
  },{
    "id":"",
    "tips":i18n.t('mobileDev.homeRightSide.gonggeMenu'),
    "type":"grid",
    "menu":[{
      "enable":true,
      "F_Icon": "fa fa-cog",
      "F_Name": "功能列表",
      "F_Url": "more-app"
    },{
      "enable":true,
      "F_Icon": "fa fa-chevron-circle-right",
      "F_Name": "组件演示",
      "F_Url": "module/module-show"
    }]
  },
  // {
  //   "id":"",
  //   "tips":"标签页",
  //   "type":"nav",
  //   "height":50,
  //   "conheight":150,
  //   "num":4,
  //   "active":1,
  //   "color":"#cccccc",
  //   "highcolor":"#02A7F0",
  //   "titles":["标签一","标签二","标签三","标签四"]
  // },
  {
    "id":"",
    "tips":i18n.t('mobileDev.homeRightSide.slideplugin'),
    "type":"swiperComponent",
    "height":300,
    "num":4,
    "title":i18n.t('slidingPluginTitle'),
    "F_DatabaseLinkId":"",
    "sql":"",
    "imgUrl":"",
    "link":"",
    "info":"",
    "content":"",
	"keyfield":""
  },{
    "id":"",
    "tips":i18n.t('mobileDev.homeRightSide.list'),
    "type":"List",
    "num":4,
    "ismore":1,
    "ispic":1,
    "istitle":1,
    "title":i18n.t('listTitle'),
    "link":"",
    "info":"",
    "content":"",
    "imgUrl":"",
    "sql":"",
    "moreLink":"",
    "F_DatabaseLinkId":"",
	"keyfield":""
  },{
    "id":"",
    "tips":i18n.t('mobileDev.homeRightSide.wfBacklog'),
    "type":"taskList",   
    "num":4
  }]

  export const echartList =[{
    "tips":i18n.t('mobileDev.homeRightSide.table'),
    "type":"table-chart",   
    "id":"",
    "height":274,
    "sql":"",
    "F_DataSourceId":"",
    "F_Text":i18n.t('salesSituationTable'),
    "tableData":[{
        "Time": "2019-06",
        "Target": "¥ 1,000,000.00",
        "Deal": "¥ 1,200,000.00",
        "Order": "200",
        "Complete":"120%",
        "Average":"¥ 100,000.00"
    }, {
        "Time": "2019-05",
        "Target": "¥ 1,000,000.00",
        "Deal": "¥ 1,200,000.00",
        "Order": "200",
        "Complete":"120%",
        "Average":"¥ 100,000.00"
    }, {
        "Time": "2019-04",
        "Target": "¥ 1,000,000.00",
        "Deal": "¥ 1,200,000.00",
        "Order": "200",
        "Complete":"120%",
        "Average":"¥ 100,000.00"
    }, {
        "Time": "2019-03",
        "Target": "¥ 1,000,000.00",
        "Deal": "¥ 1,200,000.00",
        "Order": "200",
        "Complete":"120%",
        "Average":"¥ 100,000.00"
    }, {
        "Time": "2019-02",
        "Target": "¥ 1,000,000.00",
        "Deal": "¥ 1,200,000.00",
        "Order": "200",
        "Complete":"120%",
        "Average":"¥ 100,000.00"
    }, {
        "Time": "2019-01",
        "Target": "¥ 1,000,000.00",
        "Deal": "¥ 1,200,000.00",
        "Order": "200",
        "Complete":"120%",
        "Average":"¥ 100,000.00"
    }],   
    "tableOption":{
        menu:false,
        header:false,
        page:false,
        height:'100%',
        showSummary: true,
        sumColumnList:[{name:'Order',type:'sum'}],
        column:[{
            label:'时间',
            fixed:true,
            prop:'Time',
            width: 70,
            align:'left',
            total:'0',
            count:false
        },{
            width:120,
            label:'目标金额',
            prop:'Target',
            align:'left',
            total:'0',
            count:false
        },{
            width:120,
            label:'成交金额',
            prop:'Deal',
            align:'left',
            total:'0',
            count:false
        },{
            width:70,
            label:'成交订单',
            prop:'Order',
            align:'left',
            total:'1',
            count:false
        },{
            width:60,
            label:'完成率',
            prop:'Complete',
            align:'left',
            total:'0',
            count:false
        },{
            width:120,
            label:'平均客单价',
            prop:'Average',
            align:'left',
            total:'0',
            count:false
        }]
    }
  },{
    "F_Value":"",
    "F_Category":"",
    "F_Name":"",
    "F_Text":i18n.t('exampleLineChart'),
    "F_Subtext":i18n.t('purelyFictitious'),
    "F_DatabaseLinkId":"",
    "tips":i18n.t('mobileDev.homeRightSide.line'),
    "type":"line-chart",
    "chatType":"line",
    "F_theme":"macarons",
    "id":"",
    "F_RefreshTime":4,
    "height":300,
    "sql":"",
    "option": {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        itemWidth:10,
        itemHeight:8,
        type: 'scroll',
        data: ['邮件营销', '联盟广告']
      },
      grid: {
        bottom:30
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
          type: 'value'
      },
      series: [
        {
            name: '邮件营销',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '联盟广告',
            type: 'line',
            data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    }
  },{
    "F_Value":"",
    "F_Category":"",
    "F_Name":"",
    "F_Text":i18n.t('exampleBarChart'),
    "F_Subtext":i18n.t('purelyFictitious'),
    "F_DatabaseLinkId":"",
    "tips":i18n.t('mobileDev.homeRightSide.bar'),
    "type":"bar-chart",
    "chatType":"bar",
    "F_theme":"macarons",
    "id":"",
    "F_RefreshTime":4,
    "height":300,
    "sql":"",
    "option": {
      grid:{
        bottom:30
      },
      tooltip: {},
      legend: {
        itemWidth:10,
        itemHeight:8,
        type: 'scroll',
        data:['销量','口碑']
      },
      xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        },{
          name: '口碑',
          type: 'bar',
          data: [50, 50, 36, 60, 80, 90]
      }]
    }
  },{
    "F_Value":"",
    "F_Category":"",
    "F_Name":"",
    "F_Text":i18n.t('exampleStackBarChart'),
    "F_Subtext":i18n.t('purelyFictitious'),
    "chatType":"bar",
    "F_DatabaseLinkId":"",
    "tips":i18n.t('mobileDev.homeRightSide.stackBar'),
    "type":"verticalBar-chart",
    "F_theme":"macarons",
    "id":"",
    "F_RefreshTime":4,
    "height":300,
    "sql":"",
    "option":{
      tooltip: {
          trigger: 'axis',
          axisPointer: {            // Use axis to trigger tooltip
              type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
          }
      },
      legend: {
        itemWidth:10,
        itemHeight:8,
        type: 'scroll',
        data: ['Direct', 'Mail Ad', 'Affiliate Ad', 'Video Ad', 'Search Engine']
      },
      grid: {
        bottom:30
      },
      xAxis: {
          type: 'value'
      },
      yAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      series: [
          {
              name: 'Direct',
              type: 'bar',
              stack: 'total',
              label: {
                  show: true
              },
              data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
              name: 'Mail Ad',
              type: 'bar',
              stack: 'total',
              label: {
                  show: true
              },
              data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
              name: 'Affiliate Ad',
              type: 'bar',
              stack: 'total',
              label: {
                  show: true
              },
              data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
              name: 'Video Ad',
              type: 'bar',
              stack: 'total',
              label: {
                  show: true
              },
              data: [150, 212, 201, 154, 190, 330, 410]
          },
          {
              name: 'Search Engine',
              type: 'bar',
              stack: 'total',
              label: {
                  show: true
              },
              data: [820, 832, 901, 934, 1290, 1330, 1320]
          }
      ]
    }
  },{
    "F_Value":"",
    "F_Category":"",
    "F_Text":i18n.t('userAccessSourceSite'),
    "F_Subtext":i18n.t('purelyFictitious'),
    "F_DatabaseLinkId":"",
    "tips":i18n.t('mobileDev.homeRightSide.pie'),
    "type":"pie-chart",
    "chatType":"pie",
    "F_theme":"macarons",
    "id":"",
    "F_RefreshTime":4,
    "height":250,
    "sql":"",
    "option":{
      tooltip: {
          trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: 20,
        top:'center',
        itemWidth:10,
        itemHeight:8,
        icon:'circle',
        type: 'scroll',
		textStyle:{
			width:50,
			overflow:'breakAll'
		}
      },
      series: [
          {
              name: '饼图',
              type: 'pie',
              radius: 75,
              //饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
              center:[90,'center'],
              label:{show:true,position:'inside',formatter: ' {c}'},
              labelLine:{show:false},
              data: [
                  {value: 1048, name: '搜索引擎'},
                  {value: 735, name: '直接访问'},
                  {value: 580, name: '邮件营销'},
                  {value: 484, name: '联盟广告'},
                  {value: 300, name: '视频广告'}
              ],
              emphasis: {
                  itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
  }
  },{
    "F_Value":"",
    "F_Category":"",
    "F_Text":i18n.t('equipment'),
    "F_Subtext":i18n.t('purelyFictitious'),
    "F_DatabaseLinkId":"",
    "tips":i18n.t('mobileDev.homeRightSide.circular'),
    "type":"circle-chart",
    "chatType":"pie",
    "F_theme":"macarons",
    "id":"",
    "F_RefreshTime":4,
    "height":260,
    "sql":"",
    "option":{
      tooltip: {
          trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: 20,
        top:'center',
        itemWidth:10,
        itemHeight:8,
        icon:'circle',
        type: 'scroll',
		textStyle:{
			width:50,
			overflow:'breakAll'
		}
      },
      // graphic: [{ //环形图中间添加文字
      //   type: 'text', //通过不同top值可以设置上下显示
      //   left: 60,
      //   top: '45%',
      //   style: {
      //       text: '设备总数',
      //       fill: '#999', //文字的颜色
      //       font: '12px 微软雅黑'
      //   }
      // },{ //环形图中间添加文字
      //   type: 'text', //通过不同top值可以设置上下显示
      //   left: 60,
      //   top: '55%',
      //   style: {
      //       text: '29套',
      //       fill: '#666', //文字的颜色
      //       font: 'bolder 20px 微软雅黑'
      //   }
      // }],
      series: [
          {
              name: '环形图',
              type: 'pie',
              //数组的第一项是内半径，第二项是外半径
              radius: [50, 75],
              //饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
              center:[90,'center'],
              label: {
                  show: false
              },
              data: [
                  {value: 16, name: '正常(16)'},
                  {value: 1, name: '预警(1)'},
                  {value: 1, name: '报警(1)'},
                  {value: 8, name: '离线(8)'},
                  {value: 3, name: '未入网(3)'}
              ]
          }
      ]
  }
  },{
    "F_Value":"",
    "F_Category":"",
    "F_Name":"",
    "F_Text":i18n.t('exampleStackAreaDiagram'),
    "F_Subtext":i18n.t('purelyFictitious'),
    "chatType":"line",
    "F_DatabaseLinkId":"",
    "tips":i18n.t('mobileDev.homeRightSide.stackArea'),
    "type":"area-chart",
    "F_theme":"macarons",
    "id":"",
    "F_RefreshTime":4,
    "height":300,
    "sql":"",
    "option":{
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          }
      },
      legend: {
        itemWidth:10,
        itemHeight:8,
        type: 'scroll',
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
      },
      grid: {
        bottom:30
      },
      xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
      yAxis:{
              type: 'value'
          },
      series: [
          {
              name: '邮件营销',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
              name: '联盟广告',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
              name: '视频广告',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
              name: '直接访问',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
              name: '搜索引擎',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
      ]
  }
  },{
    "F_Value":"",
    "F_Category":"",
    "F_Text":i18n.t('exampleFunnelPlot'),
    "F_Subtext":i18n.t('purelyFictitious'),
    "F_DatabaseLinkId":"",
    "tips":i18n.t('mobileDev.homeRightSide.funnel'),
    "type":"funnel-chart",
    "chatType":"funnel",
    "F_theme":"macarons",
    "id":"",
    "F_RefreshTime":4,
    "height":260,
    "sql":"",
    "option":{
      tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c}%"
      },
      legend: {
        itemWidth:10,
        itemHeight:8,
        type: 'scroll',
        data: ['展现','点击','访问','咨询','订单']
      },  
      series: [
          {
              name:'漏斗图',
              type:'funnel',
              left: 'center',
              //top: 60,
              //x2: 80,
              bottom: 20,
              width: '80%',
              // height: {totalHeight} - y - y2,
              min: 0,
              max: 100,
              minSize: '0%',
              maxSize: '100%',
              sort: 'descending',
              gap: 2,
              label: {
                  show: true,
                  position: 'inside'
              },
              labelLine: {
                  length: 10,
                  lineStyle: {
                      width: 1,
                      type: 'solid'
                  }
              },
              itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 1
              },
              emphasis: {
                  label: {
                      fontSize: 20
                  }
              },
              data: [
                  {value: 60, name: '访问'},
                  {value: 40, name: '咨询'},
                  {value: 20, name: '订单'},
                  {value: 80, name: '点击'},
                  {value: 100, name: '展现'}
              ]
          }
      ]
    }
  },{
    "F_Value":"",
    "F_Category":"",
    "F_Name":"",
    "F_Text":i18n.t('exampleStackBarChart'),
    "F_Subtext":i18n.t('purelyFictitious'),
    "chatType":"bar",
    "F_DatabaseLinkId":"",
    "tips":i18n.t('mobileDev.homeRightSide.pileBar'),
    "type":"pileBar-chart",
    "F_theme":"macarons",
    "id":"",
    "F_RefreshTime":4,
    "height":300,
    "sql":"",
    "option":{
      tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
      },
      legend: {
        itemWidth:10,
        itemHeight:8,
        type: 'scroll',
        data: ['百度', '谷歌', '必应', '其他']
      },
      grid: {
        bottom:30
      },
      xAxis:{
              type: 'category',
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
      yAxis: {
              type: 'value'
          },
      series: [
          {
              name: '百度',
              type: 'bar',
              barWidth: 20,
              stack: '总量',
              data: [620, 732, 701, 734, 1090, 1130, 1120]
          },
          {
              name: '谷歌',
              type: 'bar',
              stack: '总量',
              data: [120, 132, 101, 134, 290, 230, 220]
          },
          {
              name: '必应',
              type: 'bar',
              stack: '总量',
              data: [60, 72, 71, 74, 190, 130, 110]
          },
          {
              name: '其他',
              type: 'bar',
              stack: '总量',
              data: [62, 82, 91, 84, 109, 110, 120]
          }
      ]
    }
  }]

  export const loginList={
    "top":150,
    "inputHeight":50,
    "phoneTips":i18n.t('mobileNumber'),
    "phoneIcon":"fa fa-user",
    "accountTips":i18n.t('inputUserName'),
    "accountIcon":"fa fa-user",
    "shadow":0,
    "isBorder":1,
    "borderWidth":1,
    "borderColor":"#cccccc",
    "radius":4,
    "passwordTips":i18n.t('login.password'),
    "passwordIcon":"fa fa-lock",
    "msmTips":i18n.t('inputVerCode'),
    "msmIcon":"fa fa-envelope",
    "tenantEnabled":website.tenantEnabled,
    "tenantTips":i18n.t('tenantCode'),
    "tenantIcon":"fa fa-lock",
    "marginBottom":15,
    "btnMarginTop":25,
    "btnMarginBottom":10,
    "backgroundImg":'https://s3.bmp.ovh/imgs/2022/04/06/4194b85dfea1d580.png',
    "footer":"@ 2019-2020 湘北智造 All right reserved.",
    "buttonName":i18n.t('login.submit'),
    "letterSpace":10,
    "btnHeight":50,
    "btnFontSize":20,
    "btnNameColor":"#ffffff",
    "btnBgColor1":"#26b9fb",
    "btnBgColor2":"#1b88f8",
    "btnRadius":27
  }