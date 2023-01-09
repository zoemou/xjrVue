<template>
  <div class="system-form-box" v-if="previewUrl">
    <SystemForm
      v-if="previewUrl"
      type="2"
      :componentUrl="previewUrl"
      @changeSystemData="changeSystemData"
      @changeHideComponents="changeHideComponents"
    ></SystemForm>
  </div>
</template>

<script>
import SystemForm from "@/components/codeParser/SystemForm.vue";
import {splitComponent} from "@/config/codeParser.js";
export default {
  components: {
    SystemForm
  },
  props: {
    component: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
    },
    index: {
      type: Number,
      default: 0
    },
    formInfo: {
      type: Object,
      default: ()=>{
        return {}
      }
    },
  },
  data() {
    return {
      previewUrl: "",
      returnData:[],
      hideComponents:[]
    };
  },
  created() {
    if( this.component){
       this.previewUrl = splitComponent(this.component);
    }
  },
  methods: {
    hasSystemFieldPermissions(){
      if(this.previewUrl){
          if(this.returnData.length>0){
              return true
          }else{
              return false
          }
      }else{
          return false
      }
    },
    changeHideComponents(data){
      this.hideComponents  = data;
    },
    changeSystemData(data) {
      this.returnData = data;
      this.$emit("changeSystemData", {returnData:data,hideComponents:this.hideComponents,index:this.index,formInfo:this.formInfo});
    }
  }
};
</script>

<style lang="css" scoped>
.system-form-box{
  height: 0;
  visibility: collapse;
}
</style>
