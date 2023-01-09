# 计算组件示例
在我们使用代码生成器生成页面之后，如果需要使用子表财务组件与主表关联计算，以下就是如何配置的示例
## 关键点

### 第一. 添加引入
- 引入财务组件
```js
  import AvueFinance from "@/views/CalculationComponentExample/auxiliary/Finance";//财务组件
  export default {
     components: {
      AvueFinance
    },
  }
```
- 引入财务组件mixin
```js
   import finaceMixin from "@/views/CalculationComponentExample/auxiliary/finace"; // 财务组件计算Mixin
  export default {
     mixins: [finaceMixin],
     data() {
        return {
          reRenderSubformKey: 0,
        }
     }
  }
```

### 第二. 主表财务组件，需要修改watch,触发自己的关联组件的计算
```js
  watch: {
    'formData.field101800c': function(val, oldVal) {//field101800c 为主表财务组件字段名
      this.updateRelativeComObject(101);//101 为主表财务组件formId
    },
  },
```
### 第三. 子表中添加财务组件，修改配置
1. 有子表的情况下，data中添加`{reRenderSubformKey：0}` 
  template中，对应子表处 添加 ` :key="reRenderSubformKey"`  
  像这样` <avue-form ...    :key="reRenderSubformKey">`

2. 需要在对应的子表option添加finaceFormIdList（财务组件formId集合），对应的column中，修改插槽`formslot: true`

3. 子表中，在新增，或者删除的时候，要更新整个子表数据（修改对应的子表option配置中的rowadd，rowdel中方法）

4. 在template中添加，对应子表插槽，注意formId和子表字段名
      ```html
      <template>
      <avue-form ...>
        <!-- 添加开始 -->
        <template slot-scope="{row}" slot="对应的子表字段名">
          <AvueFinance :index="row.$index" v-model="row['对应的子表字段名']" :formId=对应的formId
            :conf='getTableItemConfConfig(对应的formId)' @changeTableFinaceData='changeTableFinaceData'
          >
          </AvueFinance>
        </template>
        <!-- 添加结束 -->
      </avue-form>
      </template>
     ```
5. 在config文件formFieldsMap中，添加对应的formId需要的数据，主要信息有
```json
{
  [
  对应的formId,
    {
      bindTable,//表名
      __vModel__,//字段名
      parentFormId, //父表组件的formId （对应页面中options后的数字）
      computationalConfiguration,//计算式配置
      relativeComObject,//添加关联关系 （（当我发生变化的时候，要触发[formId]的值的变更））
    }
  ]
}
```

## 举例配置主子表财务组件

### 举例一：子表中：含税单价=单价 +（单价*税率）
含税单价 【formId 110】
单价 【formId 104】
税率 【formId 106】
#### 修改计算式配置：config中的关联配置 [CalculationComponentExampleConfig.js]
打开CalculationComponentExampleConfig.js，formFieldsMap中，

1. 找到含税单价 【formId 110】，没有就自己添加
```json
{
  [110, {
    "parentFormId":103,
    "__vModel__": "field11049f8",
    "computationalConfiguration": [{
    "name": "单价",
    "id": 104,
    "type": "finance",
    "formId": 104  //单价组件的formId
      }, {
        "name": "+",//运算符
        "id": "1",
        "type": "operation",
        "formId": 0
      }, {
        "name": "(",//运算符
        "id": "5",
        "type": "operation",
        "formId": 0
      }, {
        "name": "单价",
        "id": 104,
        "type": "finance",
        "formId": 104//单价组件的formId
      }, {
        "name": "*",//运算符
        "id": "3",
        "type": "operation",
        "formId": 0
      }, {
        "name": "税率",
        "id": 106,
        "type": "finance",
        "formId": 106 //税率组件的formId
      }, {
        "name": ")",//运算符
        "id": "6",
        "type": "operation",
        "formId": 0
      }],
    "bindTable": "table18607",
    "relativeComObject":null
  }]
}
```
2. 找到单价 【formId 104】，没有就自己添加
```json
[104, {
  "parentFormId":103,
  "__vModel__": "field1040f1a",
  "computationalConfiguration": [],
  "computationalConfigurationValue": "",
  "relativeComObject": [110],
  "bindTable": "table18607",
}]
```
3. 找到税率 【formId 106】，没有就自己添加
```json
[106, {
  "parentFormId":103,
  "__vModel__": "field106d611",
  "computationalConfiguration": [],
  "computationalConfigurationValue": "",
  "relativeComObject": [110], // 添加关联关系 （当106发生变化的时候，要触发110的值的变更）
  "bindTable": "table18607",
}]
```
#### 修改子表财务组件

