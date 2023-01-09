import { validatenull } from './validate'

//表单序列化
export const serialize = data => {
    let list = [];
    Object.keys(data).forEach(ele => {
        list.push(`${ele}=${data[ele]}`)
    })
    return list.join('&');
};
export const getObjType = obj => {
    var toString = Object.prototype.toString;
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    if (obj instanceof Element) {
        return 'element';
    }
    return map[toString.call(obj)];
};
export const getViewDom = () => {
    return window.document.getElementById('avue-view').getElementsByClassName('el-scrollbar__wrap')[0]
}
/**
 * 对象深拷贝
 */
export const deepClone = data => {
    var type = getObjType(data);
    var obj;
    if (type === 'array') {
        obj = [];
    } else if (type === 'object') {
        obj = {};
    } else {
        //不再具有下一层次
        return data;
    }
    if (type === 'array') {
        for (var i = 0, len = data.length; i < len; i++) {
            obj.push(deepClone(data[i]));
        }
    } else if (type === 'object') {
        for (var key in data) {
            obj[key] = deepClone(data[key]);
        }
    }
    return obj;
};
/**
 * 设置灰度模式
 */
export const toggleGrayMode = (status) => {
    if (status) {
        document.body.className = document.body.className + ' grayMode';
    } else {
        document.body.className = document.body.className.replace(' grayMode', '');
    }
};
/**
 * 设置主题
 */
export const setTheme = (name) => {
    document.body.className = name;
}

/**
 * 加密处理
 */
export const encryption = (params) => {
    let {
        data,
        type,
        param,
        key
    } = params;
    let result = JSON.parse(JSON.stringify(data));
    if (type == 'Base64') {
        param.forEach(ele => {
            result[ele] = btoa(result[ele]);
        })
    } else if (type == 'Aes') {
        param.forEach(ele => {
            result[ele] = window.CryptoJS.AES.encrypt(result[ele], key).toString();
        })

    }
    return result;
};


/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
    if (fullscreenEnable()) {
        exitFullScreen();
    } else {
        reqFullScreen();
    }
};
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
    function listen() {
        callback()
    }
    document.addEventListener("fullscreenchange", function () {
        listen();
    });
    document.addEventListener("mozfullscreenchange", function () {
        listen();
    });
    document.addEventListener("webkitfullscreenchange", function () {
        listen();
    });
    document.addEventListener("msfullscreenchange", function () {
        listen();
    });
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
    var isFullscreen = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
    return isFullscreen;
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    }
};
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.exitFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.mozCancelFullScreen();
    }
};
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].children.length != 0) {
            for (let j = 0; j < menu[i].children.length; j++) {
                if (menu[i].children[j].id == id) {
                    return menu[i];
                } else {
                    if (menu[i].children[j].children.length != 0) {
                        return findParent(menu[i].children[j].children, id);
                    }
                }
            }
        }
    }
};

/*
* data : 是数据源
* valueField : 是绑定到value
* lableField : 是绑定到lable
* childField : 绑定到chilren
* */
export const FormatTree = (data,valueField,lableField,childField) => {
    let tree = [];

    data.forEach((node,index) => {
        let newNode = {
            value : node[valueField],
            label : node[lableField],
        };

        tree.push(newNode);
        if(node[childField]!= null && node[childField].length > 0){
            newNode.children = (FormatTree(node[childField],valueField,lableField,childField));
        }
    },this);

    return tree;
};
/*
* data : 是数据源
* valueField : 是绑定到value
* lableField : 是绑定到lable
* childField : 绑定到chilren
* */
export const FormatMenuTree = (data,valueField,lableField,childField,curId) => {
    let tree = [];

    data.forEach((node,index) => {        
        if(node.F_Target=="expand"){
					let newNode = {
					    value : node[valueField],
					    label : node[lableField],
							disabled:node[valueField]==curId
					};
					
					tree.push(newNode);
					if(node[childField]?.length >0){
						newNode.children = (FormatMenuTree(node[childField],valueField,lableField,childField,curId));
					}
        }
    },this);

    return tree;
};
/*
* data : 是数据源
* valueField : 是绑定到value
* lableField : 是绑定到lable
* childField : 绑定到chilren
* */
export const FormatAddressTree=(data,valueField,valueFieldTwo,lableField,childField,parentValue)=>{
	let tree = [];

	data.forEach((node,index) => {
		let newNode = {
			value :JSON.stringify({id: node[valueFieldTwo],url : parentValue+node[valueField]}),
			label : node[lableField],
			disabled:node[childField]?.length>0
		};

		tree.push(newNode);
		if(node[childField]!= null && node[childField].length > 0){
			newNode.children = (FormatAddressTree(node[childField],valueField,valueFieldTwo,lableField,childField,JSON.parse(newNode.value).url));
		}
	},this);

	return tree;
};

