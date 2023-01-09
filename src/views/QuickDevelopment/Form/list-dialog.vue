<template>
  <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('formDesign.addFormTitle')" :append-to-body="true" :visible.sync="dialogVisible"
             :before-close="handleCloseWrap" :fullscreen="true" class="form-list-dialog">
    <div class="main-container">
      <form-list @event-JumpLink="JumpLink"></form-list>
      <formDesign :visible.sync="codeVisible" :controllerType="controllerType" :key="index"></formDesign>
    </div>
  </el-dialog>
</template>

<script>
import formDesign from './form-design.vue';
import formList from './form-list';

export default {
  name: 'CodeIndex',
  components: { formDesign, formList },
  inject: ['newActive', 'F_Id'],
  props: {
    visible: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      index: 0,
      dialogVisibleDesign: false,
      codeVisible: false, // 显示弹窗
      dialogTitle: '在线代码生成器 并自动创建代码（自定义开发模板', // 弹窗名称
      controllerType: 0, // 模板类型
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible;
      },
      set (val) {
        this.$emit('update:visible', val);
      }
    }
  },
  methods: {
    JumpLink (e) {
      const { key, title } = e;
      this.dialogTitle = `在线代码生成器 并自动创建代码（${title}）`;
      this.controllerType = key;
      this.$store.commit("SET_CONTROLLER_TYPE", key);
      this.codeVisible = true;
      this.index++
    },
    handleClose () {
      this.codeVisible = false;
    },
    handleCloseWrap () {
      this.$emit('search')
      //删除兼容样式类
      let bodyClass = document.body.className.split(' ');
      bodyClass.filter((item,idx)=>{
        return item == 'original' && (bodyClass.splice(idx,1));
      });
      document.body.className = bodyClass.join(' ');
      this.dialogVisible = false;
    },

  }
};
</script>

<style lang="scss" scoped>

.main-container {
  padding: 0 10px;
}
.el-dialog__body{
	line-height: normal;
}
.form-list-dialog {
  ::v-deep .el-dialog {
    background-color: #f0f2f5;
  }

  // ::v-deep .el-dialog__header {
  //   background-color: #fff;
  // }
  ::v-deep .el-dialog__body{
  	line-height: normal;
  }
  .form-list ::v-deep .el-col-8{
    width: 32.7%;
  }
}
</style>
