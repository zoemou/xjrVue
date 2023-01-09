<template>
  <div class="avue-top">
	  <logo></logo>
    <div class="top-bar__left">
      <div class="avue-breadcrumb fl"
           :class="[{ 'avue-breadcrumb--active': isCollapse }]"
           v-if="showCollapse">
        <i class="icon-navicon top-icon-color"
           @click="setCollapse"></i>
      </div>
    
    </div>
    <div class="top-bar__title" style="display:flex;align-items: center;">
      <!-- <div class="top-bar__item top-bar__item--show"
           v-if="showMenu">
        <top-menu ref="topMenu"></top-menu>
      </div> -->
	 
	  <div class="toggle-system" ref="radiogroup" v-show="allSystem.filter(item=>{return item.F_Id != '0'}).length>=1">
	    <div class="fa fa-chevron-left" v-if="showArror" @click="arrorLeftClick"></div>
	  		<div ref="scrollbox" class="scrollBox">
	  			<el-radio-group v-model="systemId" ref="radiobox" :style="{'margin-left':marginLeft+'px'}">
	  				<el-radio :label="item.F_Id" v-for="(item,idx) in allSystem" 
	  				  :key="idx" @change="changeSystem(item)">
					  <i class="icon-drxx02"></i>
					  {{$t(item.F_LgMarkCode||item.F_Name)}}</el-radio>
	  			</el-radio-group>
	  		</div>
	  		<div class="fa fa-chevron-right" v-if="showArror" @click="arrorRightClick"></div>
	  </div>
	  
    </div>
    <div class="top-bar__right">
		<span class="top-bar__item"
		      v-if="showSearch">
		  <top-search></top-search>
		</span>
	  <el-tooltip v-if="showTheme"
	              effect="dark"
	              :content="$t('navbar.theme')"
	              placement="bottom">
	    <div class="top-bar__item top-bar__item&#45;&#45;show top-icon-color">
	      <top-theme></top-theme>
	    </div>
	  </el-tooltip>
      <el-tooltip v-if="showLanguage" effect="dark"
                  :content="$t('navbar.language')"
                  placement="bottom">
        <div class="top-bar__item top-bar__item--show top-icon-color">
          <top-lang></top-lang>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showFullScren"
                  effect="dark"
                  :content="isFullScren?$t('navbar.screenfullF'):$t('navbar.screenfull')"
                  placement="bottom">
        <div class="top-bar__item">
          <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'"
             @click="handleScreen"></i>
        </div>
      </el-tooltip>
        <el-tooltip v-if="showColor"
                  effect="dark"
                  :content="$t('navbar.color')"
                  placement="bottom">
        <div class="top-bar__item">
          <top-color></top-color>
        </div>
      </el-tooltip>
	  <el-tooltip v-if="showDebug && website.errorLogSwitch"
	              effect="dark"
	              :content="logsFlag?$t('navbar.bug'):logsLen+$t('navbar.bugs')"
	              placement="bottom">
	    <div class="top-bar__item top-icon-color fl">
	      <top-logs></top-logs>
	    </div>
	  </el-tooltip>
     <el-tooltip v-if="showLock"
                  effect="dark"
                  :content="$t('navbar.lock')"
                  placement="bottom">
        <div class="top-bar__item">
          <top-lock></top-lock>
        </div>
      </el-tooltip>
	  <el-tooltip v-if="showNotice" effect="dark"
	              :content="$t('navbar.notice')"
	              placement="bottom">
	    <div class="top-bar__item top-bar__item--show top-icon-color fl">
	      <top-notice></top-notice>
	    </div>
	  </el-tooltip>
      <el-dropdown>
        <span class="el-dropdown-link user-name">
          {{userInfo.F_RealName}}
          <i class="fa fa-caret-down user-name-down"></i>
        </span>
		
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">{{$t('navbar.dashboard')}}</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">{{$t('navbar.userinfo')}}</router-link>
          </el-dropdown-item>
  
          <el-dropdown-item>
            <router-link to="/info/setting">{{$t('navbar.setting')}}</router-link>
          </el-dropdown-item>
                   <el-dropdown-item @click.native="dialogVisible = true"
                            divided>{{$t('navbar.about')}}</el-dropdown-item>

          <el-dropdown-item @click.native="logout"
                            divided>{{$t('navbar.logOut')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <img class="top-bar__img" :src="userInfo.F_HeadIcon" alt="" onerror="javascript:this.src='/img/headPic.png'"/> 

         <el-dialog v-dialogDrag
          :title="$t('user.aboutDialog.modalTitle')"
          :visible.sync="dialogVisible"
          width="30%"
          append-to-body
          class="about-box"
          >
          <p class="about-logo"><img class="img" src="/img/logo_blue.png" alt=""><b>{{website.title}} {{website.platformName}}</b></p>
          <p class="about-text"> {{$t('user.aboutDialog.versionNum')}}： {{website.version}} </p>
          <p class="about-right"> {{website.copyright}} </p>
<!-- 
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span> -->
        </el-dialog>
    </div>
  </div>
</template>
<script>
import logo from "../logo";
import { resetRouter } from '@/router/router'
import { mapGetters, mapState } from "vuex";
import { fullscreenToggel, listenfullscreen } from "@/util/util";
import topLock from "./top-lock";
import topMenu from "./top-menu";
import topSearch from "./top-search";
import topTheme from "./top-theme";
import topLogs from "./top-logs";
import topColor from "./top-color";
import topNotice from './top-notice'
import topLang from "./top-lang";
import { baseUrl } from "@/config/env";
import website from "@/config/website"
import {
  getMenu
} from "@/api/user";
export default {
  components: {
    topLock,
    topMenu,
    topSearch,
    topTheme,
    topLogs,
    topColor,
    topNotice,
    topLang, 
	logo
  },
  name: "top",
  data () {
    return {
      website,
      dialogVisible:false,
	  showArror:false,
	  marginLeft:0
    };
  },
  filters: {},
  created () { },
  mounted () {
    listenfullscreen(this.setScreen);
      if(this.website.netFlowableEnable){
        this.userInfo.F_HeadIcon = `${baseUrl}${this.userInfo.F_HeadIcon}`;
      }
      else{
        this.userInfo.F_HeadIcon = `${baseUrl}/users/${this.userInfo.F_UserId}/head-icon`;
      }
      
	this.calcuSize()
	window.addEventListener('resize',()=>{ // 定义窗口大小变更通知事件
	  this.calcuSize()
	});
  },
  computed: {
    ...mapState({
      showDebug: state => state.common.showDebug,
      showTheme: state => state.common.showTheme,
      showLock: state => state.common.showLock,
      showFullScren: state => state.common.showFullScren,
      showCollapse: state => state.common.showCollapse,
      showSearch: state => state.common.showSearch,
      showMenu: state => state.common.showMenu,
      showColor: state => state.common.showColor,
      showLanguage : state => state.common.showLanguage,
      showNotice : state => state.common.showNotice,
    }),
    ...mapGetters([
      "website",
      "userInfo",
      "isFullScren",
      "tagWel",
      "tagList",
      "isCollapse",
      "tag",
      "logsLen",
      "logsFlag",
	  "sysCategory", "allSystem", "systemId"
    ])
  },
  methods: {
    handleScreen () {
      fullscreenToggel();
    },
    setCollapse () {
      this.$store.commit("SET_COLLAPSE");
    },
    setScreen () {
      this.$store.commit("SET_FULLSCREN");
    },
    logout () {
      this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          resetRouter();
          this.$store.commit('SET_SYSTEMID','0');
          this.$store.commit('SET_INDEX_URL','');
          this.$router.push({ path: "/login" });
        });
      });
    },
	changeSystem(item){
    this.$store.state.user.changeSystem = true;
	  this.$store.commit('SET_SYSTEMID',item.F_Id);
	  this.getMenuBySystem(item.F_Id);
	  this.getIndexUrlBySystem(item?.F_Id,item?.F_IndexUrl)
	},
	getMenuBySystem(systemId){
	  systemId = systemId || '0';
	  getMenu(systemId)
	  .then(res=>{
	    let menu = res?.data?.data || [];
	    if((menu instanceof Array) && menu.length){
	      this.isShowSubSystem = true;
	      menu.forEach((ele) => {
	        addPath(ele, true);
	      });
	      this.$router.$avueRouter.formatRoutes(menu,true)
	      this.$store.commit('SET_MENU',menu);
	      this.$store.commit('SET_MENUALL',menu);
	    }
	  })
	},
	getIndexUrlBySystem(systemId,url){
	  let tagList = this.tagList.slice(0,1);
	  this.$store.commit('SET_TAG_LIST',tagList);
	  let routeData = this.$router.resolve({
	    name: '主页',
	  });
	  if(systemId == '0'){
	    this.$store.commit('SET_INDEX_URL','');
	  }else{
	    if(url && url.includes('/')){ 
	      this.$store.commit('SET_INDEX_URL',url);
	    }
	  }
	  window.location.href = routeData.href;
	},
	arrorLeftClick(){
		let pW=this.$refs.scrollbox.clientWidth
		let cW=this.$refs.radiobox.$el.clientWidth
		let count=parseInt(cW/pW)
		let last=cW-pW*count;
		this.marginLeft+=pW;
		if(Math.abs(this.marginLeft)/last==1||Math.abs(this.marginLeft)>=0){
			this.marginLeft=0;
		}	
	},
	arrorRightClick(){
		let pW=this.$refs.scrollbox.clientWidth
		let cW=this.$refs.radiobox.$el.clientWidth
		let count=parseInt(cW/pW)
		let last=cW-pW*count;
		this.marginLeft-=pW;
		if(Math.abs(this.marginLeft)/pW==count||Math.abs(this.marginLeft)>=cW){
			this.marginLeft=-(count-1)*pW-last;
		}		
	},
	calcuSize(){		
		setTimeout(()=>{
			let pW=this.$refs.radiogroup.clientWidth
		  let cW=this.$refs.radiobox.$el.clientWidth
		  if(pW<cW){
			  this.showArror=true;
		  }else{
			  this.showArror=false;
		  }
		},500)
	}
  }
};
</script>

