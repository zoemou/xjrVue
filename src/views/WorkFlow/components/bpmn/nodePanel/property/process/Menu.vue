<template>
  <div>
    <el-form-item>
      <label>{{ $t("workFlow.Process.whetherEnable") }}</label>
      <el-radio-group v-model="formInfo.menu.isOpen">
        <el-radio :label="0">{{ $t("workFlow.Process.radioNo") }}</el-radio>
        <el-radio :label="1">{{ $t("workFlow.Process.radioYes") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="formInfo.menu.isOpen">
      <el-form-item>
        <label>{{ $t("workFlow.Process.functionNum") }}</label>
        <el-input
          v-model="formInfo.menu.F_EnCode"
          :placeholder="$t('workFlow.Process.placeholderFNum')"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <label>{{ $t("workFlow.Process.functionName") }}</label>
        <el-input
          v-model="formInfo.menu.F_FullName"
          :placeholder="$t('workFlow.Process.placeholderFName')"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        prop="F_LgMarkCode"
        :label="$t('workFlow.Process.translationTag')"
      >
        <!-- <avue-input-tree default-expand-all
										v-model="formInfo.menu.F_LgMarkId"
										:placeholder="$t('workFlow.Process.placeholderTTag')" type="tree"
										:dic="
                    " size="small"
										style="width: 100%"></avue-input-tree> -->

        <el-select
          v-model="formInfo.menu.F_LgMarkCode"
          filterable
          remote
          reserve-keyword
          :placeholder="$t('workFlow.Process.translationTag')"
          :remote-method="remoteMethod"
          style="width:100%"
          clearable
        >
          <el-option
            v-for="item in transDefaultTree"
            :key="item.F_Id"
            :label="item.F_Name"
            :value="item.F_EnCode"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <label>{{ $t("workFlow.Process.ownSystem") }}</label>
        <el-select
          v-model="formInfo.menu.F_SubSystemId"
          :placeholder="$t('workFlow.Process.placeholderOwnSys')"
          size="small"
          style="width: 100%"
          @change="toggleSystem"
        >
          <el-option
            :label="item.F_Name"
            :value="item.F_Id"
            v-for="item in allSystem"
            :key="item.F_Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <label>{{ $t("workFlow.Process.SuperiorFunction") }}</label>
        <avue-input-tree
          :props="defaultParentIdProps"
          v-model="formInfo.menu.F_ParentId"
          :placeholder="$t('workFlow.Process.placeholderSuperior')"
          type="tree"
          :dic="parentList"
          size="small"
        ></avue-input-tree>
      </el-form-item>
      <el-form-item>
        <label>{{ $t("workFlow.Process.number") }}</label>
        <el-input
          v-model="formInfo.menu.F_SortCode"
          :placeholder="$t('workFlow.Process.placeholderNum')"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <label>{{ $t("workFlow.Process.functionIcon") }}</label>
        <el-input
          :placeholder="$t('workFlow.Process.placeholderFIcon')"
          size="small"
          v-model="formInfo.menu.F_Icon"
          suffix-icon="el-icon-more"
          @focus="openDialog"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <label>{{ $t("workFlow.Process.functionDescr") }}</label>
        <el-input
          v-model="formInfo.menu.F_Description"
          type="textarea"
          :rows="4"
          :placeholder="$t('workFlow.Process.placeholderFDescr')"
        >
        </el-input>
      </el-form-item>
    </template>
    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
      @closed="closeDialog"
      class="dialog-box"
    >
      <SelectIcon v-if="dialogVisible" @childByValue="chageIcon"></SelectIcon>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SelectIcon from "@/views/FontAwesome";
import { getLgMarkList } from "@/api/language/translation";
import { getMenuTreeBySystem } from "@/api/systemManagement/menu";
import { deepClone } from "@/utils/index";
export default {
  props: {
    formInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    SelectIcon
  },
  data() {
    return {
      parentList: [],
      transDefaultTree: [],
      dialogTitle: "标题",
      dialogVisible: false,
      defaultParentIdProps:{
        label:'label',
        value:'moduleId'
      }
    };
  },
  watch: {
    "formInfo.menu.isOpen": function(val) {
      if (val) {
        this.toggleSystem(this.formInfo.menu.F_SubSystemId);
      }
    }
  },
  computed: {
    ...mapGetters(["allSystem", "systemId"])
  },
  created () {
    if(this.formInfo.menu.isOpen){
      this.toggleSystem(this.formInfo.menu.F_SubSystemId);
    }
  },
  methods: {
    /* 获取翻译标记 */
    remoteMethod(query) {
      const searchObj = {
        keyword: query
      };
      getLgMarkList(searchObj).then(res => {
        this.transDefaultTree = res.data.data;
      });
    },
    toggleSystem(systemId) {
      getMenuTreeBySystem(systemId).then(res => {
        if (res.data.success) {
          let allList = [
            {
              moduleId: "0",
              label: this.$t("workFlow.Process.placeholderSelect")
            }
          ];
          let data = res.data.data;
          allList = [
            {
              moduleId: "0",
              label: this.$t("workFlow.Process.placeholderSelect")
            },
            ...this.formateParentTree(data)
          ];

          this.parentList = deepClone(allList);
        }
      });
    },
    formateParentTree(data) {
      let list = [];
      data.forEach(item => {
        let temp = {
          moduleId: "",
          label: this.$t("workFlow.Process.placeholderSelect"),
          disabled: false,
          children: []
        };
        temp.moduleId = item.F_ModuleId;
        temp.label = item.F_FullName;
        if (item.children.length > 0) {
          temp.children = this.formateParentTree(item.children);
        }
        list.push(temp);
      });
      return list;
    },
    openDialog() {
      this.dialogTitle = this.$t("workFlow.Process.functionIcon");
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    chageIcon(val) {
      this.formInfo.menu.F_Icon = val;
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
