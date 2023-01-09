<template>
	<div class="dynamic-contant">
		<div class="dynamic-bg">
			<div class="dynamic-text">
				<img class="dynamic-image" src="../../../public/img/dynamic-one.gif"/>
				<p class="text-one">
					<a href="javascript:void(0);" @click.prevent="goToPage('/office-automation/erp_model/StockManage/erp_outstock')">
						<span>苏州仓库出库 </span></br>
						<b>总数：{{outTockCount}}</b>
					</a>
				</p>
				<p class="text-two">
					<a href="javascript:void(0)" @click.prevent="goToPage('/office-automation/erp_model/StockManage/erp_instock')">
						<span>苏州仓库入库 </span></br>
						<b>总数：{{instockCount}}</b>
					</a>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { baseUrl} from "@/config/env";
import request from '@/router/axios';
export default {
  name: "indexOne",
  data() {
    return {
		instockCount: null,
		timer: null,
		outTockTimer: null,
		outTockCount: 0,
	}
  },
  created() {
	let _this = this;
	this.timer = setInterval(() => {
		_this.getInstockInfo();
	},10000);
	this.outTockTimer = setInterval(() => {
		_this.outTockCount++;
	},3000);
  },
  beforeDestroy () {
	clearInterval(this.timer);
	clearInterval(this.outTockTimer);
	this.outTockCount = 0;
  },
  methods: {
    goToPage(path,type = 1) {
      if(type === 1){
        
      this.$router.push({ path: path });
      }
      else{
         window.open(path, '_blank');
      }
    },
	getInstockInfo(){
		request({
            url: baseUrl + '/erp_instock',
            method: 'get',
            params: this.searchParam
        }).then(res => {
			this.instockCount = res.data.data.Total;
			console.log('instock',res);
			console.log(this.instockCount)
		})
	}
  },
};
</script>

<style lang="scss" scoped>
	.dynamic-contant{
		width: 100%;
		height: 100%;
		padding:0 10px;
		box-sizing: border-box;
	}
	.dynamic-bg{
		width: 100%;
		height: 100%;
		background-image: url(../../../public/img/dynamic-bg-img.jpg);
		background-repeat: repeat;
		text-align: center;
	}
	.dynamic-image{
		overflow: hidden;
	}
	.dynamic-text{
		height: 100%;
		overflow: hidden;
		display: inline-block;
		text-align: center;
		position: relative;
	}
	.text-one{
		width: 100px;
		position: absolute;
		left:180px;
		top:280px;
		transform: rotateZ(-30deg);
		font-size: 12px;
	}
	.text-one b,.text-two b{
		font-size: 14px;
	}
	.text-one span{
		padding-left: 12px;
	}
	.text-one a,.text-two a{
		color: #fff;
	}
	.text-one a:hover,.text-two a:hover{
		cursor: pointer;
		color:#38488e ;
	}
	
	.text-two{
		width: 100px;
		position: absolute;
		left:713px;
		top:103px;
		transform: rotateZ(30deg);
		font-size: 12px;
	}
	.text-two b{
		padding-left:16px;
	}
	@media screen and (max-width: 1680px) {
		   .dynamic-text{
			overflow: scroll;
		   } 
		}		
</style>