<style scoped>
	.avue-top{
		height: 56px!important;
		line-height: 56px!important;
	}
	.avue-breadcrumb i{
	   line-height: 56px!important;
	}
	.user-name{
		display: inline-block;
		font-size: 12px;
		color: #6d8c9f;
		padding-left: 10px;
		cursor: pointer;
	}
	.user-name-down{
		color: #6d8c9f;
		padding:0 5px;
	}
	.top-icon-color,.el-dropdown,.top-bar__item{
		color: #6d8c9f!important;
	}
	.top-bar__item,.top-bar__left,.top-bar__right{
		height: 56px!important;
	}
	.fl{
		float: left;
	}

  .about-box p{
  text-align: center;
  line-height: 20px;
}
.about-logo{
  padding-top:25px;
}
.about-box p b{
  font-size: 22px;
  color:#333;
  padding-left: 15px;
}
.about-text{
  padding:16px 0;
  font-size: 16px;
  color:#333;
}
.about-right{
  color:#999;
  padding-bottom: 10px;
}
/deep/ .el-radio{
	padding:0px 20px;
	margin: 0px;
	line-height: 60px;
	color: #6d8c9f;
}
/deep/ .el-radio:last-child{
	border-right: 0;
}
.toggle-system{
	width: calc(100% - 500px);
	display: flex;
	align-items: center;
	flex: 1;
}
.fa-chevron-left,.fa-chevron-right{
	font-size: 16px;
	padding-top: 1px;
	color: #abaacd;
	cursor: pointer;
}
.fa-chevron-left:hover,.fa-chevron-right:hover{
	color: #1890ff;
}
.scrollBox{
	overflow: hidden;
	margin: 0 20px 0 10px;
}
/deep/ .toggle-system .el-radio__inner{
	display: none;
}
/deep/ .toggle-system .el-radio__input.is-checked .el-radio__inner{
	display: none;
}
/deep/ .el-radio__label i.fa{
	font-size: 14px;
	display: inline-block;
	margin:10px 6px 0 0;
}
.top-search,/deep/ .top-bar__right i{
		line-height: 56px;
	}
/deep/ .el-input__icon{
	font-size: 16px;
	padding-left: 12px;
    color:rgba(109, 140, 159, 0.5) ;
	}
.toggle-system /deep/ .is-checked{
	height: 56px;
	border-bottom: 2px solid rgba(24,144,255,1);
}	
</style>
