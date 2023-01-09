<template>
  <div class="main-container">
    <MainFixed :title="$t('selectPost.titleRole')" class="content-box">
      <div slot="list" style="height: 100%;">
        <div class="search-box">
          <el-input
            v-model="keyword"
            suffix-icon="el-icon-search"
            size="small"
            :placeholder="$t('enterRoleNameSearch')"
            @input="search"
          ></el-input>
          <div>
            <el-button size="small" @click="selectedBox = true"
              >{{$t('selectPost.selectedRole')}}</el-button
            >
          </div>
        </div>
        <List type="role" :list="list" @clickSelected="getSelected"></List>
        <Selected
          v-if="selectedBox"
          :list="changeSelectedList"
          :itemKeys="itemKeys"
          @closed="selectedBox = false"
          @deleteItem="deleteItem"
		  type="role"
        ></Selected>
      </div>
    </MainFixed>
  </div>
</template>

<script>
import MainFixed from "@/page/main/MainFixed";
import List from "./components/List";
import Selected from "./components/Selected";
import { getRoles } from "@/api/organization/company";
export default {
  components: { MainFixed, List, Selected },
  props: {
    selectedList: {
      type: Array,
    },
    singleSelectd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      keyword: "",
      selectTitle: this.$t('selectPost.selectTitle'),
      list: [],
      listCopy: [],
      selectedBox: false,
      changeSelectedList: [],
      itemKeys: [
        {
          label: this.$t('selectPost.labelRole'),
          key: "F_FullName",
        },
      ],
    };
  },
  mounted() {
    this.changeSelectedList = this.selectedList;
    this.getList();
  },
  methods: {
    async getList() {
      let selectedIds = [];
      selectedIds = this.changeSelectedList.map((ele2) => {
        return ele2.F_RoleId;
      });
      let res = await getRoles();
      if (res.data.success) {
        let resData = res.data.data;
        let data = resData.map((element) => {
          element.selected = false;
          if (selectedIds.includes(element.F_RoleId)) {
            element.selected = true;
          }
          return element;
        });
        this.list = data;
        this.listCopy = data;
      }
    },
    search() {
      if (this.keyword) {
        this.list = this.list.filter((item) => {
          return item.F_FullName.indexOf(this.keyword)>=0;
        });
      } else {
        this.list = [...this.listCopy];
      }
    },
    getSelected(index) {
      this.list[index].selected = !this.list[index].selected;
      if (this.list[index].selected) {
        this.changeSelectedList.push(this.list[index]);
        if (this.singleSelectd) {
          this.changeSelectedList = [data];
        }
      } else {
        let delRoleId = this.list[index].F_RoleId;
        this.changeSelectedList = this.changeSelectedList.filter((ele) => {
          return ele.F_RoleId != delRoleId;
        });
      }
    },
    deleteItem({ item, index }) {
     this.changeSelectedList.splice(index, 1);
      this.list.forEach((e) => {
        if (e.F_RoleId == item.F_RoleId) {
          e.selection_selected = false;
        }
      });
      this.selectTitle = this.$t('selectPost.selectTitle');
    },
    pushParentData() {
      return this.changeSelectedList;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  min-height: 500px;
}
.left-box {
  margin-right: 10px;
  height: 500px;
}
.content-box {
  width: 100%;
  height: 500px;
  position: relative;
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}
.search-box .el-input {
  width: 200px;
  margin-right: 20px;
}
@media screen and (max-width: 1370px) {
	.content-box{
	   height: 400px!important;
	 }
	 .main-container {
	   min-height: 380px;
	 }
	} 	
</style>
