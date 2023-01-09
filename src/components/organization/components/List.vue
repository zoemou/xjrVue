<template>
  <div class="content-list">
    <avue-empty :desc="$t('deletePrompt.noData')" v-if="list.length == 0"></avue-empty>
    <div class="list" v-else>
      <div
      class="position-mark"
        v-for="(item, index) in list"
        :key="index"
      >
        <div v-if="item.disabled" class="list-item disabled-box">
          <Card
            :selected="item.selected"
            :type="getType(item)"
            :infoList="getInfoList(item)"
          ></Card>
          <div class="disabled-box">
            <span class="disabled-title"><i class="fa fa-times-circle"></i>{{$t('companyManager.orgList.textDisabled')}}</span>
          </div>
        </div>
        <div v-else @click="listClickd(index)" class="list-item">
          <Card
            :selected="item.selected"
            :type="getType(item)"
            :infoList="getInfoList(item)"
          ></Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "./Card.vue";
export default {
  components: {
    Card,
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  methods: {
    listClickd(index) {
      this.$emit("clickSelected", index);
    },
    getType(item) {
      if (this.type == "user") {
        if (item.F_Gender == 1) {
          return "femaleUser";
        } else {
          return "maleUser";
        }
      } else {
        return "";
      }
    },
    getInfoList(item) {
      let infoList = [];
      if (this.type == "user") {
        infoList = [
          { label:this.$t('companyManager.orgList.labelAccount'), value: item.F_Account || "" },
          { label:this.$t('companyManager.orgList.labelName'), value: item.F_RealName || "" },
        ];
      } else if (this.type == "role") {
        infoList = [
          { label:this.$t('companyManager.orgList.labelRoleName'), value: item.F_FullName || "" },
          { label: this.$t('roleNumber'), value: (item.F_UserCount || 0)+'人' },
        ];
      } else if (this.type == "specialPost") {
        infoList = [
          { label:this.$t('companyManager.orgList.labelRoleName'), value: item.label || "" },
        ];
      } else if (this.type == "department") {
        infoList = [
          { label:this.$t('companyManager.orgList.labelDeparName'), value: item.F_FullName || "" },
          { label: "EnCode", value: item.F_EnCode || "" },
        ];
      } else if (this.type == "post") {
        infoList = [
          { label:this.$t('companyManager.orgList.labelPost'), value: item.F_Name || "" },
          { label: "EnCode", value: item.EnCode || "" },
        ];
      }
      return infoList;
    },
  },
};
</script>

<style lang="scss" scoped>
.content-list {
  padding: 10px 5px;
  height: calc(100% - 5px);
  overflow: auto;
}
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .position-mark{
    position: relative;
  }
  .list-item .item{
    min-width: 260px;
    height: 80px;
    margin: 0 10px 10px 0;
	border:1px solid rgba(0,0,0,0.04)
  }
  .list-item .item:hover{
	  cursor: pointer;
	 background-color: rgba(0, 0, 0, 0.02); 
  }
  .disabled-box .item {
    background-color: rgba(0, 0, 0, 0.03);
  }
  .disabled-title {
    position: absolute;
    bottom: 6px;
    right: 20px;
    color: rgba(0, 0, 0, 0.4);
	
	i{
		font-size: 14px;
		padding-right:4px;
	}
  }
  
}
@media screen and (max-width: 1370px) {
	.list .list-item .item{
		min-width: 240px;
	}
}

</style>
