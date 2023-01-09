export default [
    {
        title:'基础组件',
        list:[
            {
                type: 'databoard',
                label: '数据面板',
                icon: 'el-icon-price-tag',
                w: 6,
                h: 2,
                minW: 3,
                minH: 2,
                maxW: 12,
                maxH: 2,

                theme:0,
                moduleId:'',
                dataCode:'',
                dataValueKey:'',
            }
            ,{
                type: 'datalist',
                label: '信息列表',
                icon: 'fa fa-list-alt',

                w: 6,
                h: 4,
                minW: 4,
                minH: 2,
                maxW: 12,
                maxH: 12,

                viewForm:'',
                formVerison:'',
                orderId:'',
                limitRow:0,
                maxRows:10,

                columns:[]
            }
        ]
    }
    ,{
        title:'图表组件',
        list:[
            {
                type: 'chartbar',
                label: '柱状图',
                icon: 'el-icon-s-data',
                w: 6,
                h: 6,
                minW: 4,
                minH: 4,
                maxW: 12,
                maxH: 20,

                showBackground:false,
                backgroundColor:'',

                dataCode:'',
                dataType:'Y',
                YKey:'',
                XKey:'',

            }
            ,{
                type: 'chartline',
                label: '折线图',
                icon: 'fa fa-line-chart',
                w: 6,
                h: 6,
                minW: 4,
                minH: 4,
                maxW: 12,
                maxH: 20,

                dataCode:'',
                dataType:'Y',
                YKey:'',
                XKey:'',

            }
            ,{
                type: 'chartpie',
                label: '饼图',
                icon: 'el-icon-pie-chart',
                w: 6,
                h: 6,
                minW: 4,
                minH: 4,
                maxW: 12,
                maxH: 20,

                dataCode:'',
                nameKey:'',
                valueKey:'',

            }
            ,{
                type: 'chartradar',
                label: '雷达图',
                icon: 'fa fa-first-order',
                w: 6,
                h: 6,
                minW: 4,
                minH: 4,
                maxW: 12,
                maxH: 20,

                
            }
            ,{
                type: 'chartgauge',
                label: '仪表盘',
                icon: 'fa fa-tachometer',
                w: 6,
                h: 6,
                minW: 4,
                minH: 4,
                maxW: 12,
                maxH: 20,
            }
            
        ]
    }
    ,{
        title:'系统组件',
        list:[
            {
                type: 'mytask',
                label: '我的任务',
                icon: 'fa fa-tasks',

                w: 6,
                h: 3,
                minW: 6,
                minH: 3,
                maxW: 12,
                maxH: 3,
            }
            ,{
                type: 'mytasklist',
                label: '代办事项',
                icon: 'el-icon-s-order',

                w: 6,
                h: 4,
                minW: 4,
                minH: 2,
                maxW: 12,
                maxH: 12,
            }
            ,{
                type: 'modules',
                label: '常用功能',
                icon: 'el-icon-receiving',

                w: 6,
                h: 3,
                minW: 2,
                minH: 3,
                maxW: 12,
                maxH: 3,

            }
        ]
    }
]