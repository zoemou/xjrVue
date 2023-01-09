<script>
    import { deepClone } from '@/utils/index'
    import { ComponentConfigList, Components } from './custom/config.js'
    const ComponentList = ComponentConfigList

    export default {
        name: 'Tabs',
        props: {
            fieldsIndex: {
                type: Number,
                required: true
            },
            formConf: {
                type: Object,
                required: true
            },
            isEdit: {
                type: Number
            },
			formEnCodeList:{}
        },
        components: Components,
        data(){
            return {
                ComponentList:ComponentList,
                tabsValue: null,
                tabsType: '',
                tabs: [],
                tabPosition: ''
            }
        },
        mounted(){
            let childrenObj = this.formConf?.fields[this.fieldsIndex]?.__config__?.childrenObj || {};
            this.tabsValue = this.formConf?.fields[this.fieldsIndex]?.__config__?.option?.column[0].prop || '';
            this.tabsType = this.formConf?.fields[this.fieldsIndex]?.__config__?.tabsType || '';
            this.tabPosition = this.formConf?.fields[this.fieldsIndex]?.__config__?.tabPosition || '';
            this.tabs = this.getTabsInfo(childrenObj);
        },
        render(h){
            return (
                <el-tabs v-model={this.tabsValue} tabPosition={this.tabPosition} type={this.tabsType}  tab-click={this.handleClick}>
                    {this.renderTabsDom(h)}
                </el-tabs>
            )
        },
        methods:{
            renderTabsDom(h){
                let vNodes = [];
                this.tabs.map((item,idx)=>{
                    vNodes.push(
                        <el-tab-pane
                            label={item.label}
                            name={item.prop}
                        >
                            {this.renderForm(h,item.content,item.prop)}
                        </el-tab-pane>
                    );
                })
                return vNodes;
            },
            renderForm(createElement,fields, prop){
                return fields.map((scheme, index) => {
                    const config = scheme.__config__
                    if(config.layout === 'colFormItem'){
                    return this.renderColFormItem(createElement, config.layout, scheme, index, prop)
                    }else if(config.layout === 'rowFormItem'){
                    return this.renderRowFormItem(createElement, config.layout, scheme, index, prop)
                    } else {
                    return ''
                    }
                })
            },
            getTabChildrenByTabs(field,tabName){
                let _arr = [];
                
                let childrenObj = field?.__config__?.childrenObj || {};
                let children = childrenObj[tabName];
                children.map((el)=>{
                    if(el.__config__.componentName == 'avue-tabs'){
                        _arr.push(...this.getTabChildrenByTabs(el,tabName));
                    }else{
                        _arr.push(el);
                    }
                });

                return (()=>{ return _arr; })()
            },
            renderColFormItem(createElement, item, scheme, fieldsIndex, prop){
                const config = scheme.__config__
                let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
                if (config.showLabel === false) {
                    labelWidth = '0'
                }
                //为兼容解析器数据结构，重组一下fields数据结构 formConf 根据avue-tabs
                // let formConf = deepClone(this.formConf);
                let tabChildren = [];
                //暂时不考虑tabs内嵌的tabs的情况
                let currentTab = prop || 'tab1';
                tabChildren =  this.formConf.fields[this.fieldsIndex].__config__.childrenObj[currentTab]
                // let selfTabItem = this.formConf.fields.find((item)=>{return item.__config__.componentName == 'avue-tabs'});
                // let selfTabItem = this.formConf.fields[this.fieldsIndex].__config__.childrenObj[currentTab];
                // tabChildren = this.getTabChildrenByTabs(selfTabItem,currentTab);
                // let _arr = [];
                
                // let childrenObj = this.formConf.fields[this.fieldsIndex].__config__.childrenObj[currentTab];
                // let children = childrenObj[currentTab];
                // children.map((el)=>{
                //     if(el.__config__.componentName == 'avue-tabs'){
                //         _arr.push(...this.getTabChildrenByTabs(el,tabName));
                //     }else{
                //         _arr.push(el);
                //     }
                // });
                let renderTag = this.ComponentList[config.tag]?this.ComponentList[config.tag].renderTag:'ElComponent';
                // 财务组件
                if(scheme.type&&scheme.type=='number'){
                    renderTag = "CustomeFinance";
                }
                let self = this;
                let listeners = {
                    handleFilterableClick:(conf)=>{
                        self.$emit('handleFilterableClick',conf);
                    }
                };

                const vnodes = createElement(renderTag, {props: 
                { fieldsIndex, formConf: this.formConf, curFormId: config.formId, tabChildren, isEdit: this.isEdit },
                 ...{ on: listeners }
                }
                );
                // let showNode='';
                // if(config.tag=="el-mutiple-input"){
				// 	if(!config.showValue) this.$set(config,'showValue','')
                // 	showNode=createElement('el-input',{
                // 		props:{
                // 			value:config.showValue,
				// 			'suffix-icon':'el-icon-more'								
                // 		},
                // 		attrs:{
                // 			placeHolder:scheme.placeholder
                // 		},
                // 		on:{
                // 			focus:()=>this.handleFilterableClick(scheme)
                // 		}
                // 	})
                // }
				let lgmarkString = '';
				/**
				 * author:tzx
				 * time : 2021.10.30
				 * desc ：多语言翻译 当前form label
				 */
				if(config.F_LgMarkCode === '' || config.F_LgMarkCode === null|| config.F_LgMarkCode === undefined){
				  lgmarkString = config.label
				}
				else{
				  lgmarkString = this.$t(config.F_LgMarkCode);
				}
				
				// if(config.tag=="el-mutiple-input"){
				// 	return (
				// 	  <el-col span={config.span}>
				// 	    <el-form-item
				// 	      label-width={labelWidth}
				// 	      prop={config.bindTableField}
				// 	      label={config.showLabel ? lgmarkString  : ''}
				// 	    >
				// 	     {showNode}
				// 		  <el-form-item
				// 		    prop={config.bindTableField}
				// 			style="display:none"
				// 		  >
				// 		    {vnodes}
				// 		  </el-form-item>
				// 	    </el-form-item>
				// 	  </el-col>
				// 	)
				// }else{
					return (
					    <el-col span={config.span}   v-show={config.view}>
					        <el-form-item
					        label-width={labelWidth}
					        prop={config.bindTableField}
					        label={config.showLabel ? lgmarkString  : ''}
					        >
					        {vnodes}
					        </el-form-item>
					    </el-col>
					)
				// }
            },
            renderRowFormItem(createElement, item, scheme, fieldsIndex, prop){
                let child = this.renderChildren(createElement,scheme,fieldsIndex, prop)
                let slots = child;
                if(scheme.__config__.componentName && scheme.__config__.componentName === 'table'){
                    if(scheme.__config__.view){
                         return child
                    }else{
                         return null
                    }
                } else if (scheme.type === 'flex') { // 如果是表格类型
                    slots = this.renderFlexRow(scheme,child);
                }
                return (
                    <el-col span={scheme.span}>
                        <el-row gutter={scheme.gutter}>{slots}</el-row>
                    </el-col>
                )
            },
            renderChildren(createElement,scheme,fieldsIndex, prop) {
                const config = scheme.__config__
                if (config.componentName && config.componentName === 'table') {
                    return this.renderTable(createElement,config,fieldsIndex, prop);
                }
                //avue-tabs 绘制
                if (config.componentName && config.componentName === 'avue-tabs'){
                    return this.renderTabs(createElement,config,fieldsIndex, prop);
                }
                if (!Array.isArray(config.children)){
                    return null
                }
                return this.renderForm(config.children)
            },
            renderTable(createElement,config,fieldsIndex, prop){
                //为兼容解析器数据结构，重组一下fields数据结构 formConf 根据avue-tabs
                // let formConf = deepClone(this.formConf);
                let tabChildren = [];
                //暂时不考虑tabs内嵌的tabs的情况
                let currentTab = prop || 'tab1';
                // let selfTabItem = this.formConf.fields.find((item)=>{return item.__config__.componentName == 'avue-tabs'});
                // tabChildren = this.getTabChildrenByTabs(selfTabItem,currentTab);
                 tabChildren = this.formConf.fields[this.fieldsIndex].__config__.childrenObj[currentTab];
                // let renderTag = ComponentList[config.tag]?ComponentList[config.tag].renderTag:'ElComponent';
				let obj={ fieldsIndex, formConf: this.formConf, curFormId: config.formId, tabChildren, isEdit: this.isEdit}
				if(this.formEnCodeList){
					obj.formEnCodeList=this.formEnCodeList
				}
                return createElement('CustomeTable', {props: obj,ref:'avueTable'+config.formId});
            },
            renderTabs(createElement,config,fieldsIndex, prop){
                return createElement('CustomeTabs', {props: { fieldsIndex, formConf: this.formConf}});
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
            getTabsInfo(childrenObj){
                let _arr = [];
                let column = this.formConf.fields[this.fieldsIndex].__config__.option.column || [];

                column.map((item,idx)=>{
                    let _obj = {};
                    _obj.label = item.label;
                    _obj.icon = item.icon;
                    _obj.prop = item.prop;
                    _obj.content = childrenObj[item.prop] || [];

                    _arr.push(_obj);
                })

                return _arr;
            },
            handleClick(tab, event){}
        },

    }
</script>