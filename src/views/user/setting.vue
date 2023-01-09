<template>
  <div class="user-setting" style="padding:0px 8px; box-sizing: border-box;">
    <basic-container style="height:100%;">
      <el-tabs tab-position="" stretch >
        <!-- <el-tab-pane label="安全设置">
          <div class="user-setting__main">
            <div class="user-setting__title">安全设置</div>
            <div class="user-setting__item">
              <div class="user-setting__meta">
                <p class="title">
                  <i class="el-icon-user"></i>
                  账号安全
                </p>
                <p class="subtitle">更改当前账号密码</p>
              </div>
              <div class="user-setting__menu">
                <el-button size="small">修改</el-button>
              </div>
            </div>
            <div class="user-setting__item">
              <div class="user-setting__meta">
                <p class="title">
                  <i class="el-icon-mobile-phone"></i>
                  绑定手机
                </p>
                <p class="subtitle">设置您的绑定手机号码</p>
              </div>
              <div class="user-setting__menu">
                <el-button size="small">修改</el-button>
              </div>
            </div>
            <div class="user-setting__item">
              <div class="user-setting__meta">
                <p class="title">
                  <i class="el-icon-message"></i>
                  绑定邮箱
                </p>
                <p class="subtitle">设置您的绑定邮箱</p>
              </div>
              <div class="user-setting__menu">
                <el-button size="small">修改</el-button>
              </div>
            </div>
          </div>

        </el-tab-pane>
        <el-tab-pane label="通知设置">
          <div class="user-setting__main">
            <div class="user-setting__title">通知设置</div>
            <div class="user-setting__item">
              <div class="user-setting__meta">
                <p class="title">
                  <i class="el-icon-document"></i>
                  系统消息
                </p>
                <p class="subtitle">系统性的通知或者更新消息</p>
              </div>
              <div class="user-setting__menu">
                <el-switch v-model="value">
                </el-switch>
              </div>
            </div>
            <div class="user-setting__item">
              <div class="user-setting__meta">
                <p class="title">
                  <i class="el-icon-user"></i>
                  帐号消息
                </p>
                <p class="subtitle">帐号变更的通知消息</p>
              </div>
              <div class="user-setting__menu">
                <el-switch v-model="value">
                </el-switch>
              </div>
            </div>
          </div>
        </el-tab-pane> -->

        <el-tab-pane :label="$t('user.setting.Title')">
          <div class="user-setting__main">
            <div class="user-setting__title">{{$t('user.setting.Title')}}</div>
          </div>
          <div class="index-setting-wrap" :style="'height:'+listHeight">
            <div class="search-wrap">
              <div><input type="text" :placeholder="$t('user.setting.searchVal')" v-model="searchVal"></div>
              <div><el-button type="primary" size="mini" @click="search">{{$t('searchModule.searchBtn')}}</el-button></div>
              <div class="ml5"><el-button size="mini" @click="resetBtn">{{$t('searchModule.searchReset')}}</el-button></div>
            </div>
            <el-radio-group v-model="activeIndex" @change="handleChange">
            <div class="list" v-if="!loading">
              <div
                v-for="(item,index) in pageList"
                :key="item.F_Id"
              >
                <img :src="baseUrl+item.backgroundUrl" alt="">
                <el-radio :label="item.F_Id">{{item.title}}</el-radio>
              </div>
            </div>
            </el-radio-group>
            <div v-if="loading" class="load-text">{{loadText}}</div>
            <div class="empty-text" style="display:none;">{{$t('user.setting.hintNoData')}}</div>
          </div>
          <div class="text-right">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="load"
              :total="indexTotal"
              @prev-click="load"
              @next-click="load">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import { getIndexPages, changeIndexSetting, getIndexDefaultConf } from '@/api/organization/user'
