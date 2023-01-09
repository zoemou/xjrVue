<template>
  <div>
    <avue-crud
      ref="queryTable"
      :data="configData.apiInputParams"
      :option="queryoption"
      stripe
      class="params-box"
    >
    <template slot="F_Type" slot-scope="scope">
        <el-select v-model="scope.row.F_Type" placeholder="" disabled>
          <!-- 接口参数类型 0 是 header  1 是body   2是queryString -->
          <el-option label="Query Params" :value="2"></el-option>
          <el-option label="Body" :value="1"></el-option>
          <el-option label="Header" :value="0"></el-option>
        </el-select>
      </template>
      <template slot="paramType" slot-scope="scope">
        <el-select v-model="scope.row.paramType" placeholder="">
          <el-option :label="$t('workFlow.zh.value')" value="value"></el-option>
          <el-option v-if="showFormDataOption" :label="$t('formData')" value="formData"></el-option>
        </el-select>
      </template>
      <template slot="F_ParamValue" slot-scope="scope">
        <el-input
          v-if="scope.row.paramType == 'value'"
          v-model="scope.row.F_ParamValue"
          placeholder=""
        ></el-input>
         <ParameterTree  v-if="scope.row.paramType == 'formData'" 
          v-model="scope.row.params" 
          :list="commonParameters"
           mainLabelKey="name" 
           mainValueKey="id"
           ></ParameterTree>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import ParameterTree from "@/components/apiConfiguration/ParameterTree";
import { deepClone } from '@/util/util';
export default {
  props: ["configData","allComponents","isTableChild","nodeType"],
  components: {
    ParameterTree,
  },
  data() {
    return {
      commonParameters:[],
      queryoption: {
        highlightCurrentRow: true,
        stripe: true,
        calcHeight: "auto", //表格高度差（主要用于减去其他部分让表格高度自适应）
        height: 320, //表格高度
        border: true,
        align: "center",
        menu: false,
        page: false,
        dragHandler: true,
        header: false,
        column: [
          {
            label: this.$t("apiParmName"),
            prop: "F_ParamKey",
          },
          {
            label: this.$t("apiParmType"),
            prop: "F_Type",
            slot: true,
          },
          {
            label: this.$t("apiParmValueType"),
            prop: "paramType",
            slot: true,
          },
          {
            label: this.$t("apiParmValue"),
            prop: "F_ParamValue",
            slot: true,
          },
        ],
      },
    };
  },
  computed: {
    showFormDataOption() {
      if(this.isTableChild){
        return false;
      }else if(this.nodeType=='hideComponent'){
        return false;
      }else{
        return true;
      } 
    }
  },
  created () {
    let componentList =[];
    if(!this.isTableChild){
        let list = deepClone(this.allComponents);
        if(list.length>0){
          list.forEach((element, i) => {
            if (element.__config__.componentName === 'table') {
              //暂时不用支持子表单
            }else if (element.__config__.componentName === 'avue-tabs') {
              let childrenObj = element?.__config__?.childrenObj || {};
                if (JSON.stringify(childrenObj) != "{}") {
                  for (let key in childrenObj) {
                  let children = childrenObj[key] || [];
                  element.__config__.childrenObj[key] = children.map(item => {
                    if (item?.__config__?.componentName == "table") {
                      //暂时不用支持子表单
                    }else{
                      //剔除 所有布局组件、编辑器、意见簿 
                      let tags = ['h2','el-divider','xjr-opinion-comonent','tinymce','avue-custom-button'];
                      if(!tags.includes(item.__config__.tag)){
                        componentList.push({
                        id:item.__config__.formId,
                        name:item.__config__.label?item.__config__.label:item.__config__.formId
                      });
                      }
                    }
                  })
                  }
                }
            }else{
              //剔除 所有布局组件、编辑器、意见簿 
              let tags = ['h2','el-divider','xjr-opinion-comonent','tinymce','avue-custom-button'];
              if(!tags.includes(element.__config__.tag)){
                componentList.push({
                  id:element.__config__.formId,
                  name:element.__config__.label?element.__config__.label:element.__config__.formId
                });
              }
              
            }
          });
        }
    }
    let hideComponents = [];
    if(this.$attrs.hideComponents&&this.$attrs.hideComponents.length>0){
      hideComponents = this.$attrs.hideComponents.filter((ele)=>{
      return ele.name
    });
    }
    this.commonParameters = [{
        id:'1',
        name:this.$t('formData'),
        children:componentList
      },
      {
        id:'3',
        name:this.$t('hiddenComponents'),
        children:hideComponents
      },
      {
        id:'2',
        name:this.$t('currentInfor'),
        children:[
          {
            id:'current-userId',
            name:this.$t('curPersonId'),
          },
          {
            id:'current-companyId',
            name:this.$t('curPersonCoId'),
          },
           {
            id:'current-departmentId',
            name:this.$t('curPersonDeptId'),
          },
          {
            id:'current-postId',
            name:this.$t('curPersonPostId'),
          },
          {
            id:'current-token',
            name:this.$t('curPersonToken'),
          },
          {
            id:'current-roleId',
            name:this.$t('curPersonRoleId'),
          }
        ]
      }];

  },

  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
.params-box {
  padding-top: 10px;
  height: calc(100% - 100px);
}
.del-icon {
  color: #f56c6c;
  font-size: 20px;
  display: block;
}
</style>
