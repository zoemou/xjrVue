<script>
import draggable from 'vuedraggable';
import render from '@/components/render/render';
import { baseUrl } from '@/config/env';
import store from '@/store';
import Vue from 'vue';
import { layoutComponents } from '@/components/generator/config';
import { deepClone } from '@/util/util';
import { getDrawingList } from '@/utils/db';
import {convertToChineseCapital,getNumberFixed2} from '@/components/codeParser/util.js';
const components = {
  itemBtns (h, currentItem, index, list) {
    const { copyItem, deleteItem } = this.$listeners;
    return [
      <span
          class="drawing-item-copy"
          title="复制"
          onClick={(event) => {
            copyItem(currentItem, list);
            event.stopPropagation();
          }}
      >
        <i class="el-icon-copy-document"/>
      </span>,
      <span
          class="drawing-item-delete"
          title="删除"
          onClick={(event) => {
            deleteItem(index, list);
            event.stopPropagation();
          }}
      >
        <i class="el-icon-delete"/>
      </span>,
    ];
  },
};
var LIST = [];
// 生成组件包裹布局方式，内容
const layouts = {
  colFormItem (h, currentItem, index, list) {
    const { activeItem } = this.$listeners;
    const config = currentItem.__config__;
    this.parentNode(currentItem);
    const child = renderChildren.apply(this, arguments);
    let className =
        this.activeId === config.formId
            ? 'drawing-item active-from-item'
            : 'drawing-item';
    if (this.formConf.unFocusedComponentBorder)
      className += ' unfocus-bordered';
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = '0';
    //如果是标题组件 不需要form
    if (config.tag === 'h2') {
      return (
          <el-col
              span={config.span}
              class={className}
              nativeOnClick={(event) => {
                activeItem(currentItem);
                event.stopPropagation();
              }}
          >
            <el-form-item
                label-width={labelWidth}
                label={config.showLabel ? config.label : ''}
                required={config.required}
            >
              <h2 align="center" style={{
                fontSize: config.fontSize + 'px',
                textAlign: config.titlePosition,
                color: config.defaultValue
              }}>{config.label}</h2>
            </el-form-item>
            {components.itemBtns.apply(this, arguments)}
          </el-col>
      );
    }
    //如果是分割线组件 不需要form
    if (config.tag === 'el-divider') {
      return (
          <el-col
              span={config.span}
              class={className}
              nativeOnClick={(event) => {
                activeItem(currentItem);
                event.stopPropagation();
              }}
          >
            <el-form-item
                label-width={labelWidth}
                label={config.showLabel ? config.label : ''}
                required={config.required}
            >
              <div align="center" style={{
                borderTop: "1px solid #dcdfe6",
                marginTop: config.top + 'px',
                marginBottom: config.bottom + 'px',
              }}></div>
            </el-form-item>
            {components.itemBtns.apply(this, arguments)}
          </el-col>
      );
    }
    //上传
    if (config.tag === 'el-upload') {
      let uploadConfig = {...config,disabled:currentItem.disabled};
      let key = Math.round();
       return (
          <el-col
              span={config.span}
              class={className}
              nativeOnClick={(event) => {
                activeItem(currentItem);
                event.stopPropagation();
              }}
          >
            <el-form-item
                label-width={labelWidth}
                label={config.showLabel ? config.label : ''}
                required={config.required}
            >
              <xjr-custom-upload 
              key={key}
              v-model={currentItem.__config__.defaultValue} 
              config={uploadConfig}
              list-type={currentItem['list-type'] !== 'text' ? currentItem['list-type'] : ''} onInput={(event) => {
                  this.$set(config, 'defaultValue', event);
                }}></xjr-custom-upload>
            </el-form-item>
            {components.itemBtns.apply(this, arguments)}
          </el-col>
      );
    }
    //信息体
    if (config.tag === 'avue-information-body') {
       return (
          <el-col
              span={config.span}
              class={className}
              nativeOnClick={(event) => {
                activeItem(currentItem);
                event.stopPropagation();
              }}
          >
            <el-form-item
                label-width={labelWidth}
                label={config.showLabel ? config.label : ''}
                required={config.required}
            >
              <avue-information-body
              v-model={currentItem.__config__.defaultValue} 
              placeholder={config.placeholder}
              infoType={currentItem['infoType']} onInput={(event) => {
                  this.$set(config, 'defaultValue', event);
                }}></avue-information-body>
            </el-form-item>
            {components.itemBtns.apply(this, arguments)}
          </el-col>
      );
    }
	//级联
	if (config.tag === 'xjr-cascader') {
    let key = Math.round();
	   return (
	      <el-col
	          span={config.span}
	          class={className}
	          nativeOnClick={(event) => {
	            activeItem(currentItem);
	            event.stopPropagation();
	          }}
	      >
	        <el-form-item
	            label-width={labelWidth}
	            label={config.showLabel ? config.label : ''}
	            required={config.required}
	        >
	          <xjr-cascader
            key={key}
	          v-model={currentItem.__config__.defaultValue} 
	          placeholder={currentItem.placeholder}
	          settings={currentItem.__config__.settings}
			  separator={currentItem.separator}
			  clearable={currentItem.clearable}
			  disabled={currentItem.disabled} 
        checkStrictly={currentItem.checkStrictly} 
			  showAllLevels={currentItem['show-all-levels']} onInput={(event) => {
	              this.$set(config, 'defaultValue', event);
	            }}></xjr-cascader>
	        </el-form-item>
	        {components.itemBtns.apply(this, arguments)}
	      </el-col>
	  );
	}
	
    // 图片
    // function beforeAvatarUpload (file) {
    //   let imgTypes = ['image/png','image/jpeg','image/jpg','image/gif','image/bmp'];
    //   const isJPG =imgTypes.includes(file.type);
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isJPG) {
    //     this.$message.error('上传头像只能是图片格式!');
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传头像图片大小不能超过 2MB!');
    //   }
    //   return isJPG && isLt2M;
    // }

    if (config.tag === 'el-image') {
      //let imgTemplate = null;
     //if(config.defaultValue){
       let imgTemplate =  <el-image
                  src={config.defaultValue}
              >
			  <div slot="error" class="image-slot">
			          <i class="el-icon-picture-outline"></i>
			        </div></el-image>;
      // }else{
      //    imgTemplate =  <el-upload
      //             class="avatar-uploader"
      //             action={baseUrl + '/upload'}
      //             show-file-list={false}
      //             before-upload={beforeAvatarUpload}
      //             {
      //               ...{
      //                 props: {
      //                   'on-success': (res) => {
      //                     config.defaultValue = baseUrl + res.data.FileUrl[0];
      //                   }
      //                 }
      //               }
      //             }
      //         >
      //           <i class="el-icon-plus avatar-uploader-icon"></i>
      //         </el-upload>
      // }
      return (
          <el-col
              span={config.span}
              class={className}
              nativeOnClick={(event) => {
                activeItem(currentItem);
                event.stopPropagation();
              }}
          >
            <el-form-item
                label-width={labelWidth}
                label={config.showLabel ? config.label : ''}
                required={config.required}
            >
            {imgTemplate}              
            </el-form-item>
            {components.itemBtns.apply(this, arguments)}
          </el-col>
      );
    }
    
    if(currentItem.isCapitalized){
		console.log(currentItem,'config.showCapitalizedValue')
       if (config.showCapitalizedValue) {
		let val=convertToChineseCapital(currentItem.__config__.defaultValue)
        return (
            <el-col
                span={config.span}
                class={className}
                nativeOnClick={(event) => {
                  activeItem(currentItem);
                  event.stopPropagation();
                }}
            >
              <el-form-item
                  label-width={labelWidth}
                  label={config.showLabel ? config.label : ''}
                  required={config.required}
              >
                <el-input
                  v-model={val}
                  placeholder={currentItem.placeholder}
                  autosize={currentItem.autosize}
                  disabled={currentItem.disabled}
                  maxlength={currentItem.maxlength}
                  readonly={true}
                  suffix-icon={currentItem["suffix-icon"]}
                  prefix-icon={currentItem["prefix-icon"]}
                  show-word-limit={
                    currentItem["show-word-limit"]
                  }
                  style={currentItem.style}
                  {...{ on: {
                          'focus': () => {
                            config.showCapitalizedValue = false;
                          } 
                		}}
                  }
                >
                  <template slot={"prepend"}>{currentItem['__slot__']["prepend"]}</template>
                  <template slot={"append"}>{currentItem['__slot__']["append"]}</template>
                </el-input>
              </el-form-item>
              {components.itemBtns.apply(this, arguments)}
            </el-col>
        );
      }else{
         return (
            <el-col
            span={config.span}
            class={className}
            nativeOnClick={(event) => {
              activeItem(currentItem);
              event.stopPropagation();
            }}
        >
          <el-form-item
              label-width={labelWidth}
              label={config.showLabel ? config.label : ''}
              required={config.required}
          >         
		  <render
			  key={config.renderKey}
			  conf={currentItem}
			  onInput={(event) => {
				this.$set(config, 'defaultValue', getNumberFixed2(event));
			  }}
			  onBlur={(event) => {
				this.$set(config, 'showCapitalizedValue', true);
			  }}
		  >
			{child}
		  </render>
          </el-form-item>
          {components.itemBtns.apply(this, arguments)}
        </el-col>
         )
      }
    }
    return (
        <el-col
            span={config.span}
            class={className}
            nativeOnClick={(event) => {
              activeItem(currentItem);
              event.stopPropagation();
            }}
        >
          <el-form-item
              label-width={labelWidth}
              label={config.showLabel ? config.label : ''}
              required={config.required}
          >
            <render
                key={config.renderKey}
                conf={currentItem}
                onInput={(event) => {
                  this.$set(config, 'defaultValue', event);
                }}
            >
              {child}
            </render>
          </el-form-item>
          {components.itemBtns.apply(this, arguments)}
        </el-col>
    );
  },
  rowFormItem (h, currentItem, index, list) {
    const { activeItem } = this.$listeners;
    const config = currentItem.__config__;
    const className =
        this.activeId === config.formId
            ? 'drawing-row-item tab-row-box active-from-item'
            : 'drawing-row-item tab-row-box';

    let child = renderChildren.apply(this, arguments);
    this.parentNode(currentItem);

    if (currentItem.type === 'flex') {
      child = (
          <el-row
              type={currentItem.type}
              justify={currentItem.justify}
              align={currentItem.align}
          >
            {child}
          </el-row>
      );
    }

    if (config.tag === 'avue-tabs') {
      /**
       * draggable 组件事件说明 中文参考（非官方翻译）: http://www.itxst.com/vue-draggable/vnqb7fey.html   gitHub参考: https://github.com/SortableJS/Vue.Draggable/blob/master/README.md
       * 1.动态拼接选项卡项
       * by:yk修改
       * **/
      let column = config.option.column || [];
      config?.childrenObj || (config.childrenObj = {});
      //childrenObj 赋于初始值
      config.childrenObj[config.currentTab] = config.children;
    let currentTab =  config.currentTab;
      let tabHTML = column.map(item => {
        return (
            <el-tab-pane label={item.label} name={item.prop}>
            </el-tab-pane>
        );
      });
      let tabContent =  <draggable
                  list={config.children}
                  group="componentsGroup"
                  class="drag-wrapper el-row tabs-item"
                  animation="300"
                  ghost-class="ghost"
                  sort="true"
              >
                {child}
              </draggable>;
      return (
          <el-col span={config.span}>
            <el-row
                gutter={config.gutter}
                class={className}
                nativeOnClick={(event) => {
                  activeItem(currentItem);
                  event.stopPropagation();
                }}
            >
              <el-tabs
                  value={currentTab}
                  type={config.tabsType}
                  tabPosition={config.tabPosition}
                  onTab-click={(tabs, event) => {
                    //点击时，在数组查找相应的tabs.name 替换当前的 config
                    const oldName = config.currentTab;
                    const newName = tabs.name;
                    
                    config?.childrenObj || (config.childrenObj = {}); 
                    
                    if (oldName === newName) return;

                    if (oldName && newName !== oldName) {
                      let temporaryChildren = config.children;
                      //let childrenObj = JSON.parse(localStorage.getItem('childrenTab'));
                      let childrenObj = config.childrenObj;
                      if (childrenObj[newName]) {
                        childrenObj[oldName] = temporaryChildren;
                        //localStorage.setItem('childrenTab', JSON.stringify(childrenObj));
                        config.children = childrenObj[newName];
                      } else {
                        childrenObj[oldName] = temporaryChildren;
                        //系统变量赋值
                        //config.childrenObj[newName] = temporaryChildren;
                        //localStorage.setItem('childrenTab', JSON.stringify(childrenObj));
                        config.children = [];
                      }
                      config.currentTab = tabs.name;
                    }
                  }}
              >
                {tabHTML}
              </el-tabs>
              {tabContent}
              {components.itemBtns.apply(this, arguments)}
            </el-row>
          </el-col>
      );
    }
    let rowClass = "drag-wrapper el-row"
    if(config.componentName&&config.componentName==='table'){
      rowClass = "drag-wrapper el-row table-row-box";
    }
    return (
        <el-col span={config.span}>
          <el-row
              gutter={config.gutter}
              class={className}
              nativeOnClick={(event) => {
                activeItem(currentItem);
                event.stopPropagation();
              }}
          >
            <span class="component-name">{config.showLabel?config.componentTitle:''}</span>

            <draggable
                list={config.children || []}
                animation="200"
                group="componentsGroup"
                class={rowClass}
                ghost-class="ghost"
                sort="true"
            >
              {child}
            </draggable>
            {components.itemBtns.apply(this, arguments)}
          </el-row>
        </el-col>
    );
  },
  raw (h, currentItem, index, list) {
    const config = currentItem.__config__;
    const child = renderChildren.apply(this, arguments);
    return (
        <render
            key={config.renderKey}
            conf={currentItem}
            onInput={(event) => {
              this.$set(config, 'defaultValue', event);
            }}
        >
          {child}
        </render>
    );
  },
};
/**
 * 递归解析嵌套__config__.children记录
 * @param h
 * @param currentItem
 * @param index
 * @param list
 * @return {null|*}
 */
