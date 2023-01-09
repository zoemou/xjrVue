<template>
  <div class="wrap" v-loading="loading" v-if="previewUrl">
    <SystemForm
      v-if="previewUrl"
      type="3"
      :componentUrl="previewUrl"
      :formFieldPermissions="formFieldPermissions"
      :systemFormParserTaskCommentList="systemFormParserTaskCommentList"
     :systemFormParserFormData="systemFormParserFormData"
     :parameter="parameter"
     :isEdit="isEdit"
     ref="SystemFormParser"
    ></SystemForm>
    <div v-else>
      系统表单丢失了
    </div>
  </div>
</template>

<script>
import SystemForm from "@/components/codeParser/SystemForm.vue";
import {getComponentAddr} from "@/config/codeParser.js";
export default {
    components: {
    SystemForm
  },
  props: {
    url: {
      type: String,
      default: ""
    },
    formFieldInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    formData: {
      type: Object
    },
    type: {
      type: Number
    },
    taskComment: {
      type: Array
    },
    index: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    isEdit: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    parameter: {
      type: Object,
      default: () => {
        return {};
      }
    },
    
  },
  data() {
    return {
      editId: "", //编辑id
      formFieldPermissions: [],
      systemFormParserTaskCommentList:[],
      systemFormParserFormData:{},
      formType: "2",
      formIndex: 0,
      previewUrl: "",
      loading: true,
    };
  },
  async created() {
    window.localStorage.setItem("systemFormFId", this.formFieldInfo.F_Id);
    this.previewUrl = await getComponentAddr(this.formFieldInfo);
    this.formType = this.type;
    this.formIndex = this.index;
    this.formFieldPermissions = this.formFieldInfo.children;
    this.systemFormParserFormData = this.formData;
    //意见框
    let taskCommentList = {};
    if (this.taskComment && this.taskComment.length > 0) {
      this.taskComment.forEach(element => {
        if (
          element.approvalcomponents &&
          element.approvalcomponents.length > 0
        ) {
          element.approvalcomponents.forEach(taskCommentId => {
            if (taskCommentList[taskCommentId]) {
              taskCommentList[taskCommentId].push(element);
            } else {
              taskCommentList[taskCommentId] = [element];
            }
          });
        }
      });
    }
    this.systemFormParserTaskCommentList = taskCommentList;
    this.loading = false;
  },
  methods: {
    submitForm() {
      let returnData = { code: 0, params: {} };
      if(this.$refs.SystemFormParser.workflowSubmit){
         returnData =this.$refs.SystemFormParser.workflowSubmit();
      }
      if (this.editId) {
          returnData.F_Id = this.editId;
      }
      returnData.params = {formType:2,...returnData.params};
      return returnData;
    },
     getHandleSubmitFormEvent(){
       if(this.$refs.SystemFormParser&&typeof this.$refs.SystemFormParser.getHandleSubmitFormEvent=='function'){
         return this.$refs.SystemFormParser.getHandleSubmitFormEvent()
       }else{
         return ;
       }
      
    },
  }
};
</script>

<style lang="css" scoped>
/* .wrap {
  width: 100%;
  display: flex;
  min-height: 600px;
} */
/* .iframe-pre {
  width: 100%;
  height: 100vh;
  border: 0;
}
.iframe-box {
  width: 100%;
  height: 200vh;
  border: 0;
}
.iframe-box /deep/ .el-dialog__header {
  display: none;
} */
</style>
