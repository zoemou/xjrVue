/* eslint-disable max-len */
import ruleTrigger from './ruleTrigger';
import {
  titleCase
} from '@/utils/index';

let confGlobal;
let someSpanIsNot24;
let mutipleCount = 0;
let popupCount = 0;

export function dialogWrapper(str) {
  return `<el-dialog v-dialogDrag v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
    ${str}
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handelConfirm">确定</el-button>
    </div>
  </el-dialog dialogDelete>`;
}

/*
* class="custom-form" 表单信息鉴权
* */
export function vueTemplate(str) {
  return `<template>
    <div class="custom-form">
      ${str}
    </div>
  </template>`;
}

export function vueScript(str) {
  return `<script>
    ${str}
  </script>`;
}

export function cssStyle(cssStr) {
  return `<style>
    ${cssStr}
  </style>`;
}

function buildFormTemplate(scheme, child, type) {
  let labelPosition = '';
  if (scheme.labelPosition !== 'right') {
    labelPosition = `label-position="${scheme.labelPosition}"`;
  }
  const disabled = scheme.disabled ? `:disabled="${scheme.disabled}"` : '';
  let str = `<el-form ref="${scheme.formRef}"  :model="${scheme.formModel}" :rules="${scheme.formRules}" size="${scheme.size}" ${disabled} label-width="${scheme.labelWidth}px" ${labelPosition}   :key="showFormKey"  v-if="showForm">
      ${child}
      ${buildFromBtns(scheme, type)}
    </el-form>`;
  /* 默认生成 */
  // if (someSpanIsNot24) {
  str = `<el-row :gutter="${scheme.gutter}">
        ${str}
      </el-row>`;
  // }
  return str;
}

function buildFromBtns(scheme, type) {
  let str = '';
  if (scheme.formBtns && type === 'file') {
    str = `<el-form-item size="large" __isEdit__="isEdit"  class="form-button-center">
          <el-button type="primary" @click="submitForm"  :loading="submitLoading">{{submitLoading?$t('workFlow.WFMenu.hintSubmit'):$t('submit')}}</el-button>
          <el-button @click="cancelForm">{{$t('cancelText')}}</el-button>
        </el-form-item>`;
    // if (someSpanIsNot24) {
    str = `<el-col :span="24" __VIFISWORKFLOWFORM__>
          ${str}
        </el-col>
        
        `;
    // }
  }
  //scheme.fields.asso-popup
  return str;
}

// span不为24的用el-col包裹
// 添加权限修改，必须添加el-col
function colWrapper(scheme, str) {
  if (scheme.__config__.componentName === 'table') {
    return `<el-col :span="${scheme.__config__.span}"  __isInput__="hasFormPermission('${scheme.__config__.bindTable}')">
      ${str}
    </el-col>`;
  }
  if (scheme.__config__.componentName === 'avue-tabs') {
    return `<el-col :span="${scheme.__config__.span}">
      ${str}
    </el-col>`;
  }
  let doNotGenerateTags = ['h2', 'el-divider', 'avue-custom-button'];
  if (doNotGenerateTags.includes(scheme.__config__.tag)) {
    return `<el-col :span="${scheme.__config__.span}" __isOnlyLookInput__="hasLookFormPermission('${scheme.__vModel__}')">
    ${str}
  </el-col>`;
  } else if (scheme.__config__.tag == 'xjr-opinion-comonent') {
    //工作流意见簿
    return `<el-col :span="${scheme.__config__.span}" __isWorkFlowFormInput__="hasWorkFlowFormPermission('${scheme.__vModel__}')">
    ${str}
  </el-col>`;
  } else {
    return `<el-col :span="${scheme.__config__.span}" __isInput__="hasFormPermission('${scheme.__vModel__}')">
      ${str}
    </el-col>`;

  }

  // }
  // return str
}

