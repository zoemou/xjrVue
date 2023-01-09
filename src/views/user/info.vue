<template>
  <div
    class="user-info"
    style="padding:0px 5px; box-sizing: border-box;"
    v-if="!refresh"
  >
    <el-row
      :span="24"
      style="height:100%;box-sizing: border-box;display: flex;align-items: stretch;"
    >
      <el-col :span="8" style="height:100%; box-sizing: border-box;">
        <basic-container
          style="box-sizing: border-box; height: 100%; padding-top:0px; padding-bottom: 0px;"
        >
          <div class="user-info__content">
            <img class="user-info__img" :src="form.img" alt="" />
            <p class="user-info__name">{{ form.name }}</p>
            <!-- <router-link
              class="user-info__setting"
              :to="{ path: '/info/setting' }"
              >{{$t('user.info.linkPersonalSet')}}</router-link
            > -->
            <p class="user-info__desc">{{ form.ms }}</p>
            <div class="user-info__detail-desc">
              <p v-if="form.yx">
                <i class="el-icon-message"></i><span>{{$t('user.info.email')}}</span
                ><span class="con" :title="form.yx">{{ form.yx }}</span>
              </p>
              <p v-if="form.gs">
                <i class="el-icon-postcard"></i><span>{{$t('user.info.Company')}}</span
                ><span class="con" :title="form.gs">{{ form.gs }}</span>
              </p>
              <p v-if="form.gs">
                <i class="el-icon-postcard"></i><span>{{$t('user.info.Department')}}</span
                ><span class="con" :title="form.bm">{{ form.bm }}</span>
              </p>
              <p v-if="form.role">
                <i class="el-icon-user"></i><span>{{$t('user.info.Role')}}</span
                ><span class="con" :title="form.role">{{ form.role }}</span>
              </p>
            </div>
            <div class="user-info__divider"></div>
            <!-- <h4>标签</h4>  
            <div class="user-info__tags">
              <el-tag effect="plain"
                      v-for="(tag,index) in tags"
                      :key="index">
                {{tag}}
              </el-tag>
            </div> -->
          </div>
        </basic-container>
      </el-col>
      <el-col :span="16" style="height:100%;">
        <basic-container
          style="height:100%; padding:0px 10px; box-sizing: border-box;"
        >
          <avue-tabs
            :option="option"
            v-model="form"
            ref="formRef"
            @change="handleChange"
            :upload-after="uploadAfter"
            :upload-before="uploadBefore"
            @reset-change="emptytChange"
            @submit="handleSubmit"
          >
          </avue-tabs>
          <div v-if="type == 'permission'">
            <authorize-info
              ref="authorizeTreeRef"
              v-if="authorizeVisible"
              :objectType="objectType"
              :objectId="objectId"
              :type="findType"
            ></authorize-info>
          </div>
        </basic-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import option from "@/const/user/info";
