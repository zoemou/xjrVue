<template>
	<div class="custom-table__chilren" v-show="show">
		<div class="custom-table__row" v-for="it in listItem" :key="it.F_Id">
			<div class="custom-table__parent" v-show="it.show">
				<div class="custom-table__rowcell checkbox">
					<el-checkbox :indeterminate="it.indeterminate" :label="it.F_Id" :key="it.F_Id" 
					:checked="it.check" @change="handleCheck(it)">{{ }}</el-checkbox>
				</div>
				<div class="custom-table__rowBox">
					<div class="custom-table__rowcell" v-for="el in column" :key="el.prop">
						<template v-if="el.prop=='F_RequestMethod'">
							<div v-for="atype in axiosType" :key="atype.value">
								<el-tooltip v-if="it[el.prop]==atype.value" class="item" effect="dark" :content="$t(atype.label)" placement="top-start">
									<span>{{$t(atype.label)}}</span>
								</el-tooltip>
							</div>
						</template>
						<template v-else>							
							<template v-if="el.prop=='F_Name'">
								<span class="custom-table__indent" :style="{paddingLeft: level*16+'px'}"></span>
								<span v-if="it.children&&it.children.length>=0" @click="changeExpand(it)">
									<i class="el-icon-arrow-down" v-if="it.expand"></i>
									<i class="el-icon-arrow-right" v-else></i>
								</span>
								<template v-else>
									<span class="custom-table__span" :style="{paddingLeft: '12px'}"></span>
								</template>
							</template>
							<el-tooltip class="item" effect="dark" :content="it[el.prop]" placement="top">
								<span>{{it[el.prop]}}</span>
							</el-tooltip>
						</template>
					</div>
				</div>
			</div>
			
			<interfaceItem v-if="it.children&&it.children.length>0" :show="it.expand" :selected="selected" :listItem="it.children" :column="column" :level="childLevel" @changeCheck="changeCheck"></interfaceItem>	
		</div>
	</div>
</template>

<script>
	import {axiosType } from '@/util/util';
	export default {
	  name: 'interfaceItem',
	  props:{
		listItem: {
		  type: Array
		},
		column: {
		  type: Array
		},
		level: {
		  type: Number
		},
		show:{
			type:Boolean
		},
		selected:{
			type: Array
		}
	  },
	  data () {  
	    return {
	      childLevel:this.level+1,
				axiosType:axiosType
	    };
	  },
	  mounted () {
		for(let it of this.listItem){
			if(!it.children||it.children?.length<0){				
				if(this.selected.includes(it.F_Id)){
					this.handleCheck(it)
				}
			}
		}
	  },
	  methods: {
		  handleCheck(val){
			this.$emit('changeCheck',val)
		  },
		  changeCheck(val){
		  	this.handleCheck(val)
		  },
		  changeExpand(item){
		  	item.expand=!item.expand
		  }
	  },
	}
</script>

<style>
</style>