const layouts = {
  colFormItem(scheme) {
    const config = scheme.__config__;
    let labelWidth = '';
    let label = `:label="${(config.F_LgMarkCode === "" || config.F_LgMarkCode === null || config.F_LgMarkCode === undefined) ? "$t('" + config.label + "')" : "$t('" + config.F_LgMarkCode + "')"}"`;
    if (config.labelWidth && config.labelWidth !== confGlobal.labelWidth) {
      labelWidth = `label-width="${config.labelWidth}px"`;
    }
    if (config.showLabel === false) {
      labelWidth = 'label-width="0"';
      label = '';
    }
    const required = !ruleTrigger[config.tag] && config.required ? 'required' : '';
    const prop = scheme.__vModel__ ? (config.tag == "el-mutiple-input" ? `prop="${scheme.__vModel__}"` : `prop="${scheme.__vModel__}"`) : ``;
    let tagDom = null;
    // if(scheme.isCapitalized){//大写组件
    //     const {
    //       tag, disabled, vModel, placeholder
    //     } = attrBuilder(scheme);
    //     const controlsPosition = scheme['controls-position'] ? `controls-position=${scheme['controls-position']}` : '';
    //     const min = scheme.min !=undefined ? `:min='${scheme.min}'` : '';
    //     const max = scheme.max !=undefined ? `:max='${scheme.max}'` : '';
    //     const step = scheme.step ? `:step='${scheme.step}'` : '';
    //     const stepStrictly = scheme['step-strictly'] ? 'step-strictly' : '';
    //     const precision = scheme.precision ? `:precision='${scheme.precision}'` : '';
    //     tagDom = `<template>
    //     <${tag} :value="getCapitalizedMethod(${confGlobal.formModel}.${scheme.__vModel__})" readonly v-if="${scheme.__vModel__}ShowCapitalized" @focus="${scheme.__vModel__}ShowCapitalized=false"></${tag}>
    //     <${tag} v-else ${vModel} ${placeholder} ${step} ${stepStrictly} ${precision} ${controlsPosition} ${min} ${max} ${disabled} @blur="${scheme.__vModel__}ShowCapitalized=true"></${tag}>
    //     </template>`;
    //   }
    // else{
    tagDom = tags[config.tag] ? tags[config.tag](scheme) : null;
    //}

    // const tagDom = tags[config.tag] ? tags[config.tag](scheme) : null;
    const dyclass = config.tag == 'tinymce' ? 'class="tinymce"' : ''
    let str = `<el-form-item ${dyclass} ${labelWidth} ${label} ${prop} ${required}>
        ${tagDom}
      </el-form-item>`;
    str = colWrapper(scheme, str);

    if (config.avueType == "mutiple-popup") mutipleCount++;
    if (config.avueType == "asso-popup") popupCount++;

    if (mutipleCount == 1 && config.avueType == "mutiple-popup") {
      str += `<avue-filterable-data-list type="mutiple" :conf="mutipleCompleteConf" v-if="mutipleCompleteDialogVisible" v-on:onHandler="mutipleFilterableCallBack"></avue-filterable-data-list>`
    }
    if (popupCount == 1 && config.avueType == "asso-popup") {
      str += `<avue-filterable-data-list type="single" :conf="autoCompleteConf" v-if="autoCompleteDialogVisible" v-on:onHandler="filterableCallBack"></avue-filterable-data-list>`
    }
    return str;
  },
  rowFormItem(scheme) {
    const config = scheme.__config__;
    let bindTable = config.bindTable || 'childTable' + config.formId;
    let preloadLoading = 'preloadLoading' + config.formId;
    // 如果是表格容器
    if (config.componentName === 'table') {
      let slotScope = config.isSelectData ? `
			<template slot="menuForm">
				<el-button :style="{marginLeft: (option${config.formId}.labelWidth-10)+'px'}" type="primary" size="medium" 
				v-if="selectTableData${config.formId}" @click="selectTableDataEvent${config.formId}">${config.buttonName}</el-button>
			</template>
			`: ``;
      config.children.forEach((ele) => {
        if (ele && ele.__config__ && ele.__config__.avueType) {
          let configDicDataKey = ele.__vModel__ + ele.__config__.formId + 'tableChildDicData';
          if (ele.__config__.avueType == "asso-select") {
            slotScope += `
          <template slot-scope="{row}" slot="${ele.__vModel__}">
          <avue-asso-select :index="row.$index" :value="row['${ele.__vModel__}']"
          :conf='getTableConfConfig("${ele.__vModel__}")'
          :dicData='${configDicDataKey}'
           bindTable="${bindTable}" 
           @changeTableAssoData='changeTableAssoData'  :disabled="disabled?disabled:getTableChildrenItemDisabled('${bindTable}','${ele.__vModel__}',false)"></avue-asso-select>
          </template>
          `;
          }
          else if (ele.__config__.avueType == "mutiple-popup") {
            slotScope += `
          <template slot-scope="{row}" slot="${ele.__vModel__}">
          <avue-mutiple-popup :index="row.$index" :value="row['${ele.__vModel__}']"
          :conf='getTableConfConfig("${ele.__vModel__}")'
          :dicData='${configDicDataKey}'
          bindTable="${bindTable}" @changeTableMutiplePopupData='changeTableMutiplePopupData' :disabled="disabled?disabled:getTableChildrenItemDisabled('${bindTable}','${ele.__vModel__}',false)"></avue-mutiple-popup>
          </template>
          `;
          } else if (ele.__config__.avueType == "asso-popup") {
            slotScope += `
          <template slot-scope="{row}" slot="${ele.__vModel__}">
          <avue-asso-popup :index="row.$index" :value="row['${ele.__vModel__}']"
          :conf='getTableConfConfig("${ele.__vModel__}")' 
          :dicData='${configDicDataKey}'
          bindTable="${bindTable}" @changeTableAssoData='changeTableAssoData' :disabled="disabled?disabled:getTableChildrenItemDisabled('${bindTable}','${ele.__vModel__}',false)"></avue-asso-popup>
          </template>
          `;
          } else if (ele.__config__.avueType == "load-tree") {
            slotScope += `
          <template slot-scope="{row}" slot="${ele.__vModel__}">
          <avue-load-tree :index="row.$index" v-model="row['${ele.__vModel__}']"
          :conf='getTableConfConfig("${ele.__vModel__}")' 
          :__type__="'${ele.__type__}'" bindTable="${bindTable}" 
          @changeTableTreeLoadData='changeTableTreeLoadData' :disabled="disabled?disabled:getTableChildrenItemDisabled('${bindTable}','${ele.__vModel__}',false)"></avue-load-tree>
          </template>
          `;
          }
        }
      });
      let className = config.showLabel ? '' : ' avueFormNoLable ';
      className += config.showComponentBorder == false ? ' avueFormNoInputBorder ' : '';
      className += config.showFormBorder == false ? ' avueFormNoBorder ' : '';
      className += config.showFormIndex == false ? ' avueFormNoIndex ' : '';
      className += config.doesTheTitleWrap ? ' avueFormTitleWrap ' : ' avueFormTitleNoWrap ';
      className += ' subTableForm ';
      if (config.isSelectData) {
        className += ' selectTableData ';
      }
      let str = `
          <avue-form 
            v-loading="${preloadLoading}" 
            class="${className}"
            element-loading-text="数据预加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.7)"
            :option="option${config.formId}" 
            v-model="${bindTable}" 
			ref="avueTable${bindTable}"
            __isInput__="hasFormPermission('${bindTable}')"
            __disabled__
            v-if="reRenderSubform"
            >
          ${slotScope}
          </avue-form>
          `;
      if (config.isSelectData) str += `<avue-table-data-list :avueFormData="avueFormData${config.formId}"  v-if="selectTableDataVisible${config.formId}"
				      v-on:onHandler="selectTableDataCallBack${config.formId}"></avue-table-data-list>`
      return colWrapper(scheme, str);
    } else if (config.componentName === 'avue-tabs') {
      const childrenObj = config?.childrenObj || {};
      const column = config?.option?.column || [];
      let tabPaneStr = '';
      //得到内容元素 根据数据结构   key/value形式 增加content字段 存放元素的htmlStr
      column.map(item => {
        tabPaneStr += '<el-tab-pane label="' + item.label + '" name="' + item.prop + '">';
        let tabChildren = childrenObj[item.prop] || [];
        tabChildren.map(el => {
          tabPaneStr += layouts[el.__config__.layout](el);
        })
        tabPaneStr = tabPaneStr + '</el-tab-pane>';
      });

      let str = `
            <el-tabs 
                v-model="tabsValue${scheme.__config__.formId}" 
                type="${scheme.__config__.tabsType}"
                tab-position="${scheme.__config__.tabPosition}">
                  ${tabPaneStr}
            </el-tabs>
          `;
      return colWrapper(scheme, str);
    } else {
      const type = scheme.type === 'default' ? '' : `type="${scheme.type}"`;
      const justify = scheme.type === 'default' ? '' : `justify="${scheme.justify}"`;
      const align = scheme.type === 'default' ? '' : `align="${scheme.align}"`;
      const gutter = scheme.gutter ? `:gutter="${scheme.gutter}"` : '';
      const children = config.children.map(el => {
        layouts[el.__config__.layout](el)
      });
      let str = `<el-row ${type} ${justify} ${align} ${gutter}>
          ${children.join('\n')}
        </el-row>`;
      str = colWrapper(scheme, str);
      return str;
    }
  }
};