/*
* data : 是数据源
* valueField : 是绑定到value
* lableField : 是绑定到lable
* childField : 绑定到chilren
* */
export const LanguageFormatTree = (data,valueField,lableField,childField) => {
    let tree = [];

    data.forEach((node,index) => {
        let newNode = {
            value : node[valueField],
            label : node[lableField],
			disabled:node[childField]!= null && node[childField].length > 0?true:false
        };

        tree.push(newNode);
        if(node[childField]!= null && node[childField].length > 0){
            newNode.children = (LanguageFormatTree(node[childField],valueField,lableField,childField));
        }
    },this);

    return tree;
};

/*
* data : 是数据源
* fieldName : 是绑定到value
* */
export const FormatTreeAddNewNode = (data,fieldName,oneField,twoField) => {

    data.forEach((node,index) => {
        node[fieldName] = "[" + node[oneField] + "]-" + node[twoField];

        if(node.children != null && node.children.length > 0){
            FormatTreeAddNewNode(node.children,fieldName,oneField,twoField);
        }
    },this);

    return data;
};
/**
 * 判断2个对象属性和值是否相等
 */

/**
 * 动态插入css
 */

export const loadStyle = url => {
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
};
/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
    delete obj1.close;
    var o1 = obj1 instanceof Object;
    var o2 = obj2 instanceof Object;
    if (!o1 || !o2) { /*  判断不是对象  */
        return obj1 === obj2;
    }

    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
        //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
    }

    for (var attr in obj1) {
        var t1 = obj1[attr] instanceof Object;
        var t2 = obj2[attr] instanceof Object;
        if (t1 && t2) {
            return diff(obj1[attr], obj2[attr]);
        } else if (obj1[attr] !== obj2[attr]) {
            return false;
        }
    }
    return true;
}
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
    let result = '';
    if (validatenull(dic)) return value;
    if (typeof (value) == 'string' || typeof (value) == 'number' || typeof (value) == 'boolean') {
        let index = 0;
        index = findArray(dic, value);
        if (index != -1) {
            result = dic[index].label;
        } else {
            result = value;
        }
    } else if (value instanceof Array) {
        result = [];
        let index = 0;
        value.forEach(ele => {
            index = findArray(dic, ele);
            if (index != -1) {
                result.push(dic[index].label);
            } else {
                result.push(value);
            }
        });
        result = result.toString();
    }
    return result;
};
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
    for (let i = 0; i < dic.length; i++) {
        if (dic[i].value == value) {
            return i;
        }
    }
    return -1;
};
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
    let random = '';
    random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len ? len : 4);
    if (date) random = random + Date.now();
    return random;
};
/**
 * 打开小窗口
 */
export const openWindow = (url, title, w, h) => {
    // Fixes dual-screen position                            Most browsers       Firefox
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

    const left = ((width / 2) - (w / 2)) + dualScreenLeft
    const top = ((height / 2) - (h / 2)) + dualScreenTop
    const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus()
    }
}
/*
  分页参数
*/
export const pageParam = {
    limit : 1,
    size : 20,
    keyword : null,
    order : null,
    orderfield : null
}

