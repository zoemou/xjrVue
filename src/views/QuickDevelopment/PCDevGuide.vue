<template>
  <div class="wrapper height-per100 pcd_guide" style="padding:0px 10px;box-sizing: border-box;">
    <!-- 开发向导开始 -->
    <el-row :span="24" class="kfxd_con">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('PCDevGuide.titleDevelopmentDuide')}}</span>
          </div>
          <div class="kfxd_box">
            <div class="kfxd_box1">
              <div class="contact-box dataBaseSet">
                <a href="javascript:void(0);" class="clearfix sjupz_box" style="border-color:#b3d8ff; background-color: #ecf5ff;">
                  <i class="img-responsive fa fa-database"></i>
                  <div class="info">
                    <div class="m-b-md">{{$t('PCDevGuide.databaseConfiguration')}}</div>
                    <div class="enter"><i class="fa fa-angle-up"></i></div>
                  </div>
                </a>
                <div class="dataSetBox">
                  <div class="layer"></div>
                  <div class="set-li">
                    <a href="javascript:void(0);" class="J_menuItem"  @click.prevent="goToPage('/data_config/database-manager/datalink')">
                      <i class="fa fa-chain sjklj_icon"></i>
                      <div class="getText">{{$t('PCDevGuide.databaseLinks')}}</div>
                    </a>
                  </div>
                  <div class="set-li">
                    <a href="javascript:void(0);" class="J_menuItem"   @click.prevent="goToPage('/data_config/database-manager/datatable')">
                      <i class="fa fa-table sjbgl_icon"></i>
                      <div class="getText">{{$t('PCDevGuide.dataSheetManagement')}}</div>
                    </a>
                  </div>
                  <div class="set-li">
                    <a href="javascript:void(0);" class="J_menuItem"  @click.prevent="goToPage('/data_config/database-manager/datasrouce')">
                      <i class="fa fa-pie-chart sjygl_icon"></i>
                      <div class="getText">{{$t('PCDevGuide.dataSourceManagement')}}</div>
                    </a>
                  </div>
                </div>
              </div>
              <div class="direction_line"></div>
              <div class="contact-box">
                <a
                  href="javascript:void(0);"
                  class="clearfix J_menuItem J_menuItem sjupz_box"
                  style="border-color:#b3d8ff; background-color: #ecf5ff;"
                  @click.prevent="goToPage('/data_config/data-item')"
                >
                  <i class="img-responsive fa fa-book"></i>
                  <div class="info">
                    <div class="m-b-md getText">{{$t('PCDevGuide.dataDictionary')}}</div>
                    <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                  </div>
                </a>
              </div>
            </div>
            <div class="kfxd_box2">
              <!-- 左边内容 -->
              <div class="kfxd_box2_l">
                <div class="dir_line1"></div>
                <div class="dir_line2"></div>
                <div class="dir_line3 clear">
                  <div class="dmscq_box">
                    <div class="dir_line1"></div>
                  </div>
                  <div class="dmscq_box">
                    <div class="dir_line1"></div>
                  </div>
                </div>
              </div>
              <!-- 右边内容 -->
              <div class="kfxd_box2_l">
                <div class="dir_line1"></div>
                <div class="dir_line2"></div>
                <div class="dir_line3">
                  <div class="dmscq_box">
                    <div class="dir_line1"></div>
                  </div>
                  <div class="dmscq_box">
                    <div class="dir_line1"></div>
                  </div>
                </div>
              </div>
              <div class="clear"></div>
            </div>
            <div class="kfxd_box3 ">
              <div class="bdsj_box">
                <div class="contact-box" >
                  <a href="javascript:void(0);" class="clearfix J_menuItem" @click.prevent="goToPage('/quick-development/code-build')">
                    <i class="img-responsive fa fa-file-code-o"></i>
                    <div class="info">
                      <div class="m-b-md getText">{{$t('PCDevGuide.codeGenerator')}}</div>
                      <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                    </div>
                  </a>
                </div>
              </div>
              <div class="bdsj_box">
                <div class="contact-box">
                  <a
                    href="javascript:void(0);"
                    @click.prevent="goToPage('/custom_dev/form-design')"
                    class="clearfix J_menuItem"
                    style="border-color:#E64758;"
                  >
                    <i class="img-responsive fa fa-file-text"></i>
                    <div class="info">
                      <div class="m-b-md getText">{{$t('PCDevGuide.formDesign')}}</div>
                      <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                    </div>
                  </a>
                </div>
              </div>
              <div class="bdsj_box">
                <div class="contact-box">
                  <a href="javascript:void(0);" 
                    @click.prevent="goToPage('/workflow/design')"
                    class="clearfix J_menuItem" style="border-color:#E64758;">
                    <i class="img-responsive fa fa-sitemap"></i>
                    <div class="info">
                      <div class="m-b-md getText">{{$t('PCDevGuide.processDesign')}}</div>
                      <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                    </div>
                  </a>
                </div>
              </div>
              <div class="bdsj_box">
                <div class="contact-box">
                  <a href="javascript:void(0);" 
                    @click.prevent="goToPage(baseUrl + '/ureport/designer',2)"
                    class="clearfix J_menuItem" style="border-color:#E64758;">
                    <i class="img-responsive fa fa-line-chart"></i>
                    <div class="info">
                      <div class="m-b-md getText">{{$t('PCDevGuide.reportDesign')}}</div>
                      <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div class="kfxd_box2">
              <!-- 左边内容 -->
              <div class="kfxd_box2_l">
                <div class="dir_line3 clear">
                  <div class="dmscq_box">
                    <div class="dir_line1"></div>
                  </div>
                  <div class="dmscq_box">
                    <div class="dir_line1"></div>
                  </div>
                </div>
              </div>
              <!-- 右边内容 -->
              <div class="kfxd_box2_l">
                <div class="dir_line3">
                  <div class="dmscq_box">
                    <div class="dir_line1"></div>
                  </div>
                  <div class="dmscq_box">
                    <div class="dir_line1"></div>
                  </div>
                </div>
              </div>
              <div class="clear"></div>
            </div>
            <div class="kfxd_box3 ">
              <div class="dmmb_box">
				<div class="contact-box dataBaseSet">
				  <a href="javascript:void(0);" class="clearfix sjupz_box" style="border-color:#b3d8ff; background-color: #ecf5ff;">
				    <i class="img-responsive fa fa-code"></i>
				    <div class="info">
				      <div class="m-b-md">{{$t('PCDevGuide.codeTemplate')}}</div>
				      <div class="enter"><i class="fa fa-angle-up"></i></div>
				    </div>
				  </a>
				  <div class="dataSetBox">
				    <div class="layer"></div>
				    <div class="set-li">
				      <a href="javascript:void(0);" class="J_menuItem"  @click.prevent="goToPage('/quick-development/code-scheme/custom_development_template')">
				        <i class="fa fa-code sjklj_icon"></i>
				        <div class="getText">{{$t('数据优先模板')}}</div>
				      </a>
				    </div>
				    <div class="set-li">
				      <a href="javascript:void(0);" class="J_menuItem"   @click.prevent="goToPage('/quick-development/code-scheme/custom_table_structure_template')">
				        <i class="fa fa-code sjbgl_icon"></i>
				        <div class="getText">{{$t('界面优先模板')}}</div>
				      </a>
				    </div>
				    <div class="set-li">
				      <a href="javascript:void(0);" class="J_menuItem"  @click.prevent="goToPage('/quick-development/code-scheme/rapid_development_of_simple_templates')">
				        <i class="fa fa-code sjygl_icon"></i>
				        <div class="getText">{{$t('简易模板')}}</div>
				      </a>
				    </div>
				  </div>
				</div>
              </div>
              <div class="dmmb_box">
                <div class="contact-box">
                  <a href="javascript:void(0);" 
                    @click.prevent="goToPage('/custom_dev/form-release')" 
                    class="clearfix J_menuItem">
                    <i class="img-responsive fa fa-pinterest"></i>
                    <div class="info">
                      <div class="m-b-md getText">{{$t('PCDevGuide.formRelease')}}</div>
                      <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                    </div>
                  </a>
                </div>
              </div>
              <div class="dmmb_box">
                <div class="contact-box">
                  <a href="javascript:void(0);" 
                    @click.prevent="goToPage('/workflow/process')"
                    class="clearfix J_menuItem">
                    <i class="img-responsive fa fa-tasks"></i>
                    <div class="info">
                      <div class="m-b-md getText">{{$t('PCDevGuide.processTask')}}</div>
                      <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                    </div>
                  </a>
                </div>
              </div>
              <div class="dmmb_box">
                <div class="contact-box">
                  <a
                    href="javascript:void(0);"
                    @click.prevent="goToPage('/custom_dev/report-release')"
                    class="clearfix J_menuItem"
                    style="border-color:#38A1F2;"
                  >
                    <i class="img-responsive fa fa-pinterest"></i>
                    <div class="info">
                      <div class="m-b-md getText">{{$t('PCDevGuide.reportDelease')}}</div>
                      <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 开发向导结束 -->

    <el-row :span="24">
      <!-- 系统配置开始 -->
      <!-- <el-col :span="6" class="xtbz_box">
        <el-card
          class="box-card"
          style="margin-bottom: 10px;padding-bottom: 27px;min-height: 342px; box-sizing: border-box;"
        >
          <div slot="header" class="clearfix">
            <span>系统配置</span>
          </div>
          <div class="kfxd_box1">
            <div class="contact-box">
              <a
                href="#"
                class="clearfix J_menuItem"
                style="border-color:#b3d8ff; background-color: #ecf5ff; margin-top: 20px;"
              >
                <i class="img-responsive fa fa-desktop"></i>
                <div class="info">
                  <div class="m-b-md getText">桌面配置</div>
                  <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                </div>
              </a>
            </div>
          </div>
        </el-card>
      </el-col> -->
      <!-- 系统配置结束 -->
      <!-- 权限设置开始 -->
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('PCDevGuide.titlePermissionSettings')}}</span>
          </div>
          <div class="qxsz_con">
            <div class="kfxd_box1 qxsz_box1">
              <div class="contact-box" style="margin-bottom: 40px;">
                <a  href=""
                    @click.prevent="goToPage('/organization/user')"
                    class="clearfix J_menuItem" 
                    style="border-color:#b3d8ff; background-color: #ecf5ff;">
                  <i class="img-responsive fa fa-user"></i>
                  <div class="info">
                    <div class="m-b-md getText">{{$t('PCDevGuide.userManagement')}}</div>
                    <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                  </div>
                </a>
              </div>
              <div class="contact-box">
                <a
                  href=""
                  @click.prevent="goToPage('/organization/role')"
                  class="clearfix J_menuItem"
                  style="border-color:#b3d8ff; background-color: #ecf5ff;"
                >
                  <i class="img-responsive fa fa-user"></i>
                  <div class="info">
                    <div class="m-b-md getText">{{$t('PCDevGuide.roleManagement')}}</div>
                    <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                  </div>
                </a>
              </div>
            </div>

            <div class="qxsz_box2">
              <div style="width:30px; float: left;">
                <div class="qxsz_box2_line1" style="margin-top: 35px;"></div>
                <div class="qxsz_box2_line1" style="margin-top: 110px;"></div>
              </div>
              <div class="qxsz_box2_line2"></div>
              <div style="height: 184px;"><div class="qxsz_box2_line3"></div></div>
            </div>
            <div class="bdsj_box qxsz_box3" style="width:auto!important; float: left;">
              <div class="contact-box" style="margin:66px 0px 0px -2px;">
                <a href="" 
                  @click.prevent="goToPage('/organization/role')"
                  class="clearfix J_menuItem">
                  <i class="img-responsive fa fa-database"></i>
                  <div class="info">
                    <div class="m-b-md getText">{{$t('PCDevGuide.dataPermission')}}</div>
                    <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                  </div>
                </a>
              </div>
            </div>
            <div style="height: 184px; width: 30px; float: left;">
              <div class="qxsz_box2_line3"></div>
            </div>
            <div class="dmmb_box  qxsz_box3" style="width:auto!important; float: left;">
              <div class="contact-box" style="margin:66px 0px 0px -2px;">
                <a href="" 
                  @click.prevent="goToPage('/organization/role')"
                  class="clearfix J_menuItem">
                  <i class="img-responsive fa fa-file-text"></i>
                  <div class="info">
                    <div class="m-b-md getText">{{$t('PCDevGuide.customFormPermissions')}}</div>
                    <div class="enter">进入 <i class="fa fa-angle-right"></i></div>
                  </div>
                </a>
              </div>
            </div>
            <div class="clear"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { baseUrl} from "@/config/env"

