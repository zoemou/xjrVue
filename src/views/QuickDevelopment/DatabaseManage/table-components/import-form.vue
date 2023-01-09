<template>
    <!-- 在此处放置左侧列表内容 -->
    <!-- 数据字典分类树 -->
	<div class="tree-list">
	  	<p class="head_title">{{$t('databaseManage.databaseTable.fixedTitle')}}</p> 
		<el-tree :data="databaseTableTree" ref="cTree" 
             :default-expand-all="true" @node-click="handleNodeClick"></el-tree>
	</div>
</template>
<script>
  import { getDatabaseTable, getDatabaseTableTree } from '@/api/databasemanage/databasetable';

  export default {
	props: {
	  isShow:{
	    type: Boolean,
	    default: () => false,
	  }
	},
    data: () => ({
      databaseTableTree: []
    }),
    mounted () {
		this.getDatabaseTableTree();
    },
    methods: {
      /* 获取数据库列表树 */
      getDatabaseTableTree () {
        getDatabaseTableTree().then(res => {
          const { data, code } = res.data;
          if (code) return;

          this.FormatTree(data);
        });
      },
      /* 选择树形菜单加载公司用户信息 */
      handleNodeClick (datum) {
        getDatabaseTable(datum.id).then(res => {
          const { data } = res.data;
          this.$emit('getDatum', data ? data : [], datum);
        });
      },
      FormatTree (data) {
        let arr = [];
        for (let key in data) {
			if(key=='localhost'){
			  arr.unshift({
				  label: data[key][0].F_DBName,
				  id: data[key][0].F_DatabaseLinkId,
				  DBType:data[key][0].F_DbType,
				  children:[]
			  })
			}else{
			  let node = {
			    label: key,
			    children: []
			  };
				data[key].forEach((keys) => {
				  let newNode = {
					label: keys.F_DBAlias,
					id: keys.F_DatabaseLinkId,
					DBType:keys.F_DbType,
				  };
				  node.children.push(newNode);
				});
				arr.push(node);
			}  
        }
        this.databaseTableTree = arr;
      },
    },
  };
</script>
<style scoped>
	.tree-list{
	      flex-basis: 20%;
	   height: 100%;
	   overflow: scroll;
	}
</style>