import ElComponent from './ElComponent.vue'
import CustomUpload from './Upload.vue'
import CustomeImage from './Image.vue'
import CustomeTitle from './Title.vue'
import CustomeDivider from './Divider.vue'
import CustomeInfo from './Info.vue'
import CustomeUser from './User.vue'
import CustomeSelect from './Select.vue'
import CustomeTable from './Table.vue'
import CustomeInput from './Input.vue'
import CustomeInputNumber from './InputNumber.vue'
import CustomeRadio from './Radio.vue'
import CustomeCheckBox from './CheckBox.vue'
import CustomeSwitch from './Switch.vue'
import CustomeDate from './Date.vue'
import CustomeTime from './Time.vue'
import CustomeRate from './Rate.vue'
import CustomeSlider from './Slider.vue'
import CustomeSelectArea from './SelectArea.vue'
import OrganizationTree from './OrganizationTree.vue'
import CustomeButton from './Button.vue'
import FormParserFilterablelist from '@/components/generator/clientComponents/FormParserFilterablelist.vue'//联想弹层 多选弹层
import CustomeCascader from './Cascader.vue'//'@/components/codeParser/cascader.vue'
import CustomeElasticLayer from './ElasticLayer.vue'
import CustomeFinance from './Finance.vue'
export const ComponentConfigList = {
  'h2': { renderTag: 'CustomeTitle', rule: { trigger: 'change' }},
  'el-divider': { renderTag: 'CustomeDivider', rule: { trigger: 'change' }},
  'el-upload': { renderTag: 'CustomUpload', rule: { trigger: 'change', validatorStr: 'upload' }},
  'el-image': { renderTag: 'CustomeImage', rule: { trigger: 'change' }},
  'avue-information-body': { renderTag: 'CustomeInfo', rule: { trigger: 'change' }},
  'xjr-select-user': { renderTag: 'CustomeUser', rule: { trigger: 'change' }},
  'el-input-number': { renderTag: 'CustomeInputNumber', rule: { trigger: 'blur' }},
  'el-select': { renderTag: 'CustomeSelect', rule: { trigger: 'change' }},
  'el-input': { renderTag: 'CustomeInput', rule: { trigger: 'change' }},
  'el-radio-group': { renderTag: 'CustomeRadio', rule: { trigger: 'change' }},
  'el-checkbox-group': { renderTag: 'CustomeCheckBox', rule: { trigger: 'change', validatorStr: 'checkbox' }},
  'el-switch': { renderTag: 'CustomeSwitch', rule: { trigger: 'change', validatorStr: 'switch' }},
  'el-time-picker': { renderTag: 'CustomeTime', rule: { trigger: 'change' }},
  'el-date-picker': { renderTag: 'CustomeDate', rule: { trigger: 'change' }},
  'el-rate': { renderTag: 'CustomeRate', rule: { trigger: 'change' }},
  'el-slider': { renderTag: 'CustomeSlider', rule: { trigger: 'change' }},
  'avue-input-tree': { renderTag: 'OrganizationTree', rule: { trigger: 'change' }},
  'xjr-cascader': { renderTag: 'CustomeCascader', rule: { trigger: 'change', validatorStr: 'checkbox' }},
  'el-mutiple-input': { renderTag: 'CustomeElasticLayer', rule: { trigger: 'change' }},
  'avue-custom-button': { renderTag: 'CustomeButton', rule: { trigger: 'change' }},
  'avue-select-area': { renderTag: 'CustomeSelectArea', rule: { trigger: 'change' }},
}
export const Components = {
  ElComponent,
  CustomUpload,
  CustomeImage,
  CustomeTitle,
  CustomeDivider,
  CustomeInfo,
  CustomeUser,
  CustomeSelect,
  CustomeInput,
  CustomeInputNumber,
  CustomeRadio,
  CustomeCheckBox,
  CustomeTable,
  CustomeSwitch,
  CustomeDate,
  CustomeTime,
  CustomeRate,
  CustomeSlider,
  OrganizationTree,
  FormParserFilterablelist,
  CustomeCascader,
  CustomeButton,
  CustomeElasticLayer,
  CustomeSelectArea,
  CustomeFinance
}