const tags = {
  'el-divider': el => {
    const config = el.__config__;
    return `<div style="border-top: 1px solid #dcdfe6;margin-top: ${config.top}px;margin-bottom: ${config.bottom}px;"></div>`;
  },
  'el-button': el => {
    const {
      tag
    } = attrBuilder(el);
    const type = el.type ? `type="${el.type}"` : '';
    const icon = el.icon ? `icon="${el.icon}"` : '';
    const round = el.round ? 'round' : '';
    const size = el.size ? `size="${el.size}"` : '';
    const plain = el.plain ? 'plain' : '';
    const circle = el.circle ? 'circle' : '';
    let child = buildElButtonChild(el);

    if (child) child = `\n${child}\n`; // 换行
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    return `<${tag} ${type} ${icon} ${round} ${size} ${plain} ${__isDisabled__} ${circle} >${child}</${tag}>`;
  },
  'avue-custom-button': el => {
    const btnWidth = el.btnWidth ? `${el.btnWidth}` : '';
    const btnHeight = el.btnHeight ? `${el.btnHeight}` : '';
    const content = el.content;
    const prefixIcon = el['prefix-icon'] ? `class='${el['prefix-icon']}'` : '';
    const suffixIcon = el['suffix-icon'] ? `class='${el['suffix-icon']}'` : '';
    let clickHander = clickHander = `@click='getField${el.__config__.formId}Options()'`;
    let child = ``;
    if (prefixIcon) {
      child += `<i ${prefixIcon}></i>`;
    }
    child += `${content}`;
    if (suffixIcon) {
      child += `<i ${suffixIcon}></i>`;
    }
    let btnStyle = '';
    if (btnWidth) {
      btnStyle += 'width:' + btnWidth + 'px ;';
    }
    if (btnHeight) {
      btnStyle += 'height:' + btnHeight + 'px ;';
    }
    let style = btnStyle ? `style="${btnStyle}"` : "";

    return `<el-button type="primary" ${style} ${clickHander}>${child}</el-button>`;
  },
  'el-input': el => {
    let {
      tag, vModel, clearable, placeholder, width
    } = attrBuilder(el);

    const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : '';
    const showWordLimit = el['show-word-limit'] ? 'show-word-limit' : '';
    const prefixIcon = el['prefix-icon'] ? `prefix-icon='${el['prefix-icon']}'` : '';
    const suffixIcon = el['suffix-icon'] ? `suffix-icon='${el['suffix-icon']}'` : '';
    const showPassword = el['show-password'] ? 'show-password' : '';
    const type = el.type ? `type="${el.type}"` : '';
    const autosize = el.autosize && el.autosize.minRows
      ? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
      : '';
    //特殊组件处理  联想弹框 基于输入框 修改 增加点击事件，点击打开弹框
    const model = `${el.__vModel__}`;
    // const options = titleCase(model);
    // const handlerName = `handlerClick${options}`;
    //点击事件 传入参数 收集

    const focusHandler = el.__config__.openDialog ? `@focus='autoHandlerClick(autoHandlerClickConfig(${el.__config__.formId}))'  @clear="clearBombLayerFormData('${el.__vModel__}')" ` : ''
    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }

    let child = buildElInputChild(el);
    if (el.type == "number") {//财务组件
      vModel = `v-model.number="${confGlobal.formModel}['${el.__vModel__}']"`;
    }
    if (child) child = `\n${child}\n`; // 换行
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${model}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${model}',${el.readonly})"`;
    if (el.isCapitalized) {
      let blurHanderStr = `${model}ShowCapitalized=true;`;
      if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
        blurHanderStr = blurHanderStr + `triggerEventFormIdHandler(${el.__config__.formId})`;
      }
      blurHander = `@blur='${blurHanderStr}'`;
      return `<${tag} :value="getCapitalizedMethod(${confGlobal.formModel}.${model})" readonly ${maxlength} ${__isDisabled__} ${showWordLimit}  ${clearable} ${prefixIcon} ${suffixIcon} ${autosize} ${width} v-if="${model}ShowCapitalized" @focus="${model}ShowCapitalized=false">${child}</${tag}>
           <${tag} v-else ${vModel} ${type} ${placeholder} ${maxlength} ${__isDisabled__} ${__isReadonly__} ${showWordLimit}  ${clearable} ${prefixIcon} ${suffixIcon} ${autosize} ${width} ${blurHander}>${child}</${tag}>`
    } else {
      return `<${tag} ${vModel} ${type} ${placeholder} ${maxlength} ${__isDisabled__} ${__isReadonly__} ${showWordLimit}  ${clearable} ${prefixIcon} ${suffixIcon} ${showPassword} ${autosize} ${width} ${focusHandler} ${changeHander} ${blurHander}>${child}</${tag}>`;
    }

  },
  'el-mutiple-input': el => {
    const {
      vModel, clearable, placeholder, width
    } = attrBuilder(el);

    const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : '';
    const showWordLimit = el['show-word-limit'] ? 'show-word-limit' : '';
    const prefixIcon = el['prefix-icon'] ? `prefix-icon='${el['prefix-icon']}'` : '';
    const suffixIcon = el['suffix-icon'] ? `suffix-icon='${el['suffix-icon']}'` : '';
    const showPassword = el['show-password'] ? 'show-password' : '';
    const type = el.type ? `type="${el.type}"` : '';
    const autosize = el.autosize && el.autosize.minRows
      ? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
      : '';
    //特殊组件处理  多选弹窗 基于输入框 修改 增加点击事件，点击打开弹框
    const model = el.__vModel__;
    const vmodel = `v-model="${confGlobal.formModel}['${model}_showValue']"`
    //点击事件 传入参数 收集
    let params = {};
    let { label, formId, dataType, dataSource, dataItem, database, sql, showField, saveField, autoBindFields, avueType } = el.__config__;
    params = { label, formId, dataType, dataSource, dataItem, database, sql, showField, saveField, autoBindFields, avueType };
    params.model = model;
    if (el.__config__.dataType == 'dataApi') {
      params = { ...params, apiConfig: el.__config__.apiConfig }
    }
    //联想弹层
    if (el.__config__.openDialog) {
      if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
        params.eventData = el.__config__.triggerEventData['change'];
      }
    }
    params = JSON.stringify(params);
    let handler = avueType == 'asso-popup' ? 'autoHandlerClick' : 'mutipleHandlerClick';
    const clickHandler = el.__config__.openDialog ? `@focus='${handler}(autoHandlerClickConfig(${el.__config__.formId}))'    @clear="clearBombLayerFormData('${el.__vModel__}')"   ` : ''

    let child = buildElInputChild(el);

    if (child) child = `\n${child}\n`; // 换行
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${model}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${model}',${el.readonly})"`;
    let style = `style="display:none"`;

    let changeHander = '';
    let blurHander = '';
    if (!el.__config__.openDialog && el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (!el.__config__.openDialog && el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}
    return `<el-input ${vmodel} ${type} ${placeholder} ${maxlength} ${__isDisabled__} ${__isReadonly__} ${showWordLimit}  ${clearable} ${prefixIcon} ${suffixIcon} ${showPassword} ${autosize} ${width} ${clickHandler} ${blurHander}  ${changeHander}>${child}</el-input>
	<el-form-item prop="${model}" ${style}><el-input ${vModel}></el-input></el-form-item>`;
  },
  'el-input-number': el => {
    const {
      tag, vModel, placeholder
    } = attrBuilder(el);
    const controlsPosition = el['controls-position'] ? `controls-position=${el['controls-position']}` : '';
    const min = el.min != undefined ? `:min='${el.min}'` : '';
    const max = el.max != undefined ? `:max='${el.max}'` : '';
    const step = el.step ? `:step='${el.step}'` : '';
    const stepStrictly = el['step-strictly'] ? 'step-strictly' : '';
    const precision = el.precision ? `:precision='${el.precision}'` : '';
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;
    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}
    return `<${tag} ${vModel} ${placeholder} ${__isReadonly__} ${__isDisabled__} ${step} ${stepStrictly} ${precision} ${controlsPosition} ${min} ${max}  ${blurHander}  ${changeHander}></${tag}>`;
  },
  'el-select': el => {
    //联想框 特殊处理
    if (el.__config__.filterable && (el.__config__.dataType == 'dataSource' || el.__config__.dataType == 'dataSql')) {
      return buildAutoComplete(el);
    } else {
      return buildSelect(el);
    }
  },
  'el-radio-group': el => {
    const { tag, vModel } = attrBuilder(el);
    const size = `size="${el.size}"`;
    let child = buildElRadioGroupChild(el);

    if (child) child = `\n${child}\n`; // 换行
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;
    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}
    return `<${tag} ${vModel} ${size} ${__isDisabled__} ${__isReadonly__} ${blurHander}  ${changeHander}>${child}</${tag}>`;
  },
  'el-checkbox-group': el => {
    const { tag, vModel } = attrBuilder(el);
    const size = `size="${el.size}"`;
    // const min = el.min ? `:min="${el.min}"` : '';
    // const max = el.max ? `:max="${el.max}"` : '';
    let child = buildElCheckboxGroupChild(el);

    if (child) child = `\n${child}\n`; // 换行
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;
    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}
    return `<${tag} ${vModel} ${size} ${__isDisabled__} ${__isReadonly__} ${blurHander}  ${changeHander}>${child}</${tag}>`;
  },
  'el-switch': el => {
    const { tag, vModel } = attrBuilder(el);
    const activeText = el['active-text'] ? `active-text="${el['active-text']}"` : '';
    const inactiveText = el['inactive-text'] ? `inactive-text="${el['inactive-text']}"` : '';
    const activeColor = el['active-color'] ? `active-color="${el['active-color']}"` : '';
    const inactiveColor = el['inactive-color'] ? `inactive-color="${el['inactive-color']}"` : '';
    const activeValue = `:active-value='${el['active-value']}'`;
    const inactiveValue = `:inactive-value='${el['inactive-value']}'`;
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;
    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}
    return `<${tag} ${vModel} ${__isDisabled__} ${__isReadonly__} ${activeText} ${inactiveText} ${activeColor} ${inactiveColor} ${activeValue} ${inactiveValue}  ${blurHander}  ${changeHander}></${tag}>`;
  },
  'xjr-cascader': el => {
    const {
      tag, vModel, clearable, placeholder, width
    } = attrBuilder(el);
    // const options = el.options ? `:options="${el.__vModel__}Options"` : '';
    //const props = el.props ? `:props="${el.__vModel__}Props"` : '';
    const settings = `:settings="${el.__vModel__}settings"`;
    const showAllLevels = el['show-all-levels'] ? '' : ':show-all-levels="false"';
    const filterable = 'filterable';
    const separator = `separator="${el.separator}"`;
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    const checkStrictly = `:checkStrictly="${el.checkStrictly}"`;
    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}
    const show = `v-if="showForm"`;
    return `<${tag} ${vModel} ${__isDisabled__} ${settings} ${width} ${showAllLevels} ${placeholder} ${separator} ${checkStrictly}  ${filterable} ${clearable} ${show}  ${blurHander}  ${changeHander}></${tag}>`;
  },
  'el-slider': el => {
    const { tag, vModel } = attrBuilder(el);
    const min = el.min != undefined ? `:min='${el.min}'` : '';
    const max = el.max != undefined ? `:max='${el.max}'` : '';
    const step = el.step ? `:step='${el.step}'` : '';
    const range = el.range ? 'range' : '';
    const showStops = el['show-stops'] ? `:show-stops="${el['show-stops']}"` : '';
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;
    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}
    return `<${tag} ${__isDisabled__} ${__isReadonly__} ${min} ${max} ${step} ${vModel} ${range} ${showStops} ${blurHander}  ${changeHander}></${tag}>`;
  },
  'el-time-picker': el => {
    const {
      tag, vModel, clearable, placeholder, width
    } = attrBuilder(el);
    const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : '';
    const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : '';
    const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : '';
    const isRange = el['is-range'] ? 'is-range' : '';
    const format = el.format ? `format="${el.format}"` : '';
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : '';
    const pickerOptions = el['picker-options'] ? `:picker-options='${JSON.stringify(el['picker-options'])}'` : '';
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;

    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}

    return `<${tag} ${vModel} ${__isDisabled__} ${__isReadonly__} ${isRange} ${format} ${valueFormat} ${pickerOptions} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable}  ${blurHander}  ${changeHander}></${tag}>`;
  },
  'el-date-picker': el => {
    const {
      tag, vModel, clearable, placeholder, width
    } = attrBuilder(el);
    const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : '';
    const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : '';
    const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : '';
    const format = el.format ? `format="${el.format}"` : '';
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : '';
    const type = el.type === 'date' ? '' : `type="${el.type}"`;
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;

    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}

    return `<${tag} ${__isDisabled__} ${__isReadonly__} ${type} ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable}  ${blurHander}  ${changeHander}></${tag}>`;
  },
  'el-rate': el => {
    const { tag, vModel } = attrBuilder(el);
    const max = el.max ? `:max='${el.max}'` : '';
    const allowHalf = el['allow-half'] ? 'allow-half' : '';
    const showText = el['show-text'] ? 'show-text' : '';
    const showScore = el['show-score'] ? 'show-score' : '';
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;

    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}

    return `<${tag} ${vModel}  ${__isDisabled__} ${__isReadonly__}  ${blurHander}  ${changeHander} ${max} ${allowHalf} ${showText} ${showScore}></${tag}>`;
  },
  'el-color-picker': el => {
    const { tag, vModel } = attrBuilder(el);
    const size = `size="${el.size}"`;
    const showAlpha = el['show-alpha'] ? 'show-alpha' : '';
    const colorFormat = el['color-format'] ? `color-format="${el['color-format']}"` : '';
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;

    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}

    return `<${tag} ${vModel}  ${__isDisabled__} ${__isReadonly__}  ${size} ${showAlpha} ${colorFormat}  ${blurHander}  ${changeHander}></${tag}>`;
  },
  'el-upload': el => {
    const { vModel } = attrBuilder(el);
    const listType = `list-type="${el['list-type']}"`;
    let config = `:config="${el.__vModel__}Config"`;
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    // let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;
    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}
    return `<xjr-custom-upload 
    ${config} ${__isDisabled__} ${vModel}  ${listType} ${blurHander}  ${changeHander}></xjr-custom-upload>`;
  },
  'el-image': el => {
    const { tag, width } = attrBuilder(el);
    const fit = el.__config__.fit ? `:fit=${el.__config__.fit}` : '';
    const src = `:src='${confGlobal.formModel}.${el.__vModel__}'`;
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;
    //let ifVal = `v-if="${confGlobal.formModel}.${el.__vModel__}"`;
    let imgSlot = `<div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>`;
    return `<${tag} ${__isDisabled__} ${__isReadonly__} ${width} ${fit} ${src}>${imgSlot}</${tag}>`;
  },
  tinymce: el => {
    const { tag, vModel, placeholder } = attrBuilder(el);
    const height = el.height ? `:height="${el.height}"` : '';
    const branding = el.branding ? `:branding="${el.branding}"` : '';
    let __isDisabled__ = `__isDisabled__="disabled?disabled:hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="disabled?disabled:hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let validateForm = `@validateForm="validateForm"`;
    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}
    return `<${tag} ${vModel} ${__isDisabled__} ${__isReadonly__}  ${placeholder} ${height} ${branding} ${validateForm}  ${blurHander}  ${changeHander}></${tag}>`;
  },
  'avue-load-tree': el => {
    const { tag, vModel, placeholder, width } = attrBuilder(el);
    const type = `type="tree"`;
    const dic = `:dic="${el.__vModel__}Options"`;
    const __type__ = `:__type__="'${el.__type__}'"`

    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let blurHander = '';
    let changeHander = ''
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    return `<${tag} ${vModel} ${__isDisabled__} ${placeholder} ${type} ${dic} ${width} ${blurHander} ${changeHander} ${__type__} ></${tag}>`;
  },
  'h2': el => {
    const { tag, width } = attrBuilder(el);
    const config = el.__config__;
    return `<${tag} align='center' style="color:${config.defaultValue};font-size: ${config.fontSize}px;text-align: ${config.titlePosition}" ${width}>${el.__config__.label}</${tag}>`;
  },
  'xjr-select-user': el => {
    const { tag, placeholder, vModel } = attrBuilder(el);
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    //let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;
    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `triggerEventFormIdHandler(${el.__config__.formId})`;
    }
    let inputHandler = ` @input="${changeHander ? changeHander + '&&' : ''}validateForm"`;
    // ${blurHander}  ${changeHander}
    return `<${tag} ${vModel}  ${__isDisabled__} ${placeholder} v-if="showForm" :userIds="${confGlobal.formModel}.${el.__vModel__}" ${blurHander} ${inputHandler}></${tag}>`;
  },
  'avue-information-body': el => {
    const {
      tag, vModel, placeholder, width
    } = attrBuilder(el);
    const config = el.__config__;
    const multiple = el.multiple ? 'multiple' : '';
    let infoType = `infoType='${el.infoType}'`;
    let operationVal = ':operationVal="operationVal"';
    let whetherToRebindSecondaryEditing = `:whetherToRebindSecondaryEditing = '${config.whetherToRebindSecondaryEditing}'`;
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;

    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}

    return `<${tag} ${operationVal} ${infoType} ${whetherToRebindSecondaryEditing} ${vModel} ${placeholder}  ${__isDisabled__} ${__isReadonly__}  ${multiple} ${width}  ${blurHander}  ${changeHander}></${tag}>`;
  },
  'avue-select-area': el => {
    const {
      tag, vModel
    } = attrBuilder(el);
    let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
    let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;
    let clearableBind = `:clearable="${el.clearable}"`;
    let changeHander = '';
    let blurHander = '';
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('blur') && el.__config__.triggerEventData['blur'].length > 0) {
      blurHander = `@blur='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
      changeHander = `@change='triggerEventFormIdHandler(${el.__config__.formId})'`;
    }
    // ${blurHander}  ${changeHander}
    return `<${tag} v-if="showForm"  ${vModel} ${clearableBind}  ${__isDisabled__} ${__isReadonly__}  ${blurHander}  ${changeHander}></${tag}>`;
  },
  'xjr-opinion-comonent': el => {
    const {
      tag
    } = attrBuilder(el);
    let value = `:value="${confGlobal.formModel}.${el.__vModel__}"`;
    return `<${tag} ${value}></${tag}>`;
  },
  'info': (el) => {
    return `<h1>dddddddddddddddddd</h1>`;
  },
  'el-': el => {
    return `<el->`;
  }
};
function buildSelect(el) {
  const {
    tag, vModel, clearable, placeholder, width
  } = attrBuilder(el);
  const filterable = el.filterable ? 'filterable' : '';
  const multiple = el.multiple ? 'multiple' : '';
  //远程搜索下拉枉时 增加事件 目前 联想框有这个功能
  const handlerModel = `${el.__vModel__}`;
  const handlerName = `handlerSelect${handlerModel}`;

  let changeHander = '';
  if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
    changeHander = `triggerEventFormIdHandler(${el.__config__.formId})`;
  }

  const handlerEvent = el.__config__.filterable ? `@change="${changeHander ? changeHander + '&&' : ''}${handlerName}(formData.${el.__vModel__})"` : (changeHander ? `@change="${changeHander}"` : '')

  let child = buildElSelectChild(el);

  if (child) child = `\n${child}\n`; // 换行
  let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${el.__vModel__}',${el.disabled})"`;
  //let __isReadonly__ = `__isReadonly__="!hasEditPermission('${el.__vModel__}',${el.readonly})"`;

  return `<${tag} ${vModel} ${placeholder} ${__isDisabled__} ${multiple} ${filterable} ${clearable} ${width} ${handlerEvent}>${child}</${tag}>`;
}
function buildAutoComplete(el) {
  const {
    tag, vModel, clearable, placeholder, width, remote, remoteMethod, loading
  } = attrAutoCompleteBuilder(el);
  const model = `${el.__vModel__}`;
  const handlerName = `handlerSelect${model}`;
  const filterable = 'filterable';
  const multiple = el.multiple ? 'multiple' : '';
  const reserveKeyword = el.multiple ? 'reserve-keyword' : '';
  let changeHander = '';
  if (el.__config__.triggerEvents && el.__config__.triggerEvents.includes('change') && el.__config__.triggerEventData['change'].length > 0) {
    changeHander = `triggerEventFormIdHandler(${el.__config__.formId})`;
  }
  const handleSelect = JSON.stringify(el.__config__.autoBindFields) ? `@change="${changeHander ? changeHander + '&&' : ''}${handlerName}(formData.${el.__vModel__})"` : (changeHander ? `@change="${changeHander}"` : '')
  let child = buildElSelectChild(el);

  if (child) child = `\n${child}\n`; // 换行
  let __isDisabled__ = `__isDisabled__="hasDisabledPermission('${model}',${el.disabled})"`;
  let __isReadonly__ = `__isReadonly__="!hasEditPermission('${model}',${el.readonly})"`;



  return `<${tag} ${vModel} ${placeholder} ${__isDisabled__}  ${__isReadonly__} ${filterable} ${multiple} ${reserveKeyword} ${clearable} ${width} ${handleSelect} ${loading}>${child}</${tag}>`;
}
function attrBuilder(el) {
  let widthStyle = el.style && el.style.width ? `:style="{width: \'${el.style.width}\'}"` : ':style="{width: \'100%\'}"';
  return {
    tag: el.__config__.tag,
    vModel: `v-model="${confGlobal.formModel}['${el.__vModel__}']"`,
    clearable: el.clearable ? 'clearable' : '',
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
    width: widthStyle,
    disabled: el.disabled ? ':disabled=\'true\'' : ''
  };
}

