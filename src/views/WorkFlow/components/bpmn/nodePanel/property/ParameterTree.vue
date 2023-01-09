<template>
  <div>
    <el-select
      v-model="obj[mainLabelKey]"
      placeholder=""
      @change="changeOptions"
      clearable
    >
      <div v-for="(item, index) in data" :key="index">
        <div class="el-tree-node__content">
          <span
            :class="item.show?'expanded':''"
            class="el-tree-node__expand-icon el-icon-caret-right"
           @click="show(index,-1)"></span>
          <span class="el-tree-node__label">{{ item[mainLabelKey] }}</span>
        </div>
        <div v-show="item.show">
          <div v-if="item.isOptionsTree">
          <el-option
            v-for="(subItem, subIndex) in item.children"
            :key="subIndex"
            :value="subItem[mainValueKey]"
            :label="subItem[mainLabelKey]"
            class="tree-li"
            :class="
              subItem[mainValueKey] == obj[mainValueKey] ? 'selected' : ''
            "
          ></el-option>
        </div>
        <div v-else>
          <div v-for="(item2, index2) in item.children" :key="index2">
              <div  v-if="item2.children&&item2.children.length>0">
                <div class="el-tree-node__content tree-li-sub" style="margin-left:20px;">
                <span
                class="el-tree-node__expand-icon el-icon-caret-right"
                :class="item2.show?'expanded':''"
                @click="show(index,index2)"></span>
                <span class="el-tree-node__label">{{ item2[mainLabelKey] }}</span>
              </div>
              </div>
              <div v-else>
                <el-option
                  :value="item2[mainValueKey]"
                  :label="item2[mainLabelKey]"
                  class="tree-li-sub-li"
                  :class="
                    item2[mainValueKey] == obj[mainValueKey] ? 'selected' : ''
                  "
                ></el-option>
              </div>
            <div v-show="item2.show">
            <div v-if="item2.isOptionsTree&&item2.children&&item2.children.length>0">
              <div v-for="(subItem2, subIndex2) in item2.children"
                :key="subIndex2">
                  <templete v-if="subItem2.children&&subItem2.children.length>0">
                    
                    <div style="margin-left:20px;">
                      <div class="el-tree-node__content tree-li-sub">
                        <span
                          class="el-tree-node__expand-icon el-icon-caret-right expanded"></span>
                        <span class="el-tree-node__label">{{ subItem2[mainLabelKey] }}</span>
                      </div>
                        <el-option
                        v-for="(subItem3, subIndex3) in subItem2.children"
                          :key="subIndex3"
                          :value="subItem3[mainValueKey]"
                          :label="subItem3[mainLabelKey]"
                          class="tree-li-sub-li"
                          :class="
                            subItem3[mainValueKey] == obj[mainValueKey] ? subItem3[mainValueKey]+' selected' : ''
                          "
                        ></el-option>
                    </div>

                  </templete>
                  <div v-else style="margin-left:20px;">
                    <el-option
                      :value="subItem2[mainValueKey]"
                      :label="subItem2[mainLabelKey]"
                      class="tree-li-sub-li"
                      :class="
                        subItem2[mainValueKey] == obj[mainValueKey] ? ' selected' : ''
                      "
                    ></el-option>
                  </div>
              </div>
              
            </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    value: {
      type: Object,
      default: () => {
        return { id: "" };
      }
    },
    mainValueKey: {
      type: String,
      default: () => {
        return "value";
      }
    },
    mainLabelKey: {
      type: String,
      default: () => {
        return "label";
      }
    }
  },
  data() {
    return {
      obj: {
        label: "",
        id: ""
      },
      defaultObj: {},
      data: [],
      dataMap: new Map()
    };
  },
  created() {
    this.defaultObj[this.mainValueKey] = "";
    this.defaultObj[this.mainLabelKey] = "";
    this.obj = { ...this.defaultObj, ...this.value };
    this.data = [];
    if (this.list && this.list.length > 0) {
      this.list.forEach(ele => {
        let tempJson = {
          ...this.getItem(ele),
          isOptionsTree: false,
          children: [],
          show:true
        };
        if (ele.children && ele.children.length > 0) {
          ele.children.forEach(ele2 => {
            if (ele2.children) {
              tempJson.isOptionsTree = false;
              let temp = {
                isOptionsTree: true,
                ...this.getItem(ele2),
                children: [],
                show:true
              };
              if (ele2.children.length > 0) {
                ele2.children.forEach(ele3 => {
                  if(ele3.children&&ele3.children.length>0){
                     ele3.children.forEach(ele4 => {
                      this.dataMap.set(ele4[this.mainValueKey], ele4);
                     })
                  }
                  temp.children.push({
                    ...this.getItem(ele3)
                  });
                });
              }
              tempJson.children.push(temp);
            } else {
              tempJson.isOptionsTree = true;
              tempJson.children.push({
                ...this.getItem(ele2)
              });
            }
          });
        }
        this.data.push(tempJson);
      });
    }
  },
  methods: {
    getItem(ele) {
      let temp = {
        ...ele,
        id: ele[this.mainValueKey],
        label: ele[this.mainLabelKey]
      };
      this.dataMap.set(ele[this.mainValueKey], temp);
      return temp;
    },
    changeOptions(value) {
      let id = value;
       let obj = this.dataMap.get(id) ? this.dataMap.get(id) : this.defaultObj;
      this.obj = {...this.obj,...obj} ;
      this.$emit("input", this.obj);
    },
    show(index,index2){
      if(index2>-1){
        this.data[index].children[index2].show = !this.data[index].children[index2].show
      }else{
        this.data[index].show = !this.data[index].show
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tree-node__label{
  font-size: 12px !important;
}
.tree-li {
  padding-left: 20px !important;
}
.tree-li-sub{
   padding-left: 20px !important;
}
.tree-li-sub-li{
   padding-left: 40px !important;
}
</style>
