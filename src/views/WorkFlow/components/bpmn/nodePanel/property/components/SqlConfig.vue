<template>
  <el-form>
    <el-form-item
      :label="$t('databaseManage.dataSource.tableDatabase')"
      prop="database"
    >
      <avue-input-tree
        style="width: 100%"
        v-model="form.database"
        default-expand-all
        :placeholder="$t('workFlow.selectSql.hintSelectData')"
        type="tree"
        :dic="databaseDic"
      ></avue-input-tree>
    </el-form-item>
    <el-form-item :label="$t('workFlow.selectSql.sqlStatement')" prop="sql">
    </el-form-item>
    <div class="content">
      <div class="left">
        <el-tree
          :data="ruleTreelist"
          @node-click="handleNodeClick"
          :allow-drag="allowDrag"
        >
        </el-tree>
      </div>
      <div class="config-detail">
        <div class="result-config">
          <CodemirrorSql
            style="width: 100%; height: 200px"
            :placeholder="$t('fillSqlEg')"
            v-model="form.sql"
            ref="sql"
          ></CodemirrorSql>
        </div>

        <el-form-item label="">
          <el-button
            type="primary"
            size="mini"
            plain
            round
            @click="validSql"
            style="width: 80%; margin: 0 10%"
            >{{ $t("code.codeStepFour.verifyStatement") }}</el-button
          >
        </el-form-item>
        <el-form-item
          :label="$t('workFlow.searchConfig.tabBoundField')"
          prop="field"
        >
          <el-select
            v-model="form.field"
            :placeholder="$t('verifyStatementSuccessAfterSelectBoundField')"
            style="width: 100%"
            v-if="fieldOption.length > 0 && form.sql"
          >
            <el-option
              v-for="item in fieldOption"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-input
            :placeholder="
              $t(
                'verifyStatementSuccessBindFieldCannotCorrectlyObtainedInputParameter'
              )
            "
            v-model="form.field"
            v-else
          ></el-input>
        </el-form-item>
        <el-form-item>
          <span class="tips">{{ tipTxt ||  $t("hintAfterSelectBoundField") }}</span>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
import { getDbGroup } from "@/api/databasemanage/datasource";
import { getDbFieldBySQL } from "@/api/databasemanage/databaselink";
import CodemirrorSql from "@/components/common/CodemirrorSql";
export default {
  components: {
    CodemirrorSql,
  },
  props: {
    sqlConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    ruleTreelist: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tipTxt: {
      type: String,
      default:''
    }
  },
  data() {
    return {
      databaseDic: [],
      fieldOption: [],
      form: {
        database: "",
        sql: "",
        field: "",
      },
    };
  },
  async created() {
    if (this.sqlConfig && this.sqlConfig.database) {
      this.form.database = this.sqlConfig.database
        ? this.sqlConfig.database
        : "";
    }
    if (this.sqlConfig && this.sqlConfig.sql) {
      this.form.sql = this.sqlConfig.sql ? this.sqlConfig.sql : "";
    }
    if (this.sqlConfig && this.sqlConfig.field) {
      this.form.field = this.sqlConfig.field ? this.sqlConfig.field : "";
    }
    this.databaseDic = [];
    try {
      let res = await getDbGroup();
      if (res.data && res.data.data) {
        let data = res.data.data;
        for (let item in data) {
          if (item == "localhost") {
            this.databaseDic.unshift({
              label: data[item][0].F_DBName,
              value: data[item][0].F_DatabaseLinkId,
              children: [],
            });
          } else {
            let obj = {
              value: data[item][0].F_DatabaseLinkId,
              label: item,
              disabled: true,
              children: [],
            };

            if (data[item]) {
              data[item].forEach((it) => {
                it.label = it.F_DBAlias;
                it.value = it.F_DatabaseLinkId;
                obj.children.push(it);
              });
            }
            this.databaseDic.push(obj);
          }
        }
      }
    } catch (error) {}
  },
  methods: {
    handleNodeClick(data) {
      if (data.drag) {
        this.$refs.sql.insertVariable("``" + data.markKey + "``");
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.drag ? draggingNode.data.drag : false;
    },
    async validSql() {
      try {
        if (this.form.database && this.form.sql) {
          let res = await getDbFieldBySQL(this.form.database, {
            sql: this.form.sql,
          });
          if (res.data.code == 0 && res.data.data) {
            if (res.data.data.length > 0) {
              this.fieldOption = res.data.data;
            }
            this.$message({
              type: "success",
              message: this.$t("code.codeStepFour.hintVerifySuccess"),
            });
          } else {
            this.$message({
              type: "error",
              message: this.$t("code.rightPanel.hintVeriFailed"),
            });
          }
        } else {
          this.$message({
            type: "error",
            message: this.$t("selectDataBaseFillSql"),
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: this.$t("BI.group.customBind.hintVerifiedFailed"),
        });
      }
    },
    getForm() {
      return this.form;
    },
  },
};
</script>

<style lang="scss" scoped>
.tips {
  color: red;
}
.el-tree{
  height: 400px;
  overflow: scroll;
}
.content{
  display: flex;
  border: 1px solid #eeeeee;
  padding: 10px;
  .left{
    width: 220px;
    margin-right: 10px;
    border-right: 1px solid #eeeeee;
  }
  .config-detail{
    flex: 1;
  }
}
</style>
