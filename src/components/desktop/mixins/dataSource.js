import {getDataSource,getDataSourceField,getDataItem} from '@/api/databasemanage/datasource';
import {FormatTree } from '@/util/util';
import AddDataSource from '@/components/AddDataSource';
var dataSourceMixin = {
  props: ['data'],
  data: function () {
    return {
	  dataSourceVisible:false,
      dataSource: [],
	  colNameList:[],
	  dataItemOption:[]
    }
  },
  components: {
  	AddDataSource
  },
  watch:{
	dataSourceVisible: {
	  handler (val) {
	    if(!val) this.getDataSource()
	  }
	}
  },
  created(){
  	this.getDataSource()
	this.getDataField()
  },
  methods: {
  	async getDataSource(){
		if(this.config.sourceType=='dataSource'){
			//默认请求出数据源数据
			let resSource = await getDataSource();
			if(resSource.data.success){
			  const data = resSource.data.data;
			  if (data) {
				this.dataSource = [...data];
			  }
			}
		}else{
			//默认请求出数据字典数据
			let resItem = await getDataItem();
			if(resItem.data.success){
			  const data = resItem.data.data;
			  const treeData = FormatTree(data, 'F_ItemCode', 'F_ItemName', 'children');
			  this.dataItemOption = [...treeData];
			}
		}
  	},
	handleDataSourceChange(){
		this.getDataField()
	},
	getDataField(){
		if(!this.$validatenull(this.config.dataCode)){
			if(this.config.sourceType=='dataSource'){
				getDataSourceField(this.config.dataCode).then(res => {
					this.colNameList = res.data.data;
				});
			}
		}
	},
	changeSource(data){
		this.config.sourceType=data;
		this.config.dataCode="";
		this.config.dataValueKey="";
		this.getDataSource()
	},
	addDataSource(){
		this.dataSourceVisible=true
	}
  }
}
export default dataSourceMixin