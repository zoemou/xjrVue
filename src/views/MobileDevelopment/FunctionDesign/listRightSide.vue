<template>
  <el-form style="padding: 0px 0px 0px 15px;">    
    <el-form-item :label="$t('mobileDev.listRightSide.whetherShowFName')" v-if="MLListCurItem.listStyle.showName !== undefined">
      <el-select v-model="MLListCurItem.listStyle.showName" :placeholder="$t('mobileDev.formRightSide.placeholderSelect')">
        <el-option :label="$t('mobileDev.listRightSide.optionNo')" value="0"></el-option>
        <el-option :label="$t('mobileDev.listRightSide.optionYes')" value="1"></el-option>
      </el-select>
    </el-form-item> 
    <template v-if="MLListCurItem.listStyle.showName !== undefined && MLListCurItem.listStyle.showName==1">
    <el-form-item :label="$t('mobileDev.listRightSide.fontStyle')" v-if="MLListCurItem.listStyle.fontStyle !== undefined">
      <el-select v-model="MLListCurItem.listStyle.fontStyle" :placeholder="$t('mobileDev.formRightSide.placeholderSelect')">
        <el-option :label="$t('mobileDev.listRightSide.optionDefaultStyle')" value="normal 12px/50px arial"></el-option>
        <el-option :label="$t('mobileDev.listRightSide.optionItalic')" value="italic normal 12px/50px arial"></el-option>
        <el-option :label="$t('mobileDev.listRightSide.optionItalicBold')" value="italic bold 12px/50px arial"></el-option>
        <el-option :label="$t('mobileDev.listRightSide.optionBold')" value="normal bold 12px/50px arial"></el-option>
      </el-select>
    </el-form-item>  
    <el-form-item :label="$t('mobileDev.listRightSide.fontSize')" v-if="MLListCurItem.listStyle.fontSize !== undefined">
      <el-input v-model="MLListCurItem.listStyle.fontSize" placeholder="12" type="number"></el-input>
    </el-form-item>  
    <el-form-item :label="$t('mobileDev.listRightSide.fontColor')" v-if="MLListCurItem.listStyle.fontColor !== undefined">
      <el-color-picker v-model="MLListCurItem.listStyle.fontColor" show-alpha></el-color-picker>
    </el-form-item>
    </template>  
    <el-form-item :label="$t('mobileDev.listRightSide.listLineSpace')" v-if="MLListCurItem.listStyle.lineHeight !== undefined">
      <el-input v-model="MLListCurItem.listStyle.lineHeight" placeholder="12" type="number"></el-input>
    </el-form-item>  
    <div class="groupTit">{{$t('mobileDev.listRightSide.setListField')}}({{MLListCurItem.name}})</div>
    <el-form-item :label="$t('mobileDev.listRightSide.fontStyle')" v-if="MLListCurItem.listStyle.fontStyle1 !== undefined">
      <el-select v-model="MLListCurItem.listStyle.fontStyle1" :placeholder="$t('mobileDev.formRightSide.placeholderSelect')">
        <el-option :label="$t('mobileDev.listRightSide.optionDefaultStyle')" value="normal 12px/30px arial"></el-option>
        <el-option :label="$t('mobileDev.listRightSide.optionItalic')" value="italic normal 12px/30px arial"></el-option>
        <el-option :label="$t('mobileDev.listRightSide.optionItalicBold')" value="italic bold 12px/30px arial"></el-option>
        <el-option :label="$t('mobileDev.listRightSide.optionBold')" value="normal bold 12px/30px arial"></el-option>
      </el-select>
    </el-form-item>  
    <el-form-item :label="$t('mobileDev.listRightSide.fontSize')" v-if="MLListCurItem.listStyle.fontSize1 !== undefined">
      <el-input v-model="MLListCurItem.listStyle.fontSize1" placeholder="12" type="number"></el-input>
    </el-form-item>  
    <el-form-item :label="$t('mobileDev.listRightSide.fontColor')" v-if="MLListCurItem.listStyle.fontColor1 !== undefined">
      <el-color-picker v-model="MLListCurItem.listStyle.fontColor1" show-alpha></el-color-picker>
    </el-form-item>  
    <el-form-item :label="$t('mobileDev.listRightSide.Alignment')" v-if="MLListCurItem.listStyle.textAlign !== undefined">
      <el-select v-model="MLListCurItem.listStyle.textAlign" :placeholder="$t('mobileDev.formRightSide.placeholderSelect')">
        <el-option :label="$t('mobileDev.listRightSide.leftAlignment')" value="left"></el-option>
        <el-option :label="$t('mobileDev.listRightSide.Center')" value="center"></el-option>
        <el-option :label="$t('mobileDev.listRightSide.rightAlignment')" value="right"></el-option>
      </el-select>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.listRightSide.whetherAddBg')" v-if="MLListCurItem.listStyle.addTag !== undefined">
      <el-select v-model="MLListCurItem.listStyle.addTag" :placeholder="$t('mobileDev.formRightSide.placeholderSelect')">
        <el-option :label="$t('mobileDev.listRightSide.optionNo')" value="0"></el-option>
        <el-option :label="$t('mobileDev.listRightSide.optionYes')" value="1"></el-option>
      </el-select>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.listRightSide.labelColor')" v-if="MLListCurItem.listStyle.tagColor !== undefined&&MLListCurItem.listStyle.addTag==1">
      <el-color-picker v-model="MLListCurItem.listStyle.tagColor" show-alpha></el-color-picker>
    </el-form-item>
    <div style="margin-top: 20px;text-align: left;">{{$t('mobileDev.listRightSide.Example')}}<el-tag :style="MLListCurItem.listStyle.addTag==1?{color:'#fff',backgroundColor:MLListCurItem.listStyle.tagColor}:{backgroundColor:'transparent',color:'#999'}">{{$t('mobileDev.listRightSide.ListField')}}</el-tag></div>
  </el-form>
</template>
<script>
import store from '@/store/index';
import {mapGetters} from "vuex"
export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters(['MLListCurItem'])
  },
  created(){
  }
}
</script>
<style scoped>
.groupTit{
    font-size: 15px;font-weight:bold;margin-top: 20px;
  }
  .el-form-item{
    margin-top: 10px;
  }
  .el-color-picker{
    display: block;
  }
  ::v-deep .el-color-picker__trigger{
    float: right;
  }
  .el-tag{
    border:0
  }
  
  .el-select{
  	display: block;
  }
  ::v-deep .el-input__suffix{
  	 top:18px;
   }
</style>