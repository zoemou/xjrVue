<template>
  <div>
    <el-dialog v-dialogDrag :title="$t('topTheme.titleSelectTheme')"
               :visible.sync="box"
               :before-close="handleClose"
              >
      <el-radio-group v-model="text"
                      class="list">
        <el-row>
          <el-col v-for="(item,index) in list"
                  :key="index"
				  class="el-col el-col-12"
                  >
			<div class="theme_pic" @mouseover="showPreview(item)">
        <transition name="fade-ani">
          <div class="preview" @click="openPreview(item)" v-show="item.displayPreview">
            <i class="el-icon-view"></i>
            <span>{{$t('topTheme.iconPreview')}}</span>
          </div>
        </transition>
				<img :src="item.img">
			</div>	  
            <el-radio :label="item.value" style="display: block;text-align: center;">{{item.name}}</el-radio>
          </el-col>
        </el-row>
      </el-radio-group>
      <div slot="footer" class="dialog-footer text-right">
          <el-button size="mini" type="primary"
                      @click="switchTheme()">{{$t('buttonModule.modalSureBtn')}}</el-button>
      </div>
    </el-dialog>
	
    <span>
      <i class="icon-zhuti"
         @click="open"></i>
    </span>
    <transition name="scale-ani">
        <div class="large-img-wrap" v-if="largeImg">
          <div class="large-img">
            <i class="el-icon-circle-close" @click="largeImg = ''"></i>
            <img :src="largeImg"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { setTheme } from "@/util/util";
import { mapGetters } from "vuex";
import { Loading } from 'element-ui';
import website from '@/config/website'
export default {
  data () {
    return {
      box: false,
      text: "",
      largeImg: '',
      list: [
        {
          name: this.$t('topTheme.nameDefault'),
          value: "default",
          isTopMenu: false,
          img:'/img/default_pic.png',
          largeImg:'/img/default_img.png',
          displayPreview: false
        },
        {
          name:this.$t('topTheme.nameLightTheme'),
          value: "lightTheme",
          isTopMenu: false,
          img:'/img/lightTheme_pic.png',
          largeImg:'/img/lightTheme_img.png',
          displayPreview: false
        },
        {
          name:this.$t('topTheme.nameDarkTheme'),
          value: "darkTheme",
          isTopMenu: true,
          img:'/img/darkTheme_pic.png',
          largeImg:'/img/darkTheme_img.png',
          displayPreview: false
        },
        {
          name: this.$t('topTheme.nameSimpleTheme'),
          value: "simpleTheme",
          isTopMenu: true,
          img:'/img/simpleTheme_pic.png',
          largeImg:'/img/simpleTheme_img.png',
          displayPreview: false
        },
        {
          name: this.$t('topTheme.nameEveningTheme'),
          value: "eveningTheme",
          isTopMenu: true,
          img:'/img/eveningTheme_pic.png',
          largeImg:'/img/evening_img.png',
          displayPreview: false
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["themeName"])
  },
  mounted () {
    this.text = this.themeName;
    if (!this.text) {
      this.text = "";
    }else{
      setTheme(this.text);
    }
  },
  methods: {
    handleClose(done){
      this.text = this.themeName || website.defaultTheme;
      done();
    },
    showPreview(item){
      this.list.map((item)=>{
        item.displayPreview = false;
      });
      item.displayPreview = true;
    },
    openPreview(item){
      this.largeImg = item.largeImg;
      this.text = item.value;
    },
    switchTheme(){
      this.box = false;
      const loading = Loading.service({
          lock: true,
          text:this.$t('topTheme.hintSwitchTheme'),
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 1)'
      })
      
      setTimeout(()=>{
        this.$store.commit("SET_THEME_NAME", this.text);
        //设置布局结构
        let activeTheme = this.list.filter((item)=>{
          return item.value == this.text;
        });

        if(activeTheme.length){
          this.$store.commit("SET_MENULAYOUT", activeTheme[0].isTopMenu);
        }
        window.location.reload();
      },1000);
    },
    open () {
      this.box = true;
    }
  }
};
</script>

<style scoped>
div /deep/.list {
  width: 100%;
}
div /deep/.el-dialog__wrapper{
  z-index: 5000!important;
}
div /deep/.el-dialog__header{
		padding: 0px 15px !important;
	}
div /deep/.top-bar__right i {
	    line-height:40px!important;
	}
div /deep/.el-dialog__headerbtn{
		top:-4px!important;
	}
div /deep/.el-dialog__body{
		padding:10px 0px 10px 0px!important;
	}
/* .top-bar__left i, .top-bar__right i{
		line-height: 56px!important;
	} */
div /deep/.el-col-24{
	width: 33%!important;
}
div /deep/.el-dialog{
	width: 660px!important;
}	
div /deep/.el-dialog__title{
	line-height: 40px!important;
}
div /deep/.el-col{
	margin-bottom: 18px!important;
}
.dialog-footer{
  line-height: 25px;
}
.theme_pic{
  position: relative;
	width:185px;
	height: 114px; 
	background-color: #f2f2f2; 
	border-radius: 3px;
	margin: 10px auto 20px auto;
}
.theme_pic img{
	display: block;
	cursor: pointer;
}
.large-img-wrap{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5001;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,.3);
}
.large-img i{
  position: absolute;
  right: -4px;
  top: -48px;
  color: rgba(255,255,255,.8);
  font-size: 35px;
  cursor: pointer;
}
.large-img{
  position: relative;
}
.large-img img{
  position: relative
}
.scale-ani-enter-active, .scale-ani-leave-active {
  transition: .5s;
  opacity: 1;
  transform: scale(1);
}
.scale-ani-enter, .scale-ani-leave-active {
  opacity: 0;
  transform: scale(0);
}
.preview{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview i{
  position: relative;
  top: 1px;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
}
.preview span{
  font-size: 14px;
  color: #fff;
  margin-left: 5px;
  letter-spacing: 2px;
  cursor: pointer;
}
.fade-ani-enter-active, .fade-ani-leave-active {
  transition: .2s;
  opacity: 1;
}
.fade-ani-enter, .fade-ani-leave-active {
  opacity: 0;
}
.text-right{
  text-align: right;
}
</style>

