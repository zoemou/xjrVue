<template>
  <div>
    <el-dialog
      v-dialogDrag
      v-bind="$attrs"
      :close-on-click-modal="false"
      :append-to-body="true"
      v-on="$listeners"
    >
      <div style="margin-bottom: 20px;">
        <el-button size="small" @click="addTab(editableTabs.length)">
          {{ $t("addLevel") }}
        </el-button>
      </div>
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        @tab-remove="removeTab"
        :before-leave="clickTab"
      >
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="index"
          :label="$t(returnCN(index + 1) + $t('levelDataSource'))"
          :name="item.name"
          :closable="index == 0 ? false : true"
        >
          <el-form
            :model="editableTabs[index]"
            :rules="index > 0 ? rulesTwo : rules"
            label-width="100px"
            ref="elForm"
            size="small"
          >
            <el-row>
             <el-col>               
				<el-button type="primary" size="medium" @click="addNewDataSource" style="margin-left: 100px;">{{$t('newDataSource')}}</el-button>
              </el-col>
        
                <el-col>
                  <el-form-item
                    :label="$t('mobileDev.formRightSide.labelDataOptions')"
                    prop="dataSource"
                  >
                    <el-select
                      v-model="editableTabs[index]['dataSource']"
                      clearable
                      value-key="F_Id"
                      @change="changeDataSource"
                      :placeholder="$t('code.codeStepFour.placeholderSelect')"
                      style="width: 320px;"
                    >
                      <el-option
                        v-for="item in dataSourceOption"
                        :key="item.F_Id"
                        :label="item.F_Name"
                        :value="item.F_Id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              
              <el-col>
                <el-form-item
                  :label="$t('code.codeStepFour.showField')"
                  prop="showField"
                >
                  <el-select
                    clearable
                    v-model="editableTabs[index]['showField']"
                    :placeholder="$t('code.codeStepFour.placeholderSelect')"
                    style="width: 320px;"
                  >
                    <el-option
                      v-for="item in dataSourceFieldOption"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item
                  :label="$t('mobileDev.formRightSide.labelSaveField')"
                  prop="saveField"
                >
                  <el-select
                    v-model="editableTabs[index]['saveField']"
                    clearable
                    :placeholder="$t('code.codeStepFour.placeholderSelect')"
                    style="width: 320px;"
                  >
                    <el-option
                      v-for="item in dataSourceFieldOption"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="editableTabsValue >= 2">
                <el-form-item
                  :label="$t('code.codeStepFour.parentField')"
                  prop="parentId"
                >
                  <el-select
                    v-model="editableTabs[index]['parentId']"
                    clearable
                    :placeholder="$t('code.codeStepFour.placeholderSelect')"
                    style="width: 320px;"
                  >
                    <el-option
                      v-for="item in dataSourceFieldOption"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <el-button @click="close" size="small">{{
          $t("buttonModule.modalCancelBtn")
        }}</el-button>
        <el-button type="primary" size="small" @click="handelConfirm">{{
          $t("buttonModule.modalSureBtn")
        }}</el-button>
      </div>
    </el-dialog>
	<add-data-source v-if="dataSourceVisible" :visible.sync="dataSourceVisible"  :title="this.$t('addDataSource')"></add-data-source>
  </div>