/*
  请求类型
*/
export const axiosType = [{
	  value: 0,
	  label: 'GET'
	}, {
	  value: 1,
	  label: 'POST'
	}, {
	  value: 2,
	  label: 'PUT'
	},{
	  value: 3,
	  label: 'DELETE'
  }]
  
/*
  接口参数类型 
  请求方式如果是get  没有body  类型也是1  默认拼接参数到url
*/
export const axiosMethod = [{
	  value: 2,
	  label: 'Query Params'
	}, {
	  value: 1,
	  label: 'Body'
	},{
	  value: 0,
	  label: 'Header'
	}]
	
/*
  变量类型
*/
export const varibleType = [{
	  value:0,
	  label:'workFlow.zh.value'
  },{
	  value:1,
	  label:'BI.Build.Parameter'
  },{
	  value:2,
	  label:'mobileDev.homeRightSide.labelSQL'
  },{
	  value:3,
	  label:'API'
  }]

/*输出参数来源*/
export const SourceOptions= [{
	  value:0,
	  label:'InterfaceInputParameters'
  },{
	  value:1,
	  label:'interfaceVariables'
  },{
	  value:2,
	  label:'customOutParameter'
  }]

/*对象集合配置 数据类型*/
export const outputObjType=[{
	value:0,
	label:'String'
},{
	value:1,
	label:'Int'
},{
	value:2,
	label:'Double'
},{
	value:3,
	label:'Decimal'
},{
	value:4,
	label:'DateTime'
},{
	value:5,
	label:'Bool'
}]
/*表单校验提示*/
export const formValidateNotice=(obj,that,formAuth)=>{
	for(let o in obj){
		if(!formAuth[o]&&obj[o][0]){
			that.$message({message:obj[o][0].message+','+that.$t('noFormAuth'),type: 'warning'});		
			return;
		}
	}
}
/*
 获取排序
*/
export const getOrder = (order) => {
    return order == "ascending" ? "asc" : "desc"
}

export const getHtml = () => {
    return `<template>
  <div>
    <el-dialog v-dialogDrag v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <el-form-item label="单行文本" prop="field101">
              <el-input v-model="formData.field101" placeholder="请输入单行文本" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="多行文本" prop="field109">
              <el-input v-model="formData.field109" type="textarea" placeholder="请输入多行文本"
                :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下拉选择" prop="field111">
              <el-select v-model="formData.field111" placeholder="请选择下拉选择" clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in field111Options" :key="index" :label="item.label"
                  :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级联选择" prop="field113">
              <el-cascader v-model="formData.field113" :options="field113Options" :props="field113Props"
                :style="{width: '100%'}" placeholder="请选择级联选择" clearable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间选择" prop="field114">
              <el-time-picker v-model="formData.field114" format="HH:mm:ss" value-format="HH:mm:ss"
                :picker-options='{"selectableRange":"00:00:00-23:59:59"}' :style="{width: '100%'}"
                placeholder="请选择时间选择" clearable></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间范围" prop="field115">
              <el-time-picker v-model="formData.field115" is-range format="HH:mm:ss" value-format="HH:mm:ss"
                :style="{width: '100%'}" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="至"
                clearable></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="表格[开发中]" prop="field116"> null </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="编辑器" prop="field110">
              <tinymce v-model="formData.field110" placeholder="请输入编辑器" :height="300"></tinymce>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  components: {},
  props: [],
  data() {
    return {
      formData: {
        field101: undefined,
        field109: undefined,
        field111: undefined,
        field113: [],
        field114: null,
        field115: null,
        field116: undefined,
        field110: null,
      },
      rules: {
        field101: [{
          required: true,
          message: '请输入单行文本',
          trigger: 'blur'
        }],
        field109: [{
          required: true,
          message: '请输入多行文本',
          trigger: 'blur'
        }],
        field111: [{
          required: true,
          message: '请选择下拉选择',
          trigger: 'change'
        }],
        field113: [{
          required: true,
          type: 'array',
          message: '请至少选择一个级联选择',
          trigger: 'change'
        }],
        field114: [{
          required: true,
          message: '请选择时间选择',
          trigger: 'change'
        }],
        field115: [{
          required: true,
          message: '时间范围不能为空',
          trigger: 'change'
        }],
        field110: [{
          required: true,
          message: '请输入编辑器',
          trigger: 'blur'
        }],
      },
      field111Options: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
      field113Options: [],
      field113Props: {
        "multiple": false,
        "label": "label",
        "value": "value",
        "children": "children"
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getField113Options()
  },
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs['elForm'].resetFields()
    },
    close() {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.close()
      })
    },
    getField113Options() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      this.$axios({
        method: 'get',
        url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList'
      }).then(resp => {
        var {
          data
        } = resp
        this.field113Options = data.list
      })
    },
  }
}

</script>
<style>
</style>`
}

