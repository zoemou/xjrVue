<template>
    <el-dialog v-dialogDrag
      :title="conf.title"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="visibleDialog"
      :width="conf.width"
      :before-close="closeDialog"
    >
      <div class="auth-config-wrap">
          <div class="dialog-left">
            <div class="title">{{$t('orgRoleManagement.databaseAuth.sysFunction')}}</div>
            <el-tree
              :data="companiesTree"
              :props="defaultProps"
              node-key="F_CompanyId"
              @node-click="handleNodeClick"
              ref="funcTree"
              default-expand-all
              v-if="companiesTree.length>0"
            >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span v-html="node.label"></span>
            </span>
            </el-tree>
            <p class="no-func-menu" v-else>{{emptyText}}</p>
          </div>
          <div class="dialog-right">
            <div class="title">{{$t('orgRoleManagement.databaseAuth.autConfig')}}{{funcName}}</div>
            <div class="auth-config" v-if="haveFunc">
              <div class="area-title">{{$t('orgRoleManagement.databaseAuth.basConfig')}}</div>
              <div class="area-config">
                <div>
                  <div class="label">{{$t('orgRoleManagement.databaseAuth.labelEnable')}}</div>
                  <el-radio-group v-model="onConfigVal" @change="handleAuth('1')">
                    <el-radio :label="0">{{$t('orgRoleManagement.databaseAuth.radioNotEnable')}}</el-radio>
                    <el-radio :label="1">{{$t('orgRoleManagement.databaseAuth.radioEnable')}}</el-radio>
                  </el-radio-group>
                </div>
                <div>
                  <div class="label">{{$t('orgRoleManagement.databaseAuth.labelChildFun')}}</div>
                  <el-radio-group v-model="extendsParentVal" :disabled="onConfigVal == 0" @change="handleExtendsParent('2')">
                    <el-radio :label="0">{{$t('orgRoleManagement.databaseAuth.radioNotEnable')}}</el-radio>
                    <el-radio :label="1">{{$t('orgRoleManagement.databaseAuth.radioEnable')}}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="area-title">{{$t('orgRoleManagement.databaseAuth.areaTitle')}}</div>
              <div class="area-config data-auth">
                <el-radio-group v-model="dataAuthVal" :disabled="onConfigVal == 0" @change="handleDataAuth('3')">
                    <el-radio :label="0">{{$t('orgRoleManagement.databaseAuth.radioViewDate')}}</el-radio>
                    <el-radio :label="1">{{$t('orgRoleManagement.databaseAuth.radioViewCom')}}</el-radio>
                    <el-radio :label="2">{{$t('orgRoleManagement.databaseAuth.radioComSubcom')}}</el-radio>
                    <el-radio :label="3" v-show="dataAuthSwitch">{{$t('orgRoleManagement.databaseAuth.radioViewDep')}}</el-radio>
                    <el-radio :label="4" v-show="dataAuthSwitch">{{$t('orgRoleManagement.databaseAuth.radioDepSubdep')}}</el-radio>
                    <el-radio :label="5" v-show="dataAuthSwitch">{{$t('orgRoleManagement.databaseAuth.radioViewSelf')}}</el-radio>
                    <el-radio :label="6" v-show="dataAuthSwitch">{{$t('orgRoleManagement.databaseAuth.radioSelfSubstaff')}}</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="default-pancel" v-if="!haveFunc">
              <div>
                <i class="el-icon-setting"></i>
                <p>{{$t('orgRoleManagement.databaseAuth.selectSysFun')}}</p>
              </div>
            </div>
          </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">{{$t('buttonModule.modalCloseBtn')}}</el-button>
      </span>
    </el-dialog>
</template>
<script>
    import { getFuncTree,getFuncAppTree, saveDataAuth } from '@/api/organization/role'
    export default {
        name: "DatabaseAuth",
        props:{
            'conf': {
                type: Object,
                default: {}
            },
            'visible': {
              type: Boolean,
              default: false
            },
          databaseAuthType: {
            type: String,
            default: 'pc'
          },
        },
        data(){
            return {
                visibleDialog: false,
                onConfigVal: 0,
                extendsParentVal: 0,
                dataAuthVal: 0,
                haveFunc: false,
                funcName: '',
                companiesTree: [],
                defaultProps: {
                  children: "children",
                  label: "F_FullName",
                },
                leafList: [],
                emptyText: this.$t('orgRoleManagement.databaseAuth.hintLoading'),
                storeTreeData: {},   //???????????????tree???????????????????????? key:value => id:node
                parentModuleIds: [],   //??????????????????????????????ids
                dataAuthSwitch: false
            }
        },
        mounted(){
         this.getFuncTree();
        },
        methods:{
            async getFuncTree(){
              console.log('--------------');
              let id = this.conf.parentId || '';
              let type = this.conf.type || '';     //0: ??????  1: ??????
              let res = null;
              if(this.databaseAuthType=='pc'){
                res = await getFuncTree(id,type);
              }
              if(this.databaseAuthType=='app'){
                res = await getFuncAppTree(id,type);
              }
              if(res&&res.data&&res.data.code == 0){
                if(res.data.data.length){
                  this.companiesTree = res.data.data;
                  //??????????????????
                  this.displayAuthorInfo(this.companiesTree);
                  this.visibleDialog = this.visible;
                  this.changeDataStructToLocal(this.companiesTree);
                }else{
                  this.$message({
                    message:this.$t('orgRoleManagement.databaseAuth.hintNoPermiss'),
                    type: "warning",
                  });
                  this.closeDialog();
                }
              }
            },
            /***
             * ?????????????????????????????? key:value => id:node
             * @params Array arr ?????? ????????????
             * ****/
             changeDataStructToLocal(arr){
              arr.forEach((item)=>{
                this.storeTreeData[item.id] = item;
                if(item.children && item.children.length){
                  this.changeDataStructToLocal(item.children);
                }
              });
              return false;
            },
            displayAuthorInfo(arr){
              arr.forEach((item)=>{
                if(item.children && item.children.length){
                  this.displayAuthorInfo(item.children);
                }else if(item.F_Target == 'iframe'   // ?????????????????????
                          && item.authorizedData
                          && JSON.stringify(item.authorizedData) != '{}'){
                  item.F_FullName = item.F_FullName+'<span style="float: right;color:#409EFF;">'+this.$t('configured') +'</span>';
                }
              });
              return false;
            },
            closeDialog(){
                this.$emit('onHandler');
                this.visibleDialog = false;
            },
            handleNodeClick(data,node,component) {
              let textNode = data.F_FullName.split('<');
              this.haveFunc = true;
              this.funcName = '-' + textNode[0];

              //??????????????????
              if(data.authorizedData
                  && JSON.stringify(data.authorizedData) != '{}'){
                  this.onConfigVal = data.authorizedData.F_EnabledMark || 0;
                  this.extendsParentVal = data.authorizedData.F_EnabledChildrenMark || 0;
                  this.dataAuthVal = data.authorizedData.F_DataSettingType || 0;
              }else{
                  this.onConfigVal = 0;
                  this.extendsParentVal = 0;
                  this.dataAuthVal = 0;
              }

              let fullName = node.data.F_FullName.split('<');
              if(fullName.length>1){
                fullName = fullName[0];
              }else{
                fullName = node.data.F_FullName;
              }
              switch(fullName){
                case '????????????':;
                case '????????????':;
                case '????????????':;
                case '????????????':;
                case '????????????':this.dataAuthSwitch = false;break;
                default: this.dataAuthSwitch = true;
              }
            },
            handleAuth(value){
              let nodes = this.$refs.funcTree.getCurrentNode();
              let params = {};
              params.F_EnabledMark = this.onConfigVal || 0;
              params.F_EnabledChildrenMark = this.extendsParentVal || '';
              params.F_DataSettingType = this.dataAuthVal ?? '';
              params.F_ObjectId = this.conf.parentId || '';
              params.F_ObjectType = this.conf.type || '';
              params.F_ModuleIds = this.getLeafId(nodes);  //??????????????????moduleId
              if(this.databaseAuthType=='pc'){
                 params.F_ModuleType = 1;
              }
              if(this.databaseAuthType=='app'){
                params.F_ModuleType = 2;
              }
              saveDataAuth(params).then((res)=>{});

              //?????????????????????????????????  ????????????????????????
              nodes.authorizedData = nodes.authorizedData || {};
              nodes.authorizedData.F_EnabledMark = this.onConfigVal || 0;
              nodes.authorizedData.F_EnabledChildrenMark = this.extendsParentVal || 0;
              nodes.authorizedData.F_DataSettingType = this.dataAuthVal || 0;

              this.toggleConfigPrompt(nodes,this.onConfigVal);
            },
            handleExtendsParent(value){
              let nodes = this.$refs.funcTree.getCurrentNode();
              let params = {};
              params.F_EnabledMark = this.onConfigVal || 0;
              params.F_EnabledChildrenMark = this.extendsParentVal || '';
              params.F_DataSettingType = this.dataAuthVal ?? '';
              params.F_ObjectId = this.conf.parentId || '';
              params.F_ObjectType = this.conf.type || '';
              params.F_ModuleIds = this.getLeafId(nodes);  //??????????????????moduleId
              
              //????????????????????????
              nodes.authorizedData = nodes.authorizedData || {};
              nodes.authorizedData.F_EnabledMark = this.onConfigVal || 0;
              nodes.authorizedData.F_EnabledChildrenMark = this.extendsParentVal || 0;
              nodes.authorizedData.F_DataSettingType = this.dataAuthVal ?? 0;
              saveDataAuth(params).then((res)=>{});
            },
            handleDataAuth(value){
              let nodes = this.$refs.funcTree.getCurrentNode();
              let params = {};
              params.F_EnabledMark = this.onConfigVal || 0;
              params.F_EnabledChildrenMark = this.extendsParentVal || '';
              params.F_DataSettingType = this.dataAuthVal ?? '';
              params.F_ObjectId = this.conf.parentId || '';
              params.F_ObjectType = this.conf.type || '';
              params.F_ModuleIds = this.getLeafId(nodes);  //??????????????????moduleId

              saveDataAuth(params).then((res)=>{});

              //????????????????????????
              nodes.authorizedData = nodes.authorizedData || {};
              nodes.authorizedData.F_EnabledMark = this.onConfigVal || 0;
              nodes.authorizedData.F_EnabledChildrenMark = this.extendsParentVal || 0;
              nodes.authorizedData.F_DataSettingType = this.dataAuthVal || 0;

              //???????????????????????????moduleId ??????????????????????????????????????????
              this.getUpdateParentIds(nodes);
              if(this.parentModuleIds.length){
                //?????????????????????????????? ?????????????????????????????? ????????????
                let params = {};
                params.F_EnabledChildrenMark = 0;
                params.F_ObjectId = this.conf.parentId || '';
                params.F_ObjectType = this.conf.type || '';
                params.F_ModuleIds = this.parentModuleIds;  //??????????????????moduleId

                saveDataAuth(params).then((res)=>{});
              }
            },
            getUpdateParentIds(node){
               let parentNode = this.storeTreeData[node.F_ParentId] || {};
               
               if(node.F_ParentId == '0'){
                 return;
               }

               //???????????????
               if(parentNode && parentNode.authorizedData && JSON.stringify(parentNode.authorizedData) != '{}'){
                //?????????????????????????????????????????????                
                if(parentNode.authorizedData.F_EnabledChildrenMark
                     && parentNode.authorizedData.F_EnabledChildrenMark == 1){
                      this.parentModuleIds.push(parentNode.F_ModuleId);  //?????????????????????
                      //???????????????
                      this.getUpdateParentIds(parentNode);
                }else{
                   return false;
                }
               }else{
                 return false;
               }
            },
            /**
             * ??????????????????id ????????????
             * @params Array nodes?????????????????????
             * **/
            getLeafId(nodes){
              let _arr = [];
              if(nodes.children && nodes.children.length > 0){
                nodes.children.forEach((item)=>{
                 _arr.push(...this.getLeafId(item));
                });
              }else{
                _arr.push(nodes.F_ModuleId);
              }
              return (()=>{ return _arr; })();
            },
            /**
             * ???/??????????????????
             * @params Array nodes ????????????????????????
             * @params Number switchFlag ??????????????????  0: ?????????1?????????
             * **/
            toggleConfigPrompt(nodes,switchFlag){
              //???????????????????????????
              let children = nodes.children;
              if(children.length){
                children.forEach((item)=>{
                  this.toggleConfigPrompt(item,switchFlag);  //????????????????????????
                });
              }
              nodes.dataAuthorizedVo = switchFlag;
              
              //???????????????????????????
              if(switchFlag && children.length<=0){
                if(!nodes.F_FullName.includes(this.$t('configured'))){
                  nodes.F_FullName = nodes.F_FullName+'<span style="float: right;color:#409EFF;">'+ this.$t('configured') +'</span>';
                }
              }else{
                let textNode = nodes.F_FullName.split('<');
                nodes.F_FullName = textNode[0];
              }
              return;
            }
        },
    }
