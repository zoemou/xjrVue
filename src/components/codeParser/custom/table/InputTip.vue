<script>
// 子表单 单行文本
export default {
  props: {
    value: {
      type: String || Number || Object
    },
    placeholder: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: "",
      slot: [],
      popBoxSlot: null,
      showTip: false
    };
  },
  created() {
     this.inputValue = this.value;
    this.getPopBoxSlot();
  },
  watch: {
      value: {
        handler (n, o) {
            this.inputValue = n;
            this.getPopBoxSlot();
        }
      }
    },
  methods: {
    getPopBoxSlot() {
      const listeners = {
        change:(newValue)=>{
          this.$emit("input", newValue);
        }
      };
      const nativeOnListeners = {
        mouseover: () => {
          this.showTip = true;
        },
        mouseout: () => {
          this.showTip = false;
        }
      };
      let defaultSlot = <el-input
            v-model={this.inputValue}
            placeholder={this.placeholder}
            disabled={this.disabled}
            readonly={this.readonly}
            {...{ on: listeners }}
            {...{ nativeOn: nativeOnListeners }}
          >
            {this.slot}
          </el-input>;
        return (
          <el-tooltip
            content={this.inputValue}
            placement="bottom-start"
            popper-class="popper-box"
            disabled={!(this.showTip&&this.inputValue)}
          >
            {defaultSlot}
          </el-tooltip>
        );
    }
  },
  render: function(h) {
    return <div>{this.getPopBoxSlot()}</div>;
  }
};
</script>

<style lang="css" scoped>
</style>
