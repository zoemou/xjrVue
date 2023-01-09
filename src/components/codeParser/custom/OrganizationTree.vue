<script>
import { getAllCompanies,getLowerCompanies } from "@/api/organization/company";
import { getCompanyDepartments } from "@/api/organization/department";
import { updateDefaultVal } from '../util.js'
import formParserMixin from './mixin/formParser';
export default {
  mixins:[formParserMixin],
  props: {
    fieldsIndex: {
      type: Number,
      required: true,
    },
    formConf: {
      type: Object,
      required: true,
    },
    curFormId: {
      type: Number
    },
    tabChildren: {
      type: Array
    },
    // 1 新增 2 查看 3 编辑
    isEdit: {
      type: Number,
      default:1
    }
  },
  data() {
    return {
      value: "",
      dic: [],
      checkStrictly: true,
      multiple: false,
      refsName: "",
      validateErrorTemplate: null,
      confFields: []
    };
  },
  created() {
    if(this.tabChildren && this.tabChildren.length){
      this.confFields = this.tabChildren;
    }else{
      this.confFields = this.formConf.fields;
    }
    this.value = this.confFields[this.fieldsIndex].__config__.defaultValue;
    this.refsName = "AvueInputTree" + this.fieldsIndex;
    let tagIcon = this.confFields[this.fieldsIndex].__config__.tagIcon;
    if (tagIcon == "company") {
      this.getCompanyDic();
    } else if (tagIcon == "department") {
      this.getDepartmentDic();
    }
    //this.getValidate();
    //是否为查看
    if(this.isEdit==2){
      this.confFields[this.fieldsIndex].disabled = true;
    }
    this.setValue();
  },
  methods: {
    handleChange(){
      this.setValue();
      this.handleTriggerEvent('change');
    },
    getValidate() {
      this.validateErrorTemplate = null;
      if (this.confFields[this.fieldsIndex].__config__.required) {
        if (this.confFields[this.fieldsIndex].__config__.defaultValue) {
          this.validateErrorTemplate = null;
        } else {
          this.validateErrorTemplate = (
            <span class="el-form-item__error">{`${
              this.confFields[this.fieldsIndex].__config__.label
            }不能为空`}</span>
          );
        }
      }
    },
    getCompanyDic() {
      getAllCompanies().then((res) => {
        if (res.data.success) {
          this.dic = this.formateDicData(
            res.data.data,
            "F_FullName",
            "F_CompanyId"
          );
        }
      }); 
    },
    async treeLoad(node,resolve) {
      //修改
      const id = node.data.F_CompanyId || '0'
      getLowerCompanies(id).then(res => {
        if (res.data.success) {
          if (node.data.F_CompanyId) {
            resolve(res.data.data)
          } else {
            this.companies = res.data.data;
          }
        }
     })     
    },
    getDepartmentDic() {
      getCompanyDepartments().then((res) => {
        if (res.data.success) {
          this.dic = this.formateDicData(
            res.data.data,
            "F_FullName",
            "F_DepartmentId"
          );
        }
      });
    },
    formateDicData(data, labelKey, valueKey) {
      if (data.length <= 0) {
        return false;
      }
      let dicData = [];
      data.forEach((ele) => {
        let children = [];
        if (ele.children.length > 0) {
          children = this.formateDicData(ele.children, labelKey, valueKey);
        }
        dicData.push({
          label: ele[labelKey],
          value: ele[valueKey],
          disabled: ele[valueKey] ? false : true,
          children: children,
        });
      });
      return dicData;
    },
  },
  mounted(){
    this.$event.$on('updateFormConf',obj=>{
      if(obj?.fields){
        this.confFields[
              this.fieldsIndex
            ].__config__.defaultValue = updateDefaultVal(this.confFields[this.fieldsIndex].__config__.formId,obj.fields);
      } 
    });
  },
  render: function (h) {
    return (
      <div>
        <avue-input-tree
          ref={this.refsName}
          check-strictly={this.checkStrictly}
          multiple={this.multiple}
          disabled={this.confFields[this.fieldsIndex].disabled}
          type="tree"
          v-model={this.value}
          dic={this.dic}
          tree-load="treeLoad"
          placeholder={this.confFields[this.fieldsIndex].placeholder}
          style={this.confFields[this.fieldsIndex].style}
          on-change={(value) => {
            this.confFields[
              this.fieldsIndex
            ].__config__.defaultValue = value;
            this.getValidate();
            this.handleChange();
          }}
        ></avue-input-tree>
        {this.validateErrorTemplate}
      </div>
    );
  },
};
</script>
