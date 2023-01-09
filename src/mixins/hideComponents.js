// 隐藏组件
import { getDbLinksTestSql } from "@/api/databasemanage/databaselink";
import { getDataAPi } from "@/util/dataApi";
export default {
  methods: {
    async initHideComponentList(hideComponentList){
      let mapList = new Map();
      if(hideComponentList&&hideComponentList.length>0){
        for (let index = 0; index < hideComponentList.length; index++) {
          const element = hideComponentList[index];
          let key = element.id;
          let value = "";
          if(element.type=='value'){
            value = element.value;
          }else if(element.type=='sql'){
            value =await this.getHideComponentSqlValue(element.name,element.sqlConfig);
          }else if(element.type=='api'){
            value =await this.getHideComponentApiValue(element.name,element.apiConfig);
          }
          mapList.set(key,value);
        }
      }
      return mapList;
    },
    async getHideComponentSqlValue(name,sqlConfig){
      let params = {
        sql:sqlConfig.sql
      };
      try {
        let list = await getDbLinksTestSql(sqlConfig.database,params);
      if(list&&list.data&&list.data.data&&list.data.data.length>0){
        let data = list.data.data;
        if(sqlConfig.field&&data[0][sqlConfig.field]!=undefined){
          return data[0][sqlConfig.field];
        }else{
          return "";
        }
       
      }else{
        return "";
      } 
      } catch (error) {
        this.$message({
          message: '【'+name+'】使用【SQL】赋值失败：原因为“'+error.data.msg+'”。',
          type: 'error'
        });
      }
    },
    async getHideComponentApiValue(name,apiConfig){
      if (apiConfig.url) {
        try {
          let list = await getDataAPi(apiConfig);
          if(list&&list.data&&list.data.data){
            let data = list.data.data;
            let field = apiConfig.field;
            if(field&&data[field]!=undefined){
              return data[field]?data[field]:"";
            }else{
              return "";
            }
          }else{
            return "";
          }
        } catch (error) {
          this.$message({
            message: '【'+name+'】使用【API】赋值失败：原因为“'+error.data.msg+'”。',
            type: 'error'
          });
        }
        
        
      }else{
        return '';
      }
      
    },
  }
}