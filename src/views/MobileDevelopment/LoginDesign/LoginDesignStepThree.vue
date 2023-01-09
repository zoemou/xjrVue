<template>
  <div class="main-container">
    <div class="mainBox">
      <main-content
        title="代码预览"
        :search="false"
        :paddingLeft="0"
        :paddingTop="88"
        :collapse="false"
      >
        <div slot="table" id="code">
		      <p class="head_title">{{$t('mobileDev.loginDesignStepThree.headTitle')}}</p>	
          <codemirror
            ref="mycode"
            :value="curCode"
            :options="cmOptions"
          ></codemirror>
        </div>
      </main-content>
    </div>
  </div>
</template>


<script>
import MainContent from "../../../page/main/MainContent";
import { getPhoneLoginPreviewWebCode } from "@/api/code/code";
import { codemirror } from "vue-codemirror";
import "codemirror/theme/idea.css";
require("codemirror/mode/javascript/javascript"); // 这里引入的模式的js，根据设置的mode引入，一定要引入！！
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["LoginAllStep"]),
  },
  data() {
    return {
      param: {
        stepOne: {},
        stepTwo: {},
      },
      curCode: "",
      cmOptions: {
        value: "",
        mode: "text/javascript",
        theme: "idea",
        readOnly: true,
      },
    };
  },
  components: {
    codemirror,
    MainContent,
  },
  methods: {
    
  },
  created() {},
  mounted: function () {
    const { LoginAllStep, param } = this;
    param.stepOne = LoginAllStep.stepOne;
    param.stepTwo=LoginAllStep.stepTwo;

    getPhoneLoginPreviewWebCode(LoginAllStep.stepTwo).then(({ data: { data } }) => {
      this.curCode = data;
      this.LoginAllStep.stepThree=data;
    });
  },
};
</script>

<style scoped>
#code >>> .CodeMirror {
  /* overflow-y: scroll !important; */
  height: auto !important;
}

.mainBox >>> .main-table-content {
  overflow:auto
}

.mainBox >>> .cm-s-ambiance.CodeMirror {
  height: 100%;
}

.mainBox {
  /*height: calc(100% - 56px);*/
  height: 100%;
  padding-top: 10px;
}
.head_title{
	font-size: 12px;
	font-weight: bold;
	width: 100%;
	border-bottom: 1px solid #f2f2f2;
	margin-top:0px;
	line-height: 40px;
	color: #4d4d4d;
}
/deep/ .main-search{
	display: none;
}
/deep/ .main-table-content{
	border-top: none;
}
</style>
