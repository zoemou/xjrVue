<template>
  <div class="content-list">
    <div class="search-box">
      <div>
        <el-input
          v-model="keyword"
          suffix-icon="el-icon-search"
          size="small"
          placeholder="请输入要查询的关键字"
          clearable
          @input="searchUser"
        ></el-input>
        <el-button size="small" @click="selectAll">全选</el-button>
        <el-button size="small" @click="notSelectAll">全不选</el-button>
        <el-button size="small" @click="antiElection">反选</el-button>
      </div>
      <div>
        <el-button size="small" @click="open">已选人员</el-button>
      </div>
    </div>
    <div class="list-box">
      <div class="tree-list">
        <el-tree
          :data="companiesTree"
          :props="defaultProps"
          ref="cTree"
          :load="loadNode"
          lazy
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
      <div class="list-content">
        <div class="list">
          <div
            class="list-item position-mark"
            v-for="(item, index) in userList"
            :key="index"
          >
            <div
              class="item"
              :class="item.checked ? 'selected' : ''"
              @click="changeChecked(index)"
            >
              <div class="img-box">
                <img :src="imgIcon(item)" />
              </div>
              <div class="info-box">
                <p>
                  姓名：<span>{{ item.F_RealName }}</span>
                </p>
                <p>
                  账户：<span>{{ item.F_Account }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="selected-box" v-if="showSelectedBox">
      <div class="title-box">
        <span>已选列表[{{ selectedList.length }}]</span>
        <i class="el-icon-close closed-box" @click="closed"></i>
      </div>
      <div>
        <div v-for="(item, index) in selectedList" :key="index">
          <div class="item-box">
            <p>
              姓名:<span>{{ item.F_RealName }}</span>
            </p>
            <p>
              账户:<span>{{ item.F_Account }}</span>
            </p>
            <i class="el-icon-close" @click="deleteItem(item)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDepartmentUser,
  getDepartments
} from "@/api/organization/department";
import { getCompaniesTree } from "@/api/organization/user";
import { deepClone } from "@/utils";
export default {
  props: {
    list: {
      //原始数据
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      mapList: new Map(), //原始数据 用userid 做的map
      userList: [], //现在显示的用户列表
      oldUserList:[],//搜索之前保存的数据
      selectedList: [], //已经选择的用户列表
      keyword: "",
      showSelectedBox: false,
      defaultProps: {
        children: "children",
        label: "F_FullName",
        isLeaf: "leaf"
      },
      companiesTree: [],
      F_CompanyId: ""
    };
  },
  created() {
    this.getCompaniesTree();
  },
  methods: {
    async getCompaniesTree() {
      let res = await getCompaniesTree();
      if (res.data.success) {
        this.companiesTree = res.data.data;
      }
      this.setCompanyChild(this.companiesTree, "F_CompanyId");
    },
    loadNode(node, resolve) {
      this.F_CompanyId = node.data.F_CompanyId;
      if (node.data.children && node.data.children.length > 0) {
        return resolve(node.data.children);
      } else {
        return resolve([]);
      }
    },
    handleNodeClick(data, node, self) {
      if (data.hasChild) {
        getDepartments(data.F_CompanyId).then(res => {
          if (res.data.success) {
            node.expand();
            data.hasChild = false;
            res.data.data.forEach(e => {
              e.F_CompanyName = data.F_FullName;
            });
          }
        });
      }
      if (data.F_DepartmentId) {
        this.keyword = "";
        this.getUser(data);
      }
    },
    setCompanyChild(obj, name) {
      for (var i = 0; i < obj.length; i++) {
        obj[i].keyId = obj[i][name] || "";
        obj[i].hasChild = true;
        if (obj[i].children && obj[i].children.length > 0) {
          this.setCompanyChild(obj[i].children, name);
        } else {
          obj[i].leaf = true;
        }
      }
    },
    getUser(obj) {
      this.userList = [];
      this.oldUserList = [];
      getDepartmentUser(obj.F_DepartmentId, {}).then(res => {
        this.userList = res.data.data.map(ele => {
          let val = this.mapList.get(ele.F_UserId);
          let checked = false;
          if (val) {
            checked = this.mapList.get(ele.F_UserId).checked;
          }
          ele.checked = checked;
          return ele;
        });
        this.oldUserList = this.userList;
      });
    },
    open() {
      this.showSelectedBox = true;
    },
    closed() {
      this.showSelectedBox = false;
    },
    changSelectedList() {
      this.selectedList = this.list.filter(ele => {
        let val = this.mapList.get(ele.F_UserId);
        let checked = false;
        if (val) {
          checked = this.mapList.get(ele.F_UserId).checked;
          if (checked) {
            return ele;
          }
        }
      });
    },
    changeUserList() {
      this.userList = this.userList.map(ele => {
        ele.checked = this.mapList.get(ele.F_UserId).checked;
        return ele;
      });
    },
    changeMapItem(userId, checked, item) {
      let val = this.mapList.get(userId);
      if (val) {
        val.checked = checked;
        this.mapList.set(userId, val);
      } else {
        this.list.push(item);
        this.mapList.set(userId, item);
      }
    },
    //全选
    selectAll() {
        this.userList = this.userList.map(ele => {
        ele.checked = true;
        return ele;
        });
      this.userList.forEach(ele => {
        this.changeMapItem(ele.F_UserId, ele.checked, ele);
      });
      this.changSelectedList();
    },
    //全不选
    notSelectAll() {
      this.userList = this.userList.map(ele => {
      ele.checked = false;
      return ele;
      });
      this.userList.forEach(ele => {
        this.changeMapItem(ele.F_UserId, ele.checked, ele);
      });
      this.changSelectedList();
    },
    //反选
    antiElection() {
     this.userList = this.userList.map(ele => {
        ele.checked = !ele.checked;
        return ele;
      });
      this.userList.forEach(ele => {
        this.changeMapItem(ele.F_UserId, ele.checked, ele);
      });
      this.changSelectedList();
    },
    deleteItem(item) {
      this.changeMapItem(item.F_UserId, false, item);
      this.changSelectedList();
      this.changeUserList();
    },
    changeChecked(index) {
      this.userList[index].checked = !this.userList[index].checked;
      this.changeMapItem(
        this.userList[index].F_UserId,
        this.userList[index].checked,
        this.userList[index]
      );
      this.changSelectedList();
    },
    searchUser() {
      this.userList = this.oldUserList.filter(ele => {
        if (ele.F_RealName.includes(this.keyword)) {
          return ele;
        }
      });
    },
    imgIcon(item) {
      let imgIconUrl = require("@/assets/card/default.png");
      switch (item.F_Gender) {
        case "1":
          imgIconUrl = require("@/assets/card/male.png");
          break;
        case "2":
          imgIconUrl = require("@/assets/card/female.png");
          break;
        default:
          break;
      }
      return imgIconUrl;
    }
  }
};
</script>

