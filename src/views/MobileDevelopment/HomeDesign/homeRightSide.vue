<template>
<div>
  <el-form style="padding: 0 5px 0px 15px;">
    <el-form-item :label="$t('mobileDev.homeRightSide.labelCarouselType')" v-if="homeActiveData.solidType !== undefined">
      <el-select v-model="homeActiveData.solidType" :placeholder="$t('mobileDev.homeRightSide.placeholderCarouselType')">
        <el-option v-for="item in solidType" :label="item.name" :value="item.value" :key="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.homeRightSide.labelCardType')" v-if="homeActiveData.cardType !== undefined">
      <el-select v-model="homeActiveData.cardType" :placeholder="$t('mobileDev.homeRightSide.placeholderCardType')">
        <el-option v-for="item in cardType" :label="item.name" :value="item.value" :key="item.value"></el-option>
      </el-select>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.homeRightSide.labelWhetherShowT')" v-if="homeActiveData.istitle !== undefined">
      <el-select v-model="homeActiveData.istitle" :placeholder="$t('mobileDev.homeRightSide.placeholderSelect')">
        <el-option v-for="item in boolenType" :label="item.name" :value="item.value" :key="item.value"></el-option>
      </el-select>
    </el-form-item> 
    <el-form-item :label="homeActiveData.tips+$t('mobileDev.homeRightSide.title')" v-if="(homeActiveData.istitle==1||homeActiveData.type=='swiperComponent')&&homeActiveData.title !== undefined">
      <el-input v-model="homeActiveData.title" :placeholder="$t('mobileDev.homeRightSide.placeholderTitle')"></el-input>
    </el-form-item>  
    <el-form-item :label="homeActiveData.tips+$t('mobileDev.homeRightSide.title')" v-if="homeActiveData.F_Text !== undefined">
      <el-input v-model="homeActiveData.F_Text" :placeholder="$t('mobileDev.homeRightSide.placeholderTitle')"></el-input>
    </el-form-item>
    <el-form-item :label="homeActiveData.tips +' '+ $t('BI.components.main.labelSubtitle')" v-if="homeActiveData.F_Subtext !== undefined">
      <el-input v-model="homeActiveData.F_Subtext" :placeholder="$t('mobileDev.homeRightSide.placeholderSubtitle')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.homeRightSide.labelRefreshT')" v-if="homeActiveData.F_RefreshTime !== undefined">
      <el-input v-model="homeActiveData.F_RefreshTime" type="number" :placeholder="$t('mobileDev.homeRightSide.placeholderRefreshT')" @input="getEchartData(homeActiveData)"></el-input>
    </el-form-item>  
    <el-form-item :label="$t('mobileDev.homeRightSide.labelWhetherShowM')" v-if="homeActiveData.ismore !== undefined">
      <el-select v-model="homeActiveData.ismore" :placeholder="$t('mobileDev.homeRightSide.placeholderSelect')">
        <el-option v-for="item in boolenType" :label="item.name" :value="item.value" :key="item.value"></el-option>
      </el-select>
    </el-form-item> 
    <el-form-item :label="$t('mobileDev.homeRightSide.labelLink')" v-if="homeActiveData.ismore==1&&homeActiveData.title !== undefined">
      <el-input v-model="homeActiveData.moreLink" :placeholder="$t('mobileDev.homeRightSide.placeholderLink')"></el-input>
    </el-form-item>   
    <el-form-item :label="(homeActiveData.type=='nav'?'标签':homeActiveData.tips)+' '+$t('mobileDev.homeRightSide.hight')" v-if="homeActiveData.height !== undefined">
      <el-input v-model="homeActiveData.height" :placeholder="$t('mobileDev.homeRightSide.placeholderHigh')" type="number"></el-input>
    </el-form-item>
    <el-form-item :label="(homeActiveData.type=='nav'?'标签内容':homeActiveData.tips)+' '+$t('mobileDev.homeRightSide.hight')" v-if="homeActiveData.conheight !== undefined">
      <el-input v-model="homeActiveData.conheight" :placeholder="$t('mobileDev.homeRightSide.placeholderHigh')" type="number"></el-input>
    </el-form-item>
    <el-form-item :label="homeActiveData.type=='nav'?'最大标签数':homeActiveData.type=='swiperComponent'?$t('mobileDev.homeRightSide.maxLabelNum'):$t('mobileDev.homeRightSide.defaultNum')" v-if="homeActiveData.num !== undefined">
      <el-input v-model="homeActiveData.num" :placeholder="$t('mobileDev.homeRightSide.placeholderAmount')" type="number" @input="homeActiveData.type=='nav'?addTags():getEchartData(homeActiveData)"></el-input>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.homeRightSide.labelCTextBgC')" v-if="homeActiveData.bgcolor !== undefined">
      <el-color-picker v-model="homeActiveData.bgcolor" show-alpha></el-color-picker>
    </el-form-item> 
    <el-form-item :label="'标签'+navLabel[parseInt(homeActiveData.active-1)].label+'名称'" v-if="homeActiveData.type=='nav'">
      <el-input v-model="homeActiveData.titles[parseInt(homeActiveData.active-1)]" :placeholder="$t('mobileDev.homeRightSide.placeholderName')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.homeRightSide.labelHighlightTextC')" v-if="homeActiveData.highcolor !== undefined">
      <el-color-picker v-model="homeActiveData.highcolor" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.homeRightSide.labelNonhighlightTextC')" v-if="homeActiveData.color !== undefined">
      <el-color-picker v-model="homeActiveData.color" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item :label="homeActiveData.tips+' '+$t('mobileDev.homeRightSide.configWay')" v-if="homeActiveData.config !== undefined">
      <el-select v-model="homeActiveData.config" :placeholder="$t('mobileDev.homeRightSide.placeholderSeConfType')">
        <el-option v-for="item in config" :label="item.name" :value="item.value" :key="item.value"></el-option>
      </el-select>
    </el-form-item>
    <div class="groupTit" v-if="homeActiveData.chatType!==undefined||homeActiveData.type=='table-chart'"><i class="el-icon-s-tools"></i>{{$t('mobileDev.homeRightSide.chartData')}}</div>
    <!-- <el-form-item :label="$t('mobileDev.homeRightSide.labelDatabase')" 
    v-if="(homeActiveData.config==2||homeActiveData.type=='imgCard'||homeActiveData.type=='videoPlay'||homeActiveData.type=='swiperComponent'||homeActiveData.type=='List'||homeActiveData.chatType!==undefined) && homeActiveData.F_DatabaseLinkId!==undefined"
    >
      <avue-input-tree default-expand-all v-model="homeActiveData.F_DatabaseLinkId" :placeholder="$t('mobileDev.homeRightSide.placeholderSelect')" type="tree" :dic="treeList"></avue-input-tree>
    </el-form-item> -->
	<el-button type="primary" size="small" icon="el-icon-plus" style="width: 100%;" @click="addDataSource"
	v-if="(homeActiveData.config==2||homeActiveData.type=='imgCard'||homeActiveData.type=='videoPlay'||homeActiveData.type=='swiperComponent'||homeActiveData.type=='List'||homeActiveData.chatType!==undefined) && homeActiveData.sql!==undefined"
	>{{$t('addDataSource')}}</el-button>
    <el-form-item :label="$t('mobileDev.formRightSide.optionDataSource')" 
    v-if="(homeActiveData.config==2||homeActiveData.type=='imgCard'||homeActiveData.type=='videoPlay'||homeActiveData.type=='swiperComponent'||homeActiveData.type=='List'||homeActiveData.chatType!==undefined) && homeActiveData.sql!==undefined"
    >
      <!-- <el-input v-model="homeActiveData.sql" :placeholder="$t('mobileDev.homeRightSide.placeholderSQL')" type="textarea" :rows="3" @blur="homeActiveData.chatType!=undefined?verifySQL():ClearBr(homeActiveData.sql)"></el-input>
      <block v-if="homeActiveData.chatType==undefined">
        <el-button type="primary" size="small" style="width:100%;margin-top:10px" @click="verifySQL">{{$t('mobileDev.homeRightSide.verifState')}}</el-button>
        <div style="text-align:center;font-size:12px;color:red">{{homeActiveData.config==2?$t('mobileDev.homeRightSide.defaultData'):$t('mobileDev.homeRightSide.dataShow')}}</div>
      </block> -->
	  <el-select v-model="homeActiveData.sql" clearable @change="handleDataSourceChange"
	             :placeholder="$t('code.codeStepFour.hintDataOrigin')">
	    <el-option
	        v-for="item in dataSource"
	        :key="item.F_Id"
	        :label="item.F_Name"
	        :value="item.F_Id">
	    </el-option>
	  </el-select>
    </el-form-item>    
    <el-form-item :label="$t('mobileDev.homeRightSide.labelWhetherShowImg')" v-if="homeActiveData.ispic !== undefined">
      <el-select v-model="homeActiveData.ispic" :placeholder="$t('mobileDev.homeRightSide.placeholderSelect')">
        <el-option v-for="item in boolenType" :label="item.name" :value="item.value" :key="item.value"></el-option>
      </el-select>
    </el-form-item> 
    <el-form-item 
    :label="((homeActiveData.type=='imgCard'||homeActiveData.type=='swiperComponent'||homeActiveData.ispic==1)?$t('mobileDev.homeRightSide.Img'):homeActiveData.type=='videoPlay'?$t('mobileDev.homeRightSide.Video'):homeActiveData.tips)+' '+$t('mobileDev.homeRightSide.addrField')" 
    v-if="(homeActiveData.config==2 && homeActiveData.type=='solidImg')||homeActiveData.type=='imgCard'||homeActiveData.type=='videoPlay'||homeActiveData.type=='swiperComponent'||homeActiveData.ispic==1"
    >
      <el-select v-model="homeActiveData.imgUrl" :placeholder="$t('mobileDev.homeRightSide.placeholderSelectF')">
        <el-option v-for="item in FieldOptions" :label="item" :value="item" :key="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item 
    :label="homeActiveData.type=='solidText'?$t('mobileDev.homeRightSide.carolTextField'):homeActiveData.type=='imgCard'?$t('mobileDev.homeRightSide.imgTitleField'):homeActiveData.type=='videoPlay'?$t('mobileDev.homeRightSide.vidTitField'):(homeActiveData.type=='swiperComponent'||homeActiveData.type=='List')?$t('mobileDev.homeRightSide.contTitleField'):(homeActiveData.tips+' '+$t('mobileDev.homeRightSide.descrField'))" 
    v-if="(homeActiveData.config==2 && (homeActiveData.solidType==2 || homeActiveData.type=='solidText'))||homeActiveData.type=='imgCard'||homeActiveData.type=='videoPlay'||homeActiveData.type=='swiperComponent'||homeActiveData.type=='List'"
    >
      <el-select v-model="homeActiveData.info" :placeholder="$t('mobileDev.homeRightSide.placeholderSelectF')">
        <el-option v-for="item in FieldOptions" :label="item" :value="item" :key="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="(homeActiveData.type=='solidText'?$t('mobileDev.homeRightSide.carouselText'):homeActiveData.tips)+' '+$t('mobileDev.homeRightSide.linkField')" v-if="homeActiveData.config==2 && (homeActiveData.solidType==2 || homeActiveData.type=='solidText')">
      <el-select v-model="homeActiveData.imgAddr" :placeholder="$t('mobileDev.homeRightSide.placeholderSelectF')">
        <el-option v-for="item in FieldOptions" :label="item" :value="item" :key="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="(homeActiveData.type=='List'?$t('mobileDev.homeRightSide.Subtitle'):$t('mobileDev.homeRightSide.Content'))+$t('mobileDev.homeRightSide.Field')" v-if="homeActiveData.content!==undefined">
      <el-select v-model="homeActiveData.content" :placeholder="$t('mobileDev.homeRightSide.placeholderSelectF')">
        <el-option v-for="item in FieldOptions" :label="item" :value="item" :key="item"></el-option>
      </el-select>
    </el-form-item>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="(homeActiveData.type=='solidImg'|| homeActiveData.type=='solidText') && homeActiveData.config==1">
      <el-tab-pane :label="(homeActiveData.type=='solidText'?$t('mobileDev.homeRightSide.carouselText'):homeActiveData.tips)+item.label" :name="item.value" v-for="(item,idx) in solidNum" :key="idx">
        <el-form-item :label="homeActiveData.tips+item.label" v-if="homeActiveData.type=='solidImg'">
          <el-input v-model="homeActiveData.imgs[idx]" :placeholder="$t('mobileDev.homeRightSide.placeholderUploadImg')"></el-input>
          <el-row style="text-align:right;padding-top:6px">
            <el-button type="danger" size="small" @click="clearPicture(idx)">{{$t('mobileDev.homeRightSide.clearBtn')}}</el-button>
            <label :for="'file'+idx" style="margin:0 0 0 10px;">
              <span class="el-button el-button--primary el-button--small">{{$t('mobileDev.homeRightSide.uploadBtn')}}</span>                        	
              <input
                  type="file"
                  :id="'file'+idx"
                  @change="uploadPicture('inputer'+idx,idx)"
                  :ref="'inputer'+idx"
                  accept="image/*"
                  style="display:none;"
                />
            </label>              
          </el-row>
        </el-form-item>
        <el-form-item :label="(homeActiveData.type=='solidText'?$t('mobileDev.homeRightSide.carouselText'):homeActiveData.tips)+item.label+' '+$t('mobileDev.homeRightSide.explain')" v-if="homeActiveData.solidType==2 || homeActiveData.type=='solidText'">
          <el-input v-model="homeActiveData.titles[idx]" :placeholder="$t('mobileDev.homeRightSide.placeholderExplain')"></el-input>
        </el-form-item>
        <el-form-item :label="(homeActiveData.type=='solidText'?$t('mobileDev.homeRightSide.carouselText'):homeActiveData.tips)+item.label+' '+$t('mobileDev.homeRightSide.link')" v-if="homeActiveData.solidType==2|| homeActiveData.type=='solidText'">
          <el-input v-model="homeActiveData.links[idx]" :placeholder="$t('mobileDev.homeRightSide.placeholderLink')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('mobileDev.homeRightSide.carouselText')+' '+item.label+' '+$t('mobileDev.homeRightSide.coclor')" v-if="homeActiveData.type=='solidText'">
          <el-color-picker v-model="homeActiveData.textcolor[idx]" show-alpha></el-color-picker>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="homeActiveData.type=='solidText' && homeActiveData.config==2">
      <el-tab-pane :label="$t('mobileDev.homeRightSide.carouselText')+' '+item.label" :name="item.value" v-for="(item,idx) in solidNum" :key="idx">
        <el-form-item :label="$t('mobileDev.homeRightSide.carouselText')+' '+item.label+' '+$t('mobileDev.homeRightSide.coclor')">
          <el-color-picker v-model="homeActiveData.textcolor[idx]" show-alpha></el-color-picker>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
    <block v-for="(it,idx) in keys" :key="it.key">
      <el-form-item :label="it.name" v-if="homeActiveData[it.key]!==undefined" style="position:relative;">
        <el-select v-model="homeActiveData[it.key]" :placeholder="$t('mobileDev.homeRightSide.placeholderSelectF')" v-show="it.show">
          <el-option v-for="item in FieldOptions" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <el-input v-model="homeActiveData[it.key]" v-if="it.type=='icon'" :placeholder="$t('mobileDev.homeRightSide.placeholderSelectIcon')" v-show="!it.show"></el-input>
        <el-button type="text" icon="el-icon-more" v-if="it.type=='icon'" style="position:absolute;right: 2px;background: #fff;padding: 0px 6px 3px 6px;bottom: 2px;" @click="selectMoreIcon(it,idx)"></el-button>
      </el-form-item>
    </block>
	<el-form-item :label="$t('mobileDev.homeRightSide.labelKeyField')" v-if="(homeActiveData.type=='solidText'&&homeActiveData.config==2)||(homeActiveData.type!='solidText'&&homeActiveData.keyfield!==undefined)">
	  <el-select v-model="homeActiveData.keyfield" :placeholder="$t('mobileDev.homeRightSide.placeholderSelectF')">
	    <el-option v-for="item in FieldOptions" :label="item" :value="item" :key="item"></el-option>
	  </el-select>
	</el-form-item>
    <el-button v-if="homeActiveData.type=='grid'" type="primary" style="width:100%;margin-top:20px" @click="setMenuFunction">{{$t('mobileDev.homeRightSide.setMenuFunction')}}</el-button>
    <el-form-item :label="$t('mobileDev.homeRightSide.labelField')" v-if="homeActiveData.type== 'table-chart'">
      <el-input :placeholder="$t('mobileDev.homeRightSide.placeholderConfig')" readonly @focus="tableSetFunc"></el-input>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.homeRightSide.labelCorField')" v-if="homeActiveData.F_Category!==undefined">
      <el-select v-model="homeActiveData.F_Category" :placeholder="$t('mobileDev.homeRightSide.placeholderSelectF')">
        <el-option v-for="item in FieldOptions" :label="item" :value="item" :key="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.homeRightSide.labelXField')" v-if="homeActiveData.F_Name!==undefined">
      <el-select v-model="homeActiveData.F_Name" :placeholder="$t('mobileDev.homeRightSide.placeholderSelectF')">
        <el-option v-for="item in FieldOptions" :label="item" :value="item" :key="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('mobileDev.homeRightSide.labelYField')" v-if="homeActiveData.F_Value!==undefined">
      <el-select v-model="homeActiveData.F_Value" :placeholder="$t('mobileDev.homeRightSide.placeholderSelectF')">
        <el-option v-for="item in FieldOptions" :label="item" :value="item" :key="item"></el-option>
      </el-select>
    </el-form-item>
    
    <el-button type="primary" size="small" style="width:100%;margin-top:10px" v-if="homeActiveData.sql!==undefined" @click="getEchartData(homeActiveData)">{{$t('buttonModule.modalSureBtn')}}</el-button>
	
  </el-form>
  <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('mobileDev.homeRightSide.dialogTitle.selectIcon')" :append-to-body="true" :visible.sync="IconVisible" width="80%" style="padding: 10px 20px;">
    <FontHtml v-on:childByValue="childByValue"></FontHtml>
  </el-dialog>
  <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('mobileDev.homeRightSide.dialogTitle.setMenuFunction')" :append-to-body="true" :visible.sync="menuFunVisible" width="80%" top="0" style="height:100%" class="menuset">
    <MobileSchema ref="menuset" :selectedList="homeActiveData.menu"></MobileSchema>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="menuSetSubmit()">{{$t('mobileDev.homeRightSide.completeBtn')}}</el-button>
    </span>
  </el-dialog>
  <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('mobileDev.homeRightSide.dialogTitle.setTab')" :append-to-body="true" :visible.sync="tableSetVisible" width="80%" top="80px" style="height:100%">
    <tableSet :treeList="dataSource"></tableSet>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="tableSetSubmit()">{{$t('mobileDev.homeRightSide.completeBtn')}}</el-button>
    </span>
  </el-dialog>
  <add-data-source v-if="dataSourceVisible" :visible.sync="dataSourceVisible"  :title="this.$t('addDataSource')"></add-data-source>
