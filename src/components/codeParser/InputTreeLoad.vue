<template>
  <div>
    <avue-input-tree ref="inputTree"
              :placeholder="placeholder" v-model="value"
              type="tree" lazy :treeLoad="treeLoad" :disabled="disabled" @change="change" @focus="focusFunc" :dic="selectedData" :style="{width: '100%'}"></avue-input-tree>
  </div>
</template>

<script>
import { getLowerCompanies, getCompanyInfo } from '@/api/organization/company';
import { getLowerDepartment, getDepartmentInfo } from '@/api/organization/department';
import { FormatTree,organizeFormatTree } from '@/utils/index';
export default {
  data() {
    return {
      selectedData: [],
      selected: "",
      isFocus: false,
      focusNum:0,
      treeNode: '',
      treeResolve:''
    }
  },
  props: {
    __type__: {
      type: String,
      default:''
    },
    placeholder: {
      type: String,
      default:''
    },
    value: {
      type: String,
      default:''
    },
    dic: {
      type: Object,
    },
    index: {
      type: String || Number || Object
    },
    bindTable: {
      type: String,
      default: ""
    },
    conf: {
      type:Object
    },
    disabled: {
      type: Boolean
    }
  },    
  watch: {
    value: {
      handler: function (newVal) {
        if (newVal && !this.isFocus) {
          if (this.__type__ === 'company') {
            this.getCompanyInfo(newVal)
          } else if (this.__type__ === 'department') {
            this.getDepartmentInfo(newVal)
          }
        }
      },
      immediate:true
    },
  },
  methods: {
    change(data) {
      if(!data) return
      this.$emit('input', data)
      this.$emit('change', data)
      this.$emit("changeTableTreeLoadData", {
        index: this.index,
        value: data,
        bindTable: this.bindTable,
        __vModel__: this.conf?.__vModel__ || '',
        bindTableField: this.conf?.__config__?.bindTableField,
      });
    },
    async treeLoad(node, resolve) {
      if (this.dic && !this.isFocus) {
        this.treeNode = node
        this.treeResolve = resolve
        this.selectedData = this.dic
      } else {
        if (this.__type__ === 'company') {
          const id = this.focusNum === 1 ? 0 : (node?.data?.value || 0)
          let res = await getLowerCompanies(id)
            if (res.data.success) {
              if (id) {
                resolve(FormatTree(
                  res.data.data,
                  'F_CompanyId',
                  'F_FullName',
                  null,
                  0
                ));
              } else {
                this.selectedData = FormatTree(
                  res.data.data,
                  'F_CompanyId',
                  'F_FullName',
                  null,
                  0
                );
              }
          } 
        } else if (this.__type__ === 'department') {
          const id = this.focusNum === 1 ? 0 : (node?.data?.label || 0)
          if (id) {
          const companyId = node.data.companyId
          const departmentId = node.data.value || 0
          if (departmentId) {
            let res = await getLowerDepartment(companyId, departmentId)
            resolve(organizeFormatTree(res.data.data,'F_DepartmentId','F_FullName',null,1,'F_CompanyId'))
          } else {
            let [res1, res2] = await Promise.all([getLowerDepartment(companyId, departmentId), getLowerCompanies(companyId)])
            let departmentsData = []
            let companiesData = []
            let resolveData = []
            if (res1.data.success) {
              departmentsData = res1.data.data
            }
            if (res2.data.success) {
              companiesData = res2.data.data
            }
            let hasDepartmentData = !!departmentsData.length
            let hasCompaniesData = !!companiesData.length
            if (hasDepartmentData && hasCompaniesData) {
              resolveData = [...departmentsData, ...companiesData]
            } else if (!hasDepartmentData && hasCompaniesData) {
              resolveData = companiesData
            } else if (hasDepartmentData && !hasCompaniesData) {
              resolveData = departmentsData
            }
            resolve(organizeFormatTree(resolveData,'F_DepartmentId','F_FullName',null,1,'F_CompanyId'));
          }
        } else {
          let res = await getLowerCompanies(0);
          if (res.data.success) {
              this.selectedData = organizeFormatTree(res.data.data,'F_DepartmentId','F_FullName',null,1,'F_CompanyId');
          }
        }
        }
        this.focusNum ++
      }
    },
    focusFunc() {
      this.focusNum++
      this.isFocus = true
      if(this.focusNum===1)this.treeLoad(this.treeNode,this.treeResolve)
    },
    async getCompanyInfo(id) {
      const res = await getCompanyInfo(id)
      if (res.data.data) {
        this.selectedData = [{ label: res.data.data.fullName, value: id }]
      }
    },
    async getDepartmentInfo(id) {
      const res = await getDepartmentInfo(id)
      if (res.data.data) {
        this.selectedData = [{ label: res.data.data.fullName, value: id }]
      }
    }
  }
}
</script>

<style>

</style>