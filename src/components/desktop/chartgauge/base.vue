<template>
  <div>
    <el-form-item :label="$t('BI.components.pictorialbar.labelIcon')">
        <l-input-icon :iconList="iconList"  v-model="config.icon" >
        </l-input-icon>
    </el-form-item>
    <el-form-item :label="$t('workFlow.zh.topic')">
        <l-select :options="options"  v-model="config.theme" >
        </l-select>
    </el-form-item>
    <el-form-item :label="$t('jumpFunction')">
        <l-tree-select :options="modulesTree"  v-model="config.moduleId" >
        </l-tree-select>
    </el-form-item>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    props: ['data'],
    data () {
        return {
            options:[{value:0,label:this.$t('topic1')},{value:1,label:this.$t('topic2')},{value:2,label:this.$t('topic3')},{value:3,label:this.$t('topic4')}]
        }
    },
    computed:{
        config(){
            return this.data
        },
        iconList(){
            if(this.lr_icons){
                return this.lr_icons
            }
            else{
                return []
            }
        },
        ...mapGetters(["modules"]),
        myModules(){
            if(this.loginInfo.f_SecurityLevel == 1){
                return this.modules.filter(t=>t.f_EnabledMark == 1)
            }
            return this.modules.filter(item =>{
                if(item.f_EnabledMark == 1){
                    const moduleAuthIds = this.loginInfo.moduleAuthIds || []
                    if(moduleAuthIds.indexOf(item.f_ModuleId) > -1){
                        return true
                    }
                    else{
                        return false
                    }
                }
                else{
                    return false
                }
            })
        },
        modulesTree(){
            // TODO 这里可以使用我们缓存得菜单
            return [];
            // const res = this.$toTree(this.myModules,"f_ModuleId","f_ParentId","f_ModuleId","f_FullName")
            // return res.filter(t=>t.f_ParentId == '0')
        }
    }
}
</script>

