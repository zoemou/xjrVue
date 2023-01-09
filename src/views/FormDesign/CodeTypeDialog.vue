<template>
  <div>
    <el-dialog v-dialogDrag
        v-bind="$attrs"
        width="500px"
        :close-on-click-modal="false"
        :append-to-body="true"
        v-on="$listeners"
        @open="onOpen"
        @close="onClose"
    >
      <el-row :gutter="15">
        <el-form
            ref="elForm"
            :model="formData"
            :rules="rules"
            size="medium"
            label-width="100px"
        >
          <el-col :span="24">
            <el-form-item :label="$t('code.leftScrollbar.buildType')" prop="type">
              <el-radio-group v-model="formData.type">
                <el-radio-button
                    v-for="(item, index) in typeOptions"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                >
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="showFileName" :label="$t('code.leftScrollbar.labelFileName')" prop="fileName">
              <el-input v-model="formData.fileName" :placeholder="$t('code.leftScrollbar.placeholderFileName')" clearable/>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div slot="footer">
        <el-button size="mini" @click="close">
          {{$t('buttonModule.modalCancelBtn')}}
        </el-button>
        <el-button size="mini" type="primary" @click="handelConfirm">
          {{$t('buttonModule.modalSureBtn')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: ['showFileName'],
  data () {
    return {
      formData: {
        fileName: undefined,
        type: 'file'
      },
      rules: {
        fileName: [{
          required: true,
          message: this.$t('code.leftScrollbar.placeholderFileName'),
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message:this.$t('code.leftScrollbar.hintTypeNotEmpty'),
          trigger: 'change'
        }]
      },
      typeOptions: [{
        label: this.$t('code.leftScrollbar.page'),
        value: 'file'
      }]  /*{label: '弹窗',value: 'dialog'}*/
    };
  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {
    onOpen () {
      if (this.showFileName) {
        this.formData.fileName = `${+new Date()}.vue`;
      }
    },
    onClose () {
    },
    close (e) {
      this.$emit('update:visible', false);
    },
    handelConfirm () {
      this.$refs.elForm.validate(valid => {
        if (!valid) return;
        this.$emit('confirm', { ...this.formData });
        this.close();
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