function attrAutoCompleteBuilder(el) {
  // 特殊处理options属性
  const model = `${el.__vModel__}Options`;
  const options = titleCase(model);
  const methodName = `get${options}`;
  const loadingName = `${el.__vModel__}Loading`;
  return {
    tag: el.__config__.tag,
    vModel: `v-model="${confGlobal.formModel}.${el.__vModel__}"`,
    clearable: el.clearable ? 'clearable' : '',
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
    width: el.style && el.style.width ? ':style="{width: \'100%\'}"' : '',
    disabled: el.disabled ? ':disabled=\'true\'' : '',
    remote: 'remote',
    remoteMethod: `:remote-method="${methodName}"`,
    loading: `:loading="${loadingName}"`
  };
}

// el-buttin 子级
function buildElButtonChild(scheme) {
  const children = [];
  const slot = scheme.__slot__ || {};
  if (slot.default) {
    children.push(slot.default);
  }
  return children.join('\n');
}

// el-input 子级
function buildElInputChild(scheme) {
  const children = [];
  const slot = scheme.__slot__;
  if (slot && slot.prepend) {
    children.push(`<template slot="prepend">${slot.prepend}</template>`);
  }
  if (slot && slot.append) {
    children.push(`<template slot="append">${slot.append}</template>`);
  }
  return children.join('\n');
}

