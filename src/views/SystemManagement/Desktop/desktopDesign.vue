<template>
  <div class="deskTopMain">
    <l-quick-bi-design
      ref="quickBiDesign"
      :componentList="componentList"
      :noDataConfigComponents="noDataConfigComponents"
    >
		</l-quick-bi-design>
  </div>
</template>
<script>
import componentList from "@/components/desktop/index";
import "@/components/desktop/base";
import "@/components/desktop/view";
import { baseUrl } from '@/config/env';
export default {
  name: "fff",
  props:['dataJson'],
  data() {
    return {
      componentList,
      noDataConfigComponents: ["datalist", "mytask", "mytasklist", "modules"]
    };
  },
  components: {},
  mounted(){
	this.$refs.quickBiDesign.set(this.dataJson)  
  },
  methods: {
    async handleClick() {
	
		const loading = this.$loading({
		  lock: true,
		  text:this.$t('BI.group.top.hintSaving'),
		  spinner: 'el-icon-loading',
		  background: 'rgba(0, 0, 0, 0.7)'
		});

			let htmlDom=this.$refs.quickBiDesign.$children[0].$children[2].$el.children[0].children[1]
			let canvas=await html2canvas(htmlDom, {
			   useCORS: true,
               backgroundColor: null,
               allowTaint: true,
				dpi: window.devicePixelRatio
			})
			function dataURLtoFile (dataurl, filename) {
			  var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			  while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			  }
			  return new File([u8arr], filename, { type: mime });
			}
					
			
					
			var file = dataURLtoFile(canvas.toDataURL('image/jpeg'), new Date().getTime() + '.jpg');
			var formdata = new FormData();
			formdata.append('file', file)
			
			try{
				let res=await axios.post(baseUrl + '/upload', formdata, {
				  headers: {
					"Content-Type": "multipart/form-data"
				  }
				})
				const data = res.data.data;
				const url = data.FileUrl[0];
				this.$emit('deskTopJson',{backgroundUrl:url,json:this.$refs.quickBiDesign.get()});
				loading.close();
			}catch(e){
				this.$message.error(this.$t('deletePrompt.savedFailure'))
				loading.close();
			}

    }
  }
};
</script>
<style scoped>
.deskTopMain {
  height: 100%;
}
/deep/ .l-quick-bi-design__main .l-panel--warpper{
	background-color:#f0f2f5;
}
/deep/ .l-quick-bi-design .mask{
	bottom: 20px;
	height: calc(100% - 20px);
	right: 16px;
	width: calc(100% - 16px);
}
</style>