import { baseUrl } from "@/config/env";
import { updatePass } from "@/api/user";
import { mapGetters, mapState } from "vuex";
import store from "@/store/";
import md5 from "js-md5";
import { getStore } from "@/util/store";
import { modifyUser } from "@/api/organization/user";
import AuthorizeInfo from "./AuthorizeInfo";
import { postAuthorizes } from "@/api/organization/index";
import { deepClone } from "@/utils/index";
export default {
  data() {
    return {
      type: "info",
      option: option,
      imgExt : null, //图片后缀名
      tags: [
        " 善解人意",
        "开朗乐观",
        "真诚热情",
        "心地善良",
        "谦恭有礼",
        "彬彬有礼",
        "虚怀若谷",
        "严于律己",
        "雍容大度",
        "热情洋溢",
        "从容自若",
        "诚挚",
        "温厚",
        "谦让",
        "勤恳",
        "耿直"
      ],
      form: {
        img: "uploads/632261_smallweigit.jpg!avatar100?1518660401",
        username: "smallwei",
        name: "smallwei",
        ms: "保护头发，人人有责",
        yx: "1634566606@qq.com",
        gs: "某某公司",
        bm: "某某部门",
        zw: "",
        dz: "内蒙古",
        bq: [1, 2, 3, 4],
        oldpassword: "",
        newpassword: "",
        newpasswords: "",
        userId: "",
        role: ""
      },
      refresh: false,
      authorizeVisible: false,
      objectType: 2,
      objectId: "" //用户Id
    };
  },
  components: {
    AuthorizeInfo
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters(["userInfo", "website"])
  },
  created() {
    this.form.userId = this.objectId = this.userInfo.F_UserId;
    this.form.username = this.userInfo.F_Account || "";
    this.form.name = this.userInfo.F_RealName || "";
    this.form.yx = this.userInfo.F_Email || "";
    this.form.ms = this.userInfo.F_Description || "";
    this.userInfo.F_Company &&
      (this.form.gs = this.userInfo.F_Company.F_FullName);
    this.userInfo.F_Department &&
      (this.form.bm = this.getUserInfo(this.userInfo.F_Department));
    this.userInfo.F_Role &&
      (this.form.role = this.getUserInfo(this.userInfo.F_Role));
    //配置上传图片的action 并初始化头像

    this.form.img = `${baseUrl}/users/${this.userInfo.F_UserId}/head-icon`;

    if (this.website.netFlowableEnable) {
      if (this.userInfo.F_HeadIcon) {
        this.form.img = `${baseUrl}${this.userInfo.F_HeadIcon.replace(
          baseUrl,
          ""
        )}`;
      } else {
        this.form.img = `/img/user1.png`;
      }
    }

    this.option.column[0].option.column[0].action = `${baseUrl}/users/${this.userInfo.F_UserId}/head-icon`;
    //开发环境 屏蔽修改密码
    // if (!this.website.errorLogSwitch) {
    //   this.option.column.splice(2, 1);
    // }
  },
  methods: {
    uploadBefore(res, done, loading, column){

      //获取到上传的图片拓展名
      this.imgExt = res.name.split('.')[1];
      done()
    },
    uploadAfter(res, done, loading, column) {
      
      this.form.img = `${baseUrl}/users/${this.form.userId}/head-icon`;

      if (this.website.netFlowableEnable) {
        this.form.img = `${baseUrl}/HeadIconFiles/${this.form.userId}.${this.imgExt}`;
      }

      this.userInfo.F_HeadIcon = "";
      this.$store.commit("SET_USERINFO", this.userInfo);
      this.refresh = true;
      this.$nextTick(() => {
        this.userInfo.F_HeadIcon = this.form.img;
        this.$store.commit("SET_USERINFO", this.userInfo);
        this.refresh = false;
      });
      done();
    },
    getUserInfo(arr) {
      let dept = "";
      arr.forEach(item => {
        dept += item.F_FullName + ",";
      });
      dept = dept.substr(0, dept.length - 1);
      return dept;
    },
    handleSubmit() {
      if (this.type == "info") {
        this.updateInfo();
      } else {
        this.updatePass();
      }
    },
    updateInfo() {
      if (!this.form.name) {
        this.$message({
          message:this.$t('user.info.nameEmpty'),
          type: "error"
        });
        //去掉disabled属性
        this.$refs.formRef.formRef.allDisabled = false;
        this.$refs.formRef.formRef.init();
        return false;
      }
      if (!this.form.yx) {
        this.$message({
          message:this.$t('user.info.emailEmpty'),
          type: "error"
        });
        //去掉disabled属性
        this.$refs.formRef.formRef.allDisabled = false;
        this.$refs.formRef.formRef.init();
        return false;
      }
      if (
        !/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/.test(
          this.form.yx
        )
      ) {
        this.$message({
          message:this.$t('user.info.emailFormatEmpty'),
          type: "error"
        });
        //去掉disabled属性
        this.$refs.formRef.formRef.allDisabled = false;
        this.$refs.formRef.formRef.init();
        return false;
      }
      let params = {};
      params.F_RealName = this.form.name || "";
      params.F_Email = this.form.yx || "";
      params.F_Description = this.form.ms || "";
      modifyUser(this.form.userId, params)
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              message:this.$t('dataItem.dialogInstall.hintEditSuccess'),
              type: "success"
            });
          }
          this.userInfo.F_RealName = this.form.name;
          this.userInfo.F_Email = this.form.yx;
          this.userInfo.F_Description = this.form.ms;
          this.$store.commit("SET_USERINFO", this.userInfo);
          //去掉disabled属性
          this.$refs.formRef.formRef.allDisabled = false;
          this.$refs.formRef.formRef.init();
        })
        .catch(err => {});
    },
    updatePass() {
      
      if (this.form.newpassword != this.form.newpasswords) {
        this.$message({
          message:this.$t('user.info.twoPassword'),
          type: "error"
        });
        //去掉disabled属性
        this.$refs.formRef.formRef.allDisabled = false;
        this.$refs.formRef.formRef.init();
        return false;
      }
      let params = {};
      let userId = getStore({ name: "userInfo" }).F_UserId || "";
      params.oldPassword = md5(this.form.oldpassword);
      params.newPassword = md5(this.form.newpassword);
      updatePass(userId, params).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message:this.$t('user.info.passWorldSuccess'),
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleChange(item) {
      this.type = item.prop;
      if (this.type == "permission") {
        this.authorizeVisible = true;
      } else {
        this.authorizeVisible = false;
      }
    },
    emptytChange() {
      let form = deepClone(this.$refs.formRef.value);

      setTimeout(() => {
        this.form = form;

        if (this.type == "info") {
          this.form.yx = "";
          this.form.yx = "";
        } else if (this.type == "password") {
          this.form.oldpassword = "";
          this.form.newpassword = "";
          this.form.newpasswords = "";
        }
      }, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
.user-info {
  .avue-tabs {
    padding: 0 10px;
  }
  .el-tabs__content {
    padding: 20px 0;
  }
  &__img {
    display: block;
    margin: 10px auto;
    border-radius: 100%;
    width: 100px;
    height: 100px;
  }
  &__name {
    text-align: center;
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 0;
    margin-top: 10px;
  }
  &__setting {
    margin-bottom: 12px;
    display: block;
    font-size: 12px;
    color: #409eff;
    text-align: center;
  }
  &__desc {
    text-align: center;
    width: 200px;
    margin: 0 auto;
  }
  &__detail-desc {
    margin-top: 50px;
    font-size: 14px;
    p {
      margin-bottom: 10px;
    }
    span {
      margin-left: 10px;
      &.con {
        max-width: calc(100% - 80px);
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  &__divider {
    border-top: 1px dashed #e8e8e8;
    display: block;
    height: 0;
    width: 100%;
    margin: 24px 0;
    clear: both;
  }
  &__tags {
    .el-tag {
      margin: 0 5px 5px 0;
    }
  }
  ::v-deep.el-upload-list__item-actions {
    display: none;
  }
  ::v-deep.el-image-viewer__wrapper {
    display: none;
  }
}

.user-info__detail-desc p {
  display: flex;
  align-items: center;
}
.user-info__detail-desc p i {
  font-size: 16px;
}
.el-form-item--small .el-form-item__content {
  padding-left: 10px;
  margin-left: 80px !important;
}
/*
.el-form-item__label{
 	width: 80px;
 }
 */
#avue-view {
  box-sizing: border-box;
}
.text-center {
  text-align: center;
  padding-top: 10px;
}
</style>
<style scoped>
/deep/ .avue-form__line {
	  height: 0px;
	}
/deep/ .el-collapse-item__content{
	 padding-bottom: 0px;	
	}
</style>