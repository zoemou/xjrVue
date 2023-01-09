<template>
    <div>
        <div class="wrapper wrapper-content" style="padding:0px 10px; box-sizing: border-box;">
            <el-card class="box-card" shadow="never" style="margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>常用功能</span>
                </div>
                <el-row :span="24" class="hotFunc-common-func">
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
                        <div class="contact-box">
                            <a href="" 
                                @click.prevent="goToPage('/business-intelligence/bi-realese')"
                                class="clearfix J_menuItem">
                                <div class="text-center color2">
                                    <i class="img-responsive  fa fa-line-chart"></i>
                                </div>
                                <div class="info">
                                    <div class="m-t-xs getText" style="color: #38A1F2;">数据看板</div>
                                    <p>通过企业级的交互式数据解决方案，为企业运营及决策保驾护航</p>
                                </div>
                            </a>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
                        <div class="contact-box">
                            <a href="" 
                                @click.prevent="goToPage('/quick-development/code-build')"
                                class="clearfix J_menuItem">
                                <div class="text-center color4">
                                    <i class="img-responsive fa fa-code"></i>
                                </div>
                                <div class="info">
                                    <div class="m-t-xs getText" style="color: #f76461;">代码生成器</div>
                                    <p>快速、简单、高效的生成各类项目代码，节约开发成本</p>
                                </div>
                            </a>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
                        <div class="contact-box">
                            <a  href="" 
                                @click.prevent="goToPage('/workflow/design')"
                                class="clearfix J_menuItem">
                                <div class="text-center color1">
                                    <i class="img-responsive el-icon-s-operation"></i>
                                </div>
                                <div class="info">
                                    <div class="m-t-xs getText" style="color: #0fc88a;">流程设计</div>
                                    <p>采用可视化编辑工作流引擎，辅助研发人员设计专业的流程功能，节约学习成本，提高工作效率</p>
                                </div>
                            </a>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
                        <div class="contact-box">
                            <a  href="" 
                                @click.prevent="goToPage('/system-managerment/data-authorize/DataAuthorize')" 
                                class="clearfix J_menuItem">
                                <div class="text-center color3">
                                    <i class="img-responsive fa fa-wpforms"></i>
                                </div>
                                <div class="info">
                                    <div class="m-t-xs getText" style="color: #fbb44a;">自定义表单</div>
                                    <p>提供多元化组件，满足不同场景不同需求下的表单结构</p>
                                </div>
                            </a>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
                        <div class="contact-box">
                            <a  href=""
                                @click.prevent="goToPage('/quick-development/code-scheme')"
                                class="clearfix J_menuItem">
                                <div class="text-center color1">
                                    <i class="img-responsive fa fa-clone"></i>
                                </div>
                                <div class="info">
                                    <div class="m-t-xs getText" style="color: #0fc88a;">代码模板</div>
                                    <p>通过建立各类自定义代码模板，满足重复场景的代码复用</p>
                                </div>
                            </a>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
                        <div class="contact-box">
                            <a  href=""
                                @click.prevent="goToPage('/system-managerment/template/excel-import')"
                                class="clearfix J_menuItem">
                                <div class="text-center color2">
                                    <i class="img-responsive fa fa-file-excel-o"></i>
                                </div>
                                <div class="info">
                                    <div class="m-t-xs getText" style="color: #38A1F2;">Excel配置</div>
                                    <p>快捷的配置Excel导入功能，轻松实现数据移动、转换</p>
                                </div>
                            </a>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
                        <div class="contact-box">
                            <a  href=""
                                @click.prevent="goToPage('/wel/index')"
                                class="clearfix J_menuItem">
                                <div class="text-center color4">
                                    <i class="img-responsive el-icon-house"></i>
                                </div>
                                <div class="info">
                                    <div class="m-t-xs getText" style="color: #f76461;">首页展示</div>
                                    <p>通过展示各类统计数据、待办信息、系统公告等，提高管理效率</p>
                                </div>
                            </a>
                        </div>
                    </el-col>
                    <!-- <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6">
                        <div class="contact-box">
                            <a href="#" class="clearfix J_menuItem">
                                <div class="text-center color2">
                                    <i class="img-responsive fa fa-tv"></i>
                                </div>
                                <div class="info">
                                    <div class="m-t-xs getText" style="color: #38A1F2;">桌面配置</div>
                                    <p>用户可对桌面进行自定义配置，不错漏任何关键性数据</p>
                                </div>
                            </a>
                        </div>
                    </el-col> -->
                </el-row>
            </el-card>
            <el-card class="box-card hotFunc" shadow="never">
                <div slot="header" class="clearfix">
                    <span>更多功能</span>
                </div>
				<div class="flex_container">
							  <div class="flex-item someBtns">
								  <a  href=""
                                    @click.prevent="goToPage('/organization/user')" 
                                    class="J_menuItem xzkh_button" style="border: 1px solid #0FC88A;color:#0FC88A;">
								  	<div class="fa fa-user"></div>
								  	<span class="getText">新增客户</span>
								  </a>
							  </div>
							  <div class="flex-item someBtns">
							  	<a  href="" 
                                     @click.prevent="goToPage('/quick-development/database-manager/datalink')"
                                    class="J_menuItem sjk_button" style="border: 1px solid #E64758;color:#E64758;">
							  		<div class="fa fa-area-chart"></div>
							  		<span class="getText">新增数据库</span>
							  	</a>
							  </div>
							  <div class="flex-item someBtns">
							  	<a href=""
                                   @click.prevent="goToPage('/quick-development/database-manager/datasrouce')"
                                   class="J_menuItem sjy_buttton" style="border: 1px solid #38A1F2;color:#38A1F2;">
							  		<div class="fa fa-bar-chart-o"></div>
							  		<span class="getText">新增数据源</span>
							  	</a>
							  </div>
							  <div class="flex-item someBtns">
							  	<a href="" 
                                   @click.prevent="goToPage('/business-intelligence/bi/list','_blank')"
                                   class="J_menuItem xzkh_button" style="border: 1px solid #0FC88A;color:#0FC88A;">
							  		<div class="fa fa-line-chart"></div>
							  		<span class="getText">新增看板</span>
							  	</a>
							  </div>
							  <div class="flex-item someBtns">
							  	<a  href=""
                                    @click.prevent="goToPage('/organization/company')"
                                   class="J_menuItem sjk_button" style="border: 1px solid #E64758;color:#E64758;">
							  		<div class="fa fa-building"></div>
							  		<span class="getText">新增公司</span>
							  	</a>
							  </div>
				
				 </div>
				<div class="flex_container">
				 			  <div class="flex-item someBtns">
				 				 <a href=""
                                    @click.prevent="goToPage('/organization/role')"
                                    class="J_menuItem sjy_buttton" style="border: 1px solid #38A1F2;color:#38A1F2;">
				 				 	<div class="fa fa-user-plus"></div>
				 				 	<span class="getText">新增角色</span>
				 				 </a>
				 			  </div>
				 			  <div class="flex-item someBtns">
				 			  	<a  href=""
                                    @click.prevent="goToPage('/quick-development/formform-design')"
                                   class="J_menuItem xzkh_button" style="border: 1px solid #0FC88A;color:#0FC88A;">
				 			  		<div class="fa fa-th-list"></div>
				 			  		<span class="getText">新增自定义表单</span>
				 			  	</a>
				 			  </div>
				 			  <div class="flex-item someBtns">
				 			  	<a href=""
                                   @click.prevent="goToPage('/workflow/design')"
                                   class="J_menuItem sjk_button" style="border: 1px solid #E64758;color:#E64758;">
				 			  		<div class="fa fa-sitemap"></div>
				 			  		<span class="getText">新增流程模板</span>
				 			  	</a>
				 			  </div>
				 			  <div class="flex-item someBtns">
										  <a href=""
                                             @click.prevent="goToPage('/workflow/process')"
                                            class="J_menuItem sjy_buttton" style="border: 1px solid #38A1F2;color:#38A1F2;">
											<div class="fa fa-paste"></div>
											<span class="getText">创建流程任务</span>
										  </a>
				 			  </div>
				 			  <div class="flex-item someBtns">
				 			  	<a  href=""
                                    @click.prevent="goToPage('/workflow/delegate')"
                                   class="J_menuItem xzkh_button" style="border: 1px solid #0FC88A;color:#0FC88A;">
				 			  		<div class="fa fa-file-text"></div>
				 			  		<span class="getText">新增流程委托</span>
				 			  	</a>
				 			  </div>
				 
				 </div>
				
				
				
				

			</el-card>
        </div>

        <el-dialog v-dialogDrag title="填写基本信息" :append-to-body="true" :visible.sync="dialogVisible" width="800px"
                   :show-close="false" :close-on-press-escape="false"
                   :close-on-click-modal="false">
            <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="80px"
                     :validate-on-rule-change="false">
                <el-row>
                    <el-col span="12">
                        <el-form-item prop="F_ContactName" label="姓名">
                            <el-input v-model="dataForm.F_ContactName" size="medium" style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col span="12">
                        <el-form-item prop="F_QICQ" label="QQ">
                            <el-input v-model="dataForm.F_QICQ" size="medium" style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col span="12">
                        <el-form-item prop="F_FullName" label="公司">
                            <el-input v-model="dataForm.F_FullName" size="medium" style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col span="12">
                        <el-form-item prop="F_Mobile" label="密码">
                            <el-input v-model="dataForm.F_Mobile" size="medium" style="width: 100%"
                                      show-password></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<el-button size="mini" type="primary" @click="formSubmit('dataForm')">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {logAdd} from "@/api/user";
    import {setStore, getStore} from "@/util/store";

    export default {
        name: "wel",
        inject: ['reload'],
        data() {

            return {
                dialogVisible: false,
                dataForm: {
                    F_ContactName: '',
                    F_QICQ: '',
                    F_FullName: '',
                    F_Mobile: '',
                },
                rules: {
                    F_ContactName: [{required: true, message: '请填写姓名', trigger: 'blur'}],
                    F_QICQ: [{required: true, message: '请填写QQ', trigger: 'blur'}],
                    F_FullName: [{required: true, message: '请填写公司', trigger: 'blur'}],
                    F_Mobile: [{required: true, message: '请填写密码', trigger: 'blur'}],
                },
            };
        },
        computed: {
            ...mapGetters(["tagWel",'userInfo']),
        },
        created() {
            const isRealName = getStore({name: 'userInfo'}).F_RealName;
            if (!isRealName) {
                this.dialogVisible = true;
            }
        },
        methods: {
            goToPage(path,target) {
                if(target == '_blank'){  //新窗口打开
                    let routeData = this.$router.resolve({
                        path: path,
                        query: { target: "open" },
                        params: {}
                    });
                    window.open(routeData.href, "_blank");
                }else{
                    this.$router.push({ path: path });
                }  
            },
            gotoPath(path) {
                this.$router.push({
                    label: 'F_FullName',
                    path: '/usermanagement',
                    component: 'views/organization/UserManagement',
                    icon: 'F_Icon',
                    children: []
                });
            },
            /**
             * @description 确认
             * @param formName 校验对象
             * @event reload 重新加载当前页面
             * */
            async formSubmit(formName) {
                const volid = this.$refs[formName].validate(valid => valid);
                if (!volid) return;

                const {dataForm} = this;
                const {code} = await logAdd(dataForm)
                if (code) return;

                // 填写完信息，注入到localStorage
                const {...UserInfo} = getStore({name: 'UserInfo'})
                setStore({name: 'UserInfo', content: {...UserInfo, F_RealName: dataForm.F_ContactName}})

                this.reload()
                this.dialogVisible = false;

            },
        }
    };
</script>
<style scoped="scoped">
	
	.flex_container{
		  display: flex;
		  justify-content: space-between;
		  width:100%;
	  }
	  .flex-item{ width:18%;}
	
	  .flex-item a{
		  display: block;
		  text-align: center;
		  padding:30px 0;
		  border-radius: 5px;
	  }
	.someBtns div.fa{
		display: inline-block!important;
		padding-right: 16px;
	}  
	
    /*热门功能样式*/
    .el-col {
        margin-bottom: 25px;
    }

    .el-col-lg-2, .el-col-xl-2 {
        /* width: 9.9999%; */
        margin-right: 22px;
    }

    .wrapper {
        height: 100%;
		overflow: auto;
    }

    .hotFunc {
        min-height: calc(100% - 374px)
    }

    .contact-box {
        position: relative;
        height: 100px;
        width: 320px;
        background: none;
        border: 0;
    }
.contact-box a:hover{
	transition:all 0.5s ;
	box-shadow: 5px 5px 10px  rgba(0,0,0,0.1);
}
    .contact-box a {
        height: 100px;
        width: 320px;
        font-size: 12px;
        color: #666;
        border-radius: 6px;
        border: 1px solid #eee;
        margin-top: 12px;
        background: #fff;
        display: flex;
        align-items: center;
        text-decoration: none;
    }

    .text-center {
        width: 100px;
        height: 100px;
        border-radius: 6px 0px 0px 6px;
        text-align: center;
    }

    .contact-box .img-responsive {
        font-size: 32px;
        color: #fff;
        line-height: 100px;
    }

    .contact-box .col-sm-4 {
        max-width: 80px;
        padding: 0 20px 0 0;
    }

    .contact-box .info {
        flex: 1;
        padding-left: 20px;
    }

    .contact-box .info div {
        font-size: 16px;
        text-align: center;
        line-height: 25px;
    }

    .contact-box .info p {
        font-size: 12px;
        color: #9F9F9F;
        margin-top: 4px;
    }

    @keyframes fadenum {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    .someBtns {
        padding: 40px 0 0;
    }

   /* .someBtns .el-col {
        height: 125px;
    } */

    .someBtns .el-col a {
        align-items: center;
        font-size: 14px;
        color: #666;
        border-radius: 5px;
       
        height: 80px;
        display: flex;
        justify-content: space-around;
    }

    .someBtns .el-col img {
        display: block;
        margin: 0 auto 15px;
    }

    .someBtns div.fa {
        display: block;
        font-size: 25px;
        line-height: 1;
    }

    .color1 {
        background-color: #0fc88a;
    }

    .color2 {
        background-color: #38A1F2;
    }

    .color3 {
        background-color: #fbb44a;
    }

    .color4 {
        background-color: #f76461;
    }
	.xzkh_button:hover{
		color:#fff!important;
		background-color:rgb(15, 200, 138);
		transition: all 0.5s;
		box-shadow:5px 5px 15px rgba(15,200,138,0.3);
	}
	.sjk_button:hover{
		color: #fff!important;
		transition: all 0.5s;
		background:rgb(230, 71, 88);
		box-shadow:5px 5px 15px rgba(230,71,88,0.3);
	}
	.sjy_buttton:hover{
		color: #fff!important;
		transition: all 0.5s;
		background: rgb(56, 161, 242);
		box-shadow:5px 5px 15px rgba(56,161,242,0.3);
    }
</style>
