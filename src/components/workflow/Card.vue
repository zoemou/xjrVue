<template>
  <div
    :class="
      'item ' +
      (theme == 'common' ? 'common-theme' : 'evening-theme') +
      (isChecked ? ' checked' : '')
    "
     :style="theme == 'evening' ? 'display: none;' : ''"
  >
    <img src="@/../public/img/Scheme1.png" v-if="theme == 'common'" />
    <img src="@/../public/img/Scheme1.png" v-else />
    <div class="item-info">
      <p>{{$t('workFlow.WFCard.cardCode')}}：{{ F_Code }}</p>
      <p>{{$t('workFlow.WFCard.cardName')}}：{{ F_Name }}</p>
      <p>{{$t('workFlow.WFCard.cardClassify')}}：{{ F_Category }}</p>
    </div>
    <i class="el-icon-check" :class="isChecked ? 'checked' : ''"></i>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: "common",
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
    F_Code: {
      type: String,
      default: "",
    },
    F_Name: {
      type: String,
      default: "",
    },
    F_Category: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.item i {
  display: none;
}
.item img {
  float: left;
  width: 66px;
  height: 66px;
  margin-right: 15px;
}

.item .item-info {
  padding-left: 81px;
  box-sizing: border-box;
}
.item.checked .item-info p{
	color:#409eff ;
}
.item .item-info p {
  height: 22px;
  margin: 0;
  font-size: 12px;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item i.checked {
  display: none;
  position: absolute;
  right: 0px;
  top: 0;
  color: #fff;
  width: 0;
  height: 0;
  border-width: 0 30px 30px 0px;
  border-style: solid;
  border-color: #f56c6c #f56c6c transparent transparent;
  font-weight: bold;
  font-size: 14px;
  text-indent: 1em;
  line-height: 20px;
}

.item {
  padding:10px 0px 5px 5px !important;	
  width: 100%;
  
  color: #303133;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 2px;
  overflow: hidden;
  transition: 0.3s;
  box-sizing: border-box!important;
  position: relative;
}

.item.checked {
 background-color: rgba(64, 158, 255, 0.06) !important;
 border: 1px solid rgba(64, 158, 255, 0.4) !important;
}
</style>
