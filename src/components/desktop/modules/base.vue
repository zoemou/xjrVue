<template>
  <div >
    <el-form-item :label="$t('jumpFunction')">
        <avue-input-tree
          v-model="config.moduleId"
          :placeholder="$t('selectJumpFunction')"
          type="tree"
          :dic="defaultTree"
          size="small"
          style="width: 100%"
		  disabled
        >
        </avue-input-tree>
    </el-form-item>
    <el-form-item :label="$t('sortField')" v-if="config.orderField">
        <l-select
            v-model="config.orderField"
            :options="config.options"
            :placeholder="$t('code.codeStepFour.placeholderSelect')"
            >
        </l-select>
    </el-form-item>
    <el-form-item :label="$t('code.rightPanel.maxRows')">
        <el-input-number v-model="config.maxRows"
            controls-position="right"
            :placeholder="$t('code.leftScrollbar.component.hintEnter')"></el-input-number>
    </el-form-item>
    <el-form-item :label="$t('break-word')">
        <el-switch v-model="config.wrap">
        </el-switch>
    </el-form-item>
  </div>
</template>
<script>
import moduleMixin from '@/components/desktop/mixins/module';
export default {
    props: ['data'],
    inject: ["quickBiDesign"],
	mixins:[moduleMixin],
    data () {
        return {
            
        }
    },
    computed:{
        config(){
            return this.data
        }
    },
    methods:{
        
    },
	mounted(){
		this.getMenuTree('F_SubSystemId')
	}
}
</script>

