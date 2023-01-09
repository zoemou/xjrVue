<template>
<div>
  <el-form style="padding: 0 5px 0px 15px;">
    <el-form-item :label="$t('mobileDev.loginRightSide.labelBgImg')">
      <el-input v-model="LoginAllStep.stepTwo.backgroundImg" :placeholder="$t('mobileDev.loginRightSide.placeholderBgImg')"></el-input>
      <el-row style="text-align:right;padding-top:6px">
        <el-button type="danger" size="small" @click="clearPicture(1)">{{$t('mobileDev.loginRightSide.clearBtn')}}</el-button>
        <label for="file" style="margin:0 0 0 10px;">
          <span class="el-button el-button--primary el-button--small">{{$t('mobileDev.loginRightSide.uploadBtn')}}</span>                        	
          <input
              type="file"
              name="file"
              id="file"
              @change="uploadPicture('inputer')"
              ref="inputer"
              accept="image/*"
              style="display:none;"
            />
        </label>              
      </el-row>
    </el-form-item>
    <el-tabs v-model="loginType" type="card" @tab-click="handleClick" style="margin:20px -5px 0 -15px">
      <el-tab-pane :label="$t('mobileDev.loginRightSide.phoneLogin')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('mobileDev.loginRightSide.accountLogin')" name="1"></el-tab-pane>
    </el-tabs>
    <block v-if="loginType==0">
       <el-form-item :label="$t('mobileDev.loginRightSide.labelPhoneHintInfor')">
        <el-input v-model="LoginAllStep.stepTwo.phoneTips" :placeholder="$t('mobileDev.loginRightSide.placeholderHintInfor')"></el-input>
      </el-form-item> 
      <el-form-item :label="$t('mobileDev.loginRightSide.labelPhoneIcon')" style="position:relative;">
        <el-input v-model="LoginAllStep.stepTwo.phoneIcon" :placeholder="$t('mobileDev.mobileSchema.placeholderSeclectIcon')">
          <i slot="suffix" class="el-input__icon el-icon-more" @click="selectMoreIcon('phoneIcon')"></i>
        </el-input>
      </el-form-item>
    </block>
    <block v-else>
      <el-form-item :label="$t('mobileDev.loginRightSide.labelUserHintInfor')">
        <el-input v-model="LoginAllStep.stepTwo.accountTips" :placeholder="$t('mobileDev.loginRightSide.placeholderHintInfor')"></el-input>
      </el-form-item> 
      <el-form-item :label="$t('mobileDev.loginRightSide.labelUserIcon')" style="position:relative;">
        <el-input v-model="LoginAllStep.stepTwo.accountIcon" :placeholder="$t('mobileDev.mobileSchema.placeholderSeclectIcon')">
          <i slot="suffix" class="el-input__icon el-icon-more" @click="selectMoreIcon('accountIcon')"></i>
        </el-input>
      </el-form-item>  
    </block>
    <block v-if="loginType==1">
    <el-form-item :label="$t('mobileDev.loginRightSide.labelPasswordHintInfor')">
      <el-input v-model="LoginAllStep.stepTwo.passwordTips" :placeholder="$t('mobileDev.loginRightSide.placeholderHintInfor')"></el-input>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.loginRightSide.labelPasswordIcon')" style="position:relative;">
      <el-input v-model="LoginAllStep.stepTwo.passwordIcon" :placeholder="$t('mobileDev.mobileSchema.placeholderSeclectIcon')">
        <i slot="suffix" class="el-input__icon el-icon-more" @click="selectMoreIcon('passwordIcon')"></i>
      </el-input>
    </el-form-item>
    </block>
    <block v-else>
    <el-form-item :label="$t('mobileDev.loginRightSide.labelVerifyHintInfor')">
      <el-input v-model="LoginAllStep.stepTwo.msmTips" :placeholder="$t('mobileDev.loginRightSide.')"></el-input>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.loginRightSide.labelVerifyIcon')" style="position:relative;">
      <el-input v-model="LoginAllStep.stepTwo.msmIcon" :placeholder="$t('mobileDev.mobileSchema.placeholderSeclectIcon')">
        <i slot="suffix" class="el-input__icon el-icon-more" @click="selectMoreIcon('msmIcon')"></i>
      </el-input>
    </el-form-item>
    </block>
    <block v-if="website.tenantEnabled">
    <el-form-item :label="$t('mobileDev.loginRightSide.labelTenantHintInfor')">
      <el-input v-model="LoginAllStep.stepTwo.tenantTips" :placeholder="$t('mobileDev.loginRightSide.placeholderHintInfor')"></el-input>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.loginRightSide.labelTenantIcon')" style="position:relative;">
      <el-input v-model="LoginAllStep.stepTwo.tenantIcon" :placeholder="$t('mobileDev.mobileSchema.placeholderSeclectIcon')">
        <i slot="suffix" class="el-input__icon el-icon-more" @click="selectMoreIcon('tenantIcon')"></i>
      </el-input>
    </el-form-item>
    </block>
    <el-form-item :label="$t('mobileDev.loginRightSide.labelBottomDistance')">
      <el-input v-model="LoginAllStep.stepTwo.top" :placeholder="$t('mobileDev.loginRightSide.placeholderDistance')" type="number"></el-input>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.loginRightSide.labelInputHigh')">
      <el-input v-model="LoginAllStep.stepTwo.inputHeight" :placeholder="$t('mobileDev.loginRightSide.placeholderInputHigh')" type="number"></el-input>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.loginRightSide.labelSpace')">
      <el-input v-model="LoginAllStep.stepTwo.marginBottom" :placeholder="$t('mobileDev.loginRightSide.placeholderDistance')" type="number"></el-input>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.loginRightSide.labelBtnName')">
      <el-input v-model="LoginAllStep.stepTwo.buttonName" :placeholder="$t('mobileDev.loginRightSide.placeholderBtnName')"></el-input>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.loginRightSide.labelWordSpace')">
      <el-input v-model="LoginAllStep.stepTwo.letterSpace" :placeholder="$t('mobileDev.loginRightSide.placeholderWordSpace')" type="number"></el-input>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.loginRightSide.labelWordSize')">
      <el-input v-model="LoginAllStep.stepTwo.btnFontSize" :placeholder="$t('mobileDev.loginRightSide.placeholderWordSize')" type="number"></el-input>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.loginRightSide.labelWordColor')">
      <el-color-picker v-model="LoginAllStep.stepTwo.btnNameColor" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.loginRightSide.labelGradientOne')">
      <el-color-picker v-model="LoginAllStep.stepTwo.btnBgColor1" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.loginRightSide.labelGradientTwo')">
      <el-color-picker v-model="LoginAllStep.stepTwo.btnBgColor2" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.loginRightSide.labelBtnHigh')">
      <el-input v-model="LoginAllStep.stepTwo.btnHeight" :placeholder="$t('mobileDev.loginRightSide.placeholderHigh')" type="number"></el-input>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.loginRightSide.labelBtnBorderRound')">
      <el-input v-model="LoginAllStep.stepTwo.btnRadius" :placeholder="$t('mobileDev.loginRightSide.placeholderRoundSize')" type="number"></el-input>
    </el-form-item> 
    
    <el-form-item :label="$t('mobileDev.loginRightSide.labelInputSpace')">
      <el-input v-model="LoginAllStep.stepTwo.btnMarginTop" :placeholder="$t('mobileDev.loginRightSide.placeholderDistance')" type="number"></el-input>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.loginRightSide.labelTextSpace')">
      <el-input v-model="LoginAllStep.stepTwo.btnMarginBottom" :placeholder="$t('mobileDev.loginRightSide.placeholderDistance')" type="number"></el-input>
    </el-form-item>  
    <el-form-item :label="$t('mobileDev.loginRightSide.labelFooter')">
      <el-input v-model="LoginAllStep.stepTwo.footer" :placeholder="$t('mobileDev.loginRightSide.placeholderFooter')"></el-input>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.loginRightSide.labelShadow')">
      <el-select v-model="LoginAllStep.stepTwo.shadow" :placeholder="$t('mobileDev.loginRightSide.placeholderSelect')">
        <el-option v-for="item in boolenType" :label="item.name" :value="item.value" :key="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.loginRightSide.labelEnableBorder')">
      <el-select v-model="LoginAllStep.stepTwo.isBorder" :placeholder="$t('mobileDev.loginRightSide.placeholderSelect')">
        <el-option v-for="item in boolenType" :label="item.name" :value="item.value" :key="item.value"></el-option>
      </el-select>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.loginRightSide.labelBorderSize')" v-if="LoginAllStep.stepTwo.isBorder==1">
      <el-input v-model="LoginAllStep.stepTwo.borderWidth" :placeholder="$t('mobileDev.loginRightSide.placeholderBorderSize')" type="number"></el-input>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.loginRightSide.labelBorderColor')" v-if="LoginAllStep.stepTwo.isBorder==1">
      <el-color-picker v-model="LoginAllStep.stepTwo.borderColor" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.loginRightSide.labelBorderRound')">
      <el-input v-model="LoginAllStep.stepTwo.radius" :placeholder="$t('mobileDev.loginRightSide.placeholderRoundSize')" type="number"></el-input>
    </el-form-item>      
  </el-form>
  <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('mobileDev.mobileSchema.titleSelectIcon')" :append-to-body="true" :visible.sync="IconVisible" width="80%" style="padding: 10px 20px;">
    <FontHtml v-on:childByValue="childByValue"></FontHtml>
  </el-dialog>
