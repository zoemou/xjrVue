<template>
	<div class="l-data-panel l-rblock">
		<div class="l-data-panel--title"><span class="l-data-panel--label">{{data.label}}</span>
			<button type="button" class="el-button el-button--text" @click="handleMore()"><span>{{$t('route.more')}}</span></button>
		</div>
		<div class="l-rblock">
			<div class="l-data-list l-rblock">
				<!-- <avue-crud :class="data.wrap?'wrapTable':''" v-if="dataSource" :data="dataSource" :option="option" stripe style="height: 100%;">
				</avue-crud> -->
				<el-table
				    :data="dataSource"
				    style="width: 100%;"
					height="100%"
				    :default-sort = "{prop: data.orderField, order: 'descending'}"
				    >
					<el-table-column
					      type="index"
					      :index="indexMethod"
						  align="center">
					    </el-table-column>
				    <el-table-column v-for="item in data.column" :key="item.prop"
				      :prop="item.prop"
				      :label="item.label"
				      sortable
				      :width="item.width"
					  :show-overflow-tooltip="!data.wrap">
				    </el-table-column>
				  </el-table>
			</div>
		</div>
	</div>
</template>
<script>
import { getNews} from '@/api/officeautomation/news';
import {getNotice} from '@/api/officeautomation/notice';
import request from '@/router/axios';
import { baseUrl } from '@/config/env';
import {getMenu} from "@/api/user";
import {addPath} from '../util.js';
export default {
    props: ['data','isPreview'],
    data () {
        return {
   //          option:{
			// 	highlightCurrentRow: true, stripe: false, page: false,
			// 	    index: true, indexLabel:' ',menu: false,header:false,height:'100%',align:'center',
			// 	    column: this.data.column
			// },
			dataSource:[]
        }
    },
	watch:{
	    'data.orderField':{
			  handler(val, oldVal) {
				this.getData()
	       }
	    }
	},
    mounted(){
		this.getData()
    },
    methods:{
		indexMethod(index) {
			return index +1;
		},
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
		async getData(){
			if(this.data.maxRows){
				const queryData = {
					limit:1,
					size:this.data.maxRows,
					order:'desc',
					orderfield:this.data.orderField
				}
				const res = this.data.interfaceUrl=='news'? await getNews(queryData) :
				this.data.interfaceUrl=='notice'? await getNotice(queryData) :await request({
					url: baseUrl + '/'+this.data.interfaceUrl,
					method: 'get',
					params: queryData
				})
				if(res?.data?.data?.Rows) this.dataSource= res.data.data.Rows
			}
		}
       
    }
}
</script>
<style>
.el-table th {
    overflow: hidden;
    -ms-user-select: none;
    user-select: none;
    background-color: #fafafa;
    padding: 8px 0;
    font-weight: normal;
}
</style>