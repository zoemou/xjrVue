<!-- 　
template 
模板占位符:若你不想额外增加一个div，此时应该使用template来实现（推荐）
它可帮助我们包裹元素，但在循环过程当中，template不会被渲染到页面上 
-->
<template>
    <!-- template 后面紧跟一个div，注意只能一个两个会报错 -->
    <div class="main-container" :style="{padding:(elTree.showLeftTree?'0 10px':'0 10px')}">
        <!-- 
            引用组件 src/page/main/MainFixed.vue 
            通常  import MainFixed from "../../page/main/MainFixed" 之后
            在模板页面中采用 <main-fixed></main-fixed> 来使用
            当然也可以采用 <MainFixed></MainFixed> 来使用
        -->
        <MainFixed :title="fixedTitle" alt="左则页面的自定义布局组件" v-if="elTree.showLeftTree">
            <!-- slot 用于标记往哪个具名插槽中插入子组件内容。
                相当于把下面的 div 插入到组件里的  <slot name="list"></slot> 里
            -->
            <div slot="list" alt="在此处放置左侧列表树内容">
                <!-- 
                    菜单树形
                    https://element.eleme.cn/#/zh-CN/component/tree
                    
                    属性Attributes
                    :data	展示数据
                    :empty-text	内容为空的时候展示的文本
                    :props	配置选项
                    :default-expand-all	是否默认展开所有节点
                    :node-key	每个树节点用来作为唯一标识的属性，整棵树应该是唯一的

                    特殊属性 attribute
                    key 主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。
                    ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例：
                    
                    事件Events
                    @node-click	节点被点击时的回调	共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。

                    这里我把<el-tree> 改为 <elTree> 方法定义属性和方法能与组件对应上来
                 -->
                <elTree :data="elTree.data" :props="elTree.props" :node-key="elTree.nodeKey" ref="leftListTree" :default-checked-keys="[0]"
                         :default-expand-all="false" @node-click="elTree.NodeClick">
				</elTree>
            </div>
        </MainFixed>
        <main-content :title="contentTitle" :paddingLeft="elTree.showLeftTree?210:0" alt="右则页面的自定义布局组件">
            <div slot="search" alt="在此处放置搜索内容">
                <div class="search-box">

                    <el-date-picker v-model="search.timeRelation" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 250px; margin-right: 20px"  value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                    <el-input v-model="search.keyword" size="small" placeholder="请输入要查询的关键字" style="width: 200px; margin-right: 20px" ></el-input>
                    <el-input v-model="search.serialNumber" size="small" placeholder="请输入流水号" style="width: 200px; margin-right: 20px" ></el-input>
                    
					

                    <el-button type="primary" icon="el-icon-search" size="small" @click="searchMenu">搜索</el-button>
                    <el-button icon="el-icon-circle-close" size="small" @click="searchReset">重置</el-button>

                </div>
            </div>
            <div slot="table" alt="在此处放置表格内容" style="height:100%">
                <!-- {{ AvueCrud.FKSetAvueCrudmenu(AvueCrud.menu) }} -->
                <!-- 
                    avue表格组件 
                    https://avuejs.com/doc/crud/crud-doc 

                    data 显示的数据
                    option 组件配置属性
                    page.sync 分页配置选项
                -->
                <avue-crud ref="cuTable" :data="AvueCrud.data" :option="AvueCrud.option" stripe :page.sync="AvueCrud.page" @row-click="AvueCrud.handleCurrentRowChange">
                    <template slot-scope="scope" slot="menuLeft" alt="表格顶部左侧按扭区">
                        <el-button v-for="(item,index) in AvueCrud.menuLeft" :key="index" :type="item.type" :icon="item.icon" size="small" @click="menuLeftFun(item.eventName)">{{item.title}}</el-button>
                    </template>
                    <template slot-scope="scope" slot="menu" alt="表格操作列按扭">
                        <el-button v-for="(item,index) in AvueCrud.menu"  :key="index" :type="item.type" size="mini" :icon="item.icon" @click="menuActFun(item.eventName,scope.row,scope.index)">{{item.title}}</el-button>
                    </template>
                </avue-crud>
            </div>
        </main-content>
        
        

    </div>
</template>

