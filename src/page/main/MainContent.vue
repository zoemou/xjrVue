<template>
  <div class="main-content" :style="{'padding-left': paddingLeft + 'px'}">
    <div class="main-box">
      <!-- 标题模块 -->
     <!-- <div class="main-header" ref="header">{{ title }}
        <block v-if="subTitle"> -</block>
        {{ subTitle }}
        <slot name="icon"></slot>
      </div> -->

    

      <!-- 表格模块 -->
      <div class="main-table" :style="{'padding-top': paddingTop + 'px','padding-bottom':paddingBottom+'px'}">
		  <!-- 搜索模块 -->
		  <div id="main-search-box">
			  <slot name="search" v-if="search">
				<div class="main-search" ref="search">
					<div class="main-search-box" v-show="!isShow">
						<div class="search-item">
							<!-- <slot name="search"></slot> -->
						</div>
						<div class="toggle-btn" @click="toggle" v-show="collapse">
							<i class="el-icon-minus"></i>
						</div>
					</div>
					<div class="main-prompt-box" :class="{'retract': isShow}" v-show="isShow&&collapse">
						<div class="prompt-item">查询条件</div>
						<div class="toggle-btn" @click="toggle">
							<i class="el-icon-plus"></i>
						</div>
					</div>
				</div>
			  </slot>
		  </div>
        <div class="main-table-content">
		
          <slot name="table"></slot>
		  
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainContent',
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    paddingLeft: {
      type: Number,
      default: 0
    },
    paddingTop: {
      type: Number|String,
      default: 125
    },
    paddingBottom:{
      type: Number|String,
      default: 0
    },
    search: {
      type: Boolean,
      default: true
    },
    collapse: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isShow: false,
    };
  },
  mounted () {
	
  },
  methods: {
    toggle () {
      this.isShow = !this.isShow;
      if (!this.isShow) {
        this.paddingTop = 125;
      } else {
        this.paddingTop = 85;
      }
    }
  }
};
</script>

<style scoped>
.main-content {
  position: relative;
  height: 100%;
  box-sizing: border-box;
}

.main-box {
  position: relative;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
}

.main-header {
  height: 40px;
  padding-left: 20px;
  font-size: 12px;
  line-height: 40px;
  font-weight: normal;
  background: #fff;
  box-sizing: border-box;
  color: #333;
}

.main-search {
  left: 0;
  z-index: 10;
  width: 100%;
  background: #fff;
  border-top: 1px solid #f2f2f2;
  box-sizing: border-box;
}

.main-search .main-search-box, .main-search .main-prompt-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 5px 10px;
}

.main-search .main-prompt-box.retract {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 35px;
  line-height: 35px;
  font-size: 14px;
  font-weight: bold;
}

.main-search .prompt-item {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
  padding-right: 20px;
  box-sizing: border-box;
}
.main-search .search-item{
	 display: flex;
	 align-items: flex-start;
	 justify-content: flex-start;
	 flex: 1;
	 box-sizing: border-box;
}

.main-search .toggle-btn {
  float: right;
  width: 32px;
  height: 32px;
  font-size: 18px;
  color: #02A7F0;
  text-align: center;
  line-height: 32px;
}

.toggle-btn {
  display: none;
}

.main-table {
  padding-top: 0px !important;
  z-index: 2;
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;

}
.main-table-content {
  height: 100%;
  background: #fff;
 /* border-top: 1px solid #f2f2f2; */
  box-sizing: border-box;
  overflow: hidden;
}
.main-table-content>div{
	height: 100%;
}
div /deep/ .search-box{
	position: absolute;
	top:6px;
	left:5px;
	z-index:1;
}

div /deep/ .searchBox{
	top: 6px;
	z-index: 1;
	left: 5px;
	position: absolute;
	display:block;
}
div /deep/ .searchBox .el-form-item{
	margin-top: 0;
	margin-bottom: 6px!important;
}
div /deep/ #printTable .avue-crud__menu{
	position: static;
}
div /deep/ .avue-crud__left{
  display: flex;
	height: 30px;
	float: right;
	margin:7px 40px 2px 345px;
}
div /deep/ .avue-crud__right{
	position: absolute;
	right: 5px;
	top:0px;
	height: 30px;
}
</style>