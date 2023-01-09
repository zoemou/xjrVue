import i18n from "@/lang";
export const leftTreeColumn = [
    {
        id: 'ToDoTasks',
        label: i18n.t('workFlow.processTasks.todoTasks'),
        contentTitle: '待办任务列表',
        column: [
            {
                label: i18n.t('workFlow.WFChange.tabSerialNum'),
                prop: 'serialNumber', sortable: true
            },
            {
                label: i18n.t('curApprNode'),
                prop: 'taskName', sortable: true //'',
            },
            {
                label: i18n.t('workFlow.processTasks.taskName'),
                prop: 'schemeName', sortable: true//'',
            }, {
                label: i18n.t('currentProgress'),
                prop: 'currentProgress', sortable: true, slot: true, align: 'center'
            },
            //      {
            //          label:i18n.t('workFlow.WFChange.tabGrade'),
            //          prop: 'priority',
            // width:'80',sortable:true,
            //          formatter: function (row,value,label,column) {
            //              if (value >= 0 && value <= 19) {
            //                  return i18n.t('workFlow.WFChange.lowestLevel');
            //              } else if (value >= 20 && value <= 39) {
            //                  return i18n.t('workFlow.WFChange.low');
            //              } else if (value >= 40 && value <= 59) {
            //                  return i18n.t('workFlow.WFChange.generally');
            //              } else if (value >= 60 && value <= 79) {
            //                  return i18n.t('workFlow.WFChange.highLevel');
            //              }
            //          }
            //      },
            {
                label: i18n.t('workFlow.WFChange.tabStartUser'),
                prop: 'startUser',
                width: '100', sortable: true
            },
            {
                label: i18n.t('workFlow.WFChange.tabTime'),
                prop: 'createTime',
                width: '140', sortable: true
            }
        ],
        menuLeft: [
            {
                title: i18n.t('workFlow.WFChange.refreshBtn'),
                icon: 'fa fa-refresh',
                type: 'primary',
                eventName: "searchMenu"
            },
            {
                title: i18n.t('workFlow.processTasks.titleAudit'),
                // icon:'fa fa-legal',
                type: 'default',
                eventName: 'approval'
            },
            {
                title: i18n.t('workFlow.WFChange.viewBtn'),
                // icon:'fa fa-eye',
                type: 'default',
                eventName: "eyeHistory"
            }
        ]
    },
    {
        id: 'LaunchTask',
        label: i18n.t('workFlow.processTasks.initiateTask'),
        contentTitle: '流程模板列表'
    },
    {
        id: 'CompletedTask',
        label: i18n.t('workFlow.processTasks.completedTask'),
        contentTitle: '已办任务列表',
        column: [
            {
                label: i18n.t('workFlow.WFChange.tabSerialNum'),
                prop: 'serialNumber', sortable: true //'',
            },
            {
                label: i18n.t('approvedNode'),
                prop: 'taskName', sortable: true //'F_Name', //'',
            },
            {
                label: i18n.t('workFlow.processTasks.taskName'),
                prop: 'schemeName', sortable: true//'',

            }, {
                label: i18n.t('currentProgress'),
                prop: 'currentProgress', sortable: true, slot: true, align: 'center'
                // formatter: function (row, value, label, column) {
                //     return value != undefined && value != null ? value + '%' : '';
                // }
            },
            //      {
            //          label:i18n.t('workFlow.WFChange.tabGrade'),
            //          prop: 'priority',
            // width:'80',sortable:true,
            //          formatter: function (row,value,label,column) {
            //              if (value >= 0 && value <= 19) {
            //                  return i18n.t('workFlow.WFChange.lowestLevel');
            //              } else if (value >= 20 && value <= 39) {
            //                  return i18n.t('workFlow.WFChange.low');
            //              } else if (value >= 40 && value <= 59) {
            //                  return i18n.t('workFlow.WFChange.generally');
            //              } else if (value >= 60 && value <= 79) {
            //                  return i18n.t('workFlow.WFChange.highLevel');
            //              }
            //          }
            //      },
            {
                label: i18n.t('workFlow.WFChange.tabStartUser'),
                prop: 'startUser',
                width: '100', sortable: true
            },
            {
                label: i18n.t('workFlow.WFChange.tabTime'),
                prop: 'createTime',
                width: '140', sortable: true
            }
        ],
        menuLeft: [
            {
                title: i18n.t('workFlow.WFChange.refreshBtn'),
                icon: 'fa fa-refresh',
                type: 'primary',
                eventName: "searchMenu"
            },
            {
                title: i18n.t('retract'),
                // icon:'fa fa-mail-reply',
                type: 'default',
                eventName: "retractProcess"
            },
            {
                title: i18n.t('workFlow.WFChange.viewBtn'),
                // icon:'fa fa-eye',
                type: 'default',
                eventName: "eyeHistory"
            },
            //   {
            //       title:'撤回至上个节点',
            //       icon:'fa fa-mail-reply',
            //       type:'default',
            //       eventName:"recallProcessUp"
            //   }
        ]
    },
    {
        id: 'MyProcess',
        label: i18n.t('workFlow.processTasks.myProcess'),
        contentTitle: '我的流程列表',
        column: [
            {
                label: i18n.t('workFlow.WFChange.tabSerialNum'),
                prop: 'serialNumber', sortable: true
            },
            {
                label: i18n.t('curApprNode'),
                prop: 'taskName', sortable: true//'',
            },
            {
                label: i18n.t('workFlow.processTasks.taskName'),
                prop: 'schemeName', sortable: true
            }, {
                label: i18n.t('currentProgress'),
                prop: 'currentProgress', sortable: true, slot: true, align: 'center'
            },
            //      {
            //          label: i18n.t('workFlow.WFChange.tabGrade'),
            //          prop: 'priority',
            // width:'80',sortable:true,
            //          formatter: function (row,value,label,column) {
            //              if (value >= 0 && value <= 19) {
            //                  return i18n.t('workFlow.WFChange.lowestLevel');
            //              } else if (value >= 20 && value <= 39) {
            //                  return i18n.t('workFlow.WFChange.low');
            //              } else if (value >= 40 && value <= 59) {
            //                  return i18n.t('workFlow.WFChange.generally');
            //              } else if (value >= 60 && value <= 79) {
            //                  return i18n.t('workFlow.WFChange.highLevel');
            //              }
            //          }
            //      },
            {
                label: i18n.t('workFlow.WFChange.tabStartUser'),
                prop: 'startUser',
                width: '100', sortable: true
            },
            {
                label: i18n.t('workFlow.WFChange.tabTime'),
                prop: 'createTime',
                width: '140', sortable: true
            },
            //   {
            //       label: '撤回',
            //       prop: 'isRecall',
            //       formatter: function (row,value,label,column) {
            //           if (value ==1) {
            //               return '已撤回';
            //           } else if (value == 0 ) {
            //               return '';
            //           }
            //       }
            //   }
        ],
        menu: [
            {
                title: i18n.t('workFlow.WFChange.moveTrashBtn'),
                type: 'opr-primary',
                // icon:'fa fa-recycle',
                eventName: "recycled"
            }
        ],
        menuLeft: [
            {
                title: i18n.t('workFlow.WFChange.refreshBtn'),
                icon: 'fa fa-refresh',
                type: 'primary',
                eventName: "searchMenu"
            },
            {
                title: i18n.t('retract'),
                // icon:'fa fa-mail-reply',
                type: 'default',
                eventName: "retractProcess"
            },
            {
                title: i18n.t('workFlow.WFChange.viewBtn'),
                // icon:'fa fa-eye',
                type: 'default',
                eventName: "eyeHistory"
            },
            //   {
            //       title:'撤回至开始节点',
            //       icon:'fa fa-mail-reply-all',
            //       type:'default',
            //       eventName:"recallProcessAll"
            //   },
            {
                title: i18n.t('workFlow.processTasks.reInitiate'),
                // icon:'fa fa-level-up',
                type: 'default',
                eventName: "reLaunch"
            }
        ]
    },
    {
        id: 'MyForwarder',
        label: i18n.t('workFlow.processTasks.myForwarder'),
        contentTitle: '我的传阅列表',
        column: [
            {
                label: i18n.t('workFlow.WFChange.tabSerialNum'),
                prop: 'serialNumber', sortable: true
            },
            {
                label: i18n.t('nodeViewed'),
                prop: 'taskName', sortable: true
            },
            {
                label: i18n.t('workFlow.processTasks.taskName'),
                prop: 'schemeName', sortable: true
            }, {
                label: i18n.t('currentProgress'),
                prop: 'currentProgress', sortable: true, slot: true, align: 'center'
            },
            //      {
            //          label: i18n.t('workFlow.WFChange.tabGrade'),
            //          prop: 'priority',
            // width:'80',sortable:true,
            //          formatter: function (row,value,label,column) {
            //              if (value >= 0 && value <= 19) {
            //                  return i18n.t('workFlow.WFChange.lowestLevel');
            //              } else if (value >= 20 && value <= 39) {
            //                  return i18n.t('workFlow.WFChange.low');
            //              } else if (value >= 40 && value <= 59) {
            //                  return i18n.t('workFlow.WFChange.generally');
            //              } else if (value >= 60 && value <= 79) {
            //                  return i18n.t('workFlow.WFChange.highLevel');
            //              }
            //          }
            //      },
            {
                label: i18n.t('workFlow.WFChange.tabStartUser'),
                prop: 'startUser',
                width: '100', sortable: true
            },
            {
                label: i18n.t('workFlow.WFChange.tabTime'),
                prop: 'createTime',
                width: '140', sortable: true
            },
            {
                label: i18n.t('workFlow.processTasks.whetherRead'),
                prop: 'readState',
                width: '100', sortable: true,
                formatter: function (row, value, label, column) {
                    if (value == 1) {
                        return i18n.t('workFlow.WFChange.read');
                    } else {
                        return i18n.t('workFlow.WFChange.unread');
                    }
                }
            },
            {
                label: i18n.t('workFlow.WFDesign.tabFlowState'),
                prop: 'endTime',
                width: '100', sortable: true,
                formatter: function (row, value, label, column) {
                    if (value) {
                        return i18n.t('workFlow.WFChange.approved');
                    } else {
                        return i18n.t('workFlow.WFChange.approval');
                    }
                }
            },

        ],
        menuLeft: [
            {
                title: i18n.t('workFlow.WFChange.refreshBtn'),
                icon: 'fa fa-refresh',
                type: 'primary',
                eventName: "searchMenu"
            },
            {
                title: i18n.t('workFlow.WFChange.viewBtn'),
                // icon:'fa fa-eye',
                type: 'default',
                eventName: "eyeHistory"
            }
        ]
    },
    {
        id: 'Drafts',
        label: i18n.t('workFlow.processTasks.drafts'),
        contentTitle: '草稿箱列表',
        column: [
            // {
            //     label: '流水号',
            //     prop: 'serialNumber'
            // },
            {
                label: i18n.t('workFlow.WFChange.tabTitle'),
                prop: 'schemeinfoName', sortable: true
            },
            {
                label: i18n.t('workFlow.WFChange.tabStartUser'),
                prop: 'modifyUserName', sortable: true
            },
            {
                label: i18n.t('workFlow.WFChange.tabTime'),
                prop: 'modifyDate',
                width: '140', sortable: true
            }

        ],
        menu: [
            {
                title: i18n.t('tableOperationModule.editorBtn'),
                type: 'opr-primary',
                // icon:'el-icon-edit',
                eventName: "edit"
            },
            {
                title: i18n.t('tableOperationModule.deleteBtn'),
                type: 'opr-danger',
                // icon:'fa fa-trash',
                eventName: "delete"
            }
        ],
        menuLeft: [
            {
                title: i18n.t('workFlow.WFChange.refreshBtn'),
                icon: 'fa fa-refresh',
                type: 'primary',
                eventName: "searchMenu"
            }
        ]
    },
    {
        id: 'RecycleProcess',
        label: i18n.t('workFlow.processTasks.recycleProcess'),
        contentTitle: '回收站列表',
        column: [
            {
                label: i18n.t('workFlow.WFChange.tabSerialNum'),
                prop: 'serialNumber', sortable: true
            },
            {
                label: i18n.t('finalApprovalNode'),
                prop: 'taskName', sortable: true
            },
            {
                label: i18n.t('workFlow.processTasks.taskName'),
                prop: 'schemeName', sortable: true
            },
            //      {
            //          label: i18n.t('workFlow.WFChange.tabGrade'),
            //          prop: 'priority',
            // width:'80',sortable:true,
            //          formatter: function (row,value,label,column) {
            //              if (value >= 0 && value <= 19) {
            //                  return i18n.t('workFlow.WFChange.lowestLevel');
            //              } else if (value >= 20 && value <= 39) {
            //                  return i18n.t('workFlow.WFChange.low');
            //              } else if (value >= 40 && value <= 59) {
            //                  return i18n.t('workFlow.WFChange.generally');
            //              } else if (value >= 60 && value <= 79) {
            //                  return i18n.t('workFlow.WFChange.highLevel');
            //              }
            //          }
            //      },
            {
                label: i18n.t('workFlow.WFChange.tabStartUser'),
                prop: 'startUser',
                width: '100', sortable: true
            },
            {
                label: i18n.t('workFlow.WFChange.tabTime'),
                prop: 'createTime',
                width: '140', sortable: true
            }

        ],
        menu: [
            {
                title: i18n.t('tableOperationModule.deleteBtn'),
                type: 'opr-danger',
                // icon:'fa fa-trash',
                eventName: "delete"
            }
        ],
        menuLeft: [
            {
                title: i18n.t('workFlow.WFChange.refreshBtn'),
                icon: 'fa fa-refresh',
                type: 'primary',
                eventName: "searchMenu"
            },
            {
                title: i18n.t('workFlow.WFChange.viewBtn'),
                // icon:'fa fa-eye',
                type: 'default',
                eventName: "eyeHistory"
            },
            {
                title: i18n.t('workFlow.processTasks.reInitiate'),
                // icon:'fa fa-level-up',
                type: 'default',
                eventName: "reLaunch"
            }
        ]
    }

];

export const AvueCrud = {
    data: [],
    order: {
        order: "desc",
        prop: "",
    },
    option: {
        selection: false,
        tip: false,
        header: false,
        page: false,
        highlightCurrentRow: true,
        stripe: false,
        menu: false,
        menuWidth: 150,
        border: false,
        index: true,
        indexLabel: i18n.t('tableOperationModule.tabNum'),
        align: "left",
        menuAlign: "center",
        addBtn: false,
        addTitle: i18n.t('buttonModule.addBtn'),
        delBtn: false,
        editBtn: false,
        columnBtn: false,
        refreshBtn: false,
        column: [],
    },
    menu: [],
    menuLeft: [],
    currentRow: null,
}