<script>
    import { deepClone } from "@/utils/index";
    import render from "@/components/render/render.js";
    import { postAddorupdateFormdata } from "@/api/code/form.js";
    // 缓存
    import { getStore } from "@/util/store.js";

    const ruleTrigger = {
        "el-input": "blur",
        "el-input-number": "blur",
        "el-select": "change",
        "el-radio-group": "change",
        "el-checkbox-group": "change",
        "el-cascader": "change",
        "el-time-picker": "change",
        "el-date-picker": "change",
        "el-rate": "change",
    };

    // 渲染布局
    const layouts = {

        // 渲染列
        colFormItem(h, scheme) {
            const config = scheme.__config__;
            const listeners = buildListeners.call(this, scheme);

            let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
            if (config.showLabel === false) labelWidth = "0";
            return (
                <el-col span={config.span}>
                    <el-form-item
                        label-width={labelWidth}
                        // prop={scheme.__vModel__}
                        prop={config.bindTableField}
                        label={config.showLabel ? config.label : ""}
                    >
                        <render conf={scheme} {...{ on: listeners }} />
                    </el-form-item>
                </el-col>
            );
        },

        // 渲染行
        rowFormItem(h, scheme) {
            let child = renderChildren.apply(this, arguments);
            //如果是表格类型

            if (scheme.type === "flex") {
                child = (
                    <el-row
                        type={scheme.type}
                        justify={scheme.justify}
                        align={scheme.align}
                    >
                        {child}
                    </el-row>
                );
            }
            return (
                <el-col span={scheme.span}>
                    <el-row gutter={scheme.gutter}>{child}</el-row>
                </el-col>
            );
        },
    };

    function renderFrom(h) {
        // 渲染表单
        
        const { formConfCopy } = this;

        return (
            <el-row gutter={formConfCopy.gutter}>
                <el-form
                    size={formConfCopy.size}
                    label-position={formConfCopy.labelPosition}
                    disabled={formConfCopy.disabled}
                    label-width={`${formConfCopy.labelWidth}px`}
                    ref={formConfCopy.formRef}
                    // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
                    // props={{ model: this[formConfCopy.formModel] }}
                    // props={{ model: this.$data[formConfCopy.formModel] }}
                    // rules={this[formConfCopy.formRules]}
                    props={{ model: this.FK_FormOperationObject.formModel[this.FK_FormOperationObject.mainTableName] }}
                    rules={this.FK_FormOperationObject.formRules}

                >
                    {renderFormItem.call(this, h, formConfCopy.fields)}
                    {formConfCopy.formBtns && formBtns.call(this, h)}
                </el-form>
            </el-row>
        );
    }

    function formBtns(h) {
        // 渲染按钮
        return (
            <el-col>
                <el-form-item size="large">
                    <el-button type="primary" onClick={this.FKsubmitForm}>
                        提交
        </el-button>
                    <el-button onClick={this.resetForm}>重置</el-button>
                </el-form-item>
            </el-col>
        );
    }

    function renderFormItem(h, elementList) {
        if(!elementList) return elementList;
        // 渲染组件
        return elementList.map((scheme) => {
            const config = scheme.__config__;


            // 表单数据装载 by FeikeQ
            if(this.formData){
                if(this.formData[config.bindTable]){
                    if(this.formData[config.bindTable][config.bindTableField] !== undefined){
                        // config.defaultValue 没有定义 
                        // this.$set(config, "defaultValue", this.formData[config.bindTable][config.bindTableField]); //添加默认值 不然表单上不会渲染数据
                        // 直接调设置值的方法
                        setValue.call(this, this.formData[config.bindTable][config.bindTableField], config,scheme);
                    }
                }
            }
            
            
            

            const layout = layouts[config.layout];

            if (layout) {
                return layout.call(this, h, scheme);
            }
            throw new Error(`没有与${config.layout}匹配的layout`);
        });
    }

    function renderChildren(h, scheme) {
        const config = scheme.__config__;

        /**
         * 在此处使用JSX 渲染avue form   如果需要数据回显   也要把this[this.formConf.formModel]['dynamic']  相应的赋值 双向绑定
         */
        if (config.componentName === "table") {
            return (
                <avue-form
                    option={buildTableOption(config)}
                    // v-model={this.FK_FormOperationObject.formModel[config.bindTable]}
                    v-model={this.FK_FormOperationObject.formModel}
                >
                    {" "}
                </avue-form>
            );
            // return h('avue-form',{ option :  buildTableOption(config)} )
        }

        if (!Array.isArray(config.children)) return null;
        return renderFormItem.call(this, h, config.children);
    }

    function setValue(event, config, scheme) {
        this.$set(config, "defaultValue", event); //添加默认值 不然表单上不会渲染数据

         
        // 当组件有事件触发时 $set 给对象新增属性
        this.$set(this.FK_FormOperationObject.formModel[config.bindTable],config.bindTableField, event);
        
    };

    function buildListeners(scheme) {
        const config = scheme.__config__;
        const methods = this.formConf.__methods__ || {};
        const listeners = {};

        // 给__methods__中的方法绑定this和event
        Object.keys(methods).forEach((key) => {
              
            listeners[key] = (event) => methods[key].call(this, event);
        });

        // 响应 render.js 中的 vModel $emit('input', val)
        listeners.input = (event) => setValue.call(this, event, config, scheme);


        return listeners;
    }

    /*
      给avue table 绑定他的值
    */
    function buildTableOption(config) {
        if (!config) return {};
        // 初始化表格的选项
        let tableOption = {
            submitBtn: false,
            emptyBtn: false, //清空按钮
            arrow: true, // 分组折叠功能是否可用
            collapse: true, //	分组默认不叠起  false叠起 true 不叠
            labelWidth: 0, // 距离左侧
            column: [
                {
                    label: name,
                    prop: config.bindTable, //+ config.bindTable, // 传参
                    type: "dynamic",
                    span: "24",
                    children: {
                        align: "center",
                        headerAlign: "center",
                        rowAdd: (done) => {
                          
                            done();
                        },
                        rowDel: (row, done) => {
                            done();
                        },
                        column: [],
                    },
                },
            ],
        };

        // 遍历表格所有子集
        config.children.forEach((element) => {
            if (
                element.__config__.dataType === "dataSource" ||
                element.__config__.dataType == "dataItem"
            ) {
                //如果是数据源  生成配置
                if (element.__config__.dataSource) {
                    tableOption.column[0].children.column.push({
                        label: element.__config__.label,
                        type: element.__config__.avueType,
                        // prop: element.__vModel__,
                        prop: element.__config__.bindTableField,
                    });
                }
                //如果是数据字典 生成配置
                else {
                    tableOption.column[0].children.column.push({
                        label: element.__config__.label,
                        type: element.__config__.avueType,
                        // prop: element.__vModel__,
                        prop: element.__config__.bindTableField,
                    });
                }
            } else {
                tableOption.column[0].children.column.push({
                    label: element.__config__.label,
                    // prop: element.__vModel__,
                    prop: element.__config__.bindTableField,
                    // formslot: true, //表单自定义	Boolean
                });
            }
        });

        return tableOption;
    };


    /*
    Vue 实列
    */
    export default {
        name: "FKParser",
        components: {
            render,
        },
        props: {
            // 表单配置
            formConf: {
                type: Object,
                required: true,
            },
            // 表单数据
            formData: {
                type: Object
            },
            // 表单信息
            formInfos: {
                type: Object
            },

        },
        computed: {
            // 使用匿名函数混入 computed 对象中(使用 this.__UserInfo__.F_Account )
            __UserInfo__:function(){return getStore({ name: "userInfo" })}
        },
        data() {
            const data = {
                formConfCopy: deepClone(this.formConf),
                FK_FormOperationObject:{
                    formModel:{}, // 绑定数据
                    formRules:{}, // 绑定规则
                    mainTableName:'',
                }
            };

            if(!this.formConf.fields){
                this.$message.error('表单配置异常，请检查数据格式');
                return data;
            }

            // 提前按绑定表名来定义表格与表单的变量
            this.formConf.fields.forEach(el =>{
                if(!data.FK_FormOperationObject.formModel[el.__config__.bindTable]){
                    data.FK_FormOperationObject.formModel[el.__config__.bindTable] = {}
                }
                // 获取主表
                if(!data.FK_FormOperationObject.mainTableName){
                    if(!el.__config__.componentName || el.__config__.componentName!== "table"){
                        data.FK_FormOperationObject.mainTableName = el.__config__.bindTable;
                    }
                }
                
            });
            this.initFormData(data.formConfCopy.fields, data.FK_FormOperationObject.formModel);
            this.buildRules(data.formConfCopy.fields, data.FK_FormOperationObject.formRules);
            return data;
        },
        methods: {
            // 初始化表单
            initFormData(componentList, formModel) {
                var _this = this;

                

                if(!componentList) return;
                componentList.forEach((cur) => {
                    const config = cur.__config__;
                    // 初始化数据绑定值
                    // if (cur.__vModel__) formModel[cur.__vModel__] = config.defaultValue;
                    
                    
                    // 初始化数据绑定的默认值 主表
                    if (config.bindTableField) formModel[config.bindTable][config.bindTableField] = config.defaultValue;

                    


                    //原   if (config.children) this.initFormData(config.children, formModel)
                    //改     原因  要判断是否为表格的容器组件，  表格容器  也是使用的rowFormitem  如果是componentName  也是table  就证明不需要吧子节点绑定
                    if (
                        config.children &&
                        config.layout !== "rowFormItem" &&
                        config.componentName !== "table"
                    )
                        this.initFormData(config.children, formModel); // 递归
                });

            },

            // 绑定验证规则
            buildRules(componentList, rules) {
                if(!componentList) return;
                componentList.forEach((cur) => {
                    const config = cur.__config__;
                    // 如果有指定 regList 对象
                    if (Array.isArray(config.regList)) {
                        // 是否为必填 required 有就添加规则
                        if (config.required) {
                            const required = {
                                required: config.required,
                                message: cur.placeholder,
                            };
                            if (Array.isArray(config.defaultValue)) {
                                required.type = "array";
                                required.message = `请至少选择一个${config.label}`;
                            }
                            required.message === undefined &&
                                (required.message = `${config.label}不能为空`);
                            config.regList.push(required);
                        }

                        // 通过绑定表的指定字段添加验证规则
                        // rules[cur.__vModel__] = config.regList.map((item) => {
                        rules[config.bindTableField] = config.regList.map((item) => {
                            item.pattern && (item.pattern = eval(item.pattern));
                            item.trigger = ruleTrigger && ruleTrigger[config.tag];
                            return item;
                        });
                    }
                    // 如果有子集则递归处理
                    if ((config.componentName !=='table') && config.children) this.buildRules(config.children, rules);
                });
            },
            
            resetForm() {
                // 重置表单内容
                this.formConfCopy = deepClone(this.formConf);
                this.$refs[this.formConf.formRef].resetFields(); //element-ui 表单重置函数resetFields();
            },

            FKsubmitForm(callback) {
                // 表单提交

                var _valid = false;
                // 提交前验证表单内容
                this.$refs[this.formConf.formRef].validate((valid) => {
                    if (valid) _valid = true;
                });

                if (!_valid) return false;

                // //根据传入的配置json
                var newObj = {}
                // 清理子表单数据
                this.formConf.fields.forEach(el =>{  
                    if(el.__config__.componentName === 'table'){
                        if(!newObj[el.__config__.bindTable]) newObj[el.__config__.bindTable] = [];
                        var _tmp = this.FK_FormOperationObject.formModel[el.__config__.bindTable];
                        // 清洗数据
                        _tmp.map(function(item){
                            var _item = {...item};
                            delete  _item._index;
                            delete  _item.$index;
                            delete  _item.$cellEdit;
                            newObj[el.__config__.bindTable].push(_item);
                        });
                    }else{
                        if(!newObj[el.__config__.bindTable]) newObj[el.__config__.bindTable] ={};
                        newObj[el.__config__.bindTable][el.__config__.bindTableField] = this.FK_FormOperationObject.formModel[el.__config__.bindTable][el.__config__.bindTableField];
  
                    } 
                });

                this.FKsave(newObj, callback);

                // 触发sumit事件
                this.$emit("submit", newObj);
                return newObj;
            },

            
            

            FKsave(data, callback) {
                // 提交表单前将数据格式化为字符串
                var _strData = {};
                for (const key in data) {
                    _strData[key] = JSON.stringify(data[key]) 
                };
                

                // 代码生成器与表单设计器提交数据结构一样但接口不一样
                // 表单生成器提交时必须带上表单ID
                var _addParam = {
                    f_mobile:this.__UserInfo__.F_Account
                }
                if(this.formInfos){
                    _addParam.F_FormId = this.formInfos.F_Id; //表单ID(后端需要)
                    _addParam.F_Name = this.formInfos.F_Name; // 表单名
                } 
                var params = Object.assign(_addParam, _strData);

                // 保存表单数据 addOrUpdateFormInstanceData
                postAddorupdateFormdata(params).then((result) => {
                    var res = result.data;
                    if (res.success) {
                        // FKParser解析器添加提交参数params的回调方便之后父页面拿取表单设计ID
                        if(callback) callback({result:res,ajax_params:params}); //回调
                    }
                });
            },
        },
        render(h) {
            return renderFrom.call(this, h);
        },
    };
</script>
<style scoped>
    @media only screen and (min-width: 768px) {
        /* 排查avue表单组件渲染时无法在布局内展开铺满的问题并锁死el-col-sm-12样式为100% */
        /deep/ .el-col-sm-12 {
            width: 100% !important;
        }
    }
</style>