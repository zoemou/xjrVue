<template>
  <div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :title="contentData.F_FullHead"
      :visible="visible"
      append-to-body
      width="80%"
      :before-close="newshandleClose"
    >
      <div class="newsContent">
        <el-row :gutter="20">
          <div class="something" ref="header">
            <el-col :span="3">
              <div class="mr">{{contentData.F_ReleaseTime}}</div>
            </el-col>
            <el-col :span="21">
              <div v-if="contentData.F_TypeId==2" class="something">
                <el-col :span="2">
                  <div class="mr">{{contentData.F_CategoryId}}</div>
                </el-col>
                <el-col :span="11">
                  <div class="mr">{{$t('Notice.labelInforSou')}}：{{contentData.F_SourceName}}</div>
                </el-col>
                <el-col :span="11">
                  <div>{{$t('Notice.labelAddress')}}：{{contentData.F_SourceAddress}}</div>
                </el-col>
              </div>
              <div v-else class="something">
                <el-col :span="2">
                  <div class="mr">{{$t('News.labelWriter')}}：{{contentData.F_AuthorName}}</div>
                </el-col>
                <el-col :span="11">
                  <div class="mr">{{$t('News.labelEdit')}}：{{contentData.F_CompileName}}</div>
                </el-col>
                <el-col :span="11">
                  <div>{{contentData.F_CategoryId}}</div>
                </el-col>
              </div>
            </el-col>
          </div>
        </el-row>
        <div class="scrollBox" :style="{'height':scrollHeight}">
          <div class="content">
            <div v-html="contentData.F_NewsContent"></div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "News",
  props: ["contentData"],
  data() {
    return {
      visible: true,
      scrollHeight:''

    };
  },
  mounted() {
    this.visible = true;
  },
  computed:{
    
  },
  watch:{
    contentData:{
      handler(){
       this.$nextTick(()=>{
          const headerHeight = this.$refs.header.offsetHeight
          this.scrollHeight = `calc(100% - ${headerHeight}px)`
        })
      },
      immediate:true
    }
  },
  methods: {
    newshandleClose() {
      this.visible = false;
      this.$emit("visible");
    },
  },
};
</script>

<style scoped>
.newsContent {
  height: 600px;
}
.something {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
}
.el-col-21 {
  margin-bottom: 0;
}
/* .mr {
  margin-right: 40px;
} */
.scrollBox {
  overflow: auto;
}
.content {
  width: 95%;
  margin: 0 auto;
  background: #fafafa;
  padding: 20px;
}
@media screen and (max-width: 1370px) {
  div /deep/ .el-dialog {
    margin-top: 12vh !important;
  }
  .newsContent {
    height: 420px;
  }
}
</style>