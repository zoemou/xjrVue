<script>
import { deepClone } from '@/utils/index'
import render from '@/components/render/render.js'
import ruleTrigger from '@/components/generator/ruleTrigger.js';

// 渲染布局
const layouts = {
  // 渲染列
  colFormItem(h, scheme) {
    const config = scheme.__config__
    const listeners = buildListeners.call(this, scheme)

    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    return (
      <el-col span={config.span}>
        <el-form-item label-width={labelWidth} prop={scheme.__vModel__}
          label={config.showLabel ? config.label : ''}>
          <render conf={scheme} {...{ on: listeners }} />
        </el-form-item>
      </el-col>
    )
  },
  // 渲染行
  rowFormItem(h, scheme) {

    let child = renderChildren.apply(this, arguments)
    //如果是表格类型

    if (scheme.type === 'flex') {
      child = <el-row type={scheme.type} justify={scheme.justify} align={scheme.align}>
              {child}
            </el-row>
    }
    return (
      <el-col span={scheme.span}>
        <el-row gutter={scheme.gutter}>
          {child}
        </el-row>
      </el-col>
    )
  }
}

function renderFrom(h) {
  // 渲染表单
  const { formConfCopy } = this
  return (
    <el-row gutter={formConfCopy.gutter}>
      <el-form
        size={formConfCopy.size}
        label-position={formConfCopy.labelPosition}
        disabled={formConfCopy.disabled}
        label-width={`${formConfCopy.labelWidth}px`}
        ref={formConfCopy.formRef}
        // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
        props={{ model: this[formConfCopy.formModel] }}
        rules={this[formConfCopy.formRules]}
      >
        {renderFormItem.call(this, h, formConfCopy.fields)}
        {formConfCopy.formBtns && formBtns.call(this, h)}
      </el-form>
    </el-row>
  )
}

function formBtns(h) {
  // 渲染按钮
  return <el-col>
    <el-form-item size="large">
      <el-button type="primary" onClick={this.submitForm}>提交</el-button>
      <el-button onClick={this.resetForm}>重置</el-button>
    </el-form-item>
  </el-col>
}

function renderFormItem(h, elementList) {
  // 渲染组件
  return elementList.map(scheme => {
    const config = scheme.__config__
    const layout = layouts[config.layout]

    if (layout) {
    

      return layout.call(this, h, scheme)
    }
    throw new Error(`没有与${config.layout}匹配的layout`)
  })
}

function renderChildren(h, scheme) {
  



  const config = scheme.__config__

 /**
  * 在此处使用JSX 渲染avue form   如果需要数据回显   也要把this[this.formConf.formModel]['dynamic']  相应的赋值 双向绑定
  */
    if(config.componentName === 'table'){      
      return <avue-form option={buildTableOption(config)} v-model={this[this.formConf.formModel][config.bindTable]}  > </avue-form>
      // return h('avue-form',{ option :  buildTableOption(config)} )
    }

  if (!Array.isArray(config.children)) return null
  return renderFormItem.call(this, h, config.children)
}

function setValue(event, config, scheme) {
  this.$set(config, 'defaultValue', event)
  this.$set(this[this.formConf.formModel], scheme.__vModel__, event)
}

function buildListeners(scheme) {
  const config = scheme.__config__
  const methods = this.formConf.__methods__ || {}
  const listeners = {}

  // 给__methods__中的方法绑定this和event
  Object.keys(methods).forEach(key => {
    listeners[key] = event => methods[key].call(this, event)
  })
  // 响应 render.js 中的 vModel $emit('input', val)
  listeners.input = event => setValue.call(this, event, config, scheme)

  return listeners
}