</div>
</template>
<script>
import {mapGetters} from "vuex";
import { upload } from '@/api/officeautomation/news.js';
import FontHtml from '../../FontAwesome.vue';
import { baseUrl } from '@/config/env';
export default {
  components:{
    FontHtml
  },
   props:['loginType'],
  data () {
    return {
      config:[{name:this.$t('mobileDev.loginRightSide.leftAlign'),value:'left'},{name:this.$t('mobileDev.loginRightSide.centerAlign'),value:'center'},{name:this.$t('mobileDev.loginRightSide.rightAlign'),value:'right'}],
      boolenType:[{name:this.$t('mobileDev.loginRightSide.selectYes'),value:1},{name:this.$t('mobileDev.loginRightSide.selectNo'),value:0}],
      IconVisible:false,
      iconName:''  
    }
  },
  computed: {
    ...mapGetters(['LoginAllStep','website'])
  },
  methods:{
    handleClick(tab, event) {
      this.$emit('change',this.loginType)
    },
    selectMoreIcon (str) {
      this.IconVisible = true;
      this.iconName=str;
    },
    childByValue: function (childValue) {
        // childValue就是子组件传过来的值
      this.LoginAllStep.stepTwo[this.iconName] = childValue;
      this.IconVisible = false;
    },
    uploadPicture(str){
      var _this = this;
      let inputDOM = this.$refs[str];
      // 通过DOM取文件数据
      var file = inputDOM.files;
      if (file) {
        let formData = new FormData()
        formData.append('file', file[0])
        upload(formData).then(res=>{
          if(str=='inputer'){
            this.LoginAllStep.stepTwo.backgroundImg=baseUrl+res.data.data.FileUrl
          }
        })
      }
    },
    clearPicture(idx){
      if(idx==1){
        this.LoginAllStep.stepTwo.backgroundImg=""
      }
    }
  },
  mounted(){

  }
}
</script>
<style scoped>
.el-select{
  width: 100%;
}
::v-deep .el-textarea__inner{
  font-size:12px ;
}
::v-deep .el-tabs--card>.el-tabs__header .el-tabs__nav{
  border:0
}
::v-deep .el-tabs--card>.el-tabs__header .el-tabs__item{
  border-top: 1px solid #E4E7ED;  
}
::v-deep .el-tabs--card>.el-tabs__header .el-tabs__item:first-child{
  border-left:1px solid #E4E7ED;  
}
::v-deep .el-tabs--card>.el-tabs__header .el-tabs__item:last-child{
  border-right:1px solid #E4E7ED;  
}
::v-deep .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
  border-top:0;
  border-bottom: 3px solid #409EFF;
}
::v-deep .el-tabs--card>.el-tabs__header .el-tabs__item:first-child.is-active{
  border-left:0;
}
::v-deep .el-tabs--card>.el-tabs__header .el-tabs__item:last-child.is-active{
  border-right:0;
}
</style>