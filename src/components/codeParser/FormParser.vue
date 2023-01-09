<script>
import { deepClone, formValidateNotice } from "@/util/util";
import authorizeMixin from "@/mixins/authorize";//表单权限
import changeFormDataMixin from "./custom/mixin/changeFormFieldData";// 修改json数据以及对应model值
import elasticMixin from "./custom/mixin/elastic"; //联想组件
import renderMixin from "./custom/mixin/render"; // render方法
import formEventMixin from "./custom/mixin/formEvent"; // 表单事件
import hideComponentsMixin from "@/mixins/hideComponents"; // 隐藏组件
export default {
  name: "FormParser",
  mixins: [authorizeMixin, changeFormDataMixin, elasticMixin, renderMixin,formEventMixin,hideComponentsMixin],
  props: {
    conf: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
    },
    formInfos: {
      type: Object,
    },
    isEdit: {
      type: Number,
    },
    F_FormName: {
      type: String,
    },
    F_FormId: {
      type: String,
    },
    fromPage: {
      //来自页面
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      formConf: {},
      slots: [],
      checkboxField: {},
    };
  },
  async created() {
    this.show = false;
    this.formConf = deepClone(this.conf);
    console.log('this.formConf.hideComponents',this.formConf.hideComponents);
    // 隐藏组件
    if(this.formConf.hideComponents){
      let mapList = await this.initHideComponentList(this.formConf.hideComponents);
      this.$store.commit("SET_HIDE_COMPONENT_LIST", mapList);
    }
    this.formConf.triggerEventIds = [];
    this.formConf.triggerEventValue = new Map();
    this.formName=this.F_FormName;
    this.formId = this.F_FormId;
    await this.initEventData();
      this.formConf.formRef = this.formConf.formRef
        ? this.formConf.formRef
        : "refs" + Math.floor(Math.random() * 100 + 1);
      if (this.fromPage == "preview") {
      } else {
        if (!this.formConf.fields) {
          this.$message.error("表单配置异常，请检查数据格式");
          return false;
        }
      }
      this.changeData();
    this.show = true;
  },
  beforeDestroy() {
    this.$store.commit("RESET_FORM_PARSER");
  },
  methods: {
    setAuthorityField(fieldsIndex) {
      // 预览
      if(this.fromPage == "preview"){
        this.formConf.fields[fieldsIndex].__config__.view = true;
        return;
      }
      // 标题 分割线 按钮 显示
      let needReleaseTags = ['h2','el-divider','avue-custom-button'];
      if(needReleaseTags.includes(this.formConf.fields[fieldsIndex].__config__.tag)){
        this.formConf.fields[fieldsIndex].__config__.view = true;
         return;
      }
      //意见簿在非工作流表单中不显示
      if (this.formConf.fields[fieldsIndex].__type__ == "opinion") {
        this.formConf.fields[fieldsIndex].__config__.view = false;
        this.formConf.fields[fieldsIndex].__config__.edit = false;
      }else{
        if(this.formEnCodeList[this.formConf.fields[fieldsIndex].__config__.bindTableField]){
           this.formConf.fields[fieldsIndex].__config__.view = true;
        }else{
          this.formConf.fields[fieldsIndex].__config__.view = false;
        }
      }
     
    },
    setAuthorityTabField(fieldsIndex, tabKey, childrenIndex) {
      // 预览
      if(this.fromPage == "preview"){
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.view = true;
        return;
      }
      //意见簿在非工作流表单中不显示
      if (
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__type__ == "opinion"
      ) {
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.view = false;
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.edit = false;
      }else{
        if(this.formEnCodeList[this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.bindTableField]){
           this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.view = true;
        }else{
          this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][
          childrenIndex
        ].__config__.view = false;
        }
      }
    },
    setAuthorityTableField(fieldsIndex) {
      if (
        this.formConf.fields[fieldsIndex].__config__.children &&
        this.formConf.fields[fieldsIndex].__config__.children.length > 0
      ) {
        let bindTable = this.formConf.fields[fieldsIndex].__config__.bindTable;
          this.formConf.fields[fieldsIndex].__config__.children.map((childrenEle,childrenEleIndex)=>{
             let bindTableField =  childrenEle.__config__.bindTableField;
            if(this.formEnCodeList&&
            this.formEnCodeList[bindTable]&&
            Array.isArray(this.formEnCodeList[bindTable])&&
            this.formEnCodeList[bindTable].includes(bindTableField)){
              this.formConf.fields[fieldsIndex].__config__.children[childrenEleIndex].__config__.view=true;
            }
            this.formConf.fields[fieldsIndex].__config__.children[childrenEleIndex].__config__.edit=childrenEle.disabled?false:true;
          })
      }
    },
    setAuthorityTabTableField(fieldsIndex, tabKey, childrenIndex) {
      if (
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex]&&
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.children &&
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.children.length > 0
      ) {
        let bindTable = this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.bindTable;
        this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.view = true;
         this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.children.map((childrenEle,childrenEleIndex)=>{
             let bindTableField =  childrenEle.__config__.bindTableField;
            if(this.formEnCodeList&&
            this.formEnCodeList[bindTable]&&
            Array.isArray(this.formEnCodeList[bindTable])&&
            this.formEnCodeList[bindTable].includes(bindTableField)){
              this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.children[childrenEleIndex].__config__.view=true;
            }
            this.formConf.fields[fieldsIndex].__config__.childrenObj[tabKey][childrenIndex].__config__.children[childrenEleIndex].__config__.edit=childrenEle.disabled?false:true;
          })
      }
    },
    getInterceptFields(fields) {
      fields.map((item) => {
        if (item?.__config__?.componentName == "avue-tabs") {
          let childrenObj = item?.__config__?.childrenObj || null;
          if (!childrenObj) return;
          for (let key in childrenObj) {
            let children = childrenObj[key];
            children && children.length && this.getInterceptFields(children);
          }
        } else if (item?.__config__?.componentName == "table") {
          let children = item?.__config__?.children;
          children && children.length && this.getInterceptFields(children);
        } else {
          if (item?.__config__?.tag == "el-checkbox-group") {
            this.checkboxField[item?.__config__?.bindTableField] =
              item?.__config__?.bindTableField;
          }
        }
      });
    },
    async submitForm() {
      //父页面提交表单
      let validataArry = [];
      for (const el in this.$refs) {
        if (el.includes("FormTab")) {
          for (const el2 in this.$refs[el].$refs) {
            if (el2.includes("avueTable")) {
              let value = this.$refs[el].$refs[el2].getDynamicDefaultValue();
              if (value && value.length > 0) {
                const promise4 = new Promise((resolve, reject) => {
                  this.$refs[el].$refs[el2].validate((valid) => {
                    resolve(valid);
                  });
                });
                validataArry.push(promise4);
              }
            } else {
              const promise2 = new Promise((resolve, reject) => {
                this.$refs[el].$refs[el2].validate((valid, object) => {
                  formValidateNotice(object, this, this.formEnCodeList);
                  resolve(valid);
                });
              });
              validataArry.push(promise2);
            }
          }
        } else if (el.includes("avueTable")) {
          let value = this.$refs[el].getDynamicDefaultValue();
          if (value && value.length > 0) {
            const promise3 = new Promise((resolve, reject) => {
              this.$refs[el].validate((valid, object) => {
                resolve(valid);
              });
            });
            validataArry.push(promise3);
          }
        } else {
          const promise = new Promise((resolve, reject) => {
            this.$refs[el].validate((valid, object) => {
              formValidateNotice(object, this, this.formEnCodeList);
              resolve(valid);
            });
          });
          validataArry.push(promise);
        }
      }
      let res = await Promise.all(validataArry);
      if (res.includes(false)) {
        return false;
      }
      const newObj = {};
      this.getInterceptFields(this.formConf.fields);

      this.formConf.fields.forEach((el) => {
        if (el.__config__.componentName === "table") {
          if (!newObj[el.__config__.bindTable]) {
            newObj[el.__config__.bindTable] = [];
          }

          let tmp = el.__config__.defaultValue.dynamic;
          let self = this;
          if (tmp && tmp.length > 0) {
            tmp.forEach(function (item) {
              let itemChild = { ...item };
              delete itemChild._index;
              for (let [key, value] of Object.entries(itemChild)) {
                if (key.includes("$")) {
                  delete itemChild[key];
                } else {
                  if (Array.isArray(value)) {
                    itemChild[key] = value.join(",");
                  }
                }
              }
              self.setInterceptVal(itemChild);
              newObj[el.__config__.bindTable].push(itemChild);
            });
          }
        } else {
          if (el?.__config__?.componentName == "avue-tabs") {
            let fieldInfo = this.getFieldsByTab(
              el?.__config__?.childrenObj,
              newObj
            );
            let bindTable = "";
            if (fieldInfo && fieldInfo.length) {
              bindTable = fieldInfo[0].bindTable;
              if (!newObj[bindTable]) {
                newObj[bindTable] = {};
              }
            }
            fieldInfo.map((item) => {
              if (item.defaultValue && Array.isArray(item.defaultValue)) {
                newObj[bindTable][item.bindTableField] =
                  item.defaultValue.join(",");
              } else {
                newObj[bindTable][item.bindTableField] = item.defaultValue;
              }
            });
          } else {
            if (el.__config__.bindTable) {
              if (!newObj[el.__config__.bindTable]) {
                newObj[el.__config__.bindTable] = {};
              }
              if (
                el.__config__.defaultValue &&
                Array.isArray(el.__config__.defaultValue)
              ) {
                newObj[el.__config__.bindTable][el.__config__.bindTableField] =
                  el.__config__.defaultValue.join(",");
              } else {
                if (el.__config__.tag == "el-input-number") {
                  let tempVal = el.__config__.defaultValue;
                  if (el.precision != undefined) {
                    tempVal = Number.parseFloat(
                      el.__config__.defaultValue
                    ).toFixed(el.precision);
                  }
                  newObj[el.__config__.bindTable][
                    el.__config__.bindTableField
                  ] = tempVal;
                } else {
                  newObj[el.__config__.bindTable][
                    el.__config__.bindTableField
                  ] = el.__config__.defaultValue;
                }
              }
            }
          }
        }
      });
      let formParams = {};
      for (const key in newObj) {
        // formParams[key] = JSON.stringify(newObj[key])
        formParams[key] = newObj[key];
      }
      let mainParams = {
        F_FormId: "",
        F_Name:""
      };
      if (this.formInfos?.SchemeInfo) {
        mainParams.F_FormId = this.formInfos.SchemeInfo.F_Id; // 表单ID(后端需要)
        mainParams.F_Name = this.formInfos.SchemeInfo.F_Name; // 表单名
      }
      return Object.assign(mainParams, formParams);
    },
    setInterceptVal(obj) {
      for (let key in obj) {
        //复选框  提交到后端需转成字符串
        if (this.checkboxField.hasOwnProperty(key)) {
          obj[key] = Array.isArray(obj[key]) ? obj[key].join(",") : obj[key];
        }
      }
    },
    getFieldsByTab(childrenObj, newObj) {
      let _arr = [];
      if (!childrenObj || childrenObj instanceof Object) {
        for (let key in childrenObj) {
          let children = childrenObj[key];
          children.map((item) => {
            if (item?.__config__?.componentName == "table") {
              let children = item?.__config__?.children || [];
              let bindTable = "";

              children.map((el) => {
                bindTable = el.__config__.bindTable;
                if (!newObj[el.__config__.bindTable]) {
                  newObj[el.__config__.bindTable] = [];
                }
              });
              let self = this;
              let tmp = item.__config__.defaultValue.dynamic;
              if (tmp && tmp.length > 0) {
                tmp.forEach(function (item) {
                  let itemChild = { ...item };
                  delete itemChild._index;
                  for (let [key, value] of Object.entries(itemChild)) {
                    if (key.includes("$")) {
                      delete itemChild[key];
                    } else {
                      if (Array.isArray(value)) {
                        itemChild[key] = value.join(",");
                      }
                    }
                  }
                  self.setInterceptVal(itemChild);
                  newObj[bindTable].push(itemChild);
                });
              }
            } else {
              if (
                item?.__config__?.bindTable &&
                item?.__config__?.bindTableField
              ) {
                let _obj = {};
                _obj.bindTableField = item?.__config__?.bindTableField;
                _obj.defaultValue = item?.__config__?.defaultValue;
                _obj.bindTable = item?.__config__?.bindTable;
                _obj.tag = item?.__config__?.tag;
                _arr.push(_obj);
              }
            }
          });
        }
      }
      return (() => {
        return _arr;
      })();
    },
  },
};
</script>
<style scoped>
div /deep/ .el-table__body,
div /deep/ .el-table__footer,
div /deep/ .el-table__header {
  width: 100% !important;
}
.el-form-item {
  margin-top: 0;
  margin-bottom: 18px !important;
}
div /deep/ .avue-input-tree {
  display: block;
}
</style>