export default {
  name: "PCDevGuide",
  data:{
    baseUrl : baseUrl
  },
  methods: {
    goToPage(path,type = 1) {
      if(type === 1){
        
      this.$router.push({ path: path });
      }
      else{
         window.open(path, '_blank');
      }
      // window.open(path, '_blank');
    },
  },
};
</script>

<style scoped="scoped">
.box-card >>> .el-card__body {
    padding: 20px;
}
/* 修改样式 */
.el-card {
    overflow: initial;
}
.xtbz_box {
  padding-right: 15px;
  box-sizing: border-box;
}
.contact-box {
  display: inline-block;
}
.direction_line {
  height: 3px;
  background: #353432;
  display: inline-block;
  width: 284px;
}
.direction_line1 {
  height: 30px;
  background: #353432;
  display: inline-block;
  width: 3px;
}
.kfxd_box1 .contact-box > a:hover {
  transition: all 0.5s;
  background-color: #4ba4ff !important;
  color: #fff;
}
.dataSetBox i.sjklj_icon {
  background: #4ba4ff;
}
.sjbgl_icon {
  background: #67c23a;
}
.sjygl_icon {
  background: #ebb35f;
}

.kfxd_box {
  width: 920px;
  margin: 20px auto;
}
.kfxd_box1 {
  text-align: center;
  color: #4ba4ff;
}
.kfxd_box2_l {
  float: left;
  width: 50%;
}
.dir_line1 {
  width: 3px;
  height: 30px;
  background: #353432;
  margin: 0 auto;
}
.dir_line2 {
  width: 233px;
  height: 3px;
  background: #353432;
  margin: 0 auto;
}
.dmscq_box {
  width: 50%;
  display: inline-block;
}
.bdsj_box,
.dmmb_box {
  width: 25%;
  display: inline-block;
  text-align: center;
  margin-top: -10px;
}
.bdsj_box .contact-box > a {
  background: #f0f9eb !important;
  border: 1px solid #c2e7b0 !important;
  color: #67c23a !important;
}
.bdsj_box .contact-box > a:hover {
  background: #67c23a !important;
  color: #fff !important;
  transition: all 0.5s;
}
.dmmb_box .contact-box > a {
  background: #fdf6ec !important;
  border: 1px solid #f5dab1 !important;
  color: #fbb44a !important;
}
.dmmb_box .contact-box > a:hover {
  background: #fbb44a !important;
  color: #fff !important;
  transition: all 0.5s;
}
.clear {
  clear: both;
}
.kfxd_con {
  margin-bottom: 4px;
}
.qxsz_con {
  display: flex;
  justify-content: center;
  margin: 20px 0px 40px 20px;
  height: 184px;
}