import { mapGetters } from "vuex";
import { baseUrl} from "@/config/env";
export default {
  data () {
    return {
      value: true,
      activeIndex: 1,
      pageList: [],
      searchVal: '',
      indexTotal: 0,
      pageSize: 10,
      currentPage: 1,
      loading: false,
      loadText:this.$t('user.setting.hintLoading'),
      listHeight: '',
	  baseUrl:baseUrl
    }
  },
  async created(){
    this.listHeight = document.body.clientHeight - 300 + 'px'; 
    await this.getIndexPages(''); 
    this.getIndexDefaultConf();
  },
  computed:mapGetters(["systemId"]),
  methods: {
    search(){
      this.getIndexPages(this.searchVal);
    },
	resetBtn(){
		this.searchVal=""
		this.getIndexPages(this.searchVal);
	},
    load(page){
      this.currentPage = page;
      this.getIndexPages(this.searchVal);
    },
    getIndexPages(keyword){
      let page = {};
      page.limit = this.currentPage;
      page.size = this.pageSize;

      this.loading = true;
      getIndexPages(keyword,page)
      .then(res=>{
          if(res.data.data){
            this.pageList = res.data.data.Rows || [];
            this.indexTotal = res.data.data.Total || 0;
            this.loading = false;
          }else{
            this.loadText = this.$t('user.setting.hintNoTemplate');
          }
      })
      .catch(err=>{
        this.loadText = this.$t('user.setting.hintNetError');
      })
    },
    getIndexDefaultConf(){
      let systemId = this.systemId || '';
      getIndexDefaultConf(systemId)
      .then(res=>{
        if(res.data.data){
          this.activeIndex = res.data.data.F_VisualReleaseId;
        }
      })
      .catch(err=>{})
    },
    handleChange(val){
      let systemId = this.systemId || '';
      changeIndexSetting(val,{'systemId':systemId})
      .then(res=>{
        if(res.data.code == 0){
          this.$message({type:'success',message:this.$t('user.setting.hintChangeSuccess')});
          this.getIndexPages(this.searchVal);
        }
      })
      .catch()
    }
  }
}
</script>

<style lang="scss">
.user-setting {
  &__main {
    padding: 8px 40px;
  }
  &__item {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
  }
  &__title {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 12px;
  }
  &__meta {
    flex: 1;
    .title {
      margin: 6px 0;
      font-weight: 700;
      font-size: 14px;
    }
    .subtitle {
      margin: 8px 0;
      font-size: 14px;
      color: #555;
    }
  }
}

.user-setting__meta .subtitle{
	color: #C2C2C2;
}
.user-setting__title{
	font-size: 16px;
	margin-bottom: 0px;
}
.user-setting__main{
	padding:8px 20px;
}
.user-setting__meta .title i{
	font-size: 16px;
	padding-right: 10px;
}
.basic-container{
	box-sizing: border-box;
}
.is-always-shadow{
	height: 100%;
}
.index-setting-wrap .search-wrap{
  display: flex;
  align-items: center;
  margin-left: 19px;
}
.index-setting-wrap .search-wrap input{
  display: block;
  height: 27px;
  line-height: 27px;
  width: 259px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #666;
  background-color: #fff;
  padding: 0 10px;
  margin-right:5px;
}
.index-setting-wrap .search-wrap input::placeholder{
  color: #ccc;
  font-size: 14px;
}
.index-setting-wrap .list{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 5px;
}
.index-setting-wrap .list > div{
  width: 285px;
  margin: 10px 15px;
  text-align: center;
}
.index-setting-wrap .list > div > img,.index-setting-wrap .list > div > span{
  /* height: calc(100% - 36px); */
  display: block;
  height: 152px;
  width: 100%;
  background-color: #999;
  margin-bottom: 10px;
}
.index-setting-wrap .list > div > img{
	border:1px solid #eee;
}
.ml5{
  margin-left:5px;
}
.index-setting-wrap .empty-text{
  font-size: 14px;
  color: #666;
  margin: 10px;
  text-align: center;
}
.load-text{
  text-align: center;
  color: #666;
}
.text-right{
  text-align: right;
}
.el-card__body{
	padding-top:0px;
}
.basic-container{padding:0px;}
</style>
