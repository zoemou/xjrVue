<template>
  <div class="main-container">
    <el-row>
      <el-col :span="8" class="el-col-style" v-for="(item,index) in option" :key="index">
        <el-card class="box-card">
          <div @click="JumpLink(item)">
			  <div class="builder_left">
				  <div class="builder_left_img">
					  <img :src="item.img" />
				  </div>
			  </div>
			  <div class="builder_right">
				  <div class="builder_right_title">{{ item.title }}</div>
				  <p class="builder_right1">{{$t('mobileDev.appDevIndex.functionSort')}}</p>
				  <p class="builder_right2">{{ item.description}}</p>
				  <button class="builder_but">{{$t('mobileDev.appDevIndex.setFunctionBtn')}}</button>
			  </div>
			  <div class="clear"></div>
            <!-- <div slot="header" class="clearfix">
              <span class="el-icon-s-tools"></span>
              <el-tag size="mini" style="float: right;">{{ item.title }}</el-tag>
            </div>
            <div class="text-item">
              <i class="fa fa-code no-margins"></i>
              <div class="stat-percent">{{ item.description }}</div>
            </div> -->
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :close-on-click-modal="false" :title="dialogTitle" :append-to-body="true" :visible.sync="codeVisible" width="100%"
               @close="handleClose" :fullscreen="true" >
      <!-- <component :is="listTemplateController" mode="out-in" v-if="codeVisible"></component> -->
      <FunctionDesign v-if="curItem=='functionDesign'" @finish="handleClose"></FunctionDesign>
      <HomeDesign v-if="curItem=='homeDesign'" @finish="handleClose"></HomeDesign>
      <LoginDesign v-if="curItem=='loginDesign'" @finish="handleClose"></LoginDesign>
    </el-dialog> 
  </div>
</template>

<script>
import {mobileDesignList} from '@/components/mobileDesign/config';
import FunctionDesign from './FunctionDesign/FunctionDesignForm.vue';
import HomeDesign from './HomeDesign/HomeDesignForm.vue';
import LoginDesign from './LoginDesign/LoginDesignForm.vue';
export default {
  name: 'AppDevIndex',
  components: {
    FunctionDesign,
    HomeDesign,
    LoginDesign
  },
  data () {
    return {
      codeVisible: false,
      dialogTitle: '在线代码生成器 并自动创建代码（自定义开发模板）',
      curItem: '',
      option: mobileDesignList
    };
  },
  methods: {
    JumpLink (e) {
      const {clickName, key} = e
      this.curItem=clickName;
      //增加暗色主题，保留样式类
      document.body.className = document.body.className + ' original';
      switch (clickName) {
        case 'loginDesign':
          this.dialogTitle = this.$t('mobileDev.appDevIndex.loginDesignTitle');
          //this.listTemplateController = key;
          this.codeVisible = true;
          break;
        case 'homeDesign':
          this.dialogTitle = this.$t('mobileDev.appDevIndex.homeDesignTitle');
          this.codeVisible = true;
          break;
        case 'functionDesign':
          this.dialogTitle = this.$t('mobileDev.appDevIndex.functionDesignTitle');
          //this.listTemplateController = key;
          this.codeVisible = true;
          break;
      }
    },
    handleClose () {
      //删除暗色兼容样式类
      let bodyClass = document.body.className.split(' ');
      bodyClass.filter((item,idx)=>{
        return item == 'original' && (bodyClass.splice(idx,1));
      });
      document.body.className = bodyClass.join(' ');
      this.codeVisible = false;
      this.curItem=""
    }
  }
};
</script>

<style scoped>
/* css */
.main-container {
  height: 100%;
  padding: 0 10px;
}

.no-margins {
  text-align: center;
  font-size: 99px;
  color: #666;
}

.text-item {
  text-align: center;
}

.stat-percent {
  color: #409EFF;
  padding: 10px 0 40px;
  font-size: 14px;
}

.clear{
	clear: both;
}
.builder_left{
	width:40%;
	float: left;
}
.builder_right{
	width:60%;
	float: left;
	padding-left: 5%;
	box-sizing: border-box;
}
.builder_right1{
	font-size: 14px;
	color: #666;
}
.builder_right2{
	font-size: 14px;
	color: #4099FF;
	
}
.builder_left_img{
	width:100%;
	box-sizing: border-box;
	background-color: #f2f2f2;
	
	
}
.builder_left_img img{
	display: block;
	
	padding:15px;
	width: 100%;
	box-sizing: border-box;
	
}
.box-card{
  margin: 0 5px;
}
.box-card:hover{
	cursor: pointer;
}
.builder_right_title{
	font-size: 18px;
	font-weight: bold;
	padding:0.5rem 0px 10px 0;
}
.builder_but{
	background-color: #409eff;
	border:none;
	color: #fff;
	font-size: 15px;
	padding:8px 35px;
	border-radius: 5px;
	
}
.builder_but:hover{
	box-shadow: 5px 5px 10px rgba(56,161,242,0.3);
}
::v-deep .el-dialog.is-fullscreen .el-dialog__body {
    height: calc(100% - 80px);
	overflow: hidden;
}
</style>