```js
option103() {
      return {
        ...
        column: [{
          ...
          finaceFormIdList: [110,104,106 ],
          children: {
            align: 'center',
            headerAlign: 'center',
            rowAdd: (done) => {
              done({});
              // 添加 start
              if (typeof this.updateSubTableRelativeComObject === 'function') {
                this.updateSubTableRelativeComObject(103);//子表formId
                this.reRenderSubformKey++;
              }
               // 添加 end
            },
            rowDel: (row, done) => {
              done();
              // 添加 start
              if (typeof this.updateSubTableRelativeComObject === 'function') {
                this.updateSubTableRelativeComObject(103);//子表formId
              }
               // 添加 end
              this.reRenderSubform = false; //更新组件 index
              setTimeout(() => {
                this.reRenderSubform = true;
                this.reRenderSubformKey++;
              }, 0);
            },
            column: this.getAuthorityTableChildrenList('table18607', [{
              label: this.$t('单价'),
              prop: 'field1040f1a',
              ...
              formslot: true,// 修改为true 添加插槽
              ...
            }, {
              label: this.$t('含税单价'),
              ...
              formslot: true,// 修改为true 添加插槽
              ...
            },....,
            {
              label: this.$t('税率'),
              prop: 'field112e349',
              value: 0,
              type: 'finance',
              width: null,
              placeholder: '请输入税率',
               ...
              formslot: true,// 修改为true 添加插槽
              ...,
            } ])
          }
        }, ],
      }
    },
```
#### 添加含税单价插槽

含税单价 【formId 110】
字段为：field11049f8
```html
<template>
<avue-form ...    :key="reRenderSubformKey">
  <!-- 添加开始 -->
  <template slot-scope="{row}" slot="field11049f8">
    <AvueFinance :index="row.$index" v-model="row['field11049f8']" :formId=110
      :conf='getTableItemConfConfig(110)' @changeTableFinaceData='changeTableFinaceData'
      >
    </AvueFinance>
  </template>
  <!-- 添加结束 -->
</avue-form>
</template>
```

#### 添加单价组件插槽

单价 【formId 104】
字段为：field1040f1a
```html
<template>
<avue-form ...>
  <!-- 添加开始 -->
  <template slot-scope="{row}" slot="field1040f1a">
    <AvueFinance :index="row.$index" v-model="row['field1040f1a']" :formId=104
      :conf='getTableItemConfConfig(104)' @changeTableFinaceData='changeTableFinaceData'
      >
    </AvueFinance>
  </template>
  <!-- 添加结束 -->
</avue-form>
</template>
```


#### 添加税率组件插槽

税率 【formId 106】
字段为：field106d611
```html
<template>
<avue-form ...>
  <!-- 添加开始 -->
  <template slot-scope="{row}" slot="field106d611">
    <AvueFinance :index="row.$index" v-model="row['field106d611']" :formId=106
      :conf='getTableItemConfConfig(106)' @changeTableFinaceData='changeTableFinaceData'
    >
    </AvueFinance>
  </template>
  <!-- 添加结束 -->
</avue-form>
</template>
```



### 举例二：子表中：金额=单价*数量
金额 【formId 109】  field109d6db
单价 【formId 104】
数量 【formId 105】 field1059dbf
#### 修改计算式配置：config中的关联配置 [CalculationComponentExampleConfig.js]
打开CalculationComponentExampleConfig.js，formFieldsMap中，

1. 找到金额 【formId 109】，没有就自己添加
```json
{
  [109, {
    "parentFormId":103,
    "__vModel__": "field109d6db",
    "computationalConfiguration": [{
    "name": "单价",
    "id": 104,
    "type": "finance",
    "formId": 104  //单价组件的formId
      },{
        "name": "*",//运算符
        "id": "3",
        "type": "operation",
        "formId": 0
      }, {
        "name": "数量",
        "id": 105,
        "type": "finance",
        "formId": 105 //数量组件的formId
      }],
    "bindTable": "table18607",
    "relativeComObject":null
  }]
}
```
2. 找到单价 【formId 104】，没有就自己添加
```json
[104, {
  "parentFormId":103,
  "__vModel__": "field1040f1a",
  "computationalConfiguration": [],
  "computationalConfigurationValue": "",
  "relativeComObject": [110,109],
  "bindTable": "table18607",
}]
```
3. 找到数量 【formId 105】，没有就自己添加
```json
[106, {
  "parentFormId":103,
  "__vModel__": "field106d611",
  "computationalConfiguration": [],
  "computationalConfigurationValue": "",
  "relativeComObject": [110,109], // 添加关联关系
  "bindTable": "table18607",
}]
```
#### 修改子表财务组件

