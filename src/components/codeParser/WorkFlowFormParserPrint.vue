<script>
import print from "print-js";
export default {
  name: "FormParserPrint",
  directives: {
    print
  },
  props: {
    vnodes: {
      type: Array
    },
    printType: {
      type: Number,
      default: 1
    },
    borderColor:{
      type:String,
      default:'#7e7e7e'
    }
  },
  render(h) {
    let self = this;
    let listeners = {
      click: function(eventValue) {
        self.printForm("printForm", "自定义表单");
      }
    };
    let printButtonHtml = (
      <el-button
        icon="el-icon-printer"
        size="small"
        class="print-button no-print"
        {...{ on: listeners }}
      >
        打印
      </el-button>
    );

    return (
      <div>
        {printButtonHtml}
        {this.renderBoxHtml()}
      </div>
    );
  },
  methods: {
    renderBoxHtml() {
      let borderColorStyle = `border-color:${this.borderColor};`;
      let classWarpStr = "warp" + this.printType;
      let rowClassStr = "table-row table" + this.printType;
      let titleBoxClass = "title-box title-box" + this.printType;
      let headerTitleHtml = null;
      let vnodeHtml = [];
      this.vnodes.map((info, index) => {
        if (info.componentName) {
          if (info.componentName === "table") {
            let tableHtml = this.renderTable(info.showValue,borderColorStyle);
            vnodeHtml.push(tableHtml);
          }
        } else if (info.tag == "el-divider") {
          vnodeHtml.push("");
        } else {
          if (info.view) {
            let labelStyle = info.labelWidthStyle+borderColorStyle;
            let labelHtml = info.showLabel ? (
              <span class="label-column"  style={labelStyle}>
                {info.label}
              </span>
            ) : (
              ""
            );
            let valueHtml = null;
            if (info.tag == "xjr-opinion-comonent") {
              let opinionHtml = this.renderOpinionComonent(info.showValue);
              valueHtml = <span class="val-column"  style={borderColorStyle}>{opinionHtml}</span>;
            } else if (info.tag == "h2") {
              if (index == 0) {
                headerTitleHtml = (
                  <div class={titleBoxClass}  style={borderColorStyle}>
                    <div class="h2">{info.showValue}</div>
                  </div>
                );
              } else {
                valueHtml = <span class="val-column"  style={borderColorStyle}>{info.showValue}</span>;
              }
            } else if (info.tag == "el-image") {
              valueHtml = (
                <span class="val-column"  style={borderColorStyle}>{this.renderImg(info.showValue)}</span>
              );
            } else if (info.tag == "tinymce") {
              valueHtml = (
                <span class="val-column"  style={borderColorStyle}>{this.renderTinymce(info.showValue)}</span>
              );
            } else {
              let prefixTempHtml = [];
              let afterTempHtml = [];
              if (info.prepend) {
                prefixTempHtml.push(<span>{info.prepend}</span>);
              }
              if (info.append) {
                afterTempHtml.push(<span>{info.append}</span>);
              }
              if (info.prefixIcon) {
                prefixTempHtml.push(<i class={info.prefixIcon}></i>);
              }
              if (info.suffixIcon) {
                afterTempHtml.push(<i class={info.suffixIcon}></i>);
              }

              valueHtml = (
                <span class="val-column" style={borderColorStyle}>
                  {prefixTempHtml} {info.showValue} {afterTempHtml}
                </span>
              );
            }
            if (valueHtml) {
              vnodeHtml.push(
                <el-col span={info.span} class="table-col"  style={borderColorStyle}>
                  {labelHtml}
                  {valueHtml}
                </el-col>
              );
            }
          }
        }
      });
      return (
        <div
          class={classWarpStr}
          class="print-form-box"
          ref="printForm"
          id="printForm"
        >
          {headerTitleHtml}
          <el-row class={rowClassStr} style={borderColorStyle}>{vnodeHtml}</el-row>
        </div>
      );
    },
    renderImg(value) {
      return <img src={value} style="width:200px;margin:10px;heigth:100%" />;
    },
    renderTinymce(value){
      return <div domPropsInnerHTML={value}> </div>;
    },
    renderOpinionComonent(value) {
      let itemTemplate = [];
      if (value && value.length > 0) {
        value.forEach(element => {
          let children = [];
          if (element.esignature) {
            if (element.img_File) {
              children.push(
                <div class="esignature-box">
                  <img src={element.img_File} />
                </div>
              );
            }
          }
          itemTemplate.push(
            <div class="opinion-item">
              <span class="flex left">审批结果：{element.btnValue}</span>
              <span class="flex left">审批意见：{element.message}</span>
              <span class="flex right">{element.createUser}</span>
              <span class="flex right">{element.time}</span>
              {children}
              <div class="hr"></div>
            </div>
          );
        });
      } else {
        itemTemplate.push(
          <div class="opinion-item">
            <span class="flex left placeholder">
              
            </span>
          </div>
        );
      }
      return <div class="opinion-box">{itemTemplate}</div>;
    },
    renderTable(obj,borderColorStyle) {
      if (!obj) {
        return <el-col class="table-col" style={borderColorStyle}></el-col>;
      } else {
        let tableColumnValue = [];
        for (let [k, v] of Object.entries(obj)) {
          let label = v.label;
          let elementHtml = [];
          if (v.data.length > 0) {
            elementHtml.push(<span class="table-val"  style={borderColorStyle}>{label}</span>);
            v.data.forEach(value => {
              if (value) {
                elementHtml.push(<span class="table-val"  style={borderColorStyle}>{value}</span>);
              }
            });
          }
          if (elementHtml.length > 0) {
            tableColumnValue.push(<div class="table-row"  style={borderColorStyle}>{elementHtml}</div>);
          }
        }
        let tableColumnValueHtml = null;
        if (tableColumnValue.length > 0) {
          tableColumnValueHtml = (
            <div class="table-box"  style={borderColorStyle}>{tableColumnValue}</div>
          );
        }
        let labelColumnStyle = 'width:120px;'+borderColorStyle;
        return (
          <el-col class="table-col"  style={borderColorStyle}>
            <span class="label-column"  style={labelColumnStyle}>
              子表单
            </span>
            <span class="val-column"  style={borderColorStyle}>{tableColumnValueHtml}</span>
          </el-col>
        );
      }
    },

    printForm(refName, title) {
      const styleStr =
        `@page { size: auto;margin: 0mm; } ` +
        `
.table-row {
  width: 100%;
  font-size: 16px;
  width: 100%;
  border: none;
  border: none;
  color: #000000;
  margin: 0 !important;
  padding: 0 !important;
}

.table-val-box {
  border: none;
  border-top: 1px solid;
  border-left: 1px solid;
  border-color: #fafafa;
  padding: 4px !important;
  margin: 0 !important;
}
.table-col {
  display: flex;
  padding: 0 !important;
  margin: 0 !important;
  min-height: 50px;
  line-height: 50px;
}
.val-column {
  flex: 1;
  border: none;
  margin: 0 !important;
  padding: 0 0 0 4px !important;
  vertical-align: middle;
}
.label-column {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  margin: 0 !important;
  padding: 0 0 0 4px !important;
}
.h2 {
  font-size: 24px;
}
.table-wrap {
  flex: 1;
}
.title-box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  line-height: 50px;
  padding: 0 !important;
  margin: 0 !important;
}
.title-box1 {
  border: none;
}
.title-box2 {
  border: none;
  border-top: 1px solid ${this.borderColor};
  border-left: 1px solid ${this.borderColor};
  border-right: 1px solid ${this.borderColor};
}
.title-box3 {
  border: none;
  border-top: 1px solid ${this.borderColor};
  border-left: 1px solid ${this.borderColor};
  border-right: 1px solid ${this.borderColor};
}
.title-box4 {
  border: none;
}
.title-box5 {
  border: none;
}
.title-box6 {
  border: none;
}
.warp1 {
  border: none;
}
.warp2 {
  border: none;
  border-top: 1px solid ${this.borderColor};
}
.warp3 {
  border: none;
  border-top: 1px solid ${this.borderColor};
}
.warp4 {
  border: none;
}
.warp5 {
  border: none;
}
.warp6 {
  border: none;
}
.table1 {
  border: none;
  border-top: 1px solid ${this.borderColor};
  border-left: 1px solid ${this.borderColor};
}
.table1 .table-col {
  border-bottom: 1px solid ${this.borderColor};
}
.table1 .val-column,
.table1 .label-column {
  border-right: 1px solid ${this.borderColor};
  text-align: left;
}

.table2 {
  border: none;
  border-top: 1px solid ${this.borderColor};
  border-left: 1px solid ${this.borderColor};
}
.table2 .table-col {
  border-bottom: 1px solid ${this.borderColor};
}
.table2 .val-column,
.table2 .label-column {
  border-right: 1px solid ${this.borderColor};
  text-align: left;
}

.table3 {
  border: none;
  border-top: 1px solid ${this.borderColor};
  border-left: 1px solid ${this.borderColor};
}
.table3 .table-col {
  border-bottom: 1px solid ${this.borderColor};
}
.table3 .val-column {
  text-align: left;
  border-right: 1px solid ${this.borderColor};
}
.table3 .label-column {
  text-align: left;
}
.table4 {
  border: none;
  border-top: 1px solid ${this.borderColor};
  border-left: 1px solid ${this.borderColor};
}
.table4 .table-col {
  border-bottom: 1px solid ${this.borderColor};
}
.table4 .val-column {
  text-align: left;
  border-right: 1px solid ${this.borderColor};
}
.table4 .label-column {
  text-align: left;
}
.table5 {
  border: none;
  border-top: 1px solid ${this.borderColor};
}
.table5 .table-column {
  border-left: none;
}
.table5 .table-col {
  border-bottom: 1px solid ${this.borderColor};
}
.table5 .val-column {
  text-align: left;
}
.table5 .label-column {
  text-align: left;
}
.table6 {
  border: none;
}
.table6 .table-column {
  border-left: none;
}
.table6 .table-col {
  border-bottom: 1px solid ${this.borderColor};
}
.table6 .val-column {
  text-align: left;
}
.table6 .label-column {
  text-align: left;
}

.table-column-header {
  display: flex;
}
.table-column {
  margin: 10px;
  border: 1px solid ${this.borderColor};
  border-right: none;
}
.table-column-val {
  display: flex;
  border-top: 1px solid ${this.borderColor};
}
.flex {
  display: flex;
}
.opinion-box {
  min-height: 200px;
  border: none;
}
.opinion-item {
  position: relative;
  padding: 20px;
}
.esignature-box {
  position: absolute;
  width: 120px;
  top: 40px;
  right: 120px;
}
.esignature-box img {
  width: 100%;
  height: 100%;
}
.left {
  justify-content: flex-start;
}
.right {
  justify-content: flex-end;
}
.hr {
  margin-top: 10px;
  border-top: 1px solid ${this.borderColor};
}
.placeholder {
  color: ${this.borderColor};
}

.table-box .table-row{
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items: center;
  border-right: 1px solid ${this.borderColor};
}
.table-box .table-val{
  border-bottom: 1px solid ${this.borderColor};
    width: 100%;
    padding-left: 4px;
}
.table-box{
  display: flex;
  justify-content: space-around;
  border: 1px solid ${this.borderColor};
  border-bottom: none;
  border-right: none;
  margin: 10px;
}
`;
      printJS({
        printable: refName,
        type: "html",
        documentTitle: title,
        style: styleStr, // 亦可使用引入的外部css;
        css: "/cdn/element-ui/2.15.4/index.css",
        scanStyles: false,
        repeatTableHeader: false,
        header: null
      });
    }
  }
};
</script>
<style scoped>
.print-form-box {
  padding: 10px;
}
.table-row /deep/ .opinion-box {
  border: none;
}
</style>
<style lang="scss" scoped>
.print-button{
  position: fixed;
  right: 30px;
  top: 60px;
}
.table-row {
  width: 100%;
  font-size: 16px;
  width: 100%;
  border: none;
  border: none;
  color: #000000;
  margin: 0 !important;
  padding: 0 !important;
}