</div>
</template>
<script>
import store from '@/store/index';
import { baseUrl } from '@/config/env';
import { upload } from '@/api/officeautomation/news.js';
import {mapGetters} from "vuex";
// import { getDatabaseTableTree} from '@/api/databasemanage/databasetable.js';
import {getDbFieldBySQL,getDbLinksTestSql} from '@/api/databasemanage/databaselink.js';
import {getDataSource,getDataSourceField,getDataItem,getDataBySQL} from '@/api/databasemanage/datasource';
import FontHtml from '../../FontAwesome.vue';
import MobileSchema from '../MobileSchema';
import tableSet from './tableSet';
import {deepClone} from '@/utils/index';
import { getFileList } from "@/api/code/form";
import AddDataSource from '@/components/AddDataSource';
export default {
  components:{
    FontHtml,
    MobileSchema,
    tableSet,
  	AddDataSource
  },
  watch:{
  	dataSourceVisible: {
  	  handler (val) {
  	    if(!val) this.getDataSource()
  	  }
  	}  
  },
  data () {
    return {
      solidType:[{name:this.$t('mobileDev.homeRightSide.Carousel'),value:1},{name:this.$t('mobileDev.homeRightSide.textCarousel'),value:2}],
      config:[{name:this.$t('mobileDev.homeRightSide.mnualConfig'),value:1},{name:this.$t('mobileDev.homeRightSide.codeConfig'),value:2}],
      solidNum:[{label:this.$t('mobileDev.homeRightSide.one'),value:1},{label:this.$t('mobileDev.homeRightSide.two'),value:2},{label:this.$t('mobileDev.homeRightSide.three'),value:3},{label:this.$t('mobileDev.homeRightSide.four'),value:4}],
      navLabel:[{label:this.$t('mobileDev.homeRightSide.one'),value:1},{label:this.$t('mobileDev.homeRightSide.two'),value:2},{label:this.$t('mobileDev.homeRightSide.three'),value:3},{label:this.$t('mobileDev.homeRightSide.four'),value:4},{label:this.$t('mobileDev.homeRightSide.five'),value:5},{label:this.$t('mobileDev.homeRightSide.six'),value:6}],
      activeName:1,
      treeList:[],
      FieldOptions:[],
      cardType:[{name:this.$t('mobileDev.homeRightSide.moreCard'),value:1},{name:this.$t('mobileDev.homeRightSide.oneCard'),value:2}],
      boolenType:[{name:this.$t('mobileDev.listRightSide.optionYes'),value:1},{name:this.$t('mobileDev.listRightSide.optionNo'),value:2}],
      keys:[{key:'labels1',name:this.$t('mobileDev.homeRightSide.labelOneField'),show:true},{key:'icons1',name:this.$t('mobileDev.homeRightSide.labelOneIcon'),type:'icon',show:false},{key:'labels2',name:this.$t('mobileDev.homeRightSide.labelTwoField'),show:true},{key:'icons2',name:this.$t('mobileDev.homeRightSide.labelTwoIcon'),type:'icon',show:false},{key:'link',name:this.$t('mobileDev.homeRightSide.moreLink'),show:true}],
      IconVisible:false,
      curIconField:'',
      menuFunVisible:false,
      tableSetVisible:false,
      dataSourceOption:[],
      dataItemOption:[],
      dialogBoxShow:false,
	  dataSource:[],
	  dataSourceVisible:false
    }
  },
  computed: {
    ...mapGetters(['HomeAllStep','homeActiveData'])
  },
  methods:{
	addDataSource(){
		this.dataSourceVisible=true
	},
	async getDataSource(){
		//默认请求出数据源数据
		let resSource = await getDataSource();
		if(resSource.data.success){
		  const data = resSource.data.data;
		  if (data) {
			this.dataSource = [...data];
		  }
		}
	},
	handleDataSourceChange(){
		this.getDataField()
	},
	getDataField(){
		if(!this.$validatenull(this.homeActiveData.sql)){
			getDataSourceField(this.homeActiveData.sql).then(res => {
				this.FieldOptions = res.data.data;
			});
		}
	},
	
    tableSetFunc(){
      this.tableSetVisible=true
    },
    selectMoreIcon (it,idx) {
      it.show=false;
      this.keys.splice(idx,1,it)
      this.IconVisible = true;
      this.curIconField=it.key;
    },
    childByValue: function (childValue) {
        // childValue就是子组件传过来的值
      this.homeActiveData[this.curIconField] = childValue;
      this.IconVisible = false;
    },
    uploadPicture(str,idx){
      this.$nextTick(function(){
        var _this = this;
        let inputDOM = this.$refs[str][0];
        // 通过DOM取文件数据
        var file = inputDOM.files;
        
        if (file) {
          let formData = new FormData()
          formData.append('file', file[0])
          upload(formData).then(res=>{
            this.homeActiveData.imgs.splice(idx,1,baseUrl+res.data.data.FileUrl)
          })
          // let size = Math.floor(file[0].size / 1024);

          // if (size > 5 * 1024 * 1024) {
          //   this.$message.error("上传图片大小不能超过 5MB!");
          // } else {
          //   
          // }
        }
      })
      
    },
    clearPicture(idx){
      this.homeActiveData.imgs.splice(idx,1,"")
    },
   
    tableSetSubmit(){
      this.tableSetVisible=false;
      getDataBySQL(this.homeActiveData.sql).then(res=>{
        this.homeActiveData.tableData=res.data.data;
      }).catch(res=>{

      })
    },
    getEchartData(homeActiveData){
	  if(homeActiveData.type=='swiperComponent'&&homeActiveData.num>8){
		  this.$message({
		    message:this.$t('mobileDev.homeRightSide.hintMaxSlidePlug'),
		    type: 'warning'
		  });
	  }

	  if(!homeActiveData.sql){
	  		  this.$message({
	  		    message:this.$t('code.codeStepFour.hintDataOrigin'),
	  		    type: 'warning'
	  		  });
	  		  return;
	  }
	  getDataBySQL(homeActiveData.sql).then(res=>{
		let data=res.data.data;
		if(data&&data.length>0){
			if(homeActiveData.chatType!==undefined){
				//设置定时器  定时更新数据				// if (homeActiveData.F_RefreshTime > 0) {				// 	homeActiveData.refreshFunc = setInterval(() => {				// 		this.getEchartData(homeActiveData)				// 	}, homeActiveData.F_RefreshTime * 60000)				// }
				// data=[{A:'邮件',B:'星期一',C:'10'},{A:'百度',B:'星期一',C:'20'},{A:'邮件',B:'星期二',C:'30'},{A:'邮件',B:'星期三',C:'40'},{A:'邮件',B:'星期四',C:'50'},{A:'百度',B:'星期四',C:'10'}]
				// this.homeActiveData.F_Category='A';
				// this.homeActiveData.F_Name='B'
				// this.homeActiveData.F_Value='C'
				
				let legend=[]; //echart分类,饼图和环形图除外
				let name=[];//echart名称，饼图和环形图，漏斗图除外
				let series=[];//echart名称对应的值
				//先过滤分类字段为null,空的数据
			
				data=data.filter(it=>it[homeActiveData.F_Category]!=null&&it[homeActiveData.F_Category]!='')
				let pieData=deepClone(data)
				let pieLegend=pieData.map(x => {return x[homeActiveData.F_Category]}).filter((item, index, arr) => arr.indexOf(item) === index);
				if(homeActiveData.type=='funnel-chart'||homeActiveData.type=='pie-chart'||homeActiveData.type=='circle-chart'){
				  homeActiveData.option.series[0].data=[]
				  pieLegend.forEach(it=>{
					  let obj={
						  name:it,
						  value:0
					  }
					  pieData.forEach(x=>{
						if(x[homeActiveData.F_Category]==it){
							obj.value+=x[homeActiveData.F_Value]
							if(homeActiveData.type=='circle-chart') obj.name=it+'('+obj.value+')'
						} 
					  })
					  homeActiveData.option.series[0].data.push(obj)
				  })
				}else{
				  
			  
				  //再过滤名称字段为null,空的数据
				  data=data.filter(it=>it[homeActiveData.F_Name]!=null&&it[homeActiveData.F_Name]!='')
				  legend=data.map(x => {return x[homeActiveData.F_Category]}).filter((item, index, arr) => arr.indexOf(item) === index);
				  homeActiveData.option.legend.data=[...legend];

				  name=data.map(x => {return x[homeActiveData.F_Name]}).filter((item, index, arr) => arr.indexOf(item) === index);
				  if(homeActiveData.type=='line-chart'||homeActiveData.type=='bar-chart'||homeActiveData.type=='area-chart'||homeActiveData.type=='pileBar-chart'){ 
					homeActiveData.option.xAxis.data=name;
				  }else if(homeActiveData.type=='verticalBar-chart'){
					homeActiveData.option.yAxis.data=name;
				  }

				  legend.forEach(it=>{
					let obj={}
					//if(this.homeActiveData.type=='line-chart'||this.homeActiveData.type=='bar-chart'||this.homeActiveData.type=='verticalBar-chart'||this.homeActiveData.type=='area-chart'||this.homeActiveData.type=='pileBar-chart'){
					  let temp=data.filter(x=>it==x[homeActiveData.F_Category]);
					  let rs=[]
					  name.forEach(y=>{
						let val=temp.find(o=>o[homeActiveData.F_Name]==y)
						if(val){
						  rs.push(val[homeActiveData.F_Value])
						}else{
						  rs.push(0)
						}           
					  })
					  obj={
						name: it,
						type: (homeActiveData.type=='line-chart'||homeActiveData.type=='area-chart')?'line':'bar',
						data: rs
					  }
					  if(homeActiveData.type=='verticalBar-chart'){
						obj.stack='total';
						obj.label={ show: true }
					  }
					  if(homeActiveData.type=='area-chart'){
						obj.stack='总量';
						obj.areaStyle={}
					  }
					  if(homeActiveData.type=='pileBar-chart'){
						obj.barWidth= 20;
						obj.stack= '总量';
					  }
					  series.push(obj)
					  homeActiveData.option.series=series;
					//}
				  })
				}
			}else{
				if(homeActiveData.num&&data.length<homeActiveData.num){
					this.$message({
					  message:this.$t('mobileDev.homeRightSide.hintFindOut')+data.length+this.$t('mobileDev.homeRightSide.hintOverNoShow'),
					  type: 'warning'
					});
				}
				let tempArr=[];				
				let num=homeActiveData.num?(homeActiveData.num-1):3
				data.forEach((it,i)=>{					
					if(i<=num){
						if(homeActiveData.type=="solidImg"){							
							if(homeActiveData.solidType==2){
								homeActiveData.titles.splice(i,1,it[homeActiveData.info])
								homeActiveData.links.splice(i,1,it[homeActiveData.imgAddr])
							}
							this.showComptImg(homeActiveData.imgs,it[homeActiveData.imgUrl],i)
	
						}
						if(homeActiveData.type=="solidText"){
							homeActiveData.titles.splice(i,1,it[homeActiveData.info])
							homeActiveData.links.splice(i,1,it[homeActiveData.imgAddr])
						}
						if(homeActiveData.type=="imgCard"||homeActiveData.type=="videoPlay"
						||homeActiveData.type=='swiperComponent'||homeActiveData.type=='List'){
							if(it[homeActiveData.imgUrl]){
								if(it[homeActiveData.imgUrl].indexOf('/')<0){
									getFileList(it[homeActiveData.imgUrl]).then(res=>{
										let url=""
										const {data} =res.data;
										if(data&&data.length>0){
											it[homeActiveData.imgUrl]= this.baseUrl+data[0].url
										}
										tempArr.push(it)
									})
								}else{
									tempArr.push(it)
								}
							}else{
								tempArr.push(it)
							}
							
							this.$set(homeActiveData,"dataList", tempArr)
						}
					}
				})
				
			}
		}
	  }).catch(res=>{

	  })
		
    },
	showComptImg(arr,arg,i){
		if(arg){
			if(arg.indexOf('/')>=0){
				let imgUrl=arg
				arr.splice(i,1,imgUrl)
			}else{
				getFileList(arg).then(res=>{									
					let url=""
					const {data} =res.data;
					if(data&&data.length>0){
						url= this.baseUrl+data[0].url
						arr.splice(i,1,url)
					}
					
				})
			}
		}
	},
    addTags(){
      this.homeActiveData.titles=[]
      if(this.homeActiveData.num>6){
        this.homeActiveData.num=6;
        this.$message({
          message:this.$t('mobileDev.homeRightSide.hintMax'),
          type: 'warning'
        });
      }else if(this.homeActiveData.num<1){
        this.homeActiveData.num=1;
        this.$message({
          message:this.$t('mobileDev.homeRightSide.hintMin'),
          type: 'warning'
        });
      }
      for(let i=0;i<this.homeActiveData.num;i++){
        this.homeActiveData.titles.splice(i,0,'标签'+this.navLabel[i].label)
      }
      store.commit('setHomeActiveData', this.homeActiveData);    
      
    },
    setMenuFunction(){
      this.menuFunVisible=true
    },
    changeComp(it,idx){
      it.show=true;
      this.keys.splice(idx,1,it)
    },
    menuSetSubmit(){
      this.homeActiveData.menu=this.$refs.menuset.getResult();
      this.menuFunVisible=false;
    }
  },
  mounted(){
	//this.getDatabaseTableTree()
	this.getDataSource()
  }
}
</script>
<style scoped>
.el-select{
  width: 100%;
}
.groupTit{
  font-size: 15px;font-weight:bold;margin-top: 20px;
}
::v-deep .el-tabs__item{
  padding: 0 10px;
  font-size: 12px;
}
::v-deep .el-tabs__header{
  margin-bottom: 0;
}
::v-deep .el-textarea__inner{
  font-size:12px ;
}
.menuset ::v-deep .el-dialog{
  height: 100%;
}
::v-deep .el-dialog__body{
  height: calc(100% - 99px);
}
  /* ::v-deep .el-date-editor.el-input{
  width: 100%;
}
.el-date-editor--daterange.el-input__inner{
  width: 169px;
} */
</style>