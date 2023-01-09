<template>
  <div class="main-container" style="overflow: hidden;">
    <FormDesign ref="formDesign" :baseData="baseData"></FormDesign>
  </div>
</template>

<script>
import FormDesign from '../../FormDesign/Home';
import store from '@/store';

export default {
  props: [
    'baseData'
  ],
  data () {
    return {
      flag: false,
      temArr: [],
      primaryTableComponents:[]
    };
  },
  components: {
    FormDesign
  },
  mounted(){
    this.temArr = [];
    this.primaryTableComponents = [];
  },
  methods: {
    // 提交数据验证
    validateData (eleJsonArr,source) {
      //是否主表未关联 不包括标题，分割线，意见簿，子表单
      // let primaryTableComponents = [];
      let doNotGenerateTags=['h2','el-divider','xjr-opinion-comonent'];
      const items = eleJsonArr || this.baseData.step2;
      let subTableNames = [];
      let mainTableName ='';
      // 保存组件的表和字段的临时数组
      let temArrChildren = [];
      if(!source){
        this.temArr = [];
        this.primaryTableComponents = [];
      }
      for (let i = 0, len = items.length; i < len; i++) {
        if (i > 0 && (this.flag === false)) {
          return;
        }
        const item = items[i];
        /** 
         * avue-tabs 字段校验 
         * by:yk增加
         * **/
        const isTabs = item.__config__.componentName === 'avue-tabs';
        const tabsHaveChildren = isTabs && item.__config__.childrenObj;
        //递归检查 tabs 里子元素 是否能校验成功 tabs 子元素为  childrenObj
        if (isTabs && tabsHaveChildren) {
                let childrenObj = item.__config__.childrenObj;
                for (let key in childrenObj) {
                  const tabsItems = childrenObj[key];
                  // 保存组件的表和字段的临时数组
                  let temArrChildren = [];
                  for (let i = 0, len = tabsItems.length; i < len; i++) {
                    if (i > 0 && this.flag === false) {
                      return;
                    }
                    const item2 = tabsItems[i];
                    /**
                     * avue-tabs 字段校验
                     * by:yk增加 End
                     * **/
                    const isChildrenTable = item2.__config__.componentName === "table"; // 是否是子表单
                    const isComponents =
                      isChildrenTable && item2.__config__.children.length === 0; // 子表单 无控件直接返回
                    if (store.state.FD.controllerType === 0) {
                      if (isChildrenTable && item2.__config__.children.length) {
                        if (item2.__config__.bindTable) {
                          subTableNames.push(item2.__config__.bindTable);
                        }
                      }
                      if (!isChildrenTable && item2.__config__.bindTable) {
                        mainTableName = item2.__config__.bindTable;
                      }
                    }

                    const isBindTable = item2.__config__.isBindTable === false; // 如果json这个属性是false 默认跳过验证  不需要绑定表单

                    if (isBindTable || isComponents) {
                      this.flag = true;
                      if (item2.__config__.tag == "xjr-title") {
                        // 标题组件
                        this.temArr.push("xjr-title");
                      } else if (item2.__type__ == "opinion") {
                        // 意见簿组件
                        this.temArr.push("opinion");
                      } else if (item2.__config__.tag == "el-divider") {
                        //分割线组件
                        this.temArr.push("el-divider");
                      }
                      continue;
                    }
                    if (isChildrenTable && store.state.FD.controllerType === 0) {
                      if (
                        !item2.__config__.bindTable &&
                        item2?.__config__?.componentName != "avue-tabs"
                      ) {
                        this.$message({
                          message: this.$t("code.codeForm.Hint.bindSubformSheet"),
                          type: "error"
                        });
                      } else {
                        if (item2?.__config__?.componentName == "avue-tabs") {
                          let childrenObj = item2?.__config__?.childrenObj || {};
                          let str = this.getDataBaseTableFields(childrenObj);
                          temArrChildren.push(...str);
                        } else {
                          for (
                            let j = 0, len = item2.__config__.children.length;
                            j < len;
                            j++
                          ) {
                            const child = item2.__config__.children[j].__config__;
                            const str = this.validateTableAndTableFields(
                              child,
                              temArrChildren
                            );
                            temArrChildren.push(str);
                          }
                        }
                      }
                    }
                    if (!isChildrenTable && store.state.FD.controllerType === 0) {
                      // 判断除子表单以外的所有组件，并且不是子表单
                      if (item2?.__config__?.componentName == "avue-tabs") {
                        let childrenObj = item2?.__config__?.childrenObj || {};
                        let str = this.getDataBaseTableFields(childrenObj);
                        this.temArr.push(...str);
                        if (
                          item2.__config__.componentName != "avue-tabs" &&
                          item2.__config__.componentName != "table" &&
                          !doNotGenerateTags.includes(item2.__config__.tag)
                        ) {
                          this.primaryTableComponents.push(...str);
                        }
                      } else {
                        const str = this.validateTableAndTableFields(
                          item2.__config__,
                          this.temArr
                        );
                        this.temArr.push(str);
                        if (
                          item2.__config__.componentName != "avue-tabs" &&
                          item2.__config__.componentName != "table" &&
                          !doNotGenerateTags.includes(item2.__config__.tag)
                        ) {
                          this.primaryTableComponents.push(str);
                        }
                      }
                    }
                    if (
                      store.state.FD.controllerType === 1 ||
                      store.state.FD.controllerType === 2
                    ) {
                      this.temArr.push(item2.__vModel__);
                      if (
                        item2.__config__.componentName != "avue-tabs" &&
                        item2.__config__.componentName != "table" &&
                        !doNotGenerateTags.includes(item2.__config__.tag)
                      ) {
                        this.primaryTableComponents.push(item2.__vModel__);
                      }
                      this.flag = true;
                    }
                  }
                }
        }
        /**
         * avue-tabs 字段校验 
         * by:yk增加 End
         * **/
         const isChildrenTable = item.__config__.componentName === 'table'; // 是否是子表单
         const isComponents = isChildrenTable && item.__config__.children.length === 0; // 子表单 无控件直接返回
          // fixed # 805 只要添加了的子表，必必须设计才可以下一步
         if(store.state.FD.controllerType === 0){
           if(isChildrenTable&&item.__config__.children.length){
            if(item.__config__.bindTable){
              subTableNames.push(item.__config__.bindTable);
            }
           }
           if(!isChildrenTable&&item.__config__.bindTable){
             mainTableName = item.__config__.bindTable;
           }
         }
         
         const isBindTable = item.__config__.isBindTable === false;    // 如果json这个属性是false 默认跳过验证  不需要绑定表单

         if (isBindTable || isComponents) {
          this.flag = true;
          if(item.__config__.tag == 'xjr-title'){ // 标题组件
            this.temArr.push('xjr-title');
          }
          else if(item.__type__=='opinion'){ // 意见簿组件
            this.temArr.push('opinion');
          }else if(item.__config__.tag == 'el-divider'){//分割线组件
            this.temArr.push('el-divider');
          }
          continue;
        }
        if (isChildrenTable && store.state.FD.controllerType === 0) {
          if (!item.__config__.bindTable && item?.__config__?.componentName != 'avue-tabs') 
           {
              this.$message({
                message:this.$t('code.codeForm.Hint.bindSubformSheet'),
                type: 'error'
              });
           } 
          else {
            if(item?.__config__?.componentName == 'avue-tabs'){
              let childrenObj = item?.__config__?.childrenObj || {};
              let str = this.getDataBaseTableFields(childrenObj);
              temArrChildren.push(...str);
            }else{
              for (let j = 0, len = item.__config__.children.length; j < len; j++) {
                const child = item.__config__.children[j].__config__;
                const str = this.validateTableAndTableFields(child, temArrChildren);
                temArrChildren.push(str);
              }
            }
          }
        }
        if(!isChildrenTable && store.state.FD.controllerType === 0){ // 判断除子表单以外的所有组件，并且不是子表单
          if(item?.__config__?.componentName == 'avue-tabs'){
            let childrenObj = item?.__config__?.childrenObj || {};
            let str = this.getDataBaseTableFields(childrenObj);
            this.temArr.push(...str);
            if(
          item.__config__.componentName != 'avue-tabs'
          && item.__config__.componentName != 'table'
          && !doNotGenerateTags.includes(item.__config__.tag)
        ){
         this.primaryTableComponents.push(...str);
        }
            
          }else{
            const str = this.validateTableAndTableFields(item.__config__, this.temArr);
            this.temArr.push(str);
            if(
          item.__config__.componentName != 'avue-tabs'
          && item.__config__.componentName != 'table'
          && !doNotGenerateTags.includes(item.__config__.tag)
        ){
         this.primaryTableComponents.push(str);
        }
          }
        }
        if (store.state.FD.controllerType === 1 || store.state.FD.controllerType === 2) {
          this.temArr.push(item.__vModel__);
         if(
          item.__config__.componentName != 'avue-tabs'
          && item.__config__.componentName != 'table'
          && !doNotGenerateTags.includes(item.__config__.tag)
        ){
         this.primaryTableComponents.push(item.__vModel__);
        }
          this.flag = true;
        }
      }
      // if (this.temArr.length < 1) {
      //   this.flag = false;
      //   this.$message({
      //     message: '主表必须有至少一个组件',
      //     type: 'error'
      //   });
      // }
      if(store.state.FD.controllerType === 0){
        this.$store.commit('SET_MAIN_TABLE_NAME',mainTableName);
         this.$store.commit('SET_SUB_TABLE_NAMES',subTableNames);
      }
      //包含主表字段组件
     
      this.$store.commit('SET_PRIMARY_TABLE_COMPONENTS',this.primaryTableComponents);
      let {fields,...otherConf} = this.$refs.formDesign.formData;
      this.baseData.stepConf = otherConf;
      let obj = {
        items: items,
        html: this.$refs.formDesign.generateCode(),
        json: this.$refs.formDesign.formData
      };
      this.$emit('onChange', obj);
      //还原默认值
      return this.flag;
    },
    getDataBaseTableFields(childrenObj){
      let _arr = [];
      if(!childrenObj || !(childrenObj instanceof Object)) return; 
      for(let key in childrenObj){
        let children = childrenObj[key];
        for (let j = 0, len = children.length; j < len; j++) {
          if(children[i].__config__.componentName == 'avue-tabs'){
            _arr.push(...this.getDataBaseTableFields(children[i].childrenObj));
          }else{
            const child = children[j].__config__;
            const str = this.validateTableAndTableFields(child, temArrChildren);
            _arr.push(str);
          }
        }
      }
      return (()=>{ return _arr })()
    }, 
    /*
    * 验正 表、字段绑定
    * @param {Object} item 传入的组件__config__
    * @
    * 
    * param {String[]} tempArr 储存表字段集合
    * */
    validateTableAndTableFields (item, tempArr) {
      const isTableField = item.bindTable && item.bindTableField;

      if (isTableField) {
        let bindStr = item.bindTable + item.bindTableField;
        this.flag = false;
        if (tempArr.includes(bindStr)) this.$message({
          message: item.label + this.$t('componentFieldRepeated'),
          type: 'error'
        });
        else {
          this.flag = true;
          return bindStr;
        }
      } else {
        this.flag = false;
        this.$message({
          message: this.$t('bind') + item.label + this.$t('componentFields'),
          type: 'error'
        });
      }
    }
  },
  created () {
  }
};
</script>

<style scoped>

</style>