.table-val-box {
  border: none;
  border-top: 1px solid;
  border-left: 1px solid;
  border-color: #fafafa;
  padding: 4px !important;
  margin: 0 !important;
}
.table-col {
  display: flex;
  padding: 0 !important;
  margin: 0 !important;
  min-height: 50px;
  line-height: 50px;
}
.val-column {
  flex: 1;
  border: none;
  padding: 0 0 0 4px !important;
  margin: 0 !important;
  vertical-align: middle;
}
.label-column {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  margin: 0 !important;
  padding: 0 0 0 4px !important;
}
.h2 {
  font-size: 24px;
}
.table-wrap {
  flex: 1;
}
.title-box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  line-height: 50px;
  padding: 0 !important;
  margin: 0 !important;
}
.title-box1 {
  border: none;
}
.title-box2 {
  border: none;
  border-top: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
}
.title-box3 {
  border: none;
  border-top: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
}
.title-box4 {
  border: none;
}
.title-box5 {
  border: none;
}
.title-box6 {
  border: none;
}
.warp1 {
  border: none;
}
.warp2 {
  border: none;
  border-top: 1px solid;
}
.warp3 {
  border: none;
  border-top: 1px solid;
}
.warp4 {
  border: none;
}
.warp5 {
  border: none;
}
.warp6 {
  border: none;
}
.table1 {
  border: none;
  border-top: 1px solid;
  border-left: 1px solid;
}
.table1 .table-col {
  border-bottom: 1px solid;
}
.table1 .val-column,
.table1 .label-column {
  border-right: 1px solid;
  text-align: left;
}

