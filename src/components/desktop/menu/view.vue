<template>
    <l-data-panel
        :label="data.label" style="display: flex;"
        >
        <div class="l-data-board l-rblock" style="overflow: auto;">
            <div class="l-data-menu">
				<div @click="handleClick(item.moduleId)" class="l-data-menu__item" v-for="item in columns" :key="item">
					<div class="l-data-menu__icon" :style="{background:item.bgColor}">
						<i :class="item.icon"  :style="{color:item.color}"></i>                         
					</div>
					<div class="l-data-board__title">{{item.name}}</div>
				</div>
				
			</div>
        </div>
    </l-data-panel>
</template>
<script>
import {addPath} from '../util.js';
import {getMenu} from "@/api/user";
import { deepClone } from "@/util/util";
export default {
    props: ['data','isPreview'],
    data () {
        return {
			columns:[]
        }
    },
	watch:{
	    'data.columns':{
			handler(val, oldVal) {
				this.getData()
	        },
	     	deep: true //true 深度监听
	    }
	},
	mounted(){
		this.getData()
		
	},
    methods:{
		getData(){
			this.columns=deepClone(this.data.columns)
			this.columns.sort((a,b)=>{
				return a.orderId-b.orderId
			})
		},
        handleClick(moduleId){
            if(!this.isPreview && moduleId){
                let item=JSON.parse(moduleId)
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
        }
    }
}
</script>
<style>
.l-data-menu__icon{
	margin: 0 auto 20px;
	height: 64px;
	width: 64px;
	border-radius: 50%;
	text-align: center;
	line-height: 64px;
	font-size: 36px;
}
.l-data-menu{
	display: flex;justify-content: flex-start;
    align-items: center;
    width: fit-content;
}
.l-data-menu__item{padding-top: 30px;width:180px;text-align:center;flex:1}
</style>