</template>
<script>
import {
  getDataSource,
  getDbGroup,
  getDataSourceField
} from "@/api/databasemanage/datasource";
import { getDbFieldBySQL } from "@/api/databasemanage/databaselink";
import { deepClone } from "@/utils/index";
import AddDataSource from '@/components/AddDataSource';
export default {
  components: {AddDataSource},
  inheritAttrs: false,
  props: ["settings"],
  watch: {
  	dataSourceVisible: {
  	  handler (val) {
  	    if(!val) this.getDataSource()
  	  }
  	}
  },
  data() {
    return {
      editableTabsValue: "1",
      editableTabs: [],
      dataSourceOption: [],
      dataSourceFieldOption: [],
      rules: {
        dataSource: [
          {
            required: true,
            message: this.$t("mobileDev.formRightSide.placeholderDataOption"),
            trigger: "change"
          }
        ],
        showField: [
          {
            required: true,
            message: this.$t("mobileDev.formRightSide.placeholderShowField"),
            trigger: "change"
          }
        ],
        saveField: [
          {
            required: true,
            message: this.$t("selectBindField"),
            trigger: "change"
          }
        ]
      },
      rulesTwo: {
        dataSource: [
          {
            required: true,
            message: this.$t("mobileDev.formRightSide.placeholderDataOption"),
            trigger: "change"
          }
        ],
        showField: [
          {
            required: true,
            message: this.$t("mobileDev.formRightSide.placeholderShowField"),
            trigger: "change"
          }
        ],
        saveField: [
          {
            required: true,
            message: this.$t("selectBindField"),
            trigger: "change"
          }
        ],
        parentId: [
          {
            required: true,
            message: this.$t("code.codeStepFour.hintParentField"),
            trigger: "change"
          }
        ]
      },
      databaseDic: [], //数据库DIC
	  dataSourceVisible:false
    };
  },
  created() {
    let arr = deepClone(this.settings);
    if (arr.length > 0) {
      this.editableTabs = arr;
      return;
    }
    for (let i = 0; i < 3; i++) {
      let objTab = { level: i, name: i + 1 + "" };
      objTab["dataSource"] = "";
      objTab["showField"] = "";
      objTab["saveField"] = "";
      if (i > 0) objTab["parentId"] = "";

      this.editableTabs.push(objTab);
    }
  },
  mounted() {
    this.getDataSource();
	if(this.settings?.length>0){
		this.getDataField(this.settings[0].dataSource)
	}
  },
  methods: {
	async getDataSource(){
		//默认请求出数据源数据
		let resSource = await getDataSource();
		if(resSource.data.success){
		  const data = resSource.data.data;
		  if (data) {
		    this.dataSourceOption = [...data];
		  }
		}
	},
	getDataField(datas){
		if(datas!=undefined&&datas!=null){
			getDataSourceField(datas).then(res => {
			  const data = res.data.data;
			  this.dataSourceFieldOption = [...data];
			});
		}
	},
	addNewDataSource(){
		this.dataSourceVisible=true;
	},
    addTab(targetName) {
      let i = targetName;
      let objTab = { level: i, name: i + 1 + "" };
      objTab["dataSource"] = "";
      objTab["showField"] = "";
      objTab["saveField"] = "";
      objTab["parentId"] = "";
      this.editableTabs.push(objTab);
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      if (targetName < tabs.length) {
        this.$confirm(
          this.$t("removeOptionSub"),
          this.$t("deletePrompt.promptTitle"),
          {
            confirmButtonText: this.$t("buttonModule.modalSureBtn"),
            cancelButtonText: this.$t("buttonModule.modalCancelBtn"),
            type: "warning"
          }
        )
          .then(() => {
            this.editableTabsValue = (targetName - 1).toString();
            this.editableTabs = tabs.filter(tab => tab.level < targetName - 1);
            this.$message({
              type: "success",
              message: this.$t("deletePrompt.successDeleted")
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("cancelledDelete")
            });
          });
        return;
      } else {
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    },
    returnCN(num) {
      let changeNum = [
        this.$t("zero"),
        this.$t("one"),
        this.$t("two"),
        this.$t("three"),
        this.$t("four"),
        this.$t("five"),
        this.$t("six"),
        this.$t("seven"),
        this.$t("eight"),
        this.$t("nine")
      ];
      let unit = [
        "",
        this.$t("ten"),
        this.$t("hundred"),
        this.$t("thousand"),
        this.$t("wan")
      ];
      let getch = temp => {
        let strArr = temp
          .toString()
          .split("")
          .reverse();
        let newNum = "";
        for (let i = 0; i < strArr.length; i++) {
          newNum =
            (i == 0 && strArr[i] == 0
              ? ""
              : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
              ? ""
              : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) +
            newNum;
        }
        return newNum;
      };
      let ny = Math.floor(num / 100000000);
      num = ny ? num - ny * 100000000 : num;
      let nw = Math.floor(num / 10000);
      num = nw ? num - nw * 10000 : num;
      return ny
        ? getch(ny) +
            this.$t("calculate") +
            getch(nw) +
            this.$t("wan") +
            getch(num)
        : nw
        ? getch(nw) + this.$t("wan") + getch(num)
        : getch(num);
    },
    
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      for (let i = 0; i < this.editableTabs.length; i++) {
        let valid = true;
        this.$refs["elForm"][i].validate(res => {
          valid = res;
        });
        if (!valid) {
          this.editableTabsValue = this.editableTabs[i].name;
          return;
        }
      }
      this.$emit("commit", this.editableTabs);
      this.close();
    },
    clickTab(activeName, oldActiveName) {
      let valid = true;
      for (let i = 0; i < activeName - 1; i++) {
        this.$refs["elForm"][i].validate(res => {
          valid = res;
        });
        if (!valid) {
          this.editableTabsValue = this.editableTabs[i].name;
          this.$message({
            type: "warning",
            message:
              this.$t("complete") +
              this.returnCN(this.editableTabs[i].level + 1) +
              this.$t("levDataConfig")
          });
          break;
        }
      }
      if (valid) {
        this.editableTabsValue = activeName;
      }
	  if(this.editableTabs[activeName-1].dataSource){
		  this.getDataField(this.editableTabs[activeName-1].dataSource)
	  }
      return valid;
    },
    changeDataSource(data) {
      this.dataSourceFieldOption = [];
      this.editableTabs[this.editableTabsValue - 1].showField = "";
      this.editableTabs[this.editableTabsValue - 1].saveField = "";
      if (this.editableTabsValue >= 2) {
        this.editableTabs[this.editableTabsValue - 1].parentId = "";
      }
       this.getDataField(data)
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin-bottom: 0;
}
::v-deep .el-tabs__content {
  border: 1px solid #e4e7ed;
  padding: 20px;
}
::v-deep .el-tabs__nav-wrap.is-scrollable {
  padding: 0 40px 0 0;
}
::v-deep .el-tabs__nav-prev {
  right: 20px;
  left: auto;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: 0;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
  border: 1px solid #e4e7ed;
  border-bottom-color: #fff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom-color: #409eff;
  border-bottom-width: 3px;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
  width: 14px;
}
::v-deep .el-textarea + .el-form-item__error {
  top: 65px;
}
</style>
