<template>
<div>
	<div style="width: 315px;margin: 0 auto;position: absolute;left: 0;right: 0;" :style="{bottom:LoginAllStep.stepTwo.top+'px'}">
		<div class="compNode" :style="{marginBottom:LoginAllStep.stepTwo.marginBottom+'px'}">
			<el-input
				:placeholder="loginType== 1 ?LoginAllStep.stepTwo.accountTips:LoginAllStep.stepTwo.phoneTips"
				:prefix-icon="loginType== 1 ?LoginAllStep.stepTwo.accountIcon:LoginAllStep.stepTwo.phoneIcon"
				:style="{background:'#fff',
				boxShadow:LoginAllStep.stepTwo.shadow==1?'1px 1px 10px #ccc':'',
				border:LoginAllStep.stepTwo.isBorder==1?LoginAllStep.stepTwo.borderWidth+'px solid '+LoginAllStep.stepTwo.borderColor:'0',
				borderRadius:LoginAllStep.stepTwo.radius+'px',
				height:LoginAllStep.stepTwo.inputHeight+'px',lineHeight:LoginAllStep.stepTwo.inputHeight+'px'}">
			</el-input>
		</div>
		<div class="compNode" :style="{marginBottom:LoginAllStep.stepTwo.marginBottom+'px'}">
			<el-input v-if="loginType==1"
				:placeholder="LoginAllStep.stepTwo.passwordTips"
				:prefix-icon="LoginAllStep.stepTwo.passwordIcon"
				:style="{background:'#fff',
				boxShadow:LoginAllStep.stepTwo.shadow==1?'1px 1px 10px #ccc':'',
				border:LoginAllStep.stepTwo.isBorder==1?LoginAllStep.stepTwo.borderWidth+'px solid '+LoginAllStep.stepTwo.borderColor:'0',
				borderRadius:LoginAllStep.stepTwo.radius+'px',
				height:LoginAllStep.stepTwo.inputHeight+'px',lineHeight:LoginAllStep.stepTwo.inputHeight+'px'}">
			</el-input>
			<el-input v-else
				:placeholder="LoginAllStep.stepTwo.msmTips"
				:prefix-icon="LoginAllStep.stepTwo.msmIcon"
				:style="{background:'#fff',
				boxShadow:LoginAllStep.stepTwo.shadow==1?'1px 1px 10px #ccc':'',
				border:LoginAllStep.stepTwo.isBorder==1?LoginAllStep.stepTwo.borderWidth+'px solid '+LoginAllStep.stepTwo.borderColor:'0',
				borderRadius:LoginAllStep.stepTwo.radius+'px',
				height:LoginAllStep.stepTwo.inputHeight+'px',lineHeight:LoginAllStep.stepTwo.inputHeight+'px',display: 'flex',alignItems: 'center'}">
				<template slot="append">{{$t('mobileDev.loginCenterContainer.verCodeBtn')}}</template>
			</el-input>
		</div>
		<div class="compNode" :style="{marginBottom:LoginAllStep.stepTwo.marginBottom+'px'}" v-if="website.tenantEnabled">
			<el-input
				:placeholder="LoginAllStep.stepTwo.tenantTips"
				:prefix-icon="LoginAllStep.stepTwo.tenantIcon"
				:style="{background:'#fff',
				boxShadow:LoginAllStep.stepTwo.shadow==1?'1px 1px 10px #ccc':'',
				border:LoginAllStep.stepTwo.isBorder==1?LoginAllStep.stepTwo.borderWidth+'px solid '+LoginAllStep.stepTwo.borderColor:'0',
				borderRadius:LoginAllStep.stepTwo.radius+'px',
				height:LoginAllStep.stepTwo.inputHeight+'px',lineHeight:LoginAllStep.stepTwo.inputHeight+'px'}">
			</el-input>
		</div>               
		<div class="compNode" :style="{marginTop:LoginAllStep.stepTwo.btnMarginTop+'px',marginBottom:LoginAllStep.stepTwo.btnMarginBottom+'px'}">
			<el-button type="primary" 
			:style="{width:'100%',height:LoginAllStep.stepTwo.btnHeight+'px',
			lineHeight:LoginAllStep.stepTwo.btnHeight+'px',padding:0,
			fontSize:LoginAllStep.stepTwo.btnFontSize+'px',
			color:LoginAllStep.stepTwo.btnNameColor,textAlign:'center',
			backgroundImage: 'linear-gradient(to right, '+LoginAllStep.stepTwo.btnBgColor1+', '+LoginAllStep.stepTwo.btnBgColor2+')',
			boxShadow: '5px 6px 12px rgb(0 107 217 / 20%)',
			borderRadius:LoginAllStep.stepTwo.btnRadius+'px',
			letterSpacing:LoginAllStep.stepTwo.letterSpace+'px',
			borderColor:LoginAllStep.stepTwo.btnBgColor}"><div :style="{marginLeft:LoginAllStep.stepTwo.letterSpace+'px'}">{{LoginAllStep.stepTwo.buttonName}}</div></el-button>
		</div>
    
		<div class="compNode">
			<div :style="{fontSize:'14px',color:'#02A7F0',textAlign:'center'}" @click="changeLoginType">{{loginType== 1 ?$t('mobileDev.loginCenterContainer.phoneLogin'):$t('mobileDev.loginCenterContainer.passwordLogin')}}</div>
		</div>
    </div>  
    <div class="footer">
        <div>{{LoginAllStep.stepTwo.footer}}</div>
    </div>

</div>
</template>
<script>
import {deepClone} from '@/utils/index';
import {mapGetters} from "vuex"
export default {
   components: {
      deepClone
    },
    props:['loginType'],
  data () {
    return {
       //loginType:this.loginType
    }
  },
  computed: {
    ...mapGetters(['LoginAllStep','website'])
  },
   methods: {
       changeLoginType(){
           if(this.loginType == 0){
               this.loginType='1';
           }else{
               this.loginType='0';
           }
           this.$emit('change',this.loginType)
       }
   }
}
</script>
<style scoped>

::v-deep .compNode .el-input__inner{
    line-height: inherit;
    height: inherit;
    background:none
}
::v-deep .compNode .el-input__prefix {
    font-size: 15px;
    line-height: inherit;
}
::v-deep .compNode .el-input__inner{
    border: 0;
    border-radius: 0;
}
::v-deep .compNode .el-input-group__append{
    border:0;
    border-radius: inherit;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    width: 100px;
    height: 100%;
}

.fl{
    float: left;
}
.fr{
    float: right;
}
.footer{
    position: absolute;
    bottom: 15px;
    text-align: center;
    width: 100%;
    color: #ccc;
    font-size: 12px;
    left: 0;
}
</style>