function renderChildren (h, currentItem, index, list) {
  const config = currentItem.__config__;
  if (!Array.isArray(config.children)) return null;
  /*
  * avue-tabs的children数据结构 是key/value Object形式
  * by:yk修改
  **/
  return config.children.map((el, i) => {
    const layout = layouts[el.__config__.layout];
    if (layout) {
      return layout.call(this, h, el, i, config.children);
    }
    return layoutIsNotFound.call(this);
  });
}

function layoutIsNotFound () {
  throw new Error(`没有与${this.currentItem.__config__.layout}匹配的layout`);
}

export default {
  components: {
    render,
    draggable,
  },
  props: ['currentItem', 'index', 'drawingList', 'activeId', 'formConf'],
  data() {
    return {
      showOnMoveMessage: ""
    }
  },
  render (h) {
    const layout = layouts[this.currentItem.__config__.layout];
    if (layout) {
      return layout.call(
          this,
          h,
          this.currentItem,
          this.index,
          this.drawingList
      );
    }
    return layoutIsNotFound.call(this);
  },
  methods: {
    parentNode (currentItem) {
      let datum = this.$emit('getParent', currentItem.__config__.formId);
      if (datum.currentItem.__config__?.componentName !== 'table' && datum.currentItem.__config__.isChild) {
        datum.currentItem.__config__.bindTable = '';
        datum.currentItem.__config__.bindTableField = '';
        datum.currentItem.__config__.bindTableFieldType = '';
        delete datum.currentItem.__config__.isChild;
      } else if (datum.currentItem.__config__?.componentName === 'table') {
        datum.currentItem.__config__.children.forEach((el) => {
          if (el.__config__.bindTable !== datum.currentItem.__config__.bindTable) {
            el.__config__.bindTable = datum.currentItem.__config__.bindTable;
            el.__config__.bindTableField = '';
            el.__config__.bindTableFieldType = '';
            el.__config__.isChild = true;
          }
        });
      } else if (datum?.currentItem?.__config__?.componentName == 'avue-tabs') {
        let childrenObj = datum?.currentItem?.__config__?.childrenObj || {};
        for(let key in childrenObj){
          let children = childrenObj[key];
          if(children&&children.length>0){
            children.map(item=>{
            if(item?.__config__?.componentName == 'table'){
              let child = item?.__config__?.children || [];
              child.map(el=>{
                el.__config__.bindTable  = el.__config__.bindTable || '';
                if (el?.__config__?.bindTable !== item?.__config__?.bindTable) {
                  el.__config__.bindTable = item?.__config__?.bindTable;
                  el.__config__.bindTableField = '';
                  el.__config__.bindTableFieldType = '';
                  el.__config__.isChild = true;
                }
              });
            }
          });
          }
        }
      }
    }
  }
};
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
 
  text-align: center;
}
</style>