.qxsz_box1 {
  width: 182px;
  float: left;
  height: 184px;
}
.qxsz_box2 {
  width: 65px;
  float: left;
  height: 184px;
}
.qxsz_box2_line1 {
  width: 100%;
  height: 3px;
  background: #353432;
}
.qxsz_box2_line2 {
  height: 116px;
  width: 3px;
  background: #353432;
  float: left;
  margin-top: 35px;
}
.qxsz_box2_line3 {
  width: 30px;
  height: 3px;
  background: #353432;
  display: inline-block;
  margin-top: 92px;
}

.wrapper {
  height: calc(100% - 10px);
}
.height-per100 {
  height: 100%;
}
.contact-box {
  position: relative;

  width: 180px;
  background: none;
  border: 0;
}
.contact-box > a {
  height: 70px;
  width: 180px;
  text-align: center;
  line-height: 70px;
  color: inherit;
  border-radius: 6px;
  border: 1px solid #f2f2f2;
  position: relative;
  background: #fff;
  display: inline-block;
}
.contact-box .info {
  display: inline-block;
  text-align: center;
  line-height: 70px;
  padding-left: 15px;
}
.contact-box .enter {
  color: #02a7f0;
  font-size: 13px;
  position: absolute;
  right: 10px;
  bottom: -20px;
  display: none;
}
.contact-box.dataBaseSet .enter {
  display: block;
}
.contact-box.dataBaseSet .enter i {
  transition: all 0.1s ease-in 0ms;
  color: #999;
}
.contact-box:hover:after {
  animation: fadenum 1s ease;
  background-image: linear-gradient(141deg, #80ffff 0%, #81d3f8 75%);
}
/* .contact-box:hover .enter {
	display: block;
} */
@keyframes fadenum {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.fa-angle-double-right {
  font-size: 48px;
  color: #999;
  font-weight: bold;
  margin: 45px 0 30px;
  line-height: 68px;
}
.ibox {
  margin: 0;
}
.fa-angle-double-down {
  font-size: 48px;
  color: #999;
  font-weight: bold;
  display: block;
  text-align: center;
}
.dataSetBox {
  display: none;
  position: absolute;
  border: 1px solid #f0f2f5;
  box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
  z-index: 3;
  background: #fff;
  top: 88px;
  left: 0;
  width: 240px;
  justify-content: space-between;
}
.dataBaseSet:hover .dataSetBox {
  display: flex;
}
.dataSetBox .layer{
  position: absolute;height: 30px;top: -30px;left: 0px;background-color: transparent;width: 100%;
}
.dataBaseSet:hover .fa-angle-up {
  transform: rotate(180deg);
  -ms-transform: rotate(180deg); /* IE 9 */
  -moz-transform: rotate(180deg); /* Firefox */
  -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
  -o-transform: rotate(180deg);
}
.dataSetBox i {
 display: inline-block;
  font-size: 20px;
  color: #fff;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  line-height: 52px;
  text-align: center;
}
.set-li {
  text-align: center;
  font-size: 12px;
  line-height: 24px;
}
.dataSetBox:before {
  content: "";
  position: absolute;
  top: -12px;
  left: 113px;
  margin-left: -5px;
  border-width: 6px;
  border-style: solid;
  border-color: transparent transparent #fff transparent;
  z-index: 2;
}
.dataSetBox > .set-li > a{
  display: inline-block;
}
.dataSetBox > .set-li > a:hover{
  background-color: transparent;
}
.dataSetBox > .set-li > a:hover .getText{
  color: #333;
}
.dataSetBox > .set-li > a:hover i{
  display: inline-block;
  font-size: 20px;
  color: #fff;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  text-align: center;
}
.dataSetBox:after {
  content: "";
  position: absolute;
  top: -15px;
  left: 112px;
  margin-left: -5px;
  border-width: 7px;
  border-style: solid;
  border-color: transparent transparent #ccc transparent;
  z-index: 1;
}
.el-col-12 {
  padding: 0 15px;
}
.m-b-md {
  font-size: 16px;
}

.pcd_guide .img-responsive {
	 
	  font-size: 20px;
	  display: inline;
	
}
</style>