/*
  给avue table 绑定他的值
*/
function buildTableOption(config){
  if(!config) return {};
  // 初始化表格的选项
  let tableOption = {
    submitBtn: false,
    emptyBtn : false, //清空按钮
    arrow: true, // 分组折叠功能是否可用
    collapse:true, //	分组默认不叠起  false叠起 true 不叠
    labelWidth : 0, // 距离左侧
    column : [{
      label:name,
      prop : 'dynamic_data',//+ config.bindTable, // 传参
      type: 'dynamic',
      span :'24',
      children:{
        align:'center',
        headerAlign:'center',
        rowAdd: (done) => {
              // this.$message.success('新增回调');
          
         done();
        },
        rowDel: (row, done) => {
              // this.$message.success('删除回调'+JSON.stringify(row));
          done();
        },
        column :[]
      }
    }],

  };
  
  // 遍历所有子集
  config.children.forEach(element => {
    if(element.__config__.dataType === 'dataSource' || element.__config__.dataType == 'dataItem'){
      //如果是数据源  生成配置
       if(element.__config__.dataSource){
         tableOption.column[0].children.column.push({
           label : element.__config__.label,
           type:element.__config__.avueType,
           prop:element.__vModel__
           });
       }
       //如果是数据字典 生成配置
       else{
          tableOption.column[0].children.column.push({
           label : element.__config__.label,
           type:element.__config__.avueType,
           prop:element.__vModel__
           });
       }
    }
    else{
      tableOption.column[0].children.column.push({
        label : element.__config__.label,
        prop:element.__vModel__
      });
    }
  });

  
  return tableOption;
};
/*
Vue 实列
*/
export default {
  components: {
    render
  },
  props: {
    formConf: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      formConfCopy: deepClone(this.formConf),
      [this.formConf.formModel]: {},
      [this.formConf.formRules]: {}
    }
    this.initFormData(data.formConfCopy.fields, data[this.formConf.formModel])
    this.buildRules(data.formConfCopy.fields, data[this.formConf.formRules])
    return data
  },
  methods: {

    // 初始化表单
    initFormData(componentList, formData) {
      componentList.forEach(cur => {
        const config = cur.__config__;
        // 初始化数据绑定值
        if (cur.__vModel__) formData[cur.__vModel__] = config.defaultValue
        //原   if (config.children) this.initFormData(config.children, formData)
        //改     原因  要判断是否为表格的容器组件，  表格容器  也是使用的rowFormitem  如果是componentName  也是table  就证明不需要吧子节点绑定
        if (config.children && config.layout !== 'rowFormItem' && config.componentName !== 'table') this.initFormData(config.children, formData)
      })
    },
    buildRules(componentList, rules) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (Array.isArray(config.regList)) {
          if (config.required) {
            const required = { required: config.required, message: cur.placeholder }
            if (Array.isArray(config.defaultValue)) {
              required.type = 'array'
              required.message = `请至少选择一个${config.label}`
            }
            required.message === undefined && (required.message = `${config.label}不能为空`)
            config.regList.push(required)
          }
          rules[cur.__vModel__] = config.regList.map(item => {
            item.pattern && (item.pattern = eval(item.pattern))
            item.trigger = ruleTrigger && ruleTrigger[config.tag]
            return item
          })
        }
        if (config.children) this.buildRules(config.children, rules)
      })
    },
    resetForm() {
      // 重置表单内容
      this.formConfCopy = deepClone(this.formConf);
      this.$refs[this.formConf.formRef].resetFields(); //element-ui 表单重置函数resetFields();
    },
    submitForm() {
      // 表单提交 

      var _valid = false;
      // 提交前验证表单内容
      this.$refs[this.formConf.formRef].validate(valid => {
        if (valid) _valid = true;
      });
      if(!_valid) return false;

      // 处理一下表格的数据进行提升
      var data = this.FKdataClear(this[this.formConf.formModel]);

      // 触发sumit事件
      this.$emit('submit', data);
      return data;
    },
    FKdataClear(data){
      //数据清洗
      if(!data) return data;
      var _data  ={};

      // 遍历对象
      for (var key in data) {
        var element = data[key];
        if (element.hasOwnProperty('dynamic_data')){
          _data[key] = element.dynamic_data;
        }else{
          _data[key] = element;
        }
      }
      
      return _data;
    },
  },
  render(h) {
    return renderFrom.call(this, h)
  },
  
}
</script>

<style scoped>

@media only screen and (min-width:768px) {
  /* 排查avue表单组件渲染时无法在布局内展开铺满的问题并锁死el-col-sm-12样式为100% */
  /deep/ .el-col-sm-12{
    width: 100% !important;
  }
}
</style>