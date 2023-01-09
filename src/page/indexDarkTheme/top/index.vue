<template>
  <div class="avue-top">
    <div class="top-bar__left">
    </div>
    <div class="top-bar__right">
      <div class="top-bar__item">
        <el-dropdown placement="top" v-if="allSystem.filter(item=>{return item.F_Id != '0'}).length>=1">
          <span><i class="fa fa-exchange"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item 
              v-for="(item,idx) in allSystem" 
              :key="idx"
              :disabled="item.F_Id == systemId"
              @click.native="changeSystem(item)"
              ><div class="hor-flex">
                <span>{{$t(item.F_LgMarkCode||item.F_Name)}}</span>
                <span class="lar-circle" v-if="item.F_Id == systemId"><span class="small-circle"></span></span>
              </div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-tooltip v-if="showDebug && website.errorLogSwitch"
                  effect="dark"
                  :content="logsFlag?$t('navbar.bug'):logsLen+$t('navbar.bugs')"
                  placement="bottom">
        <div class="top-bar__item">
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
        <el-tooltip v-if="showColor"
                  effect="dark"
                  :content="$t('navbar.color')"
                  placement="bottom">
        <div class="top-bar__item">
          <top-color></top-color>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showTheme"
                  effect="dark"
                  :content="$t('navbar.theme')"
                  placement="bottom">
        <div class="top-bar__item top-bar__item&#45;&#45;show">
          <top-theme></top-theme>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showNotice" effect="dark"
                  :content="$t('navbar.notice')"
                  placement="bottom">
        <div class="top-bar__item top-bar__item--show" style="font-size: 18px;">
          <top-notice></top-notice>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showLanguage" effect="dark"
                  :content="$t('navbar.language')"
                  placement="bottom">
        <div class="top-bar__item top-bar__item--show">
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
      <el-dropdown>
        <span class="el-dropdown-link user-name">
          {{userInfo.F_RealName}}
          <i class="fa fa-caret-down user-name-down"></i>
        </span>
        <img class="top-bar__img" :src="userInfo.F_HeadIcon" alt="" onerror="javascript:this.src='/img/headPic.png'"/> 
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

            <el-dialog v-dialogDrag
          :title="$t('user.aboutDialog.modalTitle')"
          :visible.sync="dialogVisible"
          width="30%"
          append-to-body
          class="about-box"
          >
          <p class="about-logo"><img class="img" src="/img/logo_blue.png" alt=""><b>{{website.title}} {{website.platformName}}</b></p>
          <p class="about-text">{{$t('user.aboutDialog.versionNum')}}： {{website.version}} </p>
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
import {
  isURL,
  validatenull
} from "@/util/validate";
import webiste from "@/config/website";
function addPath(ele, first) {
  const menu = webiste.menu;
  const propsConfig = menu.props;

  const propsDefault = {
    label: propsConfig.label || "label",
    path: propsConfig.path || "path",
    icon: propsConfig.icon || "icon",
    children: propsConfig.children || "children",
    target: propsConfig.target || "target",
  };
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;


  if (isURL(ele[propsDefault.path])) {
    
    ele[propsDefault.path] = ele[propsDefault.path].replace(/&/g, "$");
  }
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + "/index";
  } else {
    ele[propsDefault.children] &&
      ele[propsDefault.children].forEach((child) => {
        if (!isURL(child[propsDefault.path])) {
          child[propsDefault.path] = `${ele[propsDefault.path]}${
            child[propsDefault.path] ? child[propsDefault.path] : "index"
          }`;
        }
        addPath(child);
      });
  }
}
export default {
  components: {
    topLock,
    topMenu,
    topSearch,
    topTheme,
    topLogs,
    topColor,
    topNotice,
    topLang
    
  },
  name: "top",
  inject: ["index"],
  data () {
    return {
       website,
      dialogVisible:false
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
      setTimeout(()=>{
      let haveMainSystem = this.allSystem.find(item=>{return item.F_Id == '0'});
      if(!haveMainSystem && this.allSystem.length && this.systemId == '0'){
        this.$store.commit('SET_SYSTEMID',this.allSystem[0].F_Id);
        let url = this.allSystem[0].F_IndexUrl;
        this.$store.commit('SET_INDEX_URL',url);
        this.$event.$emit('noMainSystemExec');
      }
    },500);
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
      "sysCategory",
      "allSystem", 
      "systemId", 
      "tagList"
    ])
  },
  methods: {
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
    }
  }
};
</script>

<style lang="scss" scoped>
	.user-name{
		display: inline-block;
		font-size: 12px;
		color: #abaacd ;
		padding-left: 10px;
		cursor: pointer;
	}
	.user-name-down{
		color: #abaacd;
		padding:0 5px;
	}
	.top-icon-color,.el-dropdown{
		color: #abaacd!important;
	}
	.avue-top{
		line-height: 64px!important;
    padding:0px!important;	
    height: 100px;
    float: right;
    width: 372px;
    z-index: 1999;	
    background-color: #030028!important;
	}
	.top-bar__right{
		height: 92px;
		width: 100%;
		box-sizing: border-box;
		margin-top: 8px;
		border-top: 1px solid rgba(39,87,233,1);
		right: 0px!important;
		color: #fff!important;
	}
  .hor-flex{
    display: flex;
    align-items: center;
  }
  .lar-circle{
    display: inline-block;
    width: 13px;
    height: 13px;
    background-color: rgba(49, 49, 168,.3);
    box-shadow: 0px 0px 2px #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    animation: lar-cir-ani 1.5s infinite alternate;
    margin-left: 10px;
  }
  .small-circle{
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: rgb(49, 49, 168);
    border-radius: 50%;
    animation: small-cir-ani 1s infinite alternate;
  }
  @keyframes lar-cir-ani {
    from{
      box-shadow: 0px 0px 1px rgba(90, 90, 107, 0.9);
    }
    to{
      box-shadow: 0px 0px 15px rgba(90, 90, 107, 0.9);
    }
  }
  @keyframes small-cir-ani {
    from{
      border-radius: 50%;
      transform: scale(.5);
    }
    to{
      border-radius: 50%;
      transform: scale(1);
    }
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
</style>