// el-select 子级
function buildElSelectChild(scheme) {
  const children = [];
  const slot = scheme.__slot__;

  if (scheme.__config__.dataType === 'dataSource' || scheme.__config__.dataType === 'dataSql') {
    children.push(`<el-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.${scheme.__config__.showField}" :value="item.${scheme.__config__.saveField}" :disabled="item.disabled"></el-option>`);
  }

  if (scheme.__config__.dataType === 'dataItem') {
    children.push(`<el-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.F_ItemName" :value="item.F_ItemValue" :disabled="item.disabled"></el-option>`);
  }

  if (scheme.__config__.dataType === 'dataApi') {
    children.push(`<el-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.${scheme.__config__.apiConfig.showField ? scheme.__config__.apiConfig.showField : 'name'}" :value="item.${scheme.__config__.apiConfig.saveField ? scheme.__config__.apiConfig.saveField : 'id'}" :disabled="item.disabled"></el-option>`);
  }

  if (!scheme.__config__.dataType && slot && slot.options && slot.options.length) {
    children.push(`<el-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>`);
  }
  return children.join('\n');
}
function buildElSelectDepartmentChild(scheme) {
  let userInfo = localStorage.getItem("avue-userInfo")
    ? JSON.parse(localStorage.getItem("avue-userInfo")).content
    : {};
  // let options =  [];
  const children = [];
  children.push(`<el-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>`)
  return children.join('\n');
}
// el-radio-group 子级
function buildElRadioGroupChild(scheme) {
  const children = [];
  const slot = scheme.__slot__;
  const config = scheme.__config__;

  const tag = config.optionType === 'button' ? 'el-radio-button' : 'el-radio';
  const border = config.border ? 'border' : '';

  if (scheme.__config__.dataType === 'dataSource') {
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.${scheme.__config__.saveField}" :disabled="item.disabled" ${border}>{{item.${scheme.__config__.showField}}}</${tag}>`);
  }

  if (scheme.__config__.dataType === 'dataItem') {
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.F_ItemValue" :disabled="item.disabled" ${border}>{{item.F_ItemName}}</${tag}>`);
  }
  if (scheme.__config__.dataType === 'dataApi') {
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.${scheme.__config__.apiConfig.saveField ? scheme.__config__.apiConfig.saveField : 'name'}" :disabled="item.disabled" ${border}>{{item.${scheme.__config__.apiConfig.showField ? scheme.__config__.apiConfig.showField : 'id'}}}</${tag}>`);
  }

  if (!scheme.__config__.dataType && slot && slot.options && slot.options.length) {
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`);
  }
  return children.join('\n');
}

// el-checkbox-group 子级
function buildElCheckboxGroupChild(scheme) {
  const children = [];
  const slot = scheme.__slot__;
  const config = scheme.__config__;

  const tag = config.optionType === 'button' ? 'el-checkbox-button' : 'el-checkbox';
  const border = config.border ? 'border' : '';

  if (scheme.__config__.dataType === 'dataSource') {
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.${scheme.__config__.saveField}" :disabled="item.disabled" ${border}>{{item.${scheme.__config__.showField}}}</${tag}>`);
  }

  if (scheme.__config__.dataType === 'dataItem') {
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.F_ItemValue" :disabled="item.disabled" ${border}>{{item.F_ItemName}}</${tag}>`);
  }

  if (scheme.__config__.dataType === 'dataApi') {
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.${scheme.__config__.apiConfig.saveField ? scheme.__config__.apiConfig.saveField : 'name'}" :disabled="item.disabled" ${border}>{{item.${scheme.__config__.apiConfig.showField ? scheme.__config__.apiConfig.showField : 'id'}}}</${tag}>`);
  }

  if (!scheme.__config__.dataType && slot && slot.options && slot.options.length) {

    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`);
  }
  return children.join('\n');
}


/** 
 * 组装html代码。【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpHtml(formConfig, type) {
  const htmlList = [];
  confGlobal = formConfig;
  // 判断布局是否都沾满了24个栅格，以备后续简化代码结构
  someSpanIsNot24 = formConfig.fields.some(item => item.__config__.span !== 24);
  // 遍历渲染每个组件成html
  mutipleCount = 0;
  popupCount = 0;

  formConfig.fields.forEach(el => {
    let elstr = layouts[el.__config__.layout](el)
    htmlList.push(elstr);
  });

  const htmlStr = htmlList.join('\n');
  // 将组件代码放进form标签
  let temp = buildFormTemplate(formConfig, htmlStr, type);
  // dialog标签包裹代码
  if (type === 'dialog') {
    temp = dialogWrapper(temp);
  }
  confGlobal = null;
  return temp;
}
