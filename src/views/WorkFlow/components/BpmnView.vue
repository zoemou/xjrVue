<template>
  <div class="fit-container">
	  <div style="display: flex;align-items: center;justify-content: flex-end;padding: 10px;">
		  <el-button type="primary" size="small" @click="handleZoom(true)">{{$t('editorModule.zoomIn')}}</el-button>
		  <el-button type="primary" size="small" @click="handleZoom(false)">{{$t('editorModule.zoomOut')}}</el-button>
	  </div>
	  
	  <div class="chart-preview">
		  <div class="view-canvas">
			  <div id="container" ref="canvas"></div>
		  </div>
	  </div>
  </div>
</template>

<script>
import Modeler from "./bpmn/lib/Modeler";
//import customTranslate from "@/util/customTranslate"; // 汉化
import { getFinishedTaskNode,getFinishedTaskXml } from "@/api/bpmn";
import { getStore } from "@/util/store";
export default {
  name: "WorkflowBpmnView",
  components: {
  },
  props: {
	deploymentId:{
      type: String,
    },
	processInstanceId:{
      type: String,
    }
  },
  data() {
    return {
      modeler: null,
      scale: 1,
	  containerEl:null
    };
  },
  computed: {

  },
  mounted() {
	this.createNewDiagram();
  },
  methods: {
	customTranslate(template, replacements) {
	  replacements = replacements || {};
	  const translations=getStore({ name: "lg-mark-" + (getStore({ name: "language" }) || "zh-CN") })
	  // Translate
	  template = translations[template] || template;
	
	  // Replace
	  return template.replace(/{([^}]+)}/g, function(_, key) {
	    var str = replacements[key];
	    if (
	      translations[replacements[key]] !== null &&
	      translations[replacements[key]] !== "undefined"
	    ) {
	      str = translations[replacements[key]];
	    }
	    return str || "{" + key + "}";
	  });
	},
    handleZoom(zoomIn = true) {	
		this.scale = this.modeler.get("canvas").zoom();
		this.scale += zoomIn ? 0.1 : -0.1;
		this.modeler.get("canvas").zoom(this.scale);
	},
    async createNewDiagram() {
	  this.containerEl = document.getElementById('container');
	  // 避免缓存，每次清一下
	  this.modeler && this.modeler.destroy();
	  this.scale = 1;
	  //this.modeler = new Modeler({container: this.containerEl});
	  this.modeler = new Modeler({
	    container: this.$refs.canvas,
	    additionalModules: [
	      {
	        translate: ["value", this.customTranslate],
	      },
	    ],
	    moddleExtensions: {},
	  });

		// 将字符串转换成图显示出来
		// data = data.replace(/</g, '&lt;');
		// data = data.replace(/>/g, '&gt;');
		
		try {
		  let res=await getFinishedTaskXml(this.deploymentId);
		  let data =res.data.data?.xmlContent||'';
		  data = data.replace(/<!\[CDATA\[(.+)]]>/g, "&lt;![CDATA[$1]]&gt;");
		  await this.modeler.importXML(data);
			if(this.processInstanceId){
				
				let modeling=this.modeler.get('modeling');
				const elementRegistry = this.modeler.get('elementRegistry');
				let res=await getFinishedTaskNode(this.processInstanceId);
				let finished =(res&& res.data&& res.data.data&& res.data.data.finished)?res.data.data.finished:[];
				let upcoming = (res&& res.data&& res.data.data&& res.data.data.upcoming)?res.data.data.upcoming:[];
				if(finished.length>0){
					finished.forEach(it=>{
					let Event=elementRegistry.get(it);
					modeling.setColor(Event, {
						stroke: 'green',
						fill: 'white'
					});
				})
				}
				if(upcoming.length>0){
					upcoming.forEach(it=>{
					let Event=elementRegistry.get(it);
					modeling.setColor(Event, {
						stroke: '#409eff',
						fill: 'white'
					});
				})
				}
			} 
			this.fitViewport();
		} catch (err) {
		 
		}		  
      
    },
	// 让图能自适应屏幕
	fitViewport() {
	  this.scale = this.modeler.get("canvas").zoom();
	  const bbox = document
	    .querySelector(".fit-container .viewport")
	    .getBBox();
	  const currentViewbox = this.modeler.get("canvas").viewbox();
	  const elementMid = {
	    x: bbox.x + bbox.width / 2 - 65,
	    y: bbox.y + bbox.height / 2,
	  };
	  this.modeler.get("canvas").viewbox({
	    x: elementMid.x - currentViewbox.width / 2,
	    y: elementMid.y - currentViewbox.height / 2,
	    width: currentViewbox.width,
	    height: currentViewbox.height,
	  });
	  this.scale = (bbox.width / currentViewbox.width) * 1.8;
	},
  },
};
</script>

<style lang="scss" scoped>
/*左边工具栏以及编辑节点的样式*/
@import "./bpmn/assets/diagram-js.css";
@import "./bpmn/assets/bpmn-font/css/bpmn.css";
@import "./bpmn/assets/bpmn-font/css/bpmn-codes.css";
@import "./bpmn/assets/bpmn-font/css/bpmn-embedded.css";
.fit-container {
	height: 100%;
	width: 100%;
	.chart-preview{
		height: calc(100% - 60px);
		width: 100%;
		overflow: auto;
		.view-canvas, #container{
			height: 100%;
			width: 100%;
		}
	}
	::v-deep .djs-palette-entries {
		display: none;
	}
	::v-deep .djs-overlay-container{
		display: none;
	}
}


</style>
