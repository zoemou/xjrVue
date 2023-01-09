<template>
	<div class="dynamic-contant">
		<div class="dynamic-bg">
			<div class="dynamic-text">
				<img class="dynamic-image" src="../../../public/img/dynamic-two.gif"/>
				<p class="text-one"><a href="javascript:void(0);" @click.prevent="goToPage('/office-automation/erp_model/SalesManage/erp_salesreturns')"><span>销售退货 </span></br><b>总数：{{salesReturn}}</b></a></p>
				<p class="text-two"><a href="javascript:void(0);" @click.prevent="goToPage('/office-automation/erp_model/SalesManage/erp_salesorder')"><span>销售订单 </span></br><b>总数：{{salesOrder}}</b></a></p>
				<p class="text-three"><a href="javascript:void(0);" @click.prevent="goToPage('/office-automation/erp_model/purchaseManage/erp_purchaseorderinfo')"><span>采购订单 </span></br><b>总数：{{purchaseManage}}</b></a></p>
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
		baseUrl : baseUrl,
		timer: null,
		timerSales: null,
		salesReturn: 563,
		salesOrder: 56376,
		purchaseManage: 0	
	}
  },
  created () {
	let _this = this;
	this.timer = setInterval(() => {
		_this.salesOrder++;
		_this.salesReturn++;
	}, 3000);
	this.timerSales = setInterval(() => {
		_this.getPurchaseOrderInfo();
	},10000);
  },
  beforeDestroy () {
	clearInterval(this.timer);
	clearInterval(this.timerSales);
	this.salesReturn = 563;
	this.salesOrder = 56376;
	this.purchaseManage = 0;
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
	getPurchaseOrderInfo(){
		request({
            url: baseUrl + '/erp_purchaseorderinfo3',
            method: 'get',
        }).then(res => {
			this.purchaseManage = res.data.data.Total;
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
		// height: 100%;
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
		left:170px;
		top:332px;
		transform: rotateZ(-30deg);
		font-size: 12px;
	}
	.text-one b,.text-two b,.text-three b{
		font-size: 14px;
	}
	.text-one span{
		padding-left: 5px;
	}
	.text-one a,.text-two a,.text-three a{
		color: #fff;
	}
	.text-one a:hover,.text-two a:hover,.text-three a:hover{
		cursor: pointer;
		color:#104a74 ;
	}
	
	.text-two{
		width: 100px;
		position: absolute;
		left:233px;
		top:604px;
		transform: rotateZ(30deg);
		font-size: 12px;
	}
	.text-two b{
		padding-left:16px;
	}
	.text-three{
		width: 100px;
		position: absolute;
		left:940px;
		top:429px;
		transform: rotateZ(-30deg);
		font-size: 12px;
	}
	.text-three span{
		padding-left: 12px;
	}
	@media screen and (max-width: 1680px) {
		.dynamic-text{
			width: 100%;
			}
		   .dynamic-text{
			overflow: scroll;
		   } 
		}	
</style>