<!-- 
script
在html中用script标签来引用代码
组件代码可以在当前html中的script标签中，也可单独存放到一个.js文件中
-->
<script>
    /*
    import
    是用于将某个模块中导出的函数或对象、初始值导入到另一个模块中的语法。
    例如：import {模块名称} from "需要导入模块的路径名"
    */
    //导入内部组件(通常在vue文件中导入组件、注册组件、使用组件)。
    import MainFixed from "../../page/main/MainFixed"; //左则页面的自定义布局组件
    import MainContent from "../../page/main/MainContent";//右则页面的自定义布局组件
    
    // EL组件
    import { Tree } from 'element-ui';
    
    // 接口
    import {getDataItem,getRelationTask} from '@/api/workFlow/WFLaunch';
    
    // 缓存
    // import Cookies from 'js-cookie';
    import { getStore } from "@/util/store.js";

    
    


    /* 
	export与export default均可用于导出常量、函数、文件、模块等，
	你可以在其它文件或模块中通过import+(常量 | 函数 | 文件 | 模块)名的方式，将其导入，以便能够对其进行使用，
	但在一个文件或模块中，export、import可以有多个，export default仅有一个。
	*/
    export default {
        name: "WFTaskList",
        /*
		props 
		用于接收来自父组件的数据 -  使得其父子 prop 之间形成了一个单向下行绑定
		可以是简单的数组，或者使用对象作为替代，对象允许配置高级选项，如类型检测、自定义验证和设置默认值。
		*/
        props:{
            // 是否显示左侧菜单
            showLeftTree:{
                type:String,
                // default:'FlowSort'
            },
            //弹层框传传接收
            FKLayerBoxComponentParams:{
                type:[String,Number,Boolean,Array,Object,Date,Function,Symbol]
            }
        },

        /* 注册组件局部注册   components 选项中定义你想要使用的组件： */
        components: {MainContent, MainFixed},
        
        /*
        computed在data之后，所以不要在data中引用computed中的属性否则只能得到undefined。
        data可以调用前面的props，methods的属性
        computed中可以调用props，methods，data中的属性
        */
        computed: {
            // 使用匿名函数混入 computed 对象中(使用this.__UserInfo__.F_Account)
            __UserInfo__:function(){return getStore({ name: "userInfo" })}
        },

        /*
		data
		类型：Object | Function
        限制：组件的定义只接受 function。 
        javascipt只有函数构成作用域(注意理解作用域,只有函数的{}构成作用域,对象的{}以及 if(){}都不构成作用域)，
        data是一个函数时，每个组件实例都有自己的作用域，每个实例相互独立,不会相互影响!
        其实vue不应该把这个方法名取为data()，应该叫setData或其他更容易理解的方法名。
		*/
        data() {
            var _this = this;
            return {
                CurrentModule:'ToDoTasks', // 当前功能模块
                fixedTitle: '流程任务状态', // 左则树菜单标题
                contentTitle: '流程任务列表', // 右则内容区标题
                // 搜索
                search:{
                    keyword:"",//关键字
                    timeRelation:"",//区间日期
                    serialNumber:"",//流水号
                    SchemeType:"", //模板类型
                    // 区间日期格式化
                    startTime:null,
                    endTime:null,
                    // 附加参数
                    relationTaskInfo:null,
                },

                // 左则页面的自定义布局组件 的 数据
                elTree:{
                    //data展示数据
                    data: [],
                    //node-key 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
                    nodeKey:"F_ItemDetailId",
                    defaultCheckedIndex:0, //默认选中的index节点值 default-checked-keys
                    //props配置选项
                    props: {
                        label:'F_ItemName', //	指定节点标签为节点对象的某个属性值	string, function(data, node)
                        children:null,//	指定子树为节点对象的某个属性值	string
                        disabled:null,	//指定节点选择框是否禁用为节点对象的某个属性值	boolean, function(data, node)
                        isLeaf:null	//指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效	boolean, function(data, node)
                    },
                    showLeftTree:this.showLeftTree,// 是否显示左侧菜单 
                    /* 选择树形菜单加载菜单信息 */
                    NodeClick:function(data,element,component) {
               
                        // 如果有指明标题则取标题，否则取lable值
                        _this.contentTitle = data.contentTitle || data.label;
                
                        // 置空搜索
                        _this.searchReset();
                        _this.AvueCrud.currentRow = null; //置空选择数据 



                        // 重新 加载数据
                        _this.searchMenu();
                        
                    }, 
                }, 

                // 表格组件
                AvueCrud:{
                    data: [], //显示的数据
                    order:{
                        order:'desc', //排序方式
                        prop:'' //默认排序字段
                    },
                    //分页配置选项
                    page: {
                        total:0,	// 总条数,如果为0的话不显示分页	Number
                        currentPage:1,	//当前页码	Number
                        background:true, //分页背景	Boolean	
                        pageSize:20,	//每页显示多少条	Number 
                        pageSizes:[10,20,30,50,100],	//分页的数组分段	Array 
                        pagerCount:5	//多少页后中间隐藏
                    },
                    option: {
                        header:false, //	头部显隐	Boolean
                        page:true, //是否显示分页选择器
                        simplePage:true, // 只有1页的时候，分页选择器会隐藏
                        highlightCurrentRow: true, //如果要高亮当前行
                        stripe: true, //是否显示表格的斑马条纹
                        menu:false, // 是否显示操作菜单栏
                        menuWidth: 150, // 操作菜单栏的宽度	Number
                        calcHeight:150, //自己动计算 height 减去的高度
                        height:'auto',//表格高度	Number
                        maxHeight: 'auto', //表格最大高度	Number
                        border: true,//表格边框	Boolean	
                        index: true, //是否显示表格序号（根据分页会自动计算，比如每页10行，到了第二页就会从11开始记数）	Boolean	true/false
                        indexLabel: '序号', //序号的标题	String
                        align: 'center',//表格列齐方式	String	left/center/right
                        menuAlign: 'center',//菜单栏对齐方式	String	left/center/right
                        addBtn:false,  //	添加按钮	Boolean	 
                        addTitle:'新增', //	新增窗口文案	String 
                        delBtn: false,//行内删除按钮	Boolean
                        editBtn: false,//行内编辑按钮	Boolean
                        columnBtn:false, //列显隐按钮	Boolean
                        refreshBtn:false,//	刷新按钮	Boolean
                        //表格列数据
                        column: [
                                {
                                    label: '流水号',
                                    prop: 'serialNumber',
                                },
                                {
                                    label: '任务',
                                    prop: 'taskName', //'',
                                },
                                {
                                    label: '标题',
                                    prop: 'schemeName',//'',
                                },
                                {
                                    label: '等级',
									width:'60',
                                    prop: 'priority',
                                    formatter: function (row,value,label,column) {
                                        if (value >= 0 && value <= 19) {
                                            return '最低级';
                                        } else if (value >= 20 && value <= 39) {
                                            return '低级';
                                        } else if (value >= 40 && value <= 59) {
                                            return '一般';
                                        } else if (value >= 60 && value <= 79) {
                                            return '高级';
                                        }
                                    }
                                },
                                {
                                    label: '发起者',
                                    prop: 'startUser',
									width:'100'
                                },
                                {
                                    label: '时间',
                                    prop: 'createTime',
									width:'140'
                                }
                            ]
                    },
                    //表格操作菜单
                    
                    menu:[
                            // {
                            //     title: '移入回收站',
                            //     type:'info',
                            //     icon:'fa fa-recycle',
                            //     eventName:"recycled"
                            // },{
                            //     title: '删除',
                            //     type:'danger',
                            //     icon:'fa fa-trash',
                            //     eventName:"delete"
                            // }
                        ], 

                    // 表格顶部左侧按扭
                    menuLeft:[
                                // {
                                //     title:'刷新',
                                //     icon:'fa fa-refresh',
                                //     type:'default',
                                //     eventName:"searchMenu"
                                // },
                                // {
                                //     title:'审核',
                                //     icon:'fa fa-legal',
                                //     type:'default',
                                //     eventName:'approval'
                                // },
                                // {
                                //     title:'查看',
                                //     icon:'fa fa-eye',
                                //     type:'default',
                                //     eventName:"eyeHistory"
                                // }
                            ]
                    ,

                    // 表格当前选中的行
                    handleCurrentRowChange(row,event,column){
                        _this.AvueCrud.currentRow = row;
                        // 如果有弹层框FKLayerBox组件事件则 回调
                        if(_this.$listeners.FKLayerBoxOnChange){
                            _this.$listeners.FKLayerBoxOnChange({
                                processInstanceId:row.nwfSchemeInfoId,
                                title:"["+row.serialNumber+"]"+row.taskName,
                            });
                        }
                    },
                    currentRow:null, //表格当前数据
                },

                


            }
        },
        /*
		created
		在实例创建完成后被立即调用。类型：Function
		在这一步，实例已完成以下的配置：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调。
        然而，挂载阶段还没开始，$el property 目前尚不可用。
        
        在created的时候，视图中的html并没有渲染出来，所以此时如果直接去操作html的dom节点，一定找不到相关的元素(可以去后端异步获取数据，并保存到data里面。)
        而在mounted中，由于此时html已经渲染出来了(mounted的话，如果需要在页面上操作dom，就要在这个函数执行。)
		*/
		created() {
            //弹层框组件的值
            this.search.relationTaskInfo = this.FKLayerBoxComponentParams;
            
            // 判断是否有表格顶部左侧按扭
            if(this.AvueCrud.menuLeft && this.AvueCrud.menuLeft.length) this.AvueCrud.option.header = true;
            // 判断是否有表格的行操作菜单
            if(this.AvueCrud.menu && this.AvueCrud.menu.length) this.AvueCrud.option.menu = true;
            



            if(this.showLeftTree){
                // 初始化发起任务模块中的模板类型下拉框数据
                getDataItem(this.showLeftTree).then(result => {
                    var res = result.data;
                    if(res.success){
                        this.elTree.data = res.data; // 赋值渲染
                        
                        // 默认选中项
                        if(res.data[this.elTree.defaultCheckedIndex]){
                            // 取第 defaultCheckedIndex ? 条做为默认选中节点的值
                            var currentNode = res.data[this.elTree.defaultCheckedIndex][this.elTree.nodeKey];
                            this.$nextTick(function () {
                                if(this.$refs && this.$refs.leftListTree) this.$refs.leftListTree.setCurrentKey(currentNode); //左侧树形菜单默认选中node-key字段的那一条
                            });
                        }
                        
                    }
                });
            }

            // 加载数据
            this.searchMenu();

            
        },
        
        /*
        mounted
        实例被挂载后调用，这时 el 被新创建的 vm.$el 替换了。
        如果根实例挂载到了一个文档内的元素上，当 mounted 被调用时 vm.$el 也在文档内。
        注意:mounted 不会保证所有的子组件也都一起被挂载。
        如果你希望等到整个视图都渲染完毕，可以在 mounted 内部使用 vm.$nextTick：
        */
        mounted() {
            /*
            vm.$nextTick( [callback] )
            将回调延迟到下次 DOM 更新循环之后执行。
            在修改数据之后立即使用它，然后等待 DOM 更新。
            它跟全局方法 Vue.nextTick 一样，不同的是回调的 this 自动绑定到调用它的实例上。
            */
            this.$nextTick(function () {

                /* 元素的 ref 属性被用来给元素或子组件注册引用信息。
                引用信息将会注册在父组件的 $refs 对象上。
                如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；
                如果用在子组件上，引用就指向组件实例： 
                */
                if(this.$refs && this.$refs.leftListTree){
                    this.$refs.leftListTree.setCurrentKey('这里要填node-key对应字段名的值好麻烦'); //左侧树形菜单默认选中node-key字段的那一条 
                    /* 
                    https://element.eleme.cn/#/zh-CN/component/tree
                    setCurrentKey	
                    通过 key 设置某个节点的当前选中状态，
                    使用此方法必须设置 node-key 属性	(key) 待被选节点的 key，若为 null 则取消当前高亮的节点
                    */
                }
                
            });
        }, 

        /*
		methods
		将被混入到 Vue 实例中。 类型：{ [key: string]: Function }
		可以直接通过 VM 实例访问这些方法，或者在指令表达式中使用。
		方法中的 this 自动绑定为 Vue 实例。
		注意，不应该使用箭头函数来定义 method 函数 (例如 plus: () => this.a++)。
		理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.a 将是 undefined。
		*/       
        methods: {
            
            
            // 查询 or 刷新 
            searchMenu() {
                // 调取API接口的请求参数
                getRelationTask({
                    f_mobile:this.__UserInfo__.F_Account,
				    limit : this.AvueCrud.page.currentPage,
				    size : this.AvueCrud.page.pageSize,
				    order : this.AvueCrud.order.order,
                    orderfield : this.AvueCrud.order.prop,
                    // 搜索
                    keyword:this.search.keyword, // 关键字
                    // timeRelation:this.search.timeRelation, // 区间日期
                    startTime:this.search.timeRelation[0], // 起始时间
                    endTime:this.search.timeRelation[1], // 结束时间
                    serialNumber:this.search.serialNumber, // 流水号
                    SchemeType:this.search.SchemeType, // 模板类型 
                    relationTaskInfo:JSON.stringify(this.search.relationTaskInfo), // 流程任务信息
                })
                // 调取API接口成功后的操作
                .then(result => {
                    var res = result.data;
                    if(res.success){
                        // 如果有分页则取返回的总条数据 如果没有则取数据长度
                        this.AvueCrud.page.total= res.data.length || res.data.Total ;
                        this.AvueCrud.data= res.data.Rows || res.data;
                    }
                })
            },
            // 查询表单重置
            searchReset() {
                this.search.keyword="";//关键字
                this.search.timeRelation="";//区间日期
                this.search.serialNumber="";//流水号
                this.search.SchemeType="";//模板类型
            },

            // 表格顶部左侧按扭的方法
            menuLeftFun(name){
                if(!name) return;

                if(name=='searchMenu' || this.AvueCrud.currentRow){
                    if(this[name])this[name]();
                }else{
                    this.$alert('请先选择一行，再进行操作。', '温馨提示', {
                        confirmButtonText: '确定',
                        type: 'info'
                    });
                }
                
            },
            // 表格右侧菜单按扭的方法
            menuActFun(name,row,index){
                if(!name) return;
                if(this[name])this[name](row,index);
            },
            
            
        }
    }
</script>

<!-- 
style 
其内部的样式将会作用于所有组件。
为了使样式私有化（模块化），不对全局造成污染，
可以在style标签上添加scoped属性以表示它的只属于当下的模块 
-->
<style scoped>
/deep/ .el-dialog__body{
    padding:0 10px;
}


</style>