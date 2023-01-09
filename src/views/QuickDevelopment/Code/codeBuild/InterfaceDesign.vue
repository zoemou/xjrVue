<template>
  <div class="design-box">
    <div class="design-header-box">
      <div class="header-nav" v-for="(item,index) in navList" :key="index">
        <div class="nav-title" @click="changeIndex(item.navIndex)">
          <span :class="navIndex == item.navIndex ? 'active-nav' : 'nav'">{{item.title}}</span>
          <span class="active-border" v-if="navIndex == item.navIndex"></span>
        </div>
      </div>
    </div>
    <div class="conent-box">
      <component
        :is="getComponent"
        ref="steps"
        :curStep="active"
        :isNextStep="isNextStep"
        :baseData.sync="baseData"
        :nameOptions="nameOptions"
        :treefieldReOptions="treefieldReOptions"
      />
    </div>
  </div>
</template>

<script>
import QueryConfiguration from "./design/QueryConfiguration.vue";
import ListConfiguration from "./design/ListConfiguration.vue";
import TotalConfiguration from "./design/TotalConfiguration.vue";
export default {
  props: ["baseData", "curStep", "isNextStep",'active'],
  components: {
    QueryConfiguration,
    ListConfiguration,
    TotalConfiguration
  },
  data() {
    return {
      navIndex: 0,
      navList:[
        {title:this.$t("code.codeIndex.stepNameThree"),navIndex:0},
        {title:this.$t("code.codeIndex.stepNameFour"),navIndex:1},
        {title:this.$t("code.codeIndex.stepNameFive"),navIndex:2}
      ],
      doNotGenerateTags: ["xjr-opinion-comonent","h2", "el-divider", "table","avue-custom-button", "tinymce",'el-upload','el-image'],
      nameOptions: [],
      treefieldReOptions: []
    };
  },
  computed: {
    getComponent() {
      if (this.navIndex == 0) {
        return "QueryConfiguration";
      } else if (this.navIndex == 1) {
        return "ListConfiguration";
      } else if (this.navIndex == 2) {
        return "TotalConfiguration";
      }
    }
  },
  created() {
    if (this.isNextStep) {
      this.initQueryConfiguration();
      this.initListConfiguration();
    }
    this.initNameOptions()
    this.initTreefieldReOptions()
  },
  methods: {
    initQueryConfiguration() {
      if (this.baseData.step2.length > 0) {
        let tempArr = [...this.baseData.step2];
        //如果为空
        if (tempArr.length === 0) {
          return;
        }
        this.baseData.step3 = [];//清空配置
        //如果存在avue-tabs 组件 需要收集avue-tabs里的元素
        let tabsElements = [];
        tempArr.map(item => {
          if (item.__config__.componentName == "avue-tabs") {
            let resultArr = this.getTabsElements(item?.__config__?.childrenObj);
            tabsElements.push(...resultArr);
          }
        });

        tempArr = tempArr.filter(item => {
          return item.__config__?.bindTableField;
        });

        tempArr.push(...tabsElements);

        if (this.curStep == 2 && this.baseData.step3.length > 0){
           this.baseData.step3 = this.baseData.step3;
        }
         
        tempArr.forEach(items => {
          // if (
          //   items.__config__.tag &&
          //   !this.doNotGenerateTags.includes(items.__config__.tag)
          //   &&
          //   !(items.__config__.tag==='el-input'&&items['show-password'])
          // ) {
          //   this.nameOptions.push({
          //     label: items.__config__.label,
          //     value: items.__config__.bindTableField
          //   });
          // }
          let obj = this.baseData.step3.find(function(item) {
            return item.field == items.__config__.bindTableField;
          });

          if (!obj) {
            let hasApiFormData = false;
            if(items.__config__.dataType=='dataApi'&&
            items.__config__.apiConfig&&
            items.__config__.apiConfig.apiInputParams&&
            items.__config__.apiConfig.apiInputParams.length>0){
              let apiInputParams = items.__config__.apiConfig.apiInputParams.filter(ele=>{
                return ele.paramType=='formData' &&
                ele.params &&
                typeof ele.params.id =='number'
              });
              if(apiInputParams.length>0){
                hasApiFormData = true;
              }
            }
            if (
              items.__config__.tag &&
              !this.doNotGenerateTags.includes(items.__config__.tag)
               &&!(items.__config__.tag==='el-input'&&items['show-password'])
              && !(items.__config__.tag == "el-time-picker"&&items.__config__.avueType == "timerange")
              && !(items.__config__.tag == "el-date-picker"&&items.__config__.avueType == "daterange")
              && !hasApiFormData
            ) {
              let type = items.__config__.bindTableFieldType;
              if(items.__config__.tag == 'el-time-picker'){//时间选择
                  type='datetime';//后端需要改type 不动前面的数据结构
              }
              let objT = {
                isDate: true,
                searchtype: "data",
                name: items.__config__.label,
                lgmark: items.__config__.F_LgMarkCode,
                DateField: "",
                field: items.__config__.bindTableField,
                table: items.__config__.bindTable,
                type,
                fieldId:
                  "FK_" +
                  items.__config__.bindTableField +
                  items.__config__.bindTable
              };
              this.baseData.step3.push(objT);
            }
          }
        });
      }
    },
    initNameOptions() {
      if (this.baseData.step2.length > 0) {
        let tempArr = [...this.baseData.step2];
        if (tempArr.length === 0) {
          return;
        }
        tempArr.forEach(items => {
          if (
            items.__config__.tag &&
            !this.doNotGenerateTags.includes(items.__config__.tag)
            &&
            !(items.__config__.tag==='el-input'&&items['show-password'])
          ) {
            this.nameOptions.push({
              label: items.__config__.label,
              value: items.__config__.bindTableField
            });
          }
        })
      }
    },
    initListConfiguration() {
      let listConfigData = [];
      let btns = [];
      if (this.baseData.step2.length > 0) {
        let tempArr = [...this.baseData.step2];
          if(this.baseData.step4&&Array.isArray(this.baseData.step4.btns)&&this.baseData.step4.btns.length>0){
            btns = this.baseData.step4.btns;
          }
        tempArr.forEach((items, j) => {
          if (items.__config__.bindTableField) {
            // if (
            //   items.__config__.tag &&
            //   !this.doNotGenerateTags.includes(items.__config__.tag) &&
            //   !(items.__config__.tag==='el-input'&&items['show-password'])
            // ) {
            //   this.treefieldReOptions.push({
            //     label: items.__config__.label,
            //     value: items.__config__.bindTableField,
            //     table: items.__config__.bindTable,
            //     colType: items.__config__.bindTableFieldType,
            //     FKid:
            //       "FK_" +
            //       items.__config__.bindTableField +
            //       items.__config__.bindTable
            //   });
            // }
            let obj = {
              fieldName: items.__config__.label,
              align: "center",
              width: "",
              FKid:
                "FK_" +
                items.__config__.bindTableField +
                items.__config__.bindTable,
              bindColumn: items.__config__.bindTableField,
              bindTable: items.__config__.bindTable,
              colType: items.__config__.bindTableFieldType
            };
            if (
              !listConfigData.find((item, i) => {
                return item.FKid === obj.FKid;
              })
            ) {
              if (
                items.__config__.tag &&
                !this.doNotGenerateTags.includes(items.__config__.tag)&&
                !(items.__config__.tag==='el-input'&&items['show-password'])
              ) {
                listConfigData.push(obj);
              }
            }
          }
          //收集 avue-tabs 字段信息
          if (items.__config__.componentName == "avue-tabs") {
            let resultArr = this.getTabsInfo(items?.__config__?.childrenObj);

            resultArr.map((field, idx) => {
              // if (
              //   field.__config__.tag &&
              //   !this.doNotGenerateTags.includes(field.__config__.tag)&&
              //   !(field.__config__.tag==='el-input'&&field['show-password'])
              // ) {
              //   this.treefieldReOptions.push({
              //     label: field.__config__.label,
              //     value: field.__config__.bindTableField,
              //     table: field.__config__.bindTable,
              //     colType: field.__config__.bindTableFieldType,
              //     FKid:
              //       "FK_" +
              //       field.__config__.bindTableField +
              //       field.__config__.bindTable
              //   });
              // }
              let newObj = {
                fieldName: field.__config__.label,
                align: "center",
                width: "",
                FKid:
                  "FK_" +
                  field.__config__.bindTableField +
                  field.__config__.bindTable,
                bindColumn: field.__config__.bindTableField,
                bindTable: field.__config__.bindTable,
                colType: field.__config__.bindTableFieldType
              };
              if (
                !listConfigData.find((el, i) => {
                  return el.FKid === newObj.FKid;
                })
              ) {
                if (
                  field.__config__.tag &&
                  !this.doNotGenerateTags.includes(field.__config__.tag) &&
                  !(field.__config__.tag==='el-input'&&field['show-password'])
                ) {
                  listConfigData.push(newObj);
                }
              }
            });
          }
        });
      }
    
      let obj = {
          ExpData: {
            bindBtn: "",
            f_column: ""
          },
          btns:[],
          fields: listConfigData,
          sort: {
            useDefaultSort: true,
            sortField: "",
            order:"desc"
          },
          impData: {},
          isPage: "1",
          isTree: 0,
          pageSize: 20,
          treeform: {
            treeSource: 1,
            treeSourceId: "",
            treefieldId: "",
            treeParentId: "",
            treefieldShow: "",
            treefieldRe: "",
            treeTitleName: "",
            treeParentIcon: "",
            treeChildIcon: ""
          }
        };
      let defaultBtns = [
            {
              name: this.$t("code.codeStepFour.refreshBtn"),
              val: "refresh",
              icon: "el-icon-refresh-right",
              checked: true
            },
            {
              name: this.$t("code.codeStepFour.addhBtn"),
              val: "add",
              icon: "el-icon-plus",
              checked: true
            },
            { 
              name:this.$t('crud.viewBtn'), 
              val: 'view', 
              icon: 'el-icon-view', 
              checked: true 
            },
            {
              name: this.$t("code.codeStepFour.editBtn"),
              val: "modify",
              icon: "el-icon-edit",
              checked: true
            },
            {
              name: this.$t("code.codeStepFour.deleteBtn"),
              val: "delete",
              icon: "el-icon-delete",
              checked: true
            },
            {
              name: this.$t("code.codeStepFour.allDeleteBtn"),
              val: "batchDelete",
              icon: "el-icon-delete",
              checked: true
            },
            {
              name: this.$t("code.codeStepFour.printBtn"),
              val: "print",
              icon: "el-icon-printer",
              checked: true
            },
            {
              name: this.$t("code.codeStepFour.importBtn"),
              val: "import",
              icon: "fa fa-sign-in",
              checked: false
            },
            {
              name: this.$t("code.codeStepFour.exportBtn"),
              val: "export",
              icon: "fa fa-sign-out",
              checked: false
            },
            {
              name: this.$t("code.codeStepFour.createFlowBtn"),
              val: "createDesignFlow",
              icon: "fa",
              checked: false
            },
            {
              name: this.$t("code.codeStepFour.createApprovalBtn"),
              val: "createFormFlow",
              icon: "fa",
              checked: false
            }
          ];
      obj.btns = btns.length>0?btns:defaultBtns;
      this.baseData.step4 = obj;
    }, 
    initTreefieldReOptions() { 
      if (this.baseData.step2.length > 0) {
        let tempArr = [...this.baseData.step2];
        tempArr.forEach((items, j) => {
          if (items.__config__.bindTableField) {
            if (
              items.__config__.tag &&
              !this.doNotGenerateTags.includes(items.__config__.tag) &&
              !(items.__config__.tag==='el-input'&&items['show-password'])
            ) {
              this.treefieldReOptions.push({
                label: items.__config__.label,
                value: items.__config__.bindTableField,
                table: items.__config__.bindTable,
                colType: items.__config__.bindTableFieldType,
                FKid:
                  "FK_" +
                  items.__config__.bindTableField +
                  items.__config__.bindTable
              });
            }
          }
          if (items.__config__.componentName == "avue-tabs") { 
            let resultArr = this.getTabsInfo(items?.__config__?.childrenObj);
            resultArr.map((field, idx) => {
              if (
                    field.__config__.tag &&
                    !this.doNotGenerateTags.includes(field.__config__.tag)&&
                    !(field.__config__.tag==='el-input'&&field['show-password'])
                  ) {
                    this.treefieldReOptions.push({
                      label: field.__config__.label,
                      value: field.__config__.bindTableField,
                      table: field.__config__.bindTable,
                      colType: field.__config__.bindTableFieldType,
                      FKid:
                        "FK_" +
                        field.__config__.bindTableField +
                        field.__config__.bindTable
                    });
                  }
            })
          }
        })
      }


    },
    initTotalConfiguration() { },
    getTabsInfo(childrenObj) {
      let dataChildren = [];

      if (childrenObj && childrenObj instanceof Object) {
        for (let key in childrenObj) {
          let children = childrenObj[key];
          children.map(item => {
            if (item?.__config__?.componentName == "table") {
            } else {
              dataChildren.push(item);
            }
          });
        }
      }
      return (() => {
        return dataChildren;
      })();
    },
    getTabsElements(childrenObj) {
      let dataChildren = [];

      if (childrenObj && childrenObj instanceof Object) {
        for (var key in childrenObj) {
          let children = childrenObj[key];
          children.map(element => {
            if (!this.doNotGenerateTags.includes(element.__config__.tag)&&
              !(element.__config__.tag==='el-input'&&element['show-password'])) {
              if (element?.__config__?.componentName == "table") {
                //兼容 avue-tabs里有avue-tabs的情况
                //this.getTabsElements(element?.__config__?.childrenObj);
              } else {
                dataChildren.push(element);
              }
            }
          });
        }
      }

      return (() => {
        return dataChildren;
      })();
    },
    changeIndex(newIndex) {
      this.navIndex = newIndex;
    },
  }
};
</script>

<style lang="scss" scoped>
.design-box {
  height: 100%;
  .design-header-box {
    display: flex;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    align-items: center;
    height: 40px;
    border-bottom: 2px solid #ebeef5;
  }
  .header-nav {
    flex-basis: 33%;
    display: flex;
    justify-content: center;
    .nav-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 30px;
      justify-content: space-between;
      margin-top: 12px;
    }
  }
}
.active-nav {
  font-size: 14px;
  font-weight: 400;
  color: #429fff;
}
.nav {
  font-size: 14px;
  font-weight: 400;
}
.active-border {
  background-color: #429fff;
  height: 2px;
  width: 180px;
}
.conent-box{
  height: 100%;
}
</style>