<style lang="scss" scoped>
.content-list {
  padding: 10px 5px;
  height: 500px;
  overflow: hidden;
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.search-box .el-input {
  width: 200px;
  margin-right: 20px;
}
.list-box {
  display: flex;
  height: 500px;
}
.tree-list {
  width: 280px;
  border: 1px solid #e4e7ed;
  height: 500px;
  overflow: scroll;
  overflow-x: hidden;
}
.el-tree{
   width: 280px;
}
.list-content {
  height: 500px;
  flex: 1;
  overflow: scroll;
}
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .position-mark {
    position: relative;
  }
  .list-item .item {
    min-width: 260px;
    height: 80px;
    margin: 0 10px 10px 0;
    border: 1px solid rgba(0, 0, 0, 0.04);
  }
  .list-item .item:hover {
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

    i {
      font-size: 14px;
      padding-right: 4px;
    }
  }
}
@media screen and (max-width: 1370px) {
  .list .list-item .item {
    min-width: 240px;
  }
}

.item {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 10px;
  .img-box {
    width: 60px;
    height: 60px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info-box {
    line-height: 1;
    margin-left: 10px;
  }
}
.selected {
  background-color: rgba(64, 158, 255, 0.06);
  border: 1px solid rgba(64, 158, 255, 0.4) !important;
}
.selected .info-box p {
  color: #409eff;
}

.selected-box {
  width: 170px;
  height: 550px;
  position: absolute;
  right: 0;
  top: 0;
  overflow: scroll;
  background-color: #fff;
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .item-box {
    border: 1px solid #e9e9e9;
    border-radius: 5px;
    padding: 10px;
    margin: 0 10px 10px;
    position: relative;
    p {
      margin: 0;
      font-size: 12px;
    }
    i {
      position: absolute;
      top: 5px;
      right: 5px;
    }
  }
}
@media screen and (max-width: 1370px) {
  .selected-box {
    height: 390px;
  }
}
</style>