.table2 {
  border: none;
  border-top: 1px solid;
  border-left: 1px solid;
}
.table2 .table-col {
  border-bottom: 1px solid;
}
.table2 .val-column,
.table2 .label-column {
  border-right: 1px solid;
  text-align: left;
}

.table3 {
  border: none;
  border-top: 1px solid;
  border-left: 1px solid;
}
.table3 .table-col {
  border-bottom: 1px solid;
}
.table3 .val-column {
  text-align: left;
  border-right: 1px solid;
}
.table3 .label-column {
  text-align: left;
}
.table4 {
  border: none;
  border-top: 1px solid;
  border-left: 1px solid;
}
.table4 .table-col {
  border-bottom: 1px solid;
}
.table4 .val-column {
  text-align: left;
  border-right: 1px solid;
}
.table4 .label-column {
  text-align: left;
}
.table5 {
  border: none;
  border-top: 1px solid;
}
.table5 .table-column {
  border-left: none;
}
.table5 .table-col {
  border-bottom: 1px solid;
}
.table5 .val-column {
  text-align: left;
}
.table5 .label-column {
  text-align: left;
}
.table6 {
  border: none;
}
.table6 .table-column {
  border-left: none;
}
.table6 .table-col {
  border-bottom: 1px solid;
}
.table6 .val-column {
  text-align: left;
}
.table6 .label-column {
  text-align: left;
}

.table-column-header {
  display: flex;
}
.table-column {
  margin: 10px;
  border: 1px solid;
  border-right: none;
}
.table-column-val {
  display: flex;
  border-top: 1px solid;
}
.flex {
  display: flex;
}
.opinion-box {
  min-height: 200px;
  border: none;
}
.opinion-item {
  position: relative;
  padding: 20px;
}
.esignature-box {
  position: absolute;
  width: 120px;
  top: 40px;
  right: 120px;
}
.esignature-box img {
  width: 100%;
  height: 100%;
}
.left {
  justify-content: flex-start;
}
.right {
  justify-content: flex-end;
}
.hr {
  margin-top: 10px;
  border-top: 1px solid #dcdfe6;
}
.placeholder {
  color: #dcdfe6;
}

.table-box .table-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-right: 1px solid;
}
.table-box .table-val {
  border-bottom: 1px solid;
  width: 100%;
  padding-left: 4px;
}
.table-box {
  display: flex;
  justify-content: space-around;
  border: 1px solid;
  border-bottom: none;
  border-right: none;
  margin: 10px;
}
</style>
