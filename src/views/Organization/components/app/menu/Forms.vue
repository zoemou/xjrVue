<template>
  <!-- 表单信息 -->
  <avue-crud
    ref="formInfo"
    :data="menuParams.formList"
    :option="formInfoOption"
    stripe
    @row-save="handleSave"
    @row-update="handleUpdate"
    @row-del="rowDel"
    @sortable-change="sortableChange"
  >
  </avue-crud>
</template>

<script>
import { baseUrl } from "@/config/env";
import { validateLength } from "@/api/organization/validateFunc";
import { getLgMarkList } from "@/api/language/translation";
import { S4 } from "@/config/fn";
export default {
  props: {
    menuParams: {
      type: Object,
    },
  },
  data() {
    return {
      formInfoOption: {
        dialogDrag: true,
        columnBtn: false,
        sortable: true,
        dragHandler: false,
        highlightCurrentRow: true,
        stripe: false,
        height: 260,
        border: true,
        page: false,
        index: false,
        align: "center",
        refreshBtn: false,
        defaultExpandAll: true,
        rowKey: "F_Id",
        column: [],
      },
    };
  },
  created() {
    this.initFormColumn();
  },
  methods: {
    async handleSave(form, done, loading) {
      if (form.F_LgMarkCode) {
        let res = await getLgMarkList({
          keyword: form.F_LgMarkCode,
        });
        form.F_LgMarkName = res?.data?.data[0]?.F_Name;
      }
      form.F_ModuleColumnId = "";
      if (form.F_ParentId != "0") {
        if (form.F_ParentId === "" || form.F_ParentId === null) {
          form.F_FunctionId = this.F_FunctionId;
          let id = this.guid();
          form.id = id;
          form.F_Id = id;
          form.F_ParentId = "0";
          this.menuParams.formList.push(form);
        } else {
          this.menuParams.formList.forEach((ele, i) => {
            if (ele.F_Id == form.F_ParentId) {
              let temp = {
                ...form,
                F_Id: this.guid(),
                F_FunctionId: ele.F_FunctionId,
                F_SortCode: null,
                F_LgMarkCode: null,
                id: this.guid(),
              };
              if (this.menuParams.formList[i].children) {
                this.menuParams.formList[i].children.push(temp);
              } else {
                this.menuParams.formList[i].children = [];
                this.menuParams.formList[i].children.push(temp);
              }
            }
          });
        }
      } else {
        form.F_FunctionId = this.F_FunctionId;
        let id = this.guid();
        form.id = id;
        form.F_Id = id;
        form.F_ParentId = "0";
        this.menuParams.formList.push(form);
      }
      this.initFormColumn();
      done();
    },
    guid() {
      return S4() + S4() + S4() + S4() + S4() + S4();
    },
    initFormColumn(){
      this.formInfoOption.column = [];
      let parentIdList = [
          {label:this.$t('mobileDev.functionDesignStepTwo.tabParentName'),value:"0"},
        ];
       this.menuParams.formList.forEach(element => {
			if(element?.children?.length>0 ){
			  parentIdList.push({
				label:this.$t('subtable')+element.F_FullName,
				value:element.F_Id
			  });
		    }
        });
        this.formInfoOption.column = [
        {
          label: this.$t("menuManagement.editModal.tabName"),
          prop: "F_FullName",
          rules: [{validator:validateLength,trigger:'change'}]
        },
        {
          label: this.$t("menuManagement.editModal.tabCode"),
          prop: "F_EnCode",
          rules: [{validator:validateLength,trigger:'change'}]
        },
        {
          label: this.$t('upperLevel'),
          prop: "F_ParentId",
          type: "select",
          dicData:parentIdList
        },
        {
        label: this.$t("menuManagement.addModal.labelTransTag"),
          prop: "F_LgMarkCode",
		  formatter:function(row){
			  return row.F_LgMarkName
		  },
          type: "select",
          remote:true,
          dicUrl: baseUrl + '/lg-mark?keyword={{key}}',
          dicFlag:false,
          props:{
            label : "F_Name",
            value : "F_EnCode",
          }
        }
      ]
    },
    sortableChange(oldindex, newindex, row, list) {
      this.menuParams.formList = [];
      this.$nextTick(() => {
        this.menuParams.formList = list;
      });
    },
    rowDel(form, index) {
      if (form["$index"] !== undefined) {
        //删除一级目录
        let parentIndex = form["$index"];
        this.menuParams.formList.splice(parentIndex, 1);
      } else {
        this.menuParams.formList.forEach((ele, parentIndex) => {
          if (ele.F_Id == form.F_ParentId) {
            if (ele.children && ele.children.length > 0) {
              ele.children.forEach((ele2, i) => {
                if (ele2.F_Id == form.F_Id) {
                  ele.children.splice(i, 1);
                }
              });
            }
          }
        });
      }
      this.initFormColumn();
    },
    async handleUpdate(form, index, done, loading) {
      if (form.F_Id == form.F_ParentId && form.F_ParentId) {
        this.$message({
          message: this.$t("upperLevelCannotChooseMyself"),
          type: "warning",
        });
        setTimeout(() => {
          loading();
        }, 1000);
        return;
      }
      if (form.F_LgMarkCode) {
        let res = await getLgMarkList({
          keyword: form.F_LgMarkCode,
        });
        form.F_LgMarkName = res?.data?.data[0]?.F_Name;
      }
      this.menuParams.formList.forEach((ele, parentIndex) => {
        if (ele.F_Id == form.F_Id) {
          if (ele.children && ele.children.length > 0) {
            form.children = ele.children;
            this.menuParams.formList.splice(parentIndex, 1, form);
          } else {
            if (form.F_ParentId != "0") {
              if (form.F_ParentId === "" || form.F_ParentId === null) {
                form.F_ParentId = "0";
                this.menuParams.formList.splice(parentIndex, 1, form);
              } else {
                let idx = this.menuParams.formList.findIndex((o) => {
                  return o.F_Id == form.F_ParentId;
                });
                if (idx >= 0) {
                  this.menuParams.formList[idx].children.push(form);
                  this.menuParams.formList.splice(parentIndex, 1);
                }
              }
            } else {
              this.menuParams.formList.splice(parentIndex, 1, form);
            }
          }
        } else if (ele.children && ele.children.length > 0) {
          ele.children.forEach((chi, cParentIndex) => {
            if (chi.F_Id == form.F_Id) {
              this.menuParams.formList.push(form);
              ele.children.splice(cParentIndex, 1);
            }
          });
        }
      });
      this.initFormColumn();
      done();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>