<template>
  <el-row class="form-list">
    <el-col :span="8" class="el-col-style" v-for="(item,index) in option" :key="index">
      <el-card class="box-card">
        <div @click="JumpLink(item)">
          <div class="builder_left">
            <div class="builder_left_img">
              <img :src="item.src"/>
            </div>
          </div>
          <div class="builder_right">
            <div class="builder_right_title">{{ item.title }}</div>
            <p class="builder_right1">{{$t('code.formList.temFunction')}}</p>
            <p class="builder_right2">{{ item.description }}</p>
            <button class="builder_but">{{$t('code.formList.setFunctionBtn')}}</button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import { initFormList } from '@/config/condition';
import store from '@/store';

export default {
  name: 'formList',
  data: () => ({
    option: initFormList(),
  }),
  methods: {
    JumpLink (e) {
      store.state.FD.controllerType = e.key
      store.state.FD.DbLinkId = ''
      this.$emit('event-JumpLink', e);
    },
  },
};
</script>
<style lang="scss" scoped>

::v-deep {
  .el-card__body {
    padding: 0;
  }

  .box-card {
    padding: 20px;
  }

  .el-col-style {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .container {
    height: 76vh;
  }
}

.box-card {

  &:hover {
    cursor: pointer;
  }
}

.form-list-dialog {
  ::v-deep .el-dialog {
    background-color: #f0f2f5;
  }

  ::v-deep .el-dialog__header {
    background-color: #fff;
  }
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

  img {
    display: block;
    padding: 15px;
    width: 100%;
    box-sizing: border-box;
  }
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

  &:hover {
    box-shadow: 5px 5px 10px rgba(56, 161, 242, 0.3);
  }
}
.form-list{
  display: flex;
}
.form-list > div{
  flex: 1;
  width: auto;
}
</style>