```js
option103() {
      return {
        ...
        column: [{
          ...
          finaceFormIdList: [110,104,106,111,105,109 ],//子表中财务组件formId集合
          children: {
            align: 'center',
            headerAlign: 'center',
            rowAdd: (done) => {
              done({});
              // 添加 start
              if (typeof this.updateSubTableRelativeComObject === 'function') {
                this.updateSubTableRelativeComObject(103);//子表formId
                this.reRenderSubformKey++;
              }
               // 添加 end
            },
            rowDel: (row, done) => {
              done();
              // 添加 start
              if (typeof this.updateSubTableRelativeComObject === 'function') {
                this.updateSubTableRelativeComObject(103);//子表formId
              }
               // 添加 end
              this.reRenderSubform = false; //更新组件 index
              setTimeout(() => {
                this.reRenderSubform = true;
                this.reRenderSubformKey++;
              }, 0);
            },
            column: this.getAuthorityTableChildrenList('table18607', [{
              label: this.$t('金额'),
              ...
              formslot: true,// 修改为true 添加插槽
              ...
            }, {
              label: this.$t('单价'),
              ...
              formslot: true,// 修改为true 添加插槽
              ...
            },{
              label: this.$t('数量'),
              ...
              formslot: true,// 修改为true 添加插槽
              ...
            },...., ])
          }
        }, ],
      }
    },
```
#### 添加含税单价插槽

金额 【formId 109】
字段为：field109d6db
```html
<template>
<avue-form ...    :key="reRenderSubformKey">
  <!-- 添加开始 -->
  <template slot-scope="{row}" slot="field109d6db">
    <AvueFinance :index="row.$index" v-model="row['field109d6db']" :formId=109
      :conf='getTableItemConfConfig(109)' @changeTableFinaceData='changeTableFinaceData'
      >
    </AvueFinance>
  </template>
  <!-- 添加结束 -->
</avue-form>
</template>
```

#### 添加单价组件插槽

单价 【formId 104】
字段为：field1040f1a
```html
<template>
<avue-form ...>
  <!-- 添加开始 -->
  <template slot-scope="{row}" slot="field1040f1a">
    <AvueFinance :index="row.$index" v-model="row['field1040f1a']" :formId=104
      :conf='getTableItemConfConfig(104)' @changeTableFinaceData='changeTableFinaceData'
      >
    </AvueFinance>
  </template>
  <!-- 添加结束 -->
</avue-form>
</template>
```


#### 添加数量组件插槽
数量 【formId 105】 
字段为：field1059dbf
```html
<template>
<avue-form ...>
  <!-- 添加开始 -->
  <template slot-scope="{row}" slot="field1059dbf">
    <AvueFinance :index="row.$index" v-model="row['field1059dbf']" :formId=105
      :conf='getTableItemConfConfig(105)' @changeTableFinaceData='changeTableFinaceData'
    >
    </AvueFinance>
  </template>
  <!-- 添加结束 -->
</avue-form>
</template>
```

### 举例三：子表中：含税金额=金额+（金额*税率）
含税金额 【formId 111】 field111669b
金额 【formId 109】  field109d6db
税率 【formId 106】 field106d611
#### 修改计算式配置：config中的关联配置 [CalculationComponentExampleConfig.js]
打开CalculationComponentExampleConfig.js，formFieldsMap中，

1. 找到 含税金额 【formId 111】，没有就自己添加 computationalConfiguration
```json
{
  [111, {
    "parentFormId":103,
    "__vModel__": "field111669b",
    "computationalConfiguration": [{
    "name": "金额",
    "id": 109,
    "type": "finance",
    "formId": 109  //金额组件的formId
      }, {
        "name": "+",//运算符
        "id": "1",
        "type": "operation",
        "formId": 0
      }, {
        "name": "(",//运算符
        "id": "5",
        "type": "operation",
        "formId": 0
      }, {
        "name": "金额",
        "id": 109,
        "type": "finance",
        "formId": 109//金额组件的formId
      }, {
        "name": "*",//运算符
        "id": "3",
        "type": "operation",
        "formId": 0
      }, {
        "name": "税率",
        "id": 106,
        "type": "finance",
        "formId": 106 //税率组件的formId
      }, {
        "name": ")",//运算符
        "id": "6",
        "type": "operation",
        "formId": 0
      }],
    "bindTable": "table18607",
    "relativeComObject":null
  }]
}
```
2. 找到金额 【formId 109】，没有就自己添加relativeComObject
```json
[109, {
  "parentFormId":103,
  "__vModel__": "field109d6db",
  "computationalConfiguration": [],
  "computationalConfigurationValue": "",
  "relativeComObject": [111],
  "bindTable": "table18607",
}]
```
3. 找到税率 【formId 106】，没有就自己添加relativeComObject
```json
[106, {
  "parentFormId":103,
  "__vModel__": "field106d611",
  "computationalConfiguration": [],
  "computationalConfigurationValue": "",
  "relativeComObject": [111],
  "bindTable": "table18607",
}]
```
#### 修改子表财务组件

