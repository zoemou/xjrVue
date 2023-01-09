<template>
  <div class="system-form-box">
    <component
      :is="componentName"
      v-if="componentName"
      :systemFormType="type"
      :formFieldPermissions="formFieldPermissions"
      :systemFormParserTaskCommentList="systemFormParserTaskCommentList"
      :systemFormParserFormData="systemFormParserFormData"
      @changeSystemData="changeSystemData"
       @changeHideComponents="changeHideComponents"
      :disabled="isEdit==2?true:false"
      :parameter="parameter"
      ref="SystemForm"
    />
  </div>
</template>
<script>

import { mapGetters } from "vuex";
export default {
  props: [
    "type",
    "componentUrl",
    "formFieldPermissions",
    "systemFormParserTaskCommentList",
    "systemFormParserFormData",
    "isEdit",
    "parameter"
  ],
  data() {
    return {
      componentName: null
    };
  },
  computed: {
    ...mapGetters(["website"]),
    loader() {
      if (!this.componentUrl) {
        return null;
      }
      return () => import(`./../../${this.componentUrl}`);
    }
  },
  mounted() {
    this.loader()
      .then(() => {
        this.componentName = () => this.loader();
      })
      .catch(() => {
        this.componentName = () => import("./../../views/Customer/Default.vue");
      });
  },
  methods: {
    changeSystemData(data) {
      this.$emit("changeSystemData", data);
    },
    changeHideComponents(data){
      this.$emit("changeHideComponents", data);
    },
    workflowSubmit() {
      let returnData = this.$refs.SystemForm.workflowSubmit();
      return returnData;
    },
     getHandleSubmitFormEvent(){
        if(typeof this.$refs.SystemForm.getHandleSubmitFormEvent=='function'){
         return this.$refs.SystemForm.getHandleSubmitFormEvent()
       }else{
         return ;
       }
    },
  }
};
</script>
<style scoped>
.system-form-box{
  width: 100%;
}
</style>