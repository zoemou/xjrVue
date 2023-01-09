<template>
  <div class="box">
    <el-form size="small" label-width="70px" class="list-box">
      <div class="list">
        <div class="list-item" v-for="(item, index) in formConf.hideComponents" :key="index">
          <div class="close-icon" @click="close(index)">
            <i class="el-icon-error"></i>
          </div>
          <el-form-item :label="$t('compName')" required>
            <el-input
              v-model="item.name"
              :placeholder="$t('pleaseFillInTheComponentName')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('compCod')" required>
            <el-input
              v-model="item.code"
              :placeholder="$t('pleaseFillInTheComponentCode')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('assType')" required>
            <el-select
              v-model="item.type"
              :placeholder="$t('pleaseSelectAnAssignmentType')"
              :style="{ width: '100%' }"
              @change="changeType(index)"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('compAss')" required>
            <template v-if="item.type == 'value'">
              <el-input
                v-model="item.value"
                :placeholder="$t('pleaseFillInComponentAssignment')"
              ></el-input>
            </template>
            <template v-else-if="item.type == 'sql'">
              <Sql :sqlConfig.sync="item.sqlConfig" @submitSql="(config)=>{item.sqlConfig = config;}"></Sql>
            </template>
            <template v-else-if="item.type == 'api'">
              <Api :apiConfig.sync="item.apiConfig" @submitApi="(config)=>{item.apiConfig = config;}"></Api>
            </template>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="add" @click="add">
      <i class="icon el-icon-circle-plus"></i
      ><span class="title">{{$t('addComponents')}}</span>
    </div>
  </div>
</template>

<script>
import Sql from "./Sql.vue";
import Api from "./Api.vue";
import { deepClone } from '@/utils/index';
export default {
  components: {
    Sql,
    Api,
  },
  props: {
    formConf: {
      type: Object
    },
    baseData:{
      type:Object
    }
  },
  data() {
    return {
      typeList: [
        { label:this.$t('workFlow.zh.value'), value: "value" },
        { label: this.$t('workFlow.selectSql.sqlStatement'), value: "sql" },
        { label: "API", value: "api" },
      ],
    };
  },
  methods: {
    add() {
      let id = 'hideComponents'+Date.now();
      let obj = {
        id,
        code: "",
        name: "",
        type: "value",
        value: "",
        apiConfig: {},
        sqlConfig: {},
      };
      this.formConf.hideComponents.push(deepClone(obj));
    },
    close(index) {
      let ele = this.formConf.hideComponents[index];
      this.changeBaseData(ele.id);
      this.changeEventData(ele.id);
      this.formConf.hideComponents.splice(index, 1);
    },
    changeBaseData(delID){
      if(this.baseData&&this.baseData.step2&&this.baseData.step2.length>0){
        for (let index = 0; index < this.baseData.step2.length; index++) {
          const items =  this.baseData.step2[index];
            if (items.__config__.componentName&&items.__config__.componentName == "avue-tabs") {
              if (items.__config__.childrenObj && items.__config__.childrenObj instanceof Object) {
                    for (let tabKey in items.__config__.childrenObj) {
                      let children = items.__config__.childrenObj[tabKey];
                      if(children.length>0){
                        for (let childrenIndex = 0; childrenIndex < children.length; childrenIndex++) {
                           let items2 = children[childrenIndex];
                          if(items2.__config__.componentName&&items2.__config__.componentName == "table"){
                            // 子表无法使用表单数据
                          }else{
                            if(this.hasApiInputParams(items2)){
                              this.baseData.step2[index].__config__.childrenObj[tabKey][childrenIndex].__config__.apiConfig.apiInputParams
                              = this.changeApiConfigApiInputParams(items2.__config__.apiConfig.apiInputParams,delID);
                            }
                          }
                        }
                      }
                    }
                  }
            }else if(items.__config__.componentName&&items.__config__.componentName == "table"){
              // 子表无法使用表单数据
            }else{
              if(this.hasApiInputParams(items)){
                this.baseData.step2[index].__config__.apiConfig.apiInputParams
                = this.changeApiConfigApiInputParams(items.__config__.apiConfig.apiInputParams,delID);
              }
            }
          
        }
      }
    },
    hasApiInputParams(ele){
       return ele.__config__.dataType&&
       ele.__config__.dataType=="dataApi"&&
       ele.__config__.apiConfig&&
       ele.__config__.apiConfig.apiInputParams&&
       ele.__config__.apiConfig.apiInputParams.length>0
    },
    changeApiConfigApiInputParams(apiInputParams,delID){// delID 被删除的隐藏组件id
      return apiInputParams.map((ele)=>{
          if(ele.paramType=='formData'&&ele.params&&ele.params.id&&ele.params.id==delID){
            ele.params = {
              id:"",
              name:""
            };
          }
          return ele;
        })
    },
    changeEventData(delID){//表单事件
       if(this.baseData&&this.baseData.step9&&this.baseData.step9.length>0){
        for (let index = 0; index < this.baseData.step9.length; index++) {
          const element = this.baseData.step9[index];
          if(element.nodeComponent=="Custom"&&
            element.triggerEventData&&
            element.triggerEventData.length>0){//只有自定义节点才使用了api
            for (let triggerIndex = 0; triggerIndex < element.triggerEventData.length; triggerIndex++) {
              const items = element.triggerEventData[triggerIndex];
              if(items.nodeType=='api'){
                this.baseData.step9[index].triggerEventData[triggerIndex].apiConfig.apiInputParams
                = this.changeApiConfigApiInputParams(items.apiConfig.apiInputParams,delID)
              }
            }
          }
        }
       }
    },
    changeType(index){
      let type = this.formConf.hideComponents[index].type;
      if(type=='sql'){
        this.formConf.hideComponents[index].sqlConfig = {
         database: "",
         field: "",
         sql: "",
        };
        this.formConf.hideComponents[index].apiConfig = {};
        this.formConf.hideComponents[index].value = "";
      }else if(type=='api'){
         this.formConf.hideComponents[index].apiConfig = {
          url: "",
          F_UrlAddress: "",
          type: "",
          field:"",
          apiInputParams: []
        };
        this.formConf.hideComponents[index].sqlConfig = {};
        this.formConf.hideComponents[index].value = "";
      }else if(type=='value'){
        this.formConf.hideComponents[index].sqlConfig = {};
        this.formConf.hideComponents[index].apiConfig = {};
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.box {
  padding: 10px;
}
.list-item {
  position: relative;
  padding: 10px;
  background-color: #f2f2f2;
  margin-top: 12px;
  border-radius: 4px;
  .close-icon {
    position: absolute;
    right: -4px;
    top: -12px;
    font-size: 20px;
    color: #afa7a7;
    cursor: pointer;
  }
}
.add {
  display: flex;
  align-items: center;
  color: #43aaf0;
  margin: 10px 0 10px 10px;
  cursor: pointer;
  .icon {
    font-size: 16px;
  }
  .title {
    font-size: 14px;
    margin-left: 4px;
  }
}
</style>