```js
//同上面的举例
```
#### 添加含税单价插槽
```js
//同上面的举例
```

#### 添加金额组件插槽
```js
//同上面的举例
```
#### 添加税率组件插槽
```js
//同上面的举例
```

### 举例四：主表中：成交金额=总和（子表含税金额）-（优惠金额*优惠折扣）

成交金额 【formId 101】
含税金额 【formId 111】
优惠金额 【formId 102】
优惠折扣 【formId 107】

#### 修改计算式配置：config中的关联配置 [CalculationComponentExampleConfig.js]
打开CalculationComponentExampleConfig.js，formFieldsMap中，
1. 找到成交金额 【formId 101】，没有就自己添加
```json
{
  [101, {
          "__vModel__": "field101800c",
            "computationalConfiguration": [{
            "name": "含税金额",
            "id": 111,
            "type": "finance",
            "formId": 111,//含税金额formId
            "OperationType": "sum",//操作参数 sum 为总和
            "parentFormId": 103 //主表formId
          }, {
            "name": "-",
            "id": "2",
            "type": "operation",
            "formId": 0
          }, {
            "name": "(",
            "id": "5",
            "type": "operation",
            "formId": 0
          }, {
            "name": "优惠金额",
            "id": 102,
            "type": "finance",
            "formId": 102
          }, {
            "name": "*",
            "id": "3",
            "type": "operation",
            "formId": 0
          }, {
            "name": "优惠折扣",
            "id": 107,
            "type": "finance",
            "formId": 107
          }, {
            "name": ")",
            "id": "6",
            "type": "operation",
            "formId": 0
          }],
        }],
}
```

2. 找到含税金额 【formId 111】，relativeComObject 没有就自己添加
```json
[111, {
  "parentFormId":103,
  "__vModel__": "field111669b",
  "computationalConfiguration": [],
  "computationalConfigurationValue": "",
  "relativeComObject": [101],
  "bindTable": "table18607",
}]
```
3. 找到优惠金额 【formId 102】，relativeComObject 没有就自己添加
```json
[102, {
  "__vModel__": "field10260ca",
  "computationalConfiguration": [],
  "computationalConfigurationValue": "",
  "relativeComObject": [101],
}]
```
4. 找到优惠折扣 【formId 107】，relativeComObject 没有就自己添加
```json
[107, {
  "__vModel__": "field107f8cb",
  "computationalConfiguration": [],
  "computationalConfigurationValue": "",
  "relativeComObject": [101],
}]
```

#### 修改主表watch

```js
  watch: {
    'formData.field101800c': function(val, oldVal) {
      this.updateRelativeComObject(101);//成交金额 
    },
    'formData.field107f8cb': function(val, oldVal) {
      this.updateRelativeComObject(107);//优惠折扣
    },
    'formData.field10260ca': function(val, oldVal) {
      this.updateRelativeComObject(102);//优惠金额
    },
  },
```

#### 添加含税金额组件插槽

含税金额 【formId 111】
字段为：field111669b
```html
<template>
<avue-form ...>
  <!-- 添加开始 -->
  <template slot-scope="{row}" slot="field111669b">
    <AvueFinance :index="row.$index" v-model="row['field111669b']" :formId=111
      :conf='getTableItemConfConfig(111)' @changeTableFinaceData='changeTableFinaceData'
    >
    </AvueFinance>
  </template>
  <!-- 添加结束 -->
</avue-form>
</template>
```

#### 修改子表财务组件
含税金额 【formId 111】
```js
option103() {
      return {
        ...
        column: [{
          ...
          finaceFormIdList: [110,104,106,111 ],
          children: {
            align: 'center',
            headerAlign: 'center',
            rowAdd: (done) => {
              done({});
              // 添加 start
              if (typeof this.updateSubTableRelativeComObject === 'function') {
                this.updateSubTableRelativeComObject(103);//子表formId
                this.reRenderSubformKey++;
              }
               // 添加 end
            },
            rowDel: (row, done) => {
              done();
              // 添加 start
              if (typeof this.updateSubTableRelativeComObject === 'function') {
                this.updateSubTableRelativeComObject(103);//子表formId
              }
               // 添加 end
              this.reRenderSubform = false; //更新组件 index
              setTimeout(() => {
                this.reRenderSubform = true;
                this.reRenderSubformKey++;
              }, 0);
            },
            column: this.getAuthorityTableChildrenList('table18607', [
             ...
             {
              label: this.$t('含税金额'),
              ...
              formslot: true,// 修改为true 添加插槽
              ...
            },.... ])
          }
        }, ],
      }
    },
```
