<template>
   <!-- <l-data-board v-bind="data" :value="showValue" @click.native="handleClick" ></l-data-board> -->
    <div class="l-data-board l-rblock" @click="handleClick">
	    <div class="l-data-board__icon" :style="{background:data.bgColor}">
		   <i :class="data.icon" :style="{color:data.color}"></i>
		</div>
		<div class="l-data-board__text">
			<div class="l-data-board__num"><l-count-up :end="showValue" ></l-count-up><span>{{data.unit}}</span></div>
			<div class="l-data-board__title">{{data.label}}</div>
		</div>
	</div>
</template>
<script>
import {getDataBySQL} from '@/api/databasemanage/datasource';
import { mapGetters } from "vuex";
import {getMenu} from "@/api/user";
import {addPath} from '../util.js';
export default {
    props: ['data','isPreview'],
    data () {
        return {
			showValue:0,
			oldDataSource:[]
        }
    },
    computed:{
         ...mapGetters(["modules"])
    },
	 watch: {
	    'data.dataValueKey': {
	     handler(val, oldVal) {
	        this.getData()
	      },
	      //deep: true //true 深度监听
	    },
		'data.computeType': {
	     handler(val, oldVal) {
	        this.getData()
	      },
	      //deep: true //true 深度监听
	    },
		'data.dataCode': {
	      async handler(val, oldVal) {
	        const res = await getDataBySQL(this.data.dataCode,{field:this.data.dataValueKey})				
			this.oldDataSource=res.data.data||[];
	      },
	      //deep: true //true 深度监听
	    },
	},
    mounted(){
		this.timer = null;
		this.getData()
        this.refresh()
    },
    
    methods:{
		refresh(){
			if(this.timer == null){
			    this.timer = setTimeout(()=>{
					this.getData()
					this.timer = null;
					this.refresh()
				},5*60*1000)
			}
		},
        handleClick(){
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
			if(this.data.dataCode&& this.data.dataValueKey){
				let arr=[]
				if(this.oldDataSource.length<=0||!this.timer){
					const res = await getDataBySQL(this.data.dataCode,{field:this.data.dataValueKey})
					arr=res.data.data;					
					this.oldDataSource=res.data.data;
				}else{
					arr=this.oldDataSource
				}
				if(Array.isArray(arr)){
					let total=arr.length;
					arr=arr.filter(o=>{return typeof o[this.data.dataValueKey] === 'number' && !isNaN(o[this.data.dataValueKey])})
					if(arr.length){
						if(this.data.computeType==""){
							this.showValue=arr[0][this.data.dataValueKey]
						}else if(this.data.computeType=="sum"){
							this.showValue=0
							arr.forEach((it,i)=>{
								this.showValue+=parseFloat(it[this.data.dataValueKey]);											
							})
						}else if(this.data.computeType=="avg"){
							let sum=0;
							arr.forEach((it,i)=>{
								sum+=parseFloat(it[this.data.dataValueKey]);											
							})
							this.showValue=(sum/total).toFixed(2);
						}else if(this.data.computeType=="max"){
							arr.sort((a,b)=>{
								return b[this.data.dataValueKey]-a[this.data.dataValueKey];											
							})
							this.showValue=parseFloat(arr[0][this.data.dataValueKey]);
						}else if(this.data.computeType=="min"){
							arr.sort((a,b)=>{
								return a[this.data.dataValueKey]-b[this.data.dataValueKey];											
							})
							this.showValue=parseFloat(arr[0][this.data.dataValueKey]);
						}
						
					}else{
						this.showValue=0;
					}
			
				}				
			}
		}
    },
	beforeDestroy(){
		clearTimeout(this.timer);
	},
}
</script>

