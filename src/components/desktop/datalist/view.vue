<template>
	<div class="l-data-panel l-rblock">
		<div class="l-data-panel--title"><span class="l-data-panel--label">{{data.label}}</span>
			<button type="button" class="el-button el-button--text" @click="handleMore"><span>{{$t('route.more')}}</span></button>
		</div>
		<div class="l-rblock">
			<div class="l-data-list l-rblock">
				<avue-crud v-if="mainTable" :data="mainTable" :option="option" stripe style="height: 100%;">
				</avue-crud>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
import {getDataByBindfields} from '@/api/code/form';
import request from '@/router/axios';
import { baseUrl } from '@/config/env';
import { deepClone } from "@/util/util";
import {getMenu} from "@/api/user";
import {addPath} from '../util.js';
export default {
    props: ['data','isPreview'],
    data () {
        return {
            mainTable:null,
			option:{
				highlightCurrentRow: true, stripe: false, page: false,
				    index: true, indexLabel:' ',menu: false,header:false,height:'100%',align:'center',
				    column:[]
			}
        }
    },
    watch:{		
      'data.columns':{
		  handler(val, oldVal) {
			this.getData()
         },
       	 deep: true //true 深度监听
      },
	  'data.orderId':{
		  handler(val, oldVal) {
			this.getData()
         }
	  }
    },
	mounted(){
		this.getData()
	},
    methods:{
        handleMore(){
            if(!this.isPreview && this.data.moduleId){
                let item=JSON.parse(this.data.moduleId)
                this.$store.commit('SET_SYSTEMID',item.id);
                getMenu(item.id).then(res=>{
                    let menu = res?.data?.data || [];
                    if((menu instanceof Array) && menu.length){
                      menu.forEach((ele) => {
                        addPath(ele, true);
                      });
                      this.$router.$avueRouter.formatRoutes(menu,true)
                      this.$store.commit('SET_MENU',menu);
                      this.$store.commit('SET_MENUALL',menu);
                    }
                	this.$router.push({ path: item.url});
                })
            }
        },
		getData(){
			let fields=[]
			this.data.columns.forEach(el=>{
				if(el.prop) fields.push(el.prop)				
			})
			let columns=deepClone(this.data.columns);
			this.option.column=columns.sort((a,b)=>{
				return a.orderId-b.orderId
			})
			
			if(this.data.viewForm&&fields.length>0){
				let arr=this.data.viewForm.split(",")
				if(arr[1]==1){ //自定义表单
					getDataByBindfields({
						bind:fields.join(","),
						id:arr[0],
						max:this.data.maxRows,
						order:this.data.orderId
					}).then(res=>{
						if(res?.data?.data) this.mainTable=res.data.data
					})
				}else{
					//系统表单
					let url=arr[2].split('/')
					request({
						url: baseUrl +'/'+ url[url.length-1],
						method: 'get',
						params: {
							limit:1,
							size:this.data.maxRows,
							orderfield:this.data.orderId
						}
					}).then(res=>{
						if(res?.data?.data?.Rows) this.mainTable=res.data.data.Rows
					})
				}
				
			}
		}
        
    }
}
</script>