</script>
<style scoped>
div /deep/.dialog-footer{
	display: inline-block;
	margin-top: 10px;
}
div /deep/.el-dialog__body{
  padding: 10px;
}
.dialog-left,.dialog-right{
  border: 1px solid #eee;
  border-radius: 8px;
}
.dialog-left .title,.dialog-right .title{
  width: 100%;
  height: 35px;
  text-align: center;
  border-bottom: 1px solid #eee;
  color: #666;
  font-size: 14px;
  font-weight: 700;
  line-height: 35px;
}
div /deep/.el-tree{
  margin: 10px;
  height: 446px;
  overflow-y: auto;
  padding-right: 10px;
  overflow-x: auto;
}
.auth-config-wrap{
  display: flex;
  align-items: stretch;
}
.auth-config-wrap .dialog-left{
  flex: none;
  margin-right: 10px;
  width: 290px;
}
.auth-config-wrap .dialog-right{
  flex: 1;
}
.auth-config{
  margin: 10px;
}
.area-title{
  color: #666;
  font-size: 14px;
  font-weight: 700;
  padding: 0px 0px 5px 0;
  border-bottom: 1px solid #eee;
}
.area-config > div{
  display: flex;
  margin: 10px 0;
}
.area-config > div > .label{
  color: #666;
  font-size: 14px;
  width: 160px;
  text-align: right;
  margin-right: 30px;
}
div /deep/.el-radio-group{
  position: relative;
  top: 8px;
}
.data-auth /deep/.el-radio-group{
  display: block;
  margin-left: 15px;
}
.data-auth /deep/.el-radio{
  display: block;
  margin: 15px 0;
}
.default-pancel{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.default-pancel i{
  color: #ccc;
  font-size: 30px;
}
.default-pancel p{
  color: #ccc;
  font-size: 22px;
  line-height: 1.6em;
  margin: 0;
}
.custom-tree-node{
  width: 100%;
}
.custom-tree-node > span{
  display: block;
  width: 100%;
}
.no-func-menu{
  height: 160px;
  text-align: center;
  color: #999;
}
@media screen and (max-width: 1370px) {
	div /deep/ .el-dialog {
	    margin-top:2vh!important;
	  }    
	}
div /deep/ .el-tree-node__content{
		 height: auto!important;
	 }
</style>