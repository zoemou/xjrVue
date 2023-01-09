<script>
import { getStampsImgUrl } from "@/api/workFlow/stamp.js";
import { baseUrl } from "@/config/env";
export default {
  props: {
    value: {
      type: Array
    }
  },
  data() {
    return {
      itemTemplate: null
    };
  },
  async created() {
    this.itemTemplate = [];
    if (this.value&&this.value.length > 0) {
      this.value.forEach(async element => {
        let children = [];
        try {
          if (element.esignature) {
            let res = await getStampsImgUrl(element.esignature);
            let img_File = "";
            if (res.data.success) {
              img_File = res.data.data;
            }
            if (img_File) {
              children.push(
                <div class="esignature-box">
                  <img src={baseUrl+img_File} />
                </div>
              );
            }
          }
        } catch (error) {}

        this.itemTemplate.push(
          <div class="opinion-item">
            <span class="flex left">审批结果：{this.$t(element.btnValue)}</span>
            <span class="flex left">审批意见：{element.message}</span>
            <span class="flex right">{element.createUser}</span>
            <span class="flex right">{element.time}</span>
            {children}
            <div class="hr"></div>
          </div>
        );
      });
    } else {
      this.itemTemplate.push(
        <div class="opinion-item">
          <span class="flex left placeholder">
            {this.$t('code.leftScrollbar.component.hintOpinionBook')}
          </span>
        </div>
      );
    }
  },
  render: function(h) {
    return <div class="opinion-wrap"><div class="opinion-box">{this.itemTemplate}</div></div>;
  }
};
</script>
<style scoped>
.flex {
  display: flex;
}
.opinion-box {
  min-height: 80px;
  border: 1px solid #dcdfe6;
}
.opinion-item {
  position: relative;
  padding: 20px;
}
.esignature-box {
  position: absolute;
  width: 120px;
  top: 40px;
  right: 120px;
}
.esignature-box img {
  width: 100%;
  height: 100%;
}
.left {
  justify-content: flex-start;
}
.right {
  justify-content: flex-end;
}
.hr {
  margin-top: 10px;
  border-top: 1px solid #dcdfe6;
}
.placeholder{
  color: #DCDFE6;
}
</style>
