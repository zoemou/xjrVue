<script>
import { deepClone } from '@/utils/index'
import { ComponentConfigList, Components } from './custom/config.js'
const ComponentList = ComponentConfigList

export default {
  name: 'Parser',
  components: Components,
  props: {
    conf: {
      type: Object,
      required: true
    },
    formData: {
      type: Object
    },
    formInfos: {
      type: Object
    }
  },
  data() {
    return {
      formConf: {},
      isEdit:2//查看
    }
  },
  created() {
    this.formConf = deepClone(this.conf)
    if (!this.formConf.fields) {
      this.$message.error('表单配置异常，请检查数据格式')
      return false
    }
    this.changeData()
  },
   render(h) {
    return (
      <el-row gutter={this.formConf.gutter}>
        <el-form
          size={this.formConf.size}
          label-position={this.formConf.labelPosition}
          disabled={this.formConf.disabled}
          label-width={`${this.formConf.labelWidth}px`}
        >
          {this.renderForm(h)}
        </el-form>
      </el-row>
    )
  },
  methods: {
    changeData() {
      const self = this
      this.formConf.fields.forEach((cur, fieldsIndex) => {
        const config = cur.__config__

        if (config.componentName && config.componentName === 'table'){
           this.formConf.fields[fieldsIndex].__config__.defaultValue = {
                dynamic: [],
              };
        }

        if (config.tag === 'el-upload') {//上传控件默认文件上传字段
        this.formConf.fields[fieldsIndex].__config__.defaultValue = "";
        }

         //数据回显
        if (this.formData&&JSON.stringify(this.formData) !== '{}') {
          if (
            this.formData[cur.__config__.bindTable]&&config.componentName && config.componentName === "table"
          ) {
              this.formConf.fields[fieldsIndex].__config__.defaultValue = {
                dynamic: this.formData[cur.__config__.bindTable],
              };
          }
          if (
            this.formData[cur.__config__.bindTable][
              cur.__config__.bindTableField
            ]
          ) {
            this.formConf.fields[
              fieldsIndex
            ].__config__.defaultValue = this.formData[cur.__config__.bindTable][
              cur.__config__.bindTableField
            ];
            if (
              this.formConf.fields[fieldsIndex].__config__.tag ===
                "el-checkbox-group" ||
              this.formConf.fields[fieldsIndex].__config__.tag ===
                "el-date-picker" ||
              this.formConf.fields[fieldsIndex].__config__.tag ===
                "el-time-picker"||
			  this.formConf.fields[fieldsIndex].__config__.tag ===
				"xjr-cascader"
            ) {
              let configVal = this.formData[cur.__config__.bindTable][
                cur.__config__.bindTableField
              ].split(",");
              if (configVal.length > 1) {
                this.formConf.fields[
                  fieldsIndex
                ].__config__.defaultValue = configVal;
              } else {
                this.formConf.fields[
                  fieldsIndex
                ].__config__.defaultValue = this.formData[
                  cur.__config__.bindTable
                ][cur.__config__.bindTableField];
              }
            }
          }
        }
        if (cur.__info__ === true && cur.__type__ === 'info') {//信息体 赋值
          this.formConf.fields[fieldsIndex].__config__.tag = 'info';
        }
      })
    },
    renderForm(createElement) {
      return this.formConf.fields.map((scheme, index) => {
        const config = scheme.__config__
        if(config.layout === 'colFormItem'){
           return this.renderColFormItem(createElement, config.layout, scheme, index)
        }else if(config.layout === 'rowFormItem'){
           return this.renderRowFormItem(createElement, config.layout, scheme, index)
        } else {
          return ''
        }
      })
    },
    renderColFormItem(createElement, item, scheme, fieldsIndex){
      const config = scheme.__config__
        let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
        if (config.showLabel === false) {
          labelWidth = '0'
        }
        let renderTag = ComponentList[config.tag]?ComponentList[config.tag].renderTag:'ElComponent';
        const vnodes = createElement(renderTag, {props: { fieldsIndex, formConf: this.formConf,isEdit: this.isEdit }});
        return (
          <el-col span={config.span}>
            <el-form-item
              label-width={labelWidth}
              prop={config.bindTableField}
              label={config.showLabel ? config.label : ''}
            >
              {vnodes}
            </el-form-item>
          </el-col>
        )
    },
    renderRowFormItem(createElement, item, scheme, fieldsIndex){
       let child = this.renderChildren(createElement,scheme,fieldsIndex)
       let slots = child;
        if(scheme.__config__.componentName && scheme.__config__.componentName === 'table'){
          return child
        } else if (scheme.type === 'flex') { // 如果是表格类型
          slots = this.renderFlexRow(scheme,child);
        }
        return (
          <el-col span={scheme.span}>
            <el-row gutter={scheme.gutter}>{slots}</el-row>
          </el-col>
        )
    },

    renderChildren(createElement,scheme,fieldsIndex) {
      const config = scheme.__config__
      if (config.componentName && config.componentName === 'table') {
        return this.renderTable(createElement,config,fieldsIndex);
      }
      if (!Array.isArray(config.children)){
         return null
      }
      return this.renderForm(config.children)
    },
    renderTable(createElement,config,fieldsIndex){
      return createElement('CustomeTable', {props: { fieldsIndex, formConf: this.formConf,isEdit: this.isEdit }});
    },
    renderFlexRow(scheme,child){
      return (
            <el-row
              type={scheme.type}
              justify={scheme.justify}
              align={scheme.align}
            >
              {child}
            </el-row>
          );
    },
    buildTableOption(config) {
      if (!config) return {}
      const tableOption = {
        submitBtn: false,
        emptyBtn: false,
        arrow: true,
        collapse: true,
        labelWidth: 0,
        column: [
          {
            label: name,
            prop: config.bindTable,
            type: 'dynamic',
            span: '24',
            children: {
              align: 'center',
              headerAlign: 'center',
              rowAdd: (done) => {
                done()
              },
              rowDel: (row, done) => {
                done()
              },
              column: []
            }
          }
        ]
      }
      config.children.forEach((element) => {
           tableOption.column[0].children.column.push({
              label: element.__config__.label,
              type: element.__config__.avueType,
              prop: element.__config__.bindTableField
            })
      })
      return tableOption
    },
  },


}
</script>
<style scoped>
 div /deep/ .el-table__body,  div /deep/ .el-table__footer,  div /deep/ .el-table__header{
  width: 100% !important;
}
.el-form-item{
  margin-top: 0;
  margin-bottom: 18px!important;
}
</style>