export const getList = () => {
    return `<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="6">
          <el-form-item label="按钮" prop="field112">
            <el-button type="primary" icon="el-icon-search" size="medium"> 主要按钮 </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="按钮" prop="field114">
            <el-button type="primary" icon="el-icon-search" size="medium"> 主要按钮 </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="按钮" prop="field115">
            <el-button type="primary" icon="el-icon-search" size="medium"> 主要按钮 </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="按钮" prop="field117">
            <el-button type="primary" icon="el-icon-search" size="medium"> 主要按钮 </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-row>
            <el-col :span="6">
              <el-form-item label="评分" prop="field118">
                <el-rate v-model="formData.field118" :max='5'></el-rate>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="颜色选择" prop="field119" required>
                <el-color-picker v-model="formData.field119" size="medium"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上传" prop="field121" required>
                <el-upload ref="field121" :file-list="field121fileList" :action="field121Action"
                  :before-upload="field121BeforeUpload">
                  <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="级联选择" prop="field110">
                <el-cascader v-model="formData.field110" :options="field110Options" :props="field110Props"
                  :style="{width: '100%'}" placeholder="请选择级联选择" clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="编辑器" prop="field111">
                <tinymce v-model="formData.field111" placeholder="请输入编辑器" :height="300"></tinymce>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-row>
            <el-col :span="24">
              <el-form-item label="表格[开发中]" prop="field103"> null </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        field112: undefined,
        field114: undefined,
        field115: undefined,
        field117: undefined,
        field118: 0,
        field119: null,
        field121: null,
        field110: [],
        field111: null,
        field103: undefined,
      },
      rules: {
        field118: [{
          required: true,
          message: '评分不能为空',
          trigger: 'change'
        }],
        field110: [{
          required: true,
          type: 'array',
          message: '请至少选择一个级联选择',
          trigger: 'change'
        }],
        field111: [{
          required: true,
          message: '请输入编辑器',
          trigger: 'blur'
        }],
      },
      field121Action: 'https://jsonplaceholder.typicode.com/posts/',
      field121fileList: [],
      field110Options: [],
      field110Props: {
        "multiple": false,
        "label": "label",
        "value": "value",
        "children": "children"
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getField110Options()
  },
  mounted() {},
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    field121BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2
      if (!isRightSize) {
        this.$message.error('文件大小超过 2MB')
      }
      return isRightSize
    },
    getField110Options() {
      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
      this.$axios({
        method: 'get',
        url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList'
      }).then(resp => {
        var {
          data
        } = resp
        this.field110Options = data.list
      })
    },
  }
}

</script>
<style>
.el-rate {
  display: inline-block;
  vertical-align: text-top;
}

.el-upload__tip {
  line-height: 1.2;
}

</style>
`
}
//数组转换成键值对，根据传入key
export const arrToObjByKey = (arr,key) => {
    if(!arr){
      return {};
    }
    if(!(arr instanceof Array)){
      return {};
    }
    let obj = {};
    arr.forEach(item=>{
      obj[item[key]] = item;
    });
    return obj;
}

//根据经纬度计算两个点之间的距离
export const getDistance = (lat1, lng1, lat2, lng2) => {
  var radLat1 = lat1*Math.PI / 180.0;
  var radLat2 = lat2*Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
  Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
  s = s *6378.137 ;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}