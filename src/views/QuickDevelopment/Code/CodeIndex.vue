<template>
  <div class="main-container">
    <formList @event-JumpLink="JumpLink"></formList>
      <div v-if="codeVisible">
        <CodeForm class="code-build-box"
         :key="controllerType"
        :controllerType="controllerType" 
         @finish="handleClose"
        @close="handleClose"
        ></CodeForm>
      </div>
  </div>
</template>

<script>
import CodeForm from './CodeForm.vue';
import formList from '../Form/form-list'

export default {
  name: 'CodeIndex',
  components: {
    CodeForm,
    formList,
  },
  data () {
    return {
      codeVisible: false,
      dialogTitle: '在线代码生成器 并自动创建代码（自定义开发模板）',
      controllerType: 0,
    };
  },
  methods: {
    JumpLink (e) {
      const { key, title } = e;
      this.dialogTitle = this.$t('code.codeIndex.title')+`（${title}）`;
      this.controllerType = key;
      this.$store.commit('SET_CONTROLLER_TYPE',key);
      this.codeVisible = true;
      document.body.className = document.body.className + ' original';
    },
    handleClose () {
      //删除兼容样式类
      let bodyClass = document.body.className.split(' ');
      bodyClass.filter((item,idx)=>{
        return item == 'original' && (bodyClass.splice(idx,1));
      });
      document.body.className = bodyClass.join(' ');
      this.codeVisible = false;
    }
  }
};
</script>

<style scoped>
/* css */
.main-container {
  height: 100%;
  padding: 0 10px;
}

.no-margins {
  text-align: center;
  font-size: 99px;
  color: #666;
}

.text-item {
  text-align: center;
}

.stat-percent {
  color: #409EFF;
  padding: 10px 0 40px;
  font-size: 14px;
}

.el-col-style {
  margin-right: 10px;
}

.clear {
  clear: both;
}

.builder_left {
  width: 40%;
  float: left;
}

.builder_right {
  width: 60%;
  float: left;
  padding-left: 5%;
  box-sizing: border-box;
}

.builder_right1 {
  font-size: 14px;
  color: #666;
}

.builder_right2 {
  font-size: 14px;
  color: #4099FF;

}

.builder_left_img {
  width: 100%;
  box-sizing: border-box;
  background-color: #f2f2f2;


}

.builder_left_img img {
  display: block;

  padding: 15px;
  width: 100%;
  box-sizing: border-box;

}

.box-card:hover {
  cursor: pointer;
}

.builder_right_title {
  font-size: 18px;
  font-weight: bold;
  padding: 0.5rem 0px 10px 0;
}

.builder_but {
  background-color: #409eff;
  border: none;
  color: #fff;
  font-size: 15px;
  padding: 8px 35px;
  border-radius: 5px;

}

.builder_but:hover {
  box-shadow: 5px 5px 10px rgba(56, 161, 242, 0.3);
}

div /deep/.el-col-style {
	padding-left: 5px;
	margin-right: 0px;
    padding-right: 5px;
    margin-bottom: 15px;
    box-sizing: border-box;
}
div /deep/.box-card{
    box-shadow: 5px 2px 7px #e5e5e5;}

.code-build-box{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 2001;
  background-color: #fff;
}
</style>
