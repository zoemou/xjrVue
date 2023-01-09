<template>
  <div class="main-container">
    <main-fixed :title="$t('selectPost.titleCompany')" class="left-box">
      <div slot="list">
        <el-tree
          :data="companiesTree"
          :props="defaultProps"
          node-key="ID"
          ref="cTree"
          :load="loadNode"
          lazy
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </main-fixed>
    <main-fixed :title="$t('selectPost.titleSelectPost')" class="content-box">
      <div slot="list" style="height: 100%;">
        <div class="content-list" v-loading='loading'>
          <avue-empty :desc="$t('deletePrompt.noData')" v-if="list.length == 0"></avue-empty>
          <el-tree
            v-else
            ref="postTree"
            node-key="F_PostId"
            :data="list"
            :props="defaultPostsProps"
            show-checkbox
            check-strictly
            default-expand-all
            @check="handlePostTreeNodeClick"
          ></el-tree>
        </div>
      </div>
    </main-fixed>
  </div>
</template>

<script>
import MainFixed from "@/page/main/MainFixed";
import { getLowerCompanies } from "@/api/organization/company";
import { getLowerDepartment } from "@/api/organization/department";
import { getDepartmentPosts } from "@/api/organization/post";

export default {
  components: { MainFixed },
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
      loading:false,
      selectedIds:[],
      list: [],
      listCopy: [],
      selectedBox: false,
      changeSelectedList: [],
      companiesTree: [],
      F_CompanyId: "",
      defaultProps: {
        children: "children",
        label: "F_FullName",
        isLeaf: "leaf",
      },
      defaultPostsProps: {
        children: "children",
        label: "F_Name",
        isLeaf: "leaf",
      },
    };
  },
  mounted() {
    this.changeSelectedList = this.selectedList;
    this.selectedIds = this.changeSelectedList.map((ele) => {
                return ele.F_PostId;
      });
  },
  methods: {
    async loadNode(node, resolve) {
      try {
        const companyId = node.data.F_CompanyId || '0'
        if (companyId === '0') {
          let res = await getLowerCompanies(companyId);
          if (res.data.success) {
            this.companiesTree = res.data.data
          }
        } else {
          const departmentId = node.data.F_DepartmentId || '0'
          if (node.data.unGetLowerCompanies) {
            let res = await getLowerDepartment(companyId, departmentId)
            if (res.data.success) {
              res.data.data.map(item => {
                item['unGetLowerCompanies'] = true
              })
            }
            resolve(res.data.data)
          } else {
            let [res1, res2] = await Promise.all([getLowerDepartment(companyId, departmentId), getLowerCompanies(companyId)])
            let departmentsData = []
            let companiesData = []
            let resolveData = []
            if (res1.data.success) {
              res1.data.data.map(item => {
                item['unGetLowerCompanies'] = true
              })
              departmentsData = res1.data.data
            }
            if (res2.data.success) {
              companiesData = res2.data.data
            }
            let hasDepartmentData = !!departmentsData.length
            let hasCompaniesData= !!companiesData.length
            if (hasDepartmentData && hasCompaniesData) {
              resolveData = [...departmentsData,...companiesData]
            } else if (!hasDepartmentData && hasCompaniesData) {
              resolveData = companiesData
            } else if (hasDepartmentData && !hasCompaniesData) {
              resolveData = departmentsData
            }
            resolve(resolveData) 
          }
        }
      } catch (error) {}
    },
    handleNodeClick(data, node, self) {
      this.getList(data.F_CompanyId,data.F_DepartmentId);
    },
    handlePostTreeNodeClick(data){
      let checkedKeys  = this.$refs.postTree.getCheckedKeys();
      let tempPostId = data.F_PostId;
     if(checkedKeys.includes(tempPostId)){
        // 需要添加
        this.selectedIds.push(tempPostId);
        this.changeSelectedList.push(data);
     }else{
        // 需要删除
        this.selectedIds = this.selectedIds.filter((ele)=>{
          return ele!=tempPostId
        });
        this.changeSelectedList = this.changeSelectedList.filter((ele)=>{
          return ele.F_PostId!=tempPostId
        });
     }
    },
    async getList(companyId,departmentId) {
      this.loading = true;
      try {
        let res = await getDepartmentPosts(companyId,departmentId);
        if (res.data.success) {
          this.list = res.data.data;
          this.listCopy = res.data.data;
          if (this.changeSelectedList.length > 0) {
            this.$nextTick(() => {
              this.$refs.postTree.setCheckedKeys(this.selectedIds);
            });
          }
          this.loading = false;
        }else{
           this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    pushParentData() {
      return this.changeSelectedList;
    },
  },
};
</script>

<style lang="scss" scoped>
.left-box {
  margin-right: 10px;
  height: 500px;
}
.content-box {
  width: calc(100% - 210px);
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
.content-list {
  padding: 10px 5px;
 height: calc(100% - 5px);
  overflow: auto;
}
.selected-box {
  height: 500px;
  position: absolute;
  right: 0;
  top: -1px;
}
.closed-box {
  position: absolute;
  right: 10px;
  top: 14px;
}
.main-container::after {
  content: "";
  visibility: hidden;
  display: block;
  clear: both;
}
.list-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}
.selected-list-box {
  border: 1px solid #e9e9e9;
  border-radius: 5px;
  padding: 10px;
  margin: 0 10px 10px;
  position: relative;
}
.selected-list-box p {
  margin: 0;
  font-size: 12px;
}
.selected-list-box i {
  position: absolute;
  top: 5px;
  right: 5px;
}
@media screen and (max-width: 1370px) {
	.content-box,.left-box{
	   height: 400px!important;
	 }
	.selected-box{
	   height: 400px;
	 }	
	} 	
</style>
