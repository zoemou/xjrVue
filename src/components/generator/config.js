import i18n from "@/lang";
import {
  baseUrl
} from '@/config/env';
// 表单属性【右面板】
export const formConf = {
  formRef: 'elForm',
  formModel: 'formData',
  size: 'medium',
  formSize: 'fullscreen',
  labelPosition: 'right',
  labelWidth: 100,
  formRules: 'rules',
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: true,
  hideComponents: []
};

// 输入型组件 【左面板】
export const inputComponents = [

  {
    // 组件的自定义配置
    __config__: {
      label: i18n.t('code.leftScrollbar.component.singleLineText'),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      avueType: 'input-tip',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      F_LgMarkCode: '', //翻译标记
      // 正则校验规则
      regList: [],
      // 组件触发事件
      triggerEvents: ['blur'],
      triggerEventData: {
        'blur': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: i18n.t('code.leftScrollbar.component.hintEnter'),
    style: {
      width: '100%'
    },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.multilineText'),
      labelWidth: null,
      showLabel: true,
      tag: 'el-input',
      tagIcon: 'textarea',
      avueType: 'textarea',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['blur'],
      triggerEventData: {
        'blur': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    type: 'textarea',
    placeholder: i18n.t('code.leftScrollbar.component.hintEnter'),
    autosize: {
      minRows: 4,
      maxRows: 4
    },
    style: {
      width: '100%'
    },
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.password'),
      showLabel: true,
      labelWidth: null,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'password',
      avueType: 'password',
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['blur'],
      triggerEventData: {
        'blur': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    __slot__: {
      prepend: '',
      append: ''
    },
    placeholder: i18n.t('code.leftScrollbar.component.hintEnter'),
    'show-password': true,
    style: {
      width: '100%'
    },
    clearable: true,
    'prefix-icon': '',
    // 'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.counter'),
      showLabel: true,
      changeTag: true,
      labelWidth: null,
      tag: 'el-input-number',
      tagIcon: 'number',
      avueType: 'number',
      defaultValue: 0,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      document: 'https://element.eleme.cn/#/zh-CN/component/input-number',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['blur'],
      triggerEventData: {
        'blur': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    placeholder: '',
    min: undefined,
    max: undefined,
    step: 1,
    'step-strictly': false,
    precision: undefined,
    'controls-position': '',
    disabled: false,
    readonly: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.editor'),
      showLabel: true,
      changeTag: true,
      labelWidth: null,
      tag: 'tinymce',
      tagIcon: 'rich-text',
      avueType: 'ueditor',
      defaultValue: null,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      document: 'http://tinymce.ax-z.cn',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['blur'],
      triggerEventData: {
        'blur': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    placeholder: i18n.t('code.leftScrollbar.component.hintEnter'),
    height: 300, // 编辑器高度
    disabled: false,
    branding: false // 隐藏右下角品牌烙印
  },
  {
    // 组件的自定义配置
    __config__: {
      label: i18n.t('code.leftScrollbar.component.codes'),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      avueType: 'autoCode',
      required: false,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      F_LgMarkCode: '', //翻译标记
      // 正则校验规则
      regList: [],
      autoCodeRule: '',    //存放自定义编码规则,
      prestrainField: ''  //子表单预加载字段
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: '',
    style: {
      width: '100%'
    },
    clearable: false,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: undefined,
    'show-word-limit': undefined,
    autoCode: true,    //是否显示编码规则选择框
    readonly: true,
    disabled: undefined
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.lenovoDropdown'),
      showLabel: true,
      labelWidth: null,
      tag: 'el-select',
      tagIcon: 'input',
      avueType: 'asso-select',
      filterable: true,
      layout: 'colFormItem',
      defaultValue: undefined,
      span: 24,
      required: true,
      dataType: 'dataSource',
      regList: [],
      autoBindFields: '',    //记录联想需同步数据的绑定组件记录 类型: JSON字符串 key:value  key:组件formId  value:字段名称
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/select',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    __slot__: {
      options: [{
        label: i18n.t('code.leftScrollbar.component.optionOne'),
        value: 1
      }, {
        label: i18n.t('code.leftScrollbar.component.optionTwo'),
        value: 2
      }]
    },
    placeholder: i18n.t('code.leftScrollbar.component.placeholderSelect'),
    style: {
      width: '100%'
    },
    clearable: true,
    disabled: false,
    filterable: true,
    multiple: false,
  },
  {
    // 组件的自定义配置
    __config__: {
      label: i18n.t('code.leftScrollbar.component.lenovoLayer'),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-mutiple-input',
      tagIcon: 'input',
      avueType: 'asso-popup',
      openDialog: true,
      defaultValue: undefined,
      showValue: undefined,
      filterable: true,    //开启联想框
      required: true,
      layout: 'colFormItem',
      dataType: 'dataSource',
      saveField: '',
      showField: '',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      F_LgMarkCode: '', //翻译标记
      // 正则校验规则
      regList: [],
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: '',  //子表单预加载字段
      autoBindFields: '',    //记录联想需同步数据的绑定组件记录 类型: JSON字符串 key:value  key:组件formId  value:字段名称
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: i18n.t('code.leftScrollbar.component.hintEnter'),
    style: {
      width: '100%'
    },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': 'el-icon-more',
    maxlength: null,
    'show-word-limit': false,
    disabled: false
  },
  {
    // 组件的自定义配置
    __config__: {
      label: i18n.t('code.leftScrollbar.component.multipleLayer'),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-mutiple-input',
      tagIcon: 'input',
      avueType: 'mutiple-popup',
      openDialog: true,
      defaultValue: undefined,
      showValue: undefined,
      filterable: true,    //开启联想框
      required: true,
      layout: 'colFormItem',
      dataType: 'dataSource',
      saveField: '',
      showField: '',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      F_LgMarkCode: '', //翻译标记
      // 正则校验规则
      regList: [],
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: '',  //子表单预加载字段
      autoBindFields: '',    //记录联想需同步数据的绑定组件记录 类型: JSON字符串 key:value  key:组件formId  value:字段名称
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: i18n.t('code.leftScrollbar.component.hintEnter'),
    style: {
      width: '100%'
    },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': 'el-icon-more',
    maxlength: null,
    'show-word-limit': false,
    disabled: false
  },
  {
    __config__: {
      label: i18n.t('button'),
      showLabel: false,
      changeTag: true,
      labelWidth: null,
      isBindTable: false, // 是否需要绑表
      tag: 'avue-custom-button',
      avueType: 'custom-button',
      tagIcon: 'button',
      span: 24,
      layout: 'colFormItem',
      // 组件触发事件
      triggerEvents: ['click', 'clickAfter'],
      triggerEventData: {
        'click': [],
        'clickAfter': []
      },
    },
    btnWidth: 0,
    btnHeight: 0,
    content: i18n.t('mobileDev.loginRightSide.labelBtnName'),
    'prefix-icon': '',
    'suffix-icon': '',
    type: 'primary'
  },
];

// 选择型组件 【左面板】
export const selectComponents = [
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.dropdownSelect'),
      showLabel: true,
      labelWidth: null,
      tag: 'el-select',
      tagIcon: 'select',
      avueType: 'select',
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      dataType: 'dataSource',
      saveField: '',
      showField: '',
      document: 'https://element.eleme.cn/#/zh-CN/component/select',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    __slot__: {
      options: [{
        label: i18n.t('code.leftScrollbar.component.optionOne'),
        value: 1
      }, {
        label: i18n.t('code.leftScrollbar.component.optionTwo'),
        value: 2
      }]
    },
    placeholder: i18n.t('code.leftScrollbar.component.placeholderSelect'),
    style: {
      width: '100%'
    },
    clearable: true,
    disabled: false,
    filterable: true,
    multiple: false,
    //readonly:false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.cascadeSelect'),
      url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList',
      method: 'get',
      dataKey: 'list',
      showLabel: true,
      labelWidth: null,
      tag: 'xjr-cascader',
      tagIcon: 'cascader',
      avueType: 'cascader',
      layout: 'colFormItem',
      defaultValue: [],
      settings: [], //用于存储数据源配置json
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/cascader',
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      F_LgMarkCode: '' //翻译标记
    },
    checkStrictly: false,
    //options: [],
    placeholder: i18n.t('code.leftScrollbar.component.placeholderSelect'),
    style: {
      width: '100%'
    },
    props: {

    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    //filterable: false,
    separator: '/',
    readonly: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.radioGroup'),
      labelWidth: null,
      showLabel: true,
      tag: 'el-radio-group',
      tagIcon: 'radio',
      avueType: 'radio',
      changeTag: true,
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      optionType: 'default',
      regList: [],
      dataType: 'dataSource',
      required: true,
      border: false,
      saveField: '',
      showField: '',
      document: 'https://element.eleme.cn/#/zh-CN/component/radio',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    __slot__: {
      options: [{
        label: i18n.t('code.leftScrollbar.component.optionOne'),
        value: 1
      }, {
        label: i18n.t('code.leftScrollbar.component.optionTwo'),
        value: 2
      }]
    },
    style: {},
    size: 'medium',
    disabled: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.checkboxGroup'),
      tag: 'el-checkbox-group',
      tagIcon: 'checkbox',
      avueType: 'checkbox',
      defaultValue: [],
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      optionType: 'default',
      required: true,
      regList: [],
      changeTag: true,
      border: false,
      dataType: 'dataSource',
      saveField: '',
      showField: '',
      document: 'https://element.eleme.cn/#/zh-CN/component/checkbox',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    __slot__: {
      options: [{
        label: i18n.t('code.leftScrollbar.component.optionOne'),
        value: 1
      }, {
        label: i18n.t('code.leftScrollbar.component.optionTwo'),
        value: 2
      }]
    },
    style: {},
    size: 'medium',
    min: null,
    max: null,
    disabled: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.switchs'),
      tag: 'el-switch',
      tagIcon: 'switch',
      avueType: 'switch',
      defaultValue: false,
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      required: false,
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/switch',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    style: {},
    disabled: false,
    'active-text': '',
    'inactive-text': '',
    'active-color': null,
    'inactive-color': null,
    'active-value': 1,
    'inactive-value': 0
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.slider'),
      tag: 'el-slider',
      tagIcon: 'slider',
      avueType: 'slider',
      defaultValue: null,
      span: 24,
      showLabel: true,
      layout: 'colFormItem',
      labelWidth: null,
      required: false,
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/slider',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    disabled: false,
    min: 0,
    max: 100,
    step: 1,
    'show-stops': false,
    range: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.timeSelect'),
      tag: 'el-time-picker',
      tagIcon: 'time',
      avueType: 'time',
      defaultValue: null,
      span: 24,
      showLabel: true,
      layout: 'colFormItem',
      labelWidth: null,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/time-picker',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    placeholder: i18n.t('code.leftScrollbar.component.placeholderSelect'),
    style: {
      width: '100%'
    },
    disabled: false,
    clearable: true,
    'picker-options': {
      selectableRange: '00:00:00-23:59:59'
    },
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss',
    readonly: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.timeRange'),
      tag: 'el-time-picker',
      tagIcon: 'time-range',
      avueType: 'timerange',
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      defaultValue: ['', ''],
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/time-picker',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    style: {
      width: '100%'
    },
    disabled: false,
    clearable: true,
    'is-range': true,
    'range-separator': i18n.t('searchModule.rangeSeparator'),
    'start-placeholder': i18n.t('searchModule.startPlaceholder'),
    'end-placeholder': i18n.t('searchModule.endPlaceholder'),
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss',
    readonly: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.dateSelect'),
      tag: 'el-date-picker',
      tagIcon: 'date',
      avueType: 'datetime',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    placeholder: i18n.t('code.leftScrollbar.component.placeholderSelect'),
    type: 'date',
    style: {
      width: '100%'
    },
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.dateRange'),
      tag: 'el-date-picker',
      tagIcon: 'date-range',
      avueType: 'daterange',
      defaultValue: [],
      span: 24,
      showLabel: true,
      labelWidth: null,
      required: true,
      layout: 'colFormItem',
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    style: {
      width: '100%'
    },
    type: 'daterange',
    'range-separator': i18n.t('searchModule.rangeSeparator'),
    'start-placeholder': i18n.t('searchModule.startDatePlaceholder'),
    'end-placeholder': i18n.t('searchModule.endDatePlaceholder'),
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.score'),
      tag: 'el-rate',
      tagIcon: 'rate',
      avueType: 'rate',
      defaultValue: 0,
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      required: false,
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/rate',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    style: {},
    max: 5,
    'allow-half': false,
    'show-text': false,
    'show-score': false,
    disabled: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.colorSelect'),
      tag: 'el-color-picker',
      tagIcon: 'color',
      avueType: 'color',
      span: 24,
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      required: false,
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/color-picker',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    'show-alpha': false,
    'color-format': '',
    disabled: false,
    size: 'medium'
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.upload'),
      tag: 'el-upload',
      tagIcon: 'upload',
      avueType: 'upload',
      layout: 'colFormItem',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      required: true,
      span: 24,
      showTip: false,
      buttonText: i18n.t('code.leftScrollbar.component.clickUpload'),
      regList: [],
      changeTag: true,
      fileSize: 2,
      sizeUnit: 'MB',
      document: 'https://element.eleme.cn/#/zh-CN/component/upload',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    __slot__: {
      'list-type': true
    },
    action: baseUrl + `/upload`,
    disabled: false,
    accept: '',
    name: 'file',
    'auto-upload': true,
    'list-type': 'text',
    multiple: false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.image'),
      showLabel: true,
      labelWidth: null,
      tag: 'el-image',
      tagIcon: 'image',
      layout: 'colFormItem',
      span: 24,
      fit: '',
      defaultValue: '',
      document: 'https://element.eleme.cn/#/zh-CN/component/image',
      F_LgMarkCode: '', //翻译标记
      prestrainField: ''  //子表单预加载字段
    },
    __vModel__: {

    },
    style: {
      width: '100%'
    }
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.selectArea'),
      url: '',
      method: 'get',
      dataKey: 'list',
      showLabel: true,
      labelWidth: null,
      tag: 'avue-select-area',
      tagIcon: 'cascader',
      avueType: 'select-area',
      layout: 'colFormItem',
      defaultValue: [],
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/cascader',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    placeholder: i18n.t('code.leftScrollbar.component.placeholderSelect'),
    style: {
      width: '100%'
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: '/'
  },
];

// 布局型组件 【左面板】
export const layoutComponents = [
  // {
  //   __config__: {
  //     layout: 'rowFormItem',
  //     tagIcon: 'row',
  //     label: '行容器',
  //     layoutTree: true,
  //     document: 'https://element.eleme.cn/#/zh-CN/component/layout#row-attributes'
  //   },
  //   type: 'default',
  //   justify: 'start',
  //   align: 'top'
  // },
  {
    __config__: {
      layout: 'rowFormItem',
      componentName: 'table',
      componentTitle: 'table',
      tagIcon: 'row',
      label: i18n.t('code.leftScrollbar.component.table'),
      layoutTree: true,
      dataType: '',
      showLabel: true,//是否显示标签
      labelTitle: "",
      showComponentBorder: true,//显示组件边框
      showFormBorder: true,//显示表单边框
      showFormIndex: true,//是否显示序号
      doesTheTitleWrap: false,//标题是否换行
      useDefaultSort: true,//使用默认排序
      sortField: '',//排序字段
      document: 'https://element.eleme.cn/#/zh-CN/component/layout#row-attributes',
      isSelectData: false,//按钮选择数据
      buttonName: i18n.t('selectData'),
      sourceTableHeader: [],//数据源表头
      itemTableHeader: [] //数据字典表头
    },
    type: 'default',
    justify: 'start',
    align: 'top'

  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.divider'),
      showLabel: false,
      changeTag: true,
      isBindTable: false, // 是否需要绑表
      direction: 'horizontal',  // 分割线方向
      contentPosition: '',  // 分割线文案的位置
      tag: 'el-divider',
      tagIcon: 'split-line',
      top: 0,
      bottom: 0,
      span: 24,
      layout: 'colFormItem',
      document: 'https://element.eleme.cn/#/zh-CN/component/divider',
      F_LgMarkCode: '', //翻译标记
      prestrainField: ''  //子表单预加载字段
    },
    __slot__: {},
  },
  {
    // type: 'flex',
    // justify: 'start',
    __config__: {
      label: i18n.t('code.leftScrollbar.component.title'),
      changeTag: null,
      isBindTable: false,
      showLabel: false,
      labelWidth: undefined,
      titlePosition: 'center',
      titleColor: null,
      fontSize: null,
      defaultValue: undefined,
      tag: 'h2',
      tagIcon: 'title',
      span: 24,
      align: 'top',
      justify: 'start',
      layout: 'colFormItem',
      document: 'https://element.eleme.cn/#/zh-CN/component/button',
      F_LgMarkCode: '', //翻译标记
      prestrainField: ''  //子表单预加载字段
    },
    __slot__: {},
    __vModel__: {},
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.tabs'),
      showLabel: false,
      labelWidth: null,
      isBindTable: false,
      tag: 'avue-tabs',
      componentName: 'avue-tabs',
      componentTitle: '选项卡',
      tagIcon: 'tabs',
      span: 24,
      layout: 'rowFormItem',
      layoutTree: true,
      currentTab: 'tab1',
      tabsType: '',    //标签风格  1.'' 2.'card' 3.'border-card' 
      tabPosition: 'top',   //选项卡位置属性  
      option: {
        submitBtn: false,
        emptyBtn: false,
        column: [{
          icon: 'el-icon-info',
          label: i18n.t('code.leftScrollbar.component.tab1'),
          prop: 'tab1'
        }, {
          icon: 'el-icon-warning',
          label: i18n.t('code.leftScrollbar.component.tab2'),
          prop: 'tab2'
        }, {
          icon: 'el-icon-question',
          label: i18n.t('code.leftScrollbar.component.tab3'),
          prop: 'tab3'
        }]
      },
      document: 'https://avuejs.com/doc/form/form-tabs',
      F_LgMarkCode: '' //翻译标记
    },
    type: 'default',
    justify: 'start',
    align: 'top',
    __slot__: {}
  }
  // {
  //   __config__: {
  //     label: '按钮',
  //     showLabel: true,
  //     changeTag: true,
  //     labelWidth: null,
  //     tag: 'el-button',
  //     tagIcon: 'button',
  //     span: 24,
  //     layout: 'colFormItem',
  //     document: 'https://element.eleme.cn/#/zh-CN/component/button'
  //   },
  //   __slot__: {
  //     default: '主要按钮'
  //   },
  //   type: 'primary',
  //   icon: 'el-icon-search',
  //   round: false,
  //   size: 'medium',
  //   plain: false,
  //   circle: false,
  //   disabled: false
  // },
  // {
  //   __config__: {
  //     layout: 'colFormItem',
  //     tagIcon: 'table',
  //     tag: 'el-table',
  //     document: 'https://element.eleme.cn/#/zh-CN/component/table',
  //     span: 24,
  //     formId: 101,
  //     renderKey: 1595761764203,
  //     componentName: 'row101',
  //     showLabel: true,
  //     changeTag: true,
  //     labelWidth: null,
  //     label: '表格[开发中]',
  //     children: [{
  //       __config__: {
  //         layout: 'raw',
  //         tag: 'el-table-column',
  //         renderKey: 15957617660153
  //       },
  //       prop: 'date',
  //       label: '日期'
  //     }, {
  //       __config__: {
  //         layout: 'raw',
  //         tag: 'el-table-column',
  //         renderKey: 15957617660152
  //       },
  //       prop: 'address',
  //       label: '地址'
  //     }, {
  //       __config__: {
  //         layout: 'raw',
  //         tag: 'el-table-column',
  //         renderKey: 15957617660151
  //       },
  //       prop: 'name',
  //       label: '名称'
  //     }, {
  //       __config__: {
  //         layout: 'raw',
  //         tag: 'el-table-column',
  //         renderKey: 1595774496335,
  //         children: [{
  //           __config__: {
  //             label: '按钮',
  //             tag: 'el-button',
  //             tagIcon: 'button',
  //             layout: 'raw',
  //             renderKey: 1595779809901
  //           },
  //           __slot__: {
  //             default: '主要按钮'
  //           },
  //           type: 'primary',
  //           icon: 'el-icon-search',
  //           round: false,
  //           size: 'medium'
  //         }]
  //       },
  //       label: '操作'
  //     }]
  //   },
  //   data: [{
  //     date: '2016-05-02',
  //     name: '王小虎',
  //     address: '上海市普陀区金沙江路 1518 弄'
  //   }],
  //   border: true,
  //   type: 'default',
  //   justify: 'start',
  //   align: 'top'
  // }
];

// 工作流相关组件 【左面板】
export const WorkFlowComponents = [
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.opinionComonent'),
      labelWidth: null,
      showLabel: true,
      isBindTable: false, // 是否需要绑数据表 
      tag: 'xjr-opinion-comonent',
      tagIcon: 'textarea',
      defaultValue: null,
      layout: 'colFormItem',
      span: 24,
      F_LgMarkCode: '', //翻译标记
      prestrainField: ''  //子表单预加载字段
    },
    type: 'textarea',
    __type__: "opinion",
    style: {
      width: '100%'
    },
  },];

// 组织机构相关组件 【左面板】
export const OrganizationComponents = [
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.inforBody'),
      labelWidth: null,
      showLabel: true,
      tag: 'avue-information-body',
      "avueType": "information-body",
      tagIcon: 'select',
      defaultValue: null,
      required: false,
      layout: 'colFormItem',
      url: baseUrl + '/users/multi',
      span: 24,
      whetherToRebindSecondaryEditing: false,
      //regList: [],
      //changeTag: true,
      bindTableField: '',
      document: 'https://element.eleme.cn/#/zh-CN/component/select',
      F_LgMarkCode: '', //翻译标记
      prestrainField: ''  //子表单预加载字段
    },
    __organize__: true,
    placeholder: i18n.t('code.leftScrollbar.component.curCompany'),
    infoType: 'company',
    __type__: 'info',
    style: {
      width: '100%'
    },
    __info__: true,
    //maxlength: null,
    'disabled': true,
    'show-word-limit': undefined,
    readonly: true
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.company'),
      labelWidth: null,
      showLabel: true,
      tag: 'avue-load-tree',
      tagIcon: 'company',
      defaultValue: undefined,
      avueType: 'load-tree',
      require: true,
      layout: 'colFormItem',
      span: 24,
      method: 'get',
      // url: baseUrl + '/companies/tree',
      dataKey: 'data',
      required: true,
      //regList: [],
      //changeTag: true,
      bindTableField: '',
      document: 'https://avuejs.com/doc/component/input-tree',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    __type__: 'company',
    __formateData__: {
      fieldId: 'F_CompanyId',
      fieldName: 'F_FullName',
      // children: 'children'
    },
    style: {
      width: '100%'
    },
    __organize__: true,
    __organizeOptions__: [{
      label: i18n.t('code.leftScrollbar.component.defaultCompany'),
      value: 'company'
    }],
    dic: [],
    type: 'tree',
    placeholder: i18n.t('code.leftScrollbar.component.defaultCompany'),
    'default-expand-all': false,
    //maxlength: null,
    'show-word-limit': undefined,
    //readonly: true,
    'disabled': false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.department'),
      labelWidth: null,
      showLabel: true,
      required: true,
      tag: 'avue-load-tree',
      tagIcon: 'department',
      defaultValue: undefined,
      avueType: 'load-tree',
      method: 'get',
      url: baseUrl + '/companies/departments/tree',
      dataKey: 'data',
      layout: 'colFormItem',
      span: 24,
      require: false,
      //regList: [],
      //changeTag: true,
      bindTableField: '',
      document: 'https://avuejs.com/doc/component/input-tree',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    __type__: 'department',
    __formateData__: {
      fieldId: 'F_DepartmentId',
      fieldName: 'F_FullName',
      // children: 'children'
    },
    style: {
      width: '100%'
    },
    __organize__: true,
    __organizeOptions__: [{
      label: i18n.t('code.leftScrollbar.component.defaultDepart'),
      value: 'department'
    }],
    dic: [],
    type: 'tree',
    lazy: true,
    treeLoad: undefined,
    placeholder: i18n.t('code.leftScrollbar.component.defaultCompany'),
    //maxlength: null,
    'show-word-limit': undefined,
    //readonly: true,
    'disabled': false
  },
  {
    __config__: {
      label: i18n.t('code.leftScrollbar.component.personnel'),
      labelWidth: null,
      showLabel: true,
      tag: 'xjr-select-user',
      tagIcon: 'personnel',
      defaultValue: undefined,
      saveValue: '',
      required: false,
      layout: 'colFormItem',
      url: baseUrl + '/users/multi/',
      span: 24,
      //regList: [],
      //changeTag: true,
      bindTableField: '',
      document: 'https://element.eleme.cn/#/zh-CN/component/dialog',
      F_LgMarkCode: '', //翻译标记
      // 组件触发事件
      triggerEvents: ['change'],
      triggerEventData: {
        'change': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    __type__: 'user',
    style: {
      width: '100%'
    },
    __organize__: true,
    __organizeOptions__: [{
      label: i18n.t('code.leftScrollbar.component.defaultPerson'),
      value: 'user'
    }],
    'suffix-icon': 'el-icon-setting',
    placeholder: i18n.t('code.leftScrollbar.component.placeholderSelect'),
    //maxlength: null,
    'show-word-limit': undefined,
    //readonly: true,
    'disabled': false
  }
];

// 财务组件 【左面板】
export const FinanceComponents = [
  {
    // 组件的自定义配置
    __config__: {
      label: i18n.t('code.leftScrollbar.component.currency'),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      avueType: 'input',
      isFinance: true,
      defaultValue: 0,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      F_LgMarkCode: '', //翻译标记
      // 正则校验规则
      regList: [],
      // 组件触发事件
      triggerEvents: ['blur'],
      triggerEventData: {
        'blur': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '¥',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    type: 'number',
    computationalConfiguration: [],//计算式配置
    computationalConfigurationValue: '',//计算式配置值
    relativeComObject: null,    //所关联的计算公式根级formId
    placeholder: i18n.t('code.leftScrollbar.component.hintEnter'),
    style: {
      width: '100%'
    },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    // 组件的自定义配置
    __config__: {
      label: i18n.t('code.leftScrollbar.component.currencyUnit'),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      avueType: 'input',
      isFinance: true,
      defaultValue: 0,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      F_LgMarkCode: '', //翻译标记
      // 正则校验规则
      regList: [],
      // 组件触发事件
      triggerEvents: ['blur'],
      triggerEventData: {
        'blur': []
      },
      prestrainField: ''  //子表单预加载字段
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: 'CNY'
    },
    // 其余的为可直接写在组件标签上的属性
    type: 'number',
    computationalConfiguration: [],//计算式配置
    computationalConfigurationValue: '',//计算式配置值
    relativeComObject: null,    //所关联的计算公式根级formId
    placeholder: i18n.t('code.leftScrollbar.component.hintEnter'),
    style: {
      width: '100%'
    },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    // 组件的自定义配置
    __config__: {
      label: i18n.t('code.leftScrollbar.component.currencyCapital'),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      avueType: 'input',
      isFinance: true,
      defaultValue: 0,
      capitalizedValue: '',
      showCapitalizedValue: true,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      F_LgMarkCode: '', //翻译标记
      // 正则校验规则
      regList: [],
      // 组件触发事件
      triggerEvents: ['blur'],
      triggerEventData: {
        'blur': []
      },
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    type: 'number',
    isCapitalized: true,
    computationalConfiguration: [],//计算式配置
    computationalConfigurationValue: '',//计算式配置值
    relativeComObject: null,    //所关联的计算公式根级formId
    placeholder: i18n.t('code.leftScrollbar.component.hintEnter'),
    style: {
      width: '100%'
    },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    prestrainField: ''  //子表单预加载字段
  },
  {
    // 组件的自定义配置
    __config__: {
      label: i18n.t('code.leftScrollbar.component.count'),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      avueType: 'input',
      isFinance: true,
      defaultValue: 0,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      F_LgMarkCode: '', //翻译标记
      // 正则校验规则
      regList: [],
      // 组件触发事件
      triggerEvents: ['blur'],
      triggerEventData: {
        'blur': []
      },
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    type: 'number',
    computationalConfiguration: [],//计算式配置
    computationalConfigurationValue: '',//计算式配置值
    relativeComObject: null,    //所关联的计算公式根级formId
    placeholder: i18n.t('code.leftScrollbar.component.hintEnter'),
    style: {
      width: '100%'
    },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    prestrainField: ''  //子表单预加载字段
  },
  {
    // 组件的自定义配置
    __config__: {
      label: i18n.t('code.leftScrollbar.component.rate'),
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      avueType: 'input',
      isFinance: true,
      defaultValue: 0,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      F_LgMarkCode: '', //翻译标记
      // 正则校验规则
      regList: [],
      // 组件触发事件
      triggerEvents: ['blur'],
      triggerEventData: {
        'blur': []
      },
    },
    // 组件的插槽属性
    __slot__: {
      prepend: i18n.t('taxIncl') + '3%',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    type: 'number',
    isTax: true,
    taxRate: 3,
    computationalConfiguration: [],//计算式配置
    computationalConfigurationValue: '',//计算式配置值
    relativeComObject: null,    //所关联的计算公式根级formId
    placeholder: i18n.t('code.leftScrollbar.component.hintEnter'),
    style: {
      width: '100%'
    },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    prestrainField: ''  //子表单预加载字段
  },
];