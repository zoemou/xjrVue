<template>
    <div>
        <el-form-item :label="$t('showBg')">
            <el-switch v-model="config.showBackground" ></el-switch>
        </el-form-item>
        <el-form-item v-if="config.showBackground" :label="$t('BI.Build.bgColor')">
            <l-input-color v-model="config.backgroundColor"
                            :placeholder="$t('deletePrompt.hinrEnterSpace')"></l-input-color>
        </el-form-item>
        <el-form-item v-show="false">
            <el-input></el-input>
        </el-form-item>
    </div>
</template>
<script>
export default {
    props: ['data'],
    data () {
        return {
        }
    },
    computed:{
        config(){
            return this.data
        },
    }
}
</script>

