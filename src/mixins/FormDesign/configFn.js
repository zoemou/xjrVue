export const FormDesignMixin = {
  data () {
    return {};
  },
  created () {

  },
  methods: {
    /*
    短文本组件 varchar 长度默认值500：
    单行文本、密码、编码、联想下拉、联想弹层、下拉选择、单选框组、时间选择、时间范围、日期范围、颜色选择、信息体、公司、部门
  、上传、图片

    长文本组件 longText 长度无默认值：
      编辑器，多行文本、多选弹层、级联选择、多选框、行政区域、人员组件

    整数组件 int 长度无默认值：
      开关、评分

    小数组件 double 长度无默认值：
      计数器、滑块、货币组件、货币单位、货币大写、计算组件、税率组件

    时间日期组件 datetime 长度无默认值：
      日期选择
    */
      fieldConfig(item) {
        const { __config__, __vModel__ } = item;
        let defaultFieldLength = __config__.fieldLength;
        let defaultBindTableFieldType = __config__.bindTableFieldType;
        if(__config__.tagIcon=='date'){
           __config__.bindTableFieldType = "datetime";
        }else if(__config__.tagIcon=='switch'||__config__.tagIcon=='rate'){
          __config__.bindTableFieldType = "int";
        }else if(__config__.tagIcon=='number'||__config__.tagIcon=='slider'||__config__.isFinance==true){
          __config__.bindTableFieldType = "double";
          
        }else if(
          __config__.tagIcon=='rich-text'||
          __config__.tagIcon=='textarea'||
          __config__.tagIcon=='cascader'||
          __config__.tagIcon=='checkbox'||
          __config__.tagIcon=='personnel'||
          (__config__.tagIcon=='input'&&__config__.avueType=='mutiple-popup')
          ){
          __config__.bindTableFieldType = "longText";
        }
        let dataType = defaultBindTableFieldType||__config__.bindTableFieldType || "varchar";
        let fieldLength = dataType == "varchar"?(defaultFieldLength||500):null
        return {
          fieldName: __vModel__ || "",
          dataType ,
          describe: __config__.label || "",
          formId: __config__.formId,
          fieldLength ,
          componentName: __config__.componentName || "",
          $cellEdit: true,
        };
      },
  }
};

