<template>
  <div class="wrap" v-if="previewUrl">
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
    }
  },
  data() {
    return {
      previewUrl: ""
    };
  },
  created() {
    if( this.component){
       this.previewUrl = splitComponent(this.component);
    }    
  },
  methods: {
    changeSystemData(data) {
      this.$emit("changeSystemData", data);
    },
    changeHideComponents(data){
      this.$emit("changeHideComponents", data);
    }
  }
};
</script>

<style lang="css" scoped>
.wrap {
  display: flex;
  height: 0;
}
.iframe-box {
  width: 100%;
  border: 0;
}
.iframe-box /deep/ .el-dialog__header {
  display: none;
}
</style>
