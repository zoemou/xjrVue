import { getAllCompanies } from "@/api/organization/company";
import { getProvinceTree, getAreasChild } from "@/api/systemManagement/area";
import { getCompanyDepartments } from "@/api/organization/department";
import { getOptions } from "@/util/dataApi";
import SearchBox from "@/components/search/Search.vue";
export default {
  components: {
    SearchBox,
  },
  data() {
    return {
      searchParamsList: [],
      showSearchBox: false,
      searchParam: {},
      searchBtns: [],
      clientWidth: 0,
      wrap: false
    };
  },
  watch: {
    page: {
      handler(val) {
        //如果page不存在用户得手动刷新页面才能更新布局
        this.$nextTick(() => { this.changeBodyHeight(); })
      },
      deep: true
    },
    searchParamsList: {
      handler(val) {
        this.$nextTick(() => {
          if (val?.length > 0) this.changeBodyHeight();
        })
      },
      deep: true
    }
  },
  mounted() {
    window.addEventListener('resize', () => { // 定义窗口大小变更通知事件
      this.changeBodyHeight();
    });
  },
  methods: {
    changeBodyHeight() {
      //根据组件高度重新计算table高度，超出出现滚动条
      var search = document.getElementsByClassName('search-box')[0] ||
        document.getElementsByClassName('searchBox')[0] ||
        document.getElementsByClassName('search-container')[0];

      let table = document.getElementsByClassName("main-table-content");


      //table[0].style.height="100%";
      if (table[0] === undefined) {
        setTimeout(() => {
          this.changeBodyHeight();
        }, 200)
        return;
      }
      if (search) {
        //初始化样式
        search.style.position = "absolute";
        search.style.padding = "0";
      }

      let clientWidth = table[0]?.offsetWidth || 0;
      let searchWidth = search?.offsetWidth || 0;
      let btnWidth = document.getElementsByClassName('avue-crud__left')[0]?.offsetWidth || 0;

      if (clientWidth >= (searchWidth + btnWidth)) {
        if (table[0]) table[0].style.height = "100%";
      } else {
        //重新设置样式
        search.style.position = "static";
        search.style.padding = "6px 20px 0 5px";
        if (table[0]) table[0].style.height = `calc(100% - ${search.offsetHeight}px)`;
      }

      setTimeout(() => {
        let page = document.getElementsByClassName("avue-crud__pagination")
        let conTable = document.getElementsByClassName("el-table")
        if (conTable[0]) {
          if (page?.length > 0) {
            if (page[0].children?.length > 0) {
              if (this.option?.header === false) {
                conTable[0].style.height = 'calc(100% - 60px)'
              } else {
                conTable[0].style.height = 'calc(100% - 100px)'
              }
            } else {
              conTable[0].style.height = 'calc(100% - 40px)'
            }
          } else {
            conTable[0].style.height = 'calc(100% - 40px)'
          }
        }
      }, 500)
    },

    searchReset() { },
    searchBoxParams(params) {
      this.searchParam = params;
    },
    changeSearchParams(obj) {
      let searchParam = this.searchParam
      if (obj) {
        searchParam = obj
      }
      let params = {};
      for (let [k, v] of Object.entries(searchParam)) {
        if (v) {
          if (Array.isArray(v)) {
            let startField = k + "_Start";
            let endField = k + "_End";
            if (searchParam[startField] == "" && v.length == 2) {
              params[startField] = v[0];
              params[endField] = v[1];
            } else {
              params[k] = v.join(",");
            }
          } else {
            params[k] = v;
          }
        }
      }
      return params;
    },
    async getCustomSearchList(queryData, fields) {

      this.searchParamsList = await this.changeList(queryData, fields);
      this.showSearchBox = true;
    },
    async getSystemSearchList(querySearchData) {
      this.searchParamsList = await this.changeList(querySearchData);
      this.showSearchBox = true;
    },
    async getWorkflowMenuSearchList(querySearchData) {
      this.searchParamsList = await this.changeList(querySearchData);
      this.showSearchBox = true;
    },
    async changeList(queryData, fields) {
      let list = [];
      let fildsMap = new Map();
      let hasFields = fields && fields.length > 0 ? true : false;
      if (hasFields) {
        fields.forEach((ele) => {
          if (ele.__config__.componentName == "table") {
          } else if (ele.__config__.componentName == "avue-tabs") {
            if (ele.__config__ && ele.__config__.childrenObj) {
              let obj = ele.__config__.childrenObj;
              for (var i in obj) {
                if (obj[i].length > 0) {
                  obj[i].forEach((ele1, cindex) => {
                    if (ele1.__config__.componentName == "table") {
                    } else {
                      if (ele1.__vModel__) {
                        fildsMap.set(ele1.__vModel__, ele1);
                      }
                    }
                  });
                }
              }
            }
          } else {
            if (ele.__vModel__) {
              fildsMap.set(ele.__vModel__, ele);
            }
          }
        });
      }
      if (queryData && queryData.length > 0) {
        for (let ele of queryData) {
          let lgmarkString = "";
          let pickerType = "";
          if (
            ele.lgmark === "" ||
            ele.lgmark === null ||
            ele.lgmark === undefined
          ) {
            lgmarkString = ele.name;
          } else {
            lgmarkString = this.$t(ele.lgmark);
          }
          if (ele.DateField) {
            this.$set(this.searchParam, ele.DateField, null);
            list.push({
              type: "date",
              pickerType,
              field: ele.DateField,
              name: lgmarkString,
            });
          } else {
            if (ele.field) {
              let config = {};
              if (hasFields) {
                if (fildsMap.has(ele.field)) {
                  let val = {};
                  val = fildsMap.get(ele.field);
                  config = { ...val, ...val.__config__ };
                }
              } else {
                config = ele;
              }
              let showField = "F_ItemName";
              let saveField = "F_ItemValue";
              let props = {};
              let checkStrictly = false;
              let showAllLevels = true;
              if (config.dataType) {
                let optionList = [];
                try {
                  optionList = await getOptions(config);

                  if (config.dataType == "dataItem") {
                    showField = "F_ItemName";
                    saveField = "F_ItemValue";
                  }
                  //数据源
                  else if (config.dataType == "dataSource") {
                    showField = config.showField;
                    saveField = config.saveField;
                  }
                  //sql
                  else if (config.dataType == "dataSql") {
                    showField = config.showField;
                    saveField = config.saveField;
                  }
                  //api
                  else if (config.dataType == "dataApi") {
                    showField = config.apiConfig.showField;
                    saveField = config.apiConfig.saveField;
                  }
                  this.$set(this.searchParam, ele.field, null);
                  let multiple = false;
                  let type = "select";
                  if (config.tag == "el-checkbox-group" || config.avueType == "mutiple-popup") {
                    multiple = true;
                  }
                  list.push({
                    type: type,
                    multiple,
                    pickerType,
                    field: ele.field,
                    name: lgmarkString,
                    optionList,
                    showField,
                    saveField,
                    props,
                  });
                } catch (error) { }
              } else {
                let type = "input";
                let selectType = ''
                let optionList = [];
                this.$set(this.searchParam, ele.field, null);
                if (config.tag == "el-time-picker") {
                  type = "time-picker";
                } else if (config.tag == "el-date-picker") {
                  type = "date-picker";
                } else if (config.tag == "xjr-select-user") {
                  type = "select-user";
                } else if (config.tag == "el-switch") {
                  type = "select";
                  optionList = [
                    { F_ItemName: "开", F_ItemValue: "1" },
                    { F_ItemName: "关", F_ItemValue: "0" },
                  ];
                } else if (config.tag == "el-color-picker") {
                  type = "color-picker";
                } else if (config.tag == "avue-select-area") {
                  type = "select-area";
                  props = {
                    lazy: true,
                    checkStrictly: false,
                    lazyLoad(node, resolve) {
                      const { level, value } = node;
                      let nodes = [];
                      if (level == 0) {
                        getProvinceTree().then((res) => {
                          if (
                            res.data &&
                            res.data.data &&
                            res.data.data.length > 0
                          ) {
                            nodes = res.data.data.map((ele) => {
                              ele["value"] = ele.F_AreaId;
                              ele["label"] = ele.F_AreaName;
                              ele["leaf"] = false;
                              return ele;
                            });
                          }
                          resolve(nodes);
                        });
                      } else if (level == 1) {
                        getAreasChild(value).then((res) => {
                          nodes = res.data.data.map((ele) => {
                            ele["value"] = ele.F_AreaId;
                            ele["label"] = ele.F_AreaName;
                            ele["leaf"] = false;
                            return ele;
                          });
                          resolve(nodes);
                        });
                      } else if (level == 2) {
                        getAreasChild(value).then((res) => {
                          nodes = res.data.data.map((ele) => {
                            ele["value"] = ele.F_AreaId;
                            ele["label"] = ele.F_AreaName;
                            ele["leaf"] = true;
                            return ele;
                          });
                          resolve(nodes);
                        });
                      }
                    },
                  };
                } else if (config.__info__ || config.__organize__) {
                  type = "input-tree";
                  let infoType = "";
                  if (config.__info__ && config.infoType) {
                    infoType = config.infoType;
                  } else if (config.__organize__ && !config.__info__ && config.__type__) {
                    infoType = config.__type__;
                  }
                  selectType = infoType
                  if (infoType == "company") {
                    this.$set(this.searchParam, ele.field, "");
                    // let res = await getAllCompanies();

                    // if (res.data.success) {
                    //   if (res.data.data.length > 0) {
                    //     optionList = this.formateDicData(
                    //       res.data.data,
                    //       "F_FullName",
                    //       "F_CompanyId"
                    //     );
                    //   }
                    // }
                  } else if (infoType == "department") {
                    this.$set(this.searchParam, ele.field, "");
                    // let res = await getCompanyDepartments();
                    // if (res.data.success) {
                    //   if (res.data.data.length > 0) {
                    //     optionList = this.formateDicData(
                    //       res.data.data,
                    //       "F_FullName",
                    //       "F_DepartmentId"
                    //     );
                    //   }
                    // }
                  } else if (infoType == "user") {
                    type = "select-user";
                  } else if (infoType == "date") {
                    type = "date-picker";
                  }
                } else if (config.tag == "xjr-cascader") {
                  type = "cascader";
                  optionList = config.settings;
                  checkStrictly = config.checkStrictly;
                  showAllLevels = config['show-all-levels'];
                }
                let format = "yyyy-MM-dd HH:mm:ss";
                let valueFormat = "yyyy-MM-dd HH:mm:ss";
                if (type == "date-picker") {
                  if (config["format"]) format = config["format"];
                  if (config["value-format"]) valueFormat = config["value-format"];
                  pickerType = "daterange";
                  if (config.type == "month") {
                    pickerType = "monthrange";
                  } else if (config.type == "year") {
                    pickerType = "yearrange";
                  } else if (config.type == "datetime") {
                    pickerType = "datetimerange";
                  }
                  this.$set(this.searchParam, ele.field, []);
                  this.$set(this.searchParam, ele.field + "_Start", "");
                  this.$set(this.searchParam, ele.field + "_End", "");
                }
                if (type == "time-picker") {
                  this.$set(this.searchParam, ele.field, ["", ""]);
                  this.$set(this.searchParam, ele.field + "_Start", "");
                  this.$set(this.searchParam, ele.field + "_End", "");
                }
                // 计数器，滑块，评分，财务组件 【数字类型】
                if (config.tag == "el-input-number" ||
                  config.tag == "el-slider" ||
                  config.tag == "el-rate" ||
                  config.isFinance
                ) {
                  type = "input-number";
                }
                list.push({
                  type,
                  field: ele.field,
                  pickerType,
                  format,
                  valueFormat,
                  name: lgmarkString,
                  optionList,
                  checkStrictly,
                  "show-all-levels": showAllLevels,
                  showField,
                  saveField,
                  props,
                  selectType
                });
              }
            }
          }
        }
      }
      return list;
    },
    formateDicData(data, labelKey, valueKey) {
      if (data.length <= 0) {
        return false;
      }
      let dicData = [];
      data.forEach((ele) => {
        let children = [];
        if (ele.children.length > 0) {
          children = this.formateDicData(ele.children, labelKey, valueKey);
        }
        dicData.push({
          label: ele[labelKey],
          value: ele[valueKey],
          disabled: ele[valueKey] ? false : true,
          children: children,
        });
      });
      return dicData;
    },
  },
};
