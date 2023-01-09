<template>
    <el-dialog v-dialogDrag
      :title="conf.title"
      :append-to-body="true"
      :close-on-click-modal="false"
      top="15vh"
      :visible.sync="visibleDialog"
      :width="conf.width"
      :before-close="closeDialog"
    >
      <div class="index-setting-wrap">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('orgRoleManagement.indexAuth.tabIndexList')" name="list">
            <div class="search-wrap">
              <div><input type="text" :placeholder="$t('orgRoleManagement.indexAuth.placeholderName')" v-model="searchVal"></div>
              <div><el-button type="primary" size="small" @click="search">{{$t('orgRoleManagement.indexAuth.inquireBtn')}}</el-button></div>
              <div class="ml10" @click="reset"><el-button size="small" >{{$t('searchModule.searchReset')}}</el-button></div>
            </div>
            <el-checkbox-group v-model="selectedList" v-if="BiList.length>0" @change="handleCheckStatus">
            <div class="list">
              <div
                v-for="(itemCheck,index) in BiList"
                :key="itemCheck.F_Id">
                <img :src="baseUrl+itemCheck.backgroundUrl" alt="">
                <el-checkbox :label="itemCheck.F_Id">{{itemCheck.title}}</el-checkbox>
              </div>
            </div>
          </el-checkbox-group>
          <div class="load-text" v-else-if="!emptyText">{{$t('orgRoleManagement.indexAuth.hintLoading')}}</div>
		  <div class="load-text" v-else>{{$t('deletePrompt.noData')}}</div>
          </el-tab-pane>
          <el-tab-pane :label="$t('orgRoleManagement.indexAuth.tabSelected')" name="selected">
            <el-checkbox-group v-model="selectedList" @change="handleCheckedStatus">
              <div class="list">
                <div
                  v-for="(item,index) in BiCheckList"
                  :key="item.F_Id">
                  <img :src="baseUrl+item.backgroundUrl" alt="">
                  <el-checkbox :label="item.F_Id">{{item.title}}</el-checkbox>
                </div>
              </div>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">{{$t('buttonModule.modalCloseBtn')}}</el-button>
      </span>
    </el-dialog>
</template>
<script>
    import { addBiTplByRole, cancelBiTplByRole, getDefaultIndexConf, getIndexPages } from '@/api/organization/role'
	import { baseUrl} from "@/config/env";
    export default {
        name: "IndexAuth",
        data(){
            return {
                visibleDialog: true,
                emptyText:false,
                activeName: 'list',
                selectedList: [],
                BiList: [],
                BiCheckList: [],
                searchVal: '',
				baseUrl:baseUrl
            }
        },
        async created(){
		  this.emptyText=false;
          let res=await this.getBIList('');
		  this.emptyText=true;
          this.getDefaultIndexConf();
        },
        methods:{
          search(){
            this.getBIList(this.searchVal);
          },
          reset(){
            this.searchVal  = '';
            this.getBIList('');
          },
          getDefaultIndexConf(){
            getDefaultIndexConf(this.conf.parentId,1)
            .then(res=>{
              if(res.data.data){
				  this.BiCheckList=res.data.data
				  this.BiCheckList.forEach(it=>{
					  this.selectedList.push(it.F_Id)
				  })
              }              
            })
            .catch(err=>{})
          },
          getBIList(keyword){
            let promise  = new Promise((resolve,reject)=>{
              getIndexPages(keyword)
              .then(res=>{
                  if(res.data.code != 0){
                    reject('err');
                    return false;
                  }
                  if(res.data.data){
                    this.BiList = res.data.data.Rows || [];
                    resolve('success');
                  }else{
                    reject('err');
                  }
              })
              .catch(err=>{reject('err')})
            });
            return promise;
          },
          handleCheckStatus(arr){
			  if(this.selectedList.length<this.BiCheckList.length){ //删除
				  this.BiCheckList.forEach(it=>{
						let temp=this.selectedList.find(o=>{return o==it.F_Id})
						if(!temp){
							this.cancelBiTplByRole(it);
						}				
					})
			  }else{
				  //前后端 增加
				  this.selectedList.forEach(it=>{
				  	let temp=this.BiCheckList.find(o=>{return o.F_Id==it})
				  	if(!temp){
				  		let obj=this.BiList.find(o=>{return o.F_Id==it})
				  		this.addBiTplByRole(obj)
				  	}				
				  })
			  }
            
          },
          handleCheckedStatus(arr){
            //后端取消
            this.BiCheckList.forEach(it=>{
				let temp=this.selectedList.find(o=>{return o==it.F_Id})
				if(!temp){
					this.cancelBiTplByRole(it);
				}				
			})
            
          },
          addBiTplByRole(item){
            let params = {};
            params.F_VisualReleaseId = item.F_Id || '';
            params.F_Category = 1,
            params.F_ObjectId = this.conf.parentId || '';
            addBiTplByRole(params)
            .then(res=>{
				//前端增加
				this.BiCheckList.push(item)
			})
            .catch(err=>{})
          },
          cancelBiTplByRole(item){
            let params = {};
            params.F_VisualReleaseId = item.F_Id || '';
            params.F_Category = 1,
            params.F_ObjectId = this.conf.parentId || '';
            cancelBiTplByRole(params)
            .then(res=>{
				//前端取消
				this.BiCheckList = this.BiCheckList.filter(item=>{
				  return this.selectedList.includes(item.F_Id);
				})
			})
            .catch(err=>{})
          },
          closeDialog(){
            this.$emit('onHandler');
            this.visibleDialog = false;
          },
          handleClick(tab, event) {
      
          }
        },
        props:{
            'conf': {
                type: Object,
                default: {}
            },
            'visible': {
              type: Boolean,
              default: false
            }
        }
    }
</script>
<style scoped>
/deep/.dialog-footer{
	display: inline-block;
	margin-top: 10px;
}
/deep/.el-dialog__body{
  padding: 10px;
}
.index-setting-wrap .search-wrap{
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.index-setting-wrap .search-wrap input{
  display: block;
  height: 27px;
  line-height:27px;
  width: 200px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  color: #666;
  padding: 0 10px;
  margin-right: 10px;
}
.index-setting-wrap .list{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 8px;
  max-height: 420px;
  overflow-y: scroll;
}
.index-setting-wrap .list > div{
  width: 285px;
  margin: 10px 10px;
  text-align: center;
}
.index-setting-wrap .list > div > img,.index-setting-wrap .list > div > span{
  /* height: calc(100% - 36px); */
  display: block;
  height: 152px;
  width: 100%;
  background-color: #ccc;
  margin-bottom: 10px;
}
.ml10{
  margin-left: 10px;
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
  font-size: 14px;
  padding: 5px 0;
}

@media screen and (max-width: 1370px) {
	  .index-setting-wrap .list{
	    max-height: 320px;
	  }
	  .index-setting-wrap .list > div{
	    width: 280px;
	  }
	} 	
</style>