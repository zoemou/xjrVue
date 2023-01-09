<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane :label="$t('code.rightPanel.compProperty')" name="field"/>
      <el-tab-pane :label="$t('code.rightPanel.formProperty')" name="form"/>
      <el-tab-pane :label="$t('隐藏组件')" name="hide"/>
    </el-tabs>
    <div class="field-box">
      <!-- <a class="document-link" target="_blank" :href="documentLink" :title="$t('code.rightPanel.seeDocument')">
        <i class="el-icon-link"/>
      </a> -->
      <el-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <el-form v-show="currentTab==='field' && showField" size="small" label-width="90px">
           <el-tabs stretch>
            <el-tab-pane :label="$t('code.rightPanel.propertySet')">
              <!-- 属性设置 -->
              <template>
                <el-form-item v-if="baseData.codeFormNumber===2" :label="$t('code.rightPanel.companyName')">
                  <el-input v-model="activeData.__config__.isBindTable" :placeholder="$t('code.rightPanel.placeholderCompanyName')"></el-input>
                </el-form-item>
                <div class="attr-item" v-if="activeData.__config__.isBindTable !== false &&
                                    baseData.codeFormNumber !== 2 &&
                                    controllerType === 0">
                  <div class="require-icon">*</div>
                  <el-form-item  :label="$t('code.rightPanel.bindSheet')">
                  <el-select v-model="activeData.__config__.bindTable" :placeholder="$t('code.rightPanel.selectSheet')"
                            @change="bindTableChange($event,baseData.step1.F_DbId)" :style="{ width: '100%' }">
                    <el-option
                        v-for="item in baseData.step1.list"
                        :key="item.F_id"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                </div>
                <div class="attr-item"  v-if="activeData.__config__.componentName !== 'table'&&
                                  activeData.__config__.isBindTable !== false &&
                                  baseData.codeFormNumber !== 2 &&
                                  controllerType === 0">
                  <div class="require-icon">*</div>
                  <el-form-item :label="$t('code.rightPanel.bindField')">
                    <el-select v-model="activeData.__config__.bindTableField" require filterable  @change="tableFieldChange" :placeholder="$t('code.rightPanel.selectField')"
                              :style="{ width: '100%' }">
                      <el-option
                          v-for="(item, index) in tableField"
                          :key="index"
                          :label="item.Name + '(' + item.Type + ')'"
                          :value="item.Name">
                        <!--:value="{Name:item.Name,Type:item.Type}">-->
                      </el-option>

                    </el-select>
                  </el-form-item>
                </div>
              </template>

              <el-form-item v-if="activeData.__config__.tag === 'avue-crud'" :label="$t('code.rightPanel.editTable')">
                <el-button>{{$t('code.rightPanel.setTableField')}}</el-button>
              </el-form-item>
          <template v-if="['xjr-cascader'].indexOf(activeData.__config__.tag) > -1">
            <div class="attr-item">
              <el-form-item :label="$t('code.rightPanel.configData')"  class='require-form-item'>
                <el-button type="primary" size="mini" class="w100" plain round @click="addTreeItem">{{$t('code.rightPanel.configCascadeData')}}</el-button>
              </el-form-item>
            </div>
            <el-form-item :label="$t('code.rightPanel.dataShowFormat')">
              <el-select v-model="activeData['show-all-levels']" :placeholder="$t('code.codeStepFour.placeholderSelect')" class="w100">
                <el-option key="0" :label="$t('code.rightPanel.showAll')" :value="true"></el-option>
              <el-option key="1" :label="$t('code.rightPanel.showSub')" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <div class="attr-item" v-if="activeData['show-all-levels']">
              <el-form-item :label="$t('code.rightPanel.cascadeDelimiter')">
                <el-select v-model="activeData.separator" :placeholder="$t('code.codeStepFour.placeholderSelect')" class="w100">
                <el-option key="0" label="/" value="/"></el-option>
                <el-option key="1" label="--" value="--"></el-option>
                <el-option key="2" label="|" value="|"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="attr-item">
              <el-form-item :label="$t('selectSet')">
                <el-select v-model="activeData.checkStrictly" :placeholder="$t('selectSelectSet')" class="w100">
                <el-option  :label="$t('optionalAnyLevel')" :value="true"></el-option>
                  <el-option :label="$t('mustSelectMostChildLevel')" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </template>
              <DataSourcesSetting
              :activeData.sync="activeData"
              :allComponents="allComponents"
              :hideComponents="formConf.hideComponents"
              @emitPreloadFieldOption="emitPreloadFieldOption"
              ></DataSourcesSetting>
                <div class="table-fields-conf" v-if="activeData.__config__.dataType && activeData.__config__.children && activeData.__config__.children.length">
                  <el-form-item
                    v-for="(child,childIndex) in activeData.__config__.children.filter(item=>{return !preloadComFilter.includes(item.__config__.tag)})" 
                    :key="childIndex"
                    :label="child.__config__.label">
                    <el-select v-model="child.__config__.prestrainField" @change="(val)=>{return handleTableChildChange(val,child)}">
                      <el-option
                        v-for="item in preloadFieldOption"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
    <!--          <el-form-item v-if="activeData.__config__.changeTag" label="组件类型">-->
    <!--            <el-select-->
    <!--                v-model="activeData.__config__.tagIcon"-->
    <!--                placeholder="请选择组件类型"-->
    <!--                :style="{width: '100%'}"-->
    <!--                @change="tagChange"-->
    <!--            >-->
    <!--              <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">-->
    <!--                <el-option-->
    <!--                    v-for="item in group.options"-->
    <!--                    :key="item.__config__.label"-->
    <!--                    :label="item.__config__.label"-->
    <!--                    :value="item.__config__.tagIcon"-->
    <!--                >-->
    <!--                  <svg-icon class="node-icon" :icon-class="item.__config__.tagIcon"/>-->
    <!--                  <span> {{ item.__config__.label }}</span>-->
    <!--                </el-option>-->
    <!--              </el-option-group>-->
    <!--            </el-select>-->
    <!--          </el-form-item>-->
              <!-- <el-form-item v-if="activeData.__vModel__!==undefined" label="字段名">
                <el-input v-model="activeData.__vModel__" placeholder="请输入字段名（v-model）" />
              </el-form-item> -->
          <el-form-item v-if="activeData.__config__.componentName!==undefined" :label="$t('route.tags')">
            <!--            {{ activeData.__config__.componentName }}-->
            <el-input v-model="activeData.__config__.componentTitle" :placeholder="$t('code.rightPanel.placeholderCompName')" @input="changeRenderKey"/>
          </el-form-item>
              <div v-if="activeData.__config__.label!==undefined">
                <div v-if="activeData.__config__.tag==='h2'"  class='require-form-item'>
                  <el-form-item  :label="$t('workFlow.WFMonitor.tabTitle')">
                    <el-input v-model="activeData.__config__.label" :placeholder="$t('mobileDev.homeRightSide.placeholderTitle')" @input="changeRenderKey"/>
                  </el-form-item>
                </div>
                <div v-else>
                  <el-form-item  :label="$t('workFlow.WFMonitor.tabTitle')">
                    <el-input v-model="activeData.__config__.label" :placeholder="$t('mobileDev.homeRightSide.placeholderTitle')" @input="changeRenderKey"/>
                  </el-form-item>
                </div>
              </div>
              <el-form-item v-if="activeData.placeholder!==undefined" :label="$t('code.rightPanel.placeholderPrompt')">
                <el-input v-model="activeData.placeholder" :placeholder="$t('code.rightPanel.fillPlaceholderPrompt')" @input="changeRenderKey"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.tagIcon==='button'"  :label="$t('mobileDev.loginRightSide.labelBtnName')">
                <el-input v-model="activeData.content" :placeholder="$t('code.codeStepFour.placeholderBtnName')"/>
              </el-form-item>

          <el-form-item v-if="activeData.__config__.label!==undefined||activeData.__config__.componentName==='table'" :label="$t('reportModule.reportRelease.labelTransTag')">
            <el-select
                v-model="activeData.__config__.F_LgMarkCode"  
              @change="handleLgChange"
              filterable
              remote
              reserve-keyword
              :placeholder=" $t('menuManagement.addModal.placeholderTransTag')"
              :remote-method="remoteMethod"
                          :disabled="!showLanguage"
              style="width:100%"
                    clearable>
                <el-option
                    v-for="item in transDefaultTree"
                    :key="item.F_Id"
                    :label="item.F_Name"
                    :value="item.F_EnCode">
              </el-option>
              </el-select>
          </el-form-item>
              <el-form-item v-if="activeData.autoCode !==undefined" :label="$t('code.rightPanel.codeRules')"  class='require-form-item'>
                <el-select 
                  v-model="activeData.__config__.autoCodeRule" 
                  :placeholder="$t('code.rightPanel.selectCodeRules')" 
                  :style="{width: '100%'}"
                  @change="handleSelectAutoCode">
                  <el-option
                      v-for="(item, index) in autoCodeRules"
                      :key="index"
                      :label="item.F_FullName"
                      :value="item.F_EnCode"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="activeData.isTax" :label="$t('code.rightPanel.rate')"  class='require-form-item'>
                <el-input v-model.number="activeData.taxRate" :placeholder="$t('code.rightPanel.placeholderRate')" @input="changeTaxRate"/>
              </el-form-item>
              <el-form-item v-if="activeData.computationalConfigurationValue!==undefined" :label="$t('code.rightPanel.compConfig')">
                <div class="el-input form-rule-box" @click="openComputationalDialog">
                  <span class="rule-item" v-if="!activeData.computationalConfigurationValue">{{$t('code.rightPanel.fillCompConfig')}}</span>
                  <span class="rule-item" v-if="activeData.computationalConfigurationValue">{{activeData.computationalConfigurationValue}}</span>
                </div>
              </el-form-item>
              <el-form-item v-if="activeData['start-placeholder']!==undefined" :label="$t('code.rightPanel.startOccupy')">
                <el-input v-model="activeData['start-placeholder']" :placeholder="$t('code.rightPanel.fillPlaceholderPrompt')"/>
              </el-form-item>
              <el-form-item v-if="activeData['end-placeholder']!==undefined" :label="$t('code.rightPanel.endOccupy')">
                <el-input v-model="activeData['end-placeholder']" :placeholder="$t('code.rightPanel.fillPlaceholderPrompt')"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.span!==undefined"
                            :label="$t('code.rightPanel.formGrid')">
                <el-slider v-model="activeData.__config__.span" :max="24" :min="1" :marks="{12:''}" @change="spanChange"/>
              </el-form-item>
              <!-- 子表单添加配置 开始 -->
              <el-form-item v-if="activeData.__config__.componentName&&activeData.__config__.componentName=='table'" :label="$t('whetherShowTag')">
                <el-switch v-model="activeData.__config__.showLabel"/>
              </el-form-item>
                <el-form-item v-if="activeData.__config__.componentName&&activeData.__config__.componentName=='table'" :label="$t('wheTitleWrap')">
                <el-switch v-model="activeData.__config__.doesTheTitleWrap"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.componentName&&activeData.__config__.componentName=='table'" :label="$t('showCompBorder')">
                <el-switch v-model="activeData.__config__.showComponentBorder"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.componentName&&activeData.__config__.componentName=='table'" :label="$t('showFormBorder')">
                <el-switch v-model="activeData.__config__.showFormBorder"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.componentName&&activeData.__config__.componentName=='table'" :label="$t('whetherShowNum')">
                <el-switch v-model="activeData.__config__.showFormIndex"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.componentName&&activeData.__config__.componentName=='table'" :label="$t('useDefaultSort')">
                <el-switch v-model="activeData.__config__.useDefaultSort" @change="changeSortOptions"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.componentName&&activeData.__config__.componentName=='table'&&!activeData.__config__.useDefaultSort" label="排序字段">
                <el-select 
                v-model="activeData.__config__.sortField" :placeholder="$t('sortField')" :style="{width: '100%'}">
                  <el-option
                      v-for="(item, index) in sortOptions"
                      :key="index"
                      :label="item.__config__.label?item.__config__.label:item.__vModel__"
                      :value="item.__config__.formId"
                  />
                </el-select>
              </el-form-item>
              <!-- 子表单配置结束 -->
              <el-form-item v-if="activeData.__config__.layout==='rowFormItem'&&activeData.gutter!==undefined" :label="$t('code.rightPanel.gridInterval')">
                <el-input-number v-model="activeData.gutter" :min="0" :placeholder="$t('code.rightPanel.gridInterval')"/>
              </el-form-item>
              <el-form-item
                  v-if="activeData.__config__.layout==='rowFormItem'&&activeData.type!==undefined && activeData.__config__.componentName !== 'table'"
                  :label="$t('code.rightPanel.layoutMode')">
                <el-radio-group v-model="activeData.type">
                  <el-radio-button label="default"/>
                  <el-radio-button label="flex"/>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="activeData.justify!==undefined && activeData.type==='flex'" :label="$t('code.rightPanel.horiArrange')">
                <el-select v-model="activeData.justify" :placeholder="$t('code.rightPanel.selectHoriArrange')" :style="{width: '100%'}">
                  <el-option
                      v-for="(item, index) in justifyOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="activeData.align!==undefined&&activeData.type==='flex'" :label="$t('code.rightPanel.verticalArrange')">
                <el-radio-group v-model="activeData.align">
                  <el-radio-button label="top"/>
                  <el-radio-button label="middle"/>
                  <el-radio-button label="bottom"/>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.labelWidth!==undefined" :label="$t('code.rightPanel.labelWidth')">
                <el-input v-model.number="activeData.__config__.labelWidth" type="number" :placeholder="$t('code.rightPanel.placeholderLabelWidth')"/>
              </el-form-item>
              <el-form-item v-if="activeData.style&&activeData.style.width!==undefined" :label="$t('code.rightPanel.compWidth')">
                <el-input v-model="activeData.style.width" :placeholder="$t('code.rightPanel.placeholderCompWidth')" clearable/>
              </el-form-item>
              <template v-if="activeData.__info__">
                <el-form-item :label="$t('mobileDev.formRightSide.labelInforType')">
                  <el-select v-model="activeData.infoType" :style="{width: '100%'}" @change="selectInfoType">
                    <el-option
                        v-for="(item, index) in infoOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
              <template v-else-if="activeData.__organize__">
                <el-form-item :label="$t('code.rightPanel.compType')">
                  <el-select v-model="activeData.__type__" :style="{width: '100%'}">
                    <el-option
                        v-for="(item, index) in activeData.__organizeOptions__"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item
                    v-if="activeData.__vModel__!==undefined && activeData.__config__.componentName !== 'table' && activeData.__config__.isBindTable !== false 
                    && activeData.__config__.tagIcon!='password'
                    && activeData.__config__.tag!='el-upload'
            && activeData.__config__.tag!='xjr-cascader'
                    && !activeData.__config__.filterable
                    && !activeData.autoCode || activeData.__config__.titleColor !== undefined"
                    :label="activeData.__config__.titleColor !== undefined ?$t('code.rightPanel.colorValue'): $t('mobileDev.formRightSide.labelDefault')">
                  <el-color-picker v-if="activeData.__config__.titleColor !== undefined" v-model="activeData.__config__.defaultValue"></el-color-picker>
                    <el-input
                    v-if="activeData.__config__.tag === 'el-input-number'"
                    v-model="numberValue"
                      :placeholder="$t('mobileDev.formRightSide.placeholderDefault')"
                      @change="onDefaultNumberValueInput"
                  />
                    <el-input
                    v-else
                    :value="setDefaultValue(activeData.__config__.defaultValue)"
                      :placeholder="$t('mobileDev.formRightSide.placeholderDefault')"
                      @input="onDefaultValueInput"
              :type="activeData.type=='number'?'number':'text'"
                  />
                </el-form-item>
          <el-form-item v-if="activeData.__config__.tag=='el-image'">
            <el-upload
              class="upload-demo"
              action=""
              :http-request="submitUpload"
              :before-upload="beforeAvatarUpload"
              :limit="1"
              :show-file-list="false">
              <el-button icon="el-icon-upload" type="primary">{{$t('workFlow.addStamp.labelUpload')}}</el-button>
            </el-upload>
          </el-form-item>
              </template>
              <el-form-item v-if="activeData.__config__.tag==='el-checkbox-group'" :label="$t('code.rightPanel.atLeast')">
                <el-input-number
                    :value="activeData.min"
                    :min="0"
                    :placeholder="$t('code.rightPanel.atLeast')"
                    @input="$set(activeData, 'min', $event?$event:undefined)"
                />
              </el-form-item>
              <el-form-item v-if="activeData.__config__.tag==='el-checkbox-group'" :label="$t('code.rightPanel.mostSelect')">
                <el-input-number
                    :value="activeData.max"
                    :min="0"
                    :placeholder="$t('code.rightPanel.mostSelect')"
                    @input="$set(activeData, 'max', $event?$event:undefined)"
                />
              </el-form-item>
              <el-form-item v-if="activeData.__slot__&&activeData.__slot__.prepend!==undefined" :label="$t('codeRule.addModal.tablePrefix')">
                <el-input v-model="activeData.__slot__.prepend" :placeholder="$t('code.rightPanel.placeholderPrefix')"/>
              </el-form-item>
              <el-form-item v-if="activeData.__slot__&&activeData.__slot__.append!==undefined" :label="$t('code.rightPanel.suffix')">
                <el-input v-model="activeData.__slot__.append" :placeholder="$t('code.rightPanel.placeholderSuffix')"/>
              </el-form-item>
               <el-form-item v-if="activeData.btnWidth!==undefined" :label="$t('BI.Build.Width')">
                <el-input v-model.number="activeData.btnWidth" :placeholder="$t('fillInWidth')">
                </el-input>
              </el-form-item>
               <el-form-item v-if="activeData.btnHeight!==undefined" :label="$t('code.rightPanel.height')">
                <el-input v-model.number="activeData.btnHeight" :placeholder="$t('fillInHeight')">
                </el-input>
              </el-form-item>
              <el-form-item v-if="activeData['prefix-icon']!==undefined" :label="$t('code.rightPanel.frontIcon')">
                <el-input v-model="activeData['prefix-icon']" :placeholder="$t('code.rightPanel.placeholderFrontIcon')">
                  <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
                    {{$t('code.rightPanel.select')}}
                  </el-button>
                </el-input>
              </el-form-item>
              <el-form-item v-if="activeData['suffix-icon'] !== undefined" :label="$t('code.rightPanel.backIcon')">
                <el-input v-model="activeData['suffix-icon']" :placeholder="$t('mobileDev.mobileSchema.placeholderSeclectIcon')">
                  <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
                    {{$t('code.rightPanel.select')}}
                  </el-button>
                </el-input>
              </el-form-item>
              <el-form-item
                  v-if="activeData['icon']!==undefined && activeData.__config__.tag === 'el-button'"
                  :label="$t('code.rightPanel.btnIcon')"
              >
                <el-input v-model="activeData['icon']" :placeholder="$t('code.rightPanel.placeholderBtnIcon')">
                  <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('icon')">
                    {{$t('code.rightPanel.select')}}
                  </el-button>
                </el-input>
              </el-form-item>
              
              <el-form-item v-if="activeData.autosize !== undefined" :label="$t('code.rightPanel.minRows')">
                <el-input-number v-model="activeData.autosize.minRows" :min="1" :placeholder="$t('code.rightPanel.minRows')"/>
              </el-form-item>
              <el-form-item v-if="activeData.autosize !== undefined" :label="$t('code.rightPanel.maxRows')">
                <el-input-number v-model="activeData.autosize.maxRows" :min="1" :placeholder="$t('code.rightPanel.maxRows')"/>
              </el-form-item>
              <!-- 计数器最大值最小值 -->
              <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" :label="$t('code.rightPanel.min')">
                <el-input-number v-model="activeData.min" :placeholder="$t('code.rightPanel.min')" @change="inputNumberMaxAndMinSetting"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" :label="$t('code.rightPanel.max')">
                <el-input-number v-model="activeData.max" :placeholder="$t('code.rightPanel.max')" @change="inputNumberMaxAndMinSetting"/>
              </el-form-item>
              <!-- 滑块最大值最小值 -->
              <el-form-item v-if="activeData.__config__.tag === 'el-slider'" :label="$t('code.rightPanel.min')">
                <el-input-number v-model="activeData.min" :placeholder="$t('code.rightPanel.min')" @change="sliderMaxAndMinSetting"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.tag === 'el-slider'" :label="$t('code.rightPanel.max')">
                <el-input-number v-model="activeData.max" :placeholder="$t('code.rightPanel.max')" @change="sliderMaxAndMinSetting"/>
              </el-form-item>
              <!-- 评分最大值 -->
              <el-form-item v-if="activeData.__config__.tag === 'el-rate'" :label="$t('code.rightPanel.max')">
                <el-input-number v-model="activeData.max" :placeholder="$t('code.rightPanel.max')" :min="1" @change="rateMaxAndDefaultValueSetting"/>
              </el-form-item>
              <el-form-item v-if="activeData.height!==undefined" :label="$t('code.rightPanel.compHight')">
                <el-input-number v-model="activeData.height" :placeholder="$t('code.rightPanel.height')" @input="changeRenderKey"/>
              </el-form-item>
              <el-form-item v-if="isShowStep" :label="$t('codeRule.addModal.tableStep')">
                <el-input-number v-model="activeData.step" :placeholder="$t('code.rightPanel.tableStep')"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" :label="$t('BI.components.flop.labelPrecision')">
                <el-input-number v-model="activeData.precision" :min="0" :placeholder="$t('BI.components.flop.labelPrecision')"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" :label="$t('code.rightPanel.btnPosition')">
                <el-radio-group v-model="activeData['controls-position']">
                  <el-radio-button label="">
                    {{$t('code.rightPanel.defaults')}}
                  </el-radio-button>
                  <el-radio-button label="right">
                    {{$t('code.rightPanel.right')}}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="activeData.maxlength !== undefined" :label="$t('code.rightPanel.maxFill')">
                <el-input v-model="activeData.maxlength" :placeholder="$t('code.rightPanel.characterLength')">
                  <template slot="append">
                    {{$t('code.rightPanel.characters')}}
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="activeData['active-text'] !== undefined" :label="$t('code.rightPanel.openPrompt')">
                <el-input v-model="activeData['active-text']" :placeholder="$t('code.rightPanel.placeholderOpenPrompt')"/>
              </el-form-item>
              <el-form-item v-if="activeData['inactive-text'] !== undefined" :label="$t('code.rightPanel.closePrompt')">
                <el-input v-model="activeData['inactive-text']" :placeholder="$t('code.rightPanel.placeholderClosePrompt')"/>
              </el-form-item>
              <el-form-item v-if="activeData['active-value'] !== undefined" :label="$t('code.rightPanel.openValue')">
                <el-input
                    :value="setDefaultValue(activeData['active-value'])"
                    :placeholder="$t('code.rightPanel.placeholderOpenValue')"
                    @input="onSwitchValueInput($event, 'active-value')"
                />
              </el-form-item>
              <el-form-item v-if="activeData['inactive-value'] !== undefined" :label="$t('code.rightPanel.closeValue')">
                <el-input
                    :value="setDefaultValue(activeData['inactive-value'])"
                    :placeholder="$t('code.rightPanel.placeholderCloseValue')"
                    @input="onSwitchValueInput($event, 'inactive-value')"
                />
              </el-form-item>
              <el-form-item
                  v-if="activeData.type !== undefined && 'el-date-picker' === activeData.__config__.tag"
                  :label="$t('code.rightPanel.timeType')"
              >
                <el-select
                    v-model="activeData.type"
                    :placeholder="$t('code.rightPanel.selectTimeType')"
                    :style="{ width: '100%' }"
                    @change="dateTypeChange"
                >
                  <el-option
                      v-for="(item, index) in dateOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="activeData.name !== undefined" :label="$t('code.rightPanel.fileFieldName')">
                <el-input v-model="activeData.name" :placeholder="$t('code.rightPanel.placeholderFileFieldName')"/>
              </el-form-item>
              <!-- <el-form-item v-if="activeData.accept !== undefined" label="文件类型">
                <el-select
                    v-model="activeData.accept"
                    placeholder="请选择文件类型"
                    :style="{ width: '100%' }"
                    clearable
                >
                  <el-option label="图片" value="image/*"/>
                  <el-option label="视频" value="video/*"/>
                  <el-option label="音频" value="audio/*"/>
                  <el-option label="excel" value=".xls,.xlsx"/>
                  <el-option label="word" value=".doc,.docx"/>
                  <el-option label="pdf" value=".pdf"/>
                  <el-option label="txt" value=".txt"/>
                </el-select>
              </el-form-item> -->
              <el-form-item v-if="activeData.__config__.fileSize !== undefined" :label="$t('code.rightPanel.fileSize')">
                <el-input type="number" v-model.number="activeData.__config__.fileSize" :placeholder="$t('code.rightPanel.placeholderFileSize')" @input="uploadFileSize">
                  <el-select slot="append" v-model="activeData.__config__.sizeUnit" :style="{ width: '66px' }">
                    <el-option label="KB" value="KB"/>
                    <el-option label="MB" value="MB"/>
                    <el-option label="GB" value="GB"/>
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item v-if="activeData['list-type'] !== undefined" :label="$t('code.rightPanel.listType')">
                <el-radio-group v-model="activeData['list-type']" size="small">
                  <el-radio-button label="text">
                    text
                  </el-radio-button>
                  <el-radio-button label="picture">
                    picture
                  </el-radio-button>
                  <el-radio-button label="picture-card">
                    picture-card
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                  v-if="activeData.type !== undefined && activeData.__config__.tag === 'el-button'"
                  :label="$t('code.rightPanel.btnType')"
              >
                <el-select v-model="activeData.type" :style="{ width: '100%' }">
                  <el-option label="primary" value="primary"/>
                  <el-option label="success" value="success"/>
                  <el-option label="warning" value="warning"/>
                  <el-option label="danger" value="danger"/>
                  <el-option label="info" value="info"/>
                  <el-option label="text" value="text"/>
                </el-select>
              </el-form-item>
              <el-form-item
                  v-if="activeData.__config__.buttonText !== undefined"
                  v-show="'picture-card' !== activeData['list-type']"
                  :label="$t('code.rightPanel.btnText')"
              >
                <el-input v-model="activeData.__config__.buttonText" :placeholder="$t('code.rightPanel.placeholderbtnText')"/>
              </el-form-item>
              <el-form-item
                  v-if="activeData.__config__.tag === 'el-button'"
                  :label="$t('code.rightPanel.btnText')"
              >
                <el-input v-model="activeData.__slot__.default" :placeholder="$t('code.rightPanel.placeholderbtnText')"/>
              </el-form-item>
              <el-form-item v-if="activeData['range-separator'] !== undefined" :label="$t('code.rightPanel.delimiter')">
                <el-input v-model="activeData['range-separator']" :placeholder="$t('code.rightPanel.placeholderDelimiter')"/>
              </el-form-item>
              <el-form-item v-if="activeData['picker-options'] !== undefined" :label="$t('code.rightPanel.period')">
                <el-input
                    v-model="activeData['picker-options'].selectableRange"
                    :placeholder="$t('code.rightPanel.placeholderPeriod')"
                />
              </el-form-item>
              <el-form-item v-if="activeData.format !== undefined" :label="$t('BI.components.datetime.labelTime')">
                <el-input
                    :value="activeData.format"
                    :placeholder="$t('code.rightPanel.placeholderTimeFormat')"
            disabled
                    @input="setTimeValue($event)"
                />
              </el-form-item>
              <el-form-item v-if="activeData.__config__.fontSize !== undefined" :label="$t('BI.components.datetime.labelSize')">
                <el-input v-model.number="activeData.__config__.fontSize" type="number" :placeholder="$t('code.rightPanel.placeholderFontSize')"
                />
              </el-form-item>
              <template v-if="activeData.__config__.autoCode"></template>
              <el-form-item v-if="activeData.__config__.titlePosition !== undefined" :label="$t('BI.components.datetime.labelAlignment')">
                <el-radio-group v-model="activeData.__config__.titlePosition">
                  <el-radio-button label="left">
                    {{$t('code.codeStepFour.alignLeft')}}
                  </el-radio-button>
                  <el-radio-button label="center">
                    {{$t('code.codeStepFour.Centered')}}
                  </el-radio-button>
                  <el-radio-button label="right">
                    {{$t('code.codeStepFour.alignRight')}}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-form-item v-if="activeData.__config__.optionType !== undefined" :label="$t('code.rightPanel.optionStyle')">
                <el-radio-group v-model="activeData.__config__.optionType">
                  <el-radio-button label="default">
                    {{$t('code.rightPanel.defaults')}}
                  </el-radio-button>
                  <el-radio-button label="button">
                    {{$t('code.rightPanel.btn')}}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="activeData['active-color'] !== undefined" :label="$t('code.rightPanel.startColor')">
                <el-color-picker v-model="activeData['active-color']"/>
              </el-form-item>
              <el-form-item v-if="activeData['inactive-color'] !== undefined" :label="$t('code.rightPanel.closeColor')">
                <el-color-picker v-model="activeData['inactive-color']"/>
              </el-form-item>

              <!--          组件属性 switch 部分-->
              <el-form-item v-if="activeData.__config__.showLabel !== undefined
                && activeData.__config__.labelWidth !== undefined && activeData.__config__.isBindTable !== false"
                            :label="$t('code.rightPanel.showLable')"
              >
                <el-switch v-model="activeData.__config__.showLabel"/>
              </el-form-item>
              <!-- <el-form-item v-if="activeData.branding !== undefined" label="品牌烙印">
                <el-switch v-model="activeData.branding" @input="changeRenderKey"/>
              </el-form-item> -->
              <!-- <el-form-item v-if="activeData['allow-half'] !== undefined" :label="$t('code.rightPanel.allowHalfSelect')">
                <el-switch v-model="activeData['allow-half']"/>
              </el-form-item> -->
              <el-form-item v-if="activeData['show-text'] !== undefined" :label="$t('code.rightPanel.auxiliaryText')">
                <el-switch v-model="activeData['show-text']" @change="rateTextChange"/>
              </el-form-item>
              <el-form-item v-if="activeData['show-score'] !== undefined" :label="$t('code.rightPanel.showScore')">
                <el-switch v-model="activeData['show-score']" @change="rateScoreChange"/>
              </el-form-item>
              <el-form-item v-if="activeData['show-stops'] !== undefined" :label="$t('code.rightPanel.showDiscontinuity')">
                <el-switch v-model="activeData['show-stops']"/>
              </el-form-item>
              <!-- <el-form-item v-if="activeData.range !== undefined" label="范围选择">
                <el-switch v-model="activeData.range" @change="rangeChange"/>
              </el-form-item> -->
              <el-form-item
                  v-if="activeData.__config__.border !== undefined && activeData.__config__.optionType === 'default'"
                  :label="$t('code.rightPanel.whetherBorder')"
              >
                <el-switch v-model="activeData.__config__.border"/>
              </el-form-item>
    <!--          <el-form-item v-if="activeData.__config__.tag === 'el-color-picker' || activeData.__config__.tag === 'h2'"-->
    <!--                        label="颜色格式">-->
    <!--            <el-select-->
    <!--                v-model="activeData['color-format']"-->
    <!--                placeholder="请选择颜色格式"-->
    <!--                :style="{ width: '100%' }"-->
    <!--                clearable-->
    <!--                @change="colorFormatChange"-->
    <!--            >-->
    <!--              <el-option-->
    <!--                  v-for="(item, index) in colorFormatOptions"-->
    <!--                  :key="index"-->
    <!--                  :label="item.label"-->
    <!--                  :value="item.value"-->
    <!--              />-->
    <!--            </el-select>-->
    <!--          </el-form-item>-->
              <el-form-item
                  v-if="activeData.size !== undefined &&
                  (activeData.__config__.optionType === 'button' ||
                    activeData.__config__.border ||
                    activeData.__config__.tag === 'el-color-picker' ||
                    activeData.__config__.tag === 'el-button')"
                  :label="$t('code.rightPanel.compSize')"
              >
                <el-radio-group v-model="activeData.size">
                  <el-radio-button label="medium">
                    {{$t('code.rightPanel.medium')}}
                  </el-radio-button>
                  <el-radio-button label="small">
                    {{$t('code.rightPanel.small')}}
                  </el-radio-button>
                  <el-radio-button label="mini">
                    {{$t('code.rightPanel.mini')}}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <!-- <el-form-item v-if="activeData['show-word-limit'] !== undefined" label="输入统计">
                <el-switch v-model="activeData['show-word-limit']"/>
              </el-form-item> -->
              <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" :label="$t('code.rightPanel.strictStep')">
                <el-switch v-model="activeData['step-strictly']"/>
              </el-form-item>
            <!-- <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="任选层级">
                <el-switch v-model="activeData.props.props.checkStrictly"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="是否多选">
                <el-switch v-model="activeData.props.props.multiple"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="展示全路径">
                <el-switch v-model="activeData['show-all-levels']"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="可否筛选">
                <el-switch v-model="activeData.filterable"/>
              </el-form-item> -->
              <el-form-item v-if="activeData.clearable !== undefined" :label="$t('code.rightPanel.whetherEmpty')">
                <el-switch v-model="activeData.clearable" :disabled="activeData.autoCode||activeData.disabled||activeData.readonly"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.showTip !== undefined" :label="$t('code.rightPanel.showPrompt')">
                <el-switch v-model="activeData.__config__.showTip"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.tag === 'el-upload'" :label="$t('code.rightPanel.multipleSelectFiles')">
                <el-switch v-model="activeData.multiple"/>
              </el-form-item>
              <el-form-item v-if="activeData.readonly !== undefined" :label="$t('code.rightPanel.whetherRead')">
                <el-switch v-model="activeData.readonly" :disabled="activeData.__info__||activeData.autoCode||activeData.disabled"/>
              </el-form-item>
              <el-form-item v-if="activeData.disabled !== undefined" :label="$t('code.rightPanel.whetherDisable')">
                <el-switch v-model="activeData.disabled" :disabled="activeData.__info__"/>
              </el-form-item>
              <el-form-item v-if="activeData.__config__.tag === 'el-select' && activeData.__config__.filterable" :label="$t('code.rightPanel.whetherSearch')">
                <el-switch v-model="activeData.filterable"/>
              </el-form-item>
              <!-- <el-form-item v-if="activeData.__config__.tag === 'el-select'" label="是否多选">
                <el-switch v-model="activeData.multiple" @change="multipleChange"/>
              </el-form-item> -->
              <!-- 开关组件 评分组件 滑块组件 信息体组件 颜色组件 屏蔽是否必填的选项 -->
              <template v-if="activeData.__config__.tag=='el-switch'
              ||activeData.__config__.tag=='el-slider'
              ||activeData.__config__.tag=='avue-information-body'
              ||activeData.__config__.tag=='el-rate'
              ||activeData.__config__.tag=='el-color-picker'
              "></template>
              <el-form-item v-else-if="activeData.__config__.required !== undefined" :label="$t('code.rightPanel.whetherFill')">
                <el-switch v-model="activeData.__config__.required" :disabled="activeData.__info__||activeData.autoCode||activeData.readonly||activeData.disabled"/>
              </el-form-item>
              <!-- 二次编辑或审批是否重新绑定 -->
              <el-form-item v-if="activeData.__config__.whetherToRebindSecondaryEditing !== undefined" :label="$t('code.rightPanel.whetherRebind')">
                <el-switch v-model="activeData.__config__.whetherToRebindSecondaryEditing"/>
              </el-form-item>
              <!-- 分割线 -->
              <el-form-item v-if="activeData.__config__.top !== undefined" :label="$t('code.rightPanel.upperSpace')">
                <el-input-number :min="0" v-model="activeData.__config__.top"/> PX
              </el-form-item>
              <el-form-item v-if="activeData.__config__.bottom !== undefined" :label="$t('code.rightPanel.bottomSpace')">
                <el-input-number :min="0" v-model="activeData.__config__.bottom"/> PX
              </el-form-item>
              <template>
                <el-form-item v-if="activeData.__config__.tag === 'avue-tabs'" :label="$t('code.rightPanel.labelConfig')"  class='require-form-item'>
                  <div>
                    <draggable
                      :list="activeData.__config__.option.column"
                      animation={340}
                      group="tabsGroupList"
                      class="drag-wrapper"
                      chosenClass="tab-chosen"
                      handle=".mover"
                    >
                      <div v-for="(tab,tabIndex) in activeData.__config__.option.column" :key="tabIndex">
                        <div class="tab-label-operate">
                          <div><i class="el-icon-rank mover"></i></div>
                          <div><el-input v-model="tab.label" size="mini"></el-input></div>
                          <div><i class="el-icon-delete" @click="tabDelete(activeData.__config__.option.column,tabIndex)"></i></div>
                        </div>
                      </div>
                    </draggable>
                    <span class="add-tab-btn" @click="addTab">{{$t('code.rightPanel.addLable')}}</span>
                  </div>  
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'avue-tabs'" :label="$t('code.rightPanel.styleType')">
                  <el-radio-group v-model="activeData.__config__.tabsType" size="small">
                    <el-radio-button label="">
                      {{$t('code.rightPanel.defaults')}}
                    </el-radio-button>
                    <el-radio-button label="card">
                      {{$t('code.rightPanel.tabs')}}
                    </el-radio-button>
                    <el-radio-button label="border-card">
                      {{$t('code.rightPanel.card')}}
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="activeData.__config__.tag === 'avue-tabs'" :label="$t('code.rightPanel.tabLocation')">
                  <el-radio-group v-model="activeData.__config__.tabPosition" size="small">
                    <el-radio-button label="top">
                      {{$t('code.rightPanel.top')}}
                    </el-radio-button>
                    <el-radio-button label="left">
                      {{$t('code.rightPanel.left')}}
                    </el-radio-button>
                    <el-radio-button label="right">
                      {{$t('code.rightPanel.right')}}
                    </el-radio-button>
                    <el-radio-button label="bottom">
                      {{$t('code.rightPanel.bottom')}}
                    </el-radio-button>  
                  </el-radio-group> 
                </el-form-item>
              </template>

              <template v-if="activeData.__config__.layoutTree">
                <el-divider>{{$t('code.rightPanel.layoutTree')}}</el-divider>
                <!-- {{activeData.__config__}} -->
                <el-tree
                    :data="[activeData.__config__]"
                    :props="layoutTreeProps"
                    node-key="renderKey"
                    default-expand-all
                    draggable
                >
                  <span slot-scope="{ node, data }">
                    <span class="node-label">
                      <svg-icon class="node-icon" :icon-class="data.__config__?data.__config__.tagIcon:data.tagIcon"/>
                      {{ node.label }}
                    </span>
                  </span>
                </el-tree>
              </template>`
            </el-tab-pane>
            <el-tab-pane :label="$t('compTrigEvent')" v-if="!isTableChild&&activeData.__config__.triggerEvents&&activeData.__config__.triggerEvents.length>0">
            <!-- 组件触发事件 --> 
            <ComponentEvents :hideComponents="formConf.hideComponents" :componentFormList="componentFormList" :activeData.sync="activeData" :allComponents="allComponents"></ComponentEvents>
            </el-tab-pane>
            <el-tab-pane :label="$t('code.rightPanel.regularCheck')" v-if="Array.isArray(activeData.__config__.regList)">
              <!-- 正则校验 -->
               <RegularSetting :activeData.sync="activeData"></RegularSetting>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <!-- 表单属性 -->
        <FormProperties  v-show="currentTab === 'form'" :formConf.sync="formConf"></FormProperties>
        <!-- 隐藏组件 -->
        <HideComponentConfiguration  v-show="currentTab === 'hide'" :baseData.sync="baseData" :formConf.sync="formConf"></HideComponentConfiguration>
      </el-scrollbar>
    </div>

    <treeNode-dialog :visible.sync="dialogVisible" v-if="dialogVisible" :settings="activeData.__config__.settings" :title="$t('code.rightPanel.titleDataConfig')" @commit="addNode"/>
    <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" v-if="iconsVisible"/>
    <computational-dialog 
      :visible.sync="computationalVisible" 
      :current="activeData" 
      :ruleTreelist="computationComs" 
      :allComponent="numComponents"
      v-if="computationalVisible"/>

	<!-- <add-data-source v-if="dataSourceVisible" :visible.sync="dataSourceVisible"  :title="this.$t('addDataSource')"></add-data-source> -->
  </div>
</template>

<script>
import { baseUrl } from '@/config/env';
import {mapState } from "vuex";
import TreeNodeDialog from '@/views/FormDesign/TreeNodeDialog';
import { isNumberStr } from '@/utils/index';
import IconsDialog from './IconsDialog';
import ComputationalDialog from './ComputationalDialog';
import RegularSetting from './settings/RegularSetting';
import ComponentEvents from './settings/ComponentEvents';
import FormProperties from './settings/FormProperties';
import HideComponentConfiguration from './settings/HideComponentConfiguration/Index.vue';
import DataSourcesSetting from './settings/DataSourcesSetting';
import SvgIcon from '@/components/SvgIcon/index';
import {
  inputComponents, selectComponents, layoutComponents
} from '@/components/generator/config';
import { saveFormConf } from '@/utils/db';
import { getDbFieldByName} from '@/api/databasemanage/databaselink';
import { getLgMarkList } from "@/api/language/translation";
import { getCodeRules } from '@/api/system/coderule'
import AddDataSource from '@/components/AddDataSource';
import { getStore } from '@/util/store.js';
import store from '@/store'
import { getToken } from "@/util/auth";
const user = getStore({ name: 'userInfo' }) || {};
const depList = [];
user?.F_Department?.map(d => {
  depList.push({
    label: d.F_FullName,
    value: d.F_DepartmentId
  });
});

const dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 W 周',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
};

// 使changeRenderKey在目标组件改变时可用
const needRerenderList = ['tinymce'];

export default {
  components: {
    TreeNodeDialog,
    IconsDialog,
    ComputationalDialog,
    SvgIcon,
	AddDataSource,
  RegularSetting,
  FormProperties,
  HideComponentConfiguration,
  ComponentEvents,
  DataSourcesSetting
  },
  props: ['showField', 'activeData', 'formConf', 'baseData', 'parentNode','numComponents','allComponents'],
  data () {
    return {
      numberValue:undefined,
      controllerType: store.state.FD.controllerType,
      bindTable: [],
      tableField: [],
      dataItemChangeFlag: true,
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      showText: false,
      iconsVisible: false,
      computationalVisible:false,
	  // dataSourceVisible:false,

      currentIconModel: null,
      dateTypeOptions: [
        {
          label: '日(date)',
          value: 'date'
        },
        // {
        //   label: '周(week)',
        //   value: 'week'
        // },
        {
          label: '月(month)',
          value: 'month'
        },
        {
          label: '年(year)',
          value: 'year'
        },
        {
          label: '日期时间(datetime)',
          value: 'datetime'
        }
      ],
      dateRangeTypeOptions: [
        {
          label: '日期范围(daterange)',
          value: 'daterange'
        },
        {
          label: '月范围(monthrange)',
          value: 'monthrange'
        },
        {
          label: '日期时间范围(datetimerange)',
          value: 'datetimerange'
        }
      ],
      colorFormatOptions: [
        {
          label: 'hex',
          value: 'hex'
        },
        {
          label: 'rgb',
          value: 'rgb'
        },
        {
          label: 'rgba',
          value: 'rgba'
        },
        {
          label: 'hsv',
          value: 'hsv'
        },
        {
          label: 'hsl',
          value: 'hsl'
        }
      ],
      justifyOptions: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ],
      layoutTreeProps: {
        label (data, node) {
          const config = data.__config__;
          return data.componentTitle || `${config.label}: ${data.__vModel__}`;
        }
      },
      infoOptions: [
        {
          label: this.$t('mobileDev.searchRightSide.placeholderCompany'),
          value: 'company'
        },
        {
          label: this.$t('mobileDev.formRightSide.optionDepartment'),
          value: 'department'
        },
        {
          label:this.$t('mobileDev.formRightSide.optionUser'),
          value: 'user'
        },
        {
          label: this.$t('mobileDev.formRightSide.optionTime'),
          value: 'date'
        }
      ],
      computationComs: [],
      autoCodeRules: [],    //编码规则选项集

      relativeComList: [],   //当前表单区域，可关联联想数据源配置的组件
      databaseDic: [],   //数据库DIC
      tableChildFields: [],
      preloadComFilter: ['el-upload','el-image','table','xjr-opinion-comonent','el-divider','h2','avue-tabs'],
      preloadFieldOption: [],
	  transDefaultTree:[],
    sortOptions:[],
    };
  },
  computed: {
	...mapState({
	  showLanguage : state => state.common.showLanguage
	}),
  isTableChild(){
    let formId = this.activeData.__config__.formId;
    let parentFormId = null;
      //遍历整个组件列表
      this.allComponents.forEach((element, i) => {
        //找到子表单组件，  只有子表单组件 需要默认设置所绑定的表
        if (element.__config__.componentName === 'table') {
          element.__config__.children.forEach((el) => {
            if (el.__config__.formId === formId) {
              parentFormId = element.__config__.formId;
            }
          });
        }else if (element.__config__.componentName === 'avue-tabs') {
          let childrenObj = element?.__config__?.childrenObj || {};
            if (JSON.stringify(childrenObj) != "{}") {
              for (let key in childrenObj) {
              let children = childrenObj[key] || [];
              children.forEach(item => {
                if (item?.__config__?.componentName == "table") {
                   item.__config__.children.forEach((el) => {
                    if (el.__config__.formId === formId) {
                      parentFormId = el.__config__.formId;
                    }
                  });
                }
              })
              }
            }
        }
      });
      return parentFormId?true:false;
  },
  componentFormList(){
    let tags  = ['el-select','el-radio-group','el-checkbox-group'];
    let formId = this.activeData.__config__.formId;
    let componentMap = new Map();
    if(this.allComponents.length>0){
      this.allComponents.forEach((element, i) => {
        if (element.__config__.componentName === 'table') {
          //暂时不用支持子表单
        }else if (element.__config__.componentName === 'avue-tabs') {
          let childrenObj = element?.__config__?.childrenObj || {};
            if (JSON.stringify(childrenObj) != "{}") {
              for (let key in childrenObj) {
              let children = childrenObj[key] || [];
              if(children.length>0){
                  children.forEach(item => {
                    if(item){
                      if (item.__config__?.componentName == "table") {
                        //暂时不用支持子表单
                      }else{
                        if(
                          item.__config__&&
                          // item.__config__.dataType&&
                          // item.__config__.dataType==='dataApi'&&
                          item.__config__.formId&&
                          (
                            tags.includes(item.__config__.tag)||
                            item.__config__.avueType ==='asso-select'
                          )&&
                          formId!=item.__config__.formId){
                          let temp = {
                            value:item.__config__.formId,
                            label:item.__config__.label?item.__config__.label:item.__config__.formId,
                            triggerEventData:item.__config__.triggerEventData
                          };
                          componentMap.set(temp.value,temp);
                        }
                      }
                    }
                })
                }
              }
            }
        }else{
          if(
            // element.__config__.dataType&&
            // element.__config__.dataType==='dataApi'&&
            element.__config__.formId&&
            (
              tags.includes(element.__config__.tag)||
              element.__config__.avueType ==='asso-select'
            )&&
            formId!=element.__config__.formId){
              let temp = {
                      value:element.__config__.formId,
                      label:element.__config__.label?element.__config__.label:element.__config__.formId,
                      triggerEventData:element.__config__.triggerEventData
              };
              componentMap.set(temp.value,temp);
          }
        }
      });
    }
     let componentList =[];
     function isReactiveFunc(detail,formId){
       if(detail.value===formId){
          return true
        }else if(detail.triggerEventData){
          let isReactiveBool = false;
          for (let key in detail.triggerEventData) {
              let children = detail.triggerEventData[key] || [];
              if(children.length>0){
                for (let index = 0; index < children.length; index++) {
                  const element = children[index];
                  if(element.componentFormId==formId){
                    isReactiveBool = true;
                    break;
                  }else{
                     let subComponentDetail = componentMap.has(element.componentFormId)?componentMap.get(element.componentFormId):{};
                     isReactiveBool  = isReactiveFunc(subComponentDetail,formId);
                  }
                }
              }
          }
          if(isReactiveBool){
             return true
          }else{
            return false
          }
      }else{
         return false
      }
     }
    for (let [key, obj] of componentMap) {
       let isReactiveBool  = isReactiveFunc(obj,formId);
       if(!isReactiveBool){
          componentList.push(obj);
       }
    }
    return componentList;
  },
    documentLink () {
      return (
          this.activeData.__config__?.document
          || 'https://element.eleme.cn/#/zh-CN/component/installation'
      );
    },
    dateOptions () {
      if (
          this.activeData.type !== undefined
          && this.activeData.__config__.tag === 'el-date-picker'
      ) {
        if (this.activeData['start-placeholder'] === undefined) {
          return this.dateTypeOptions;
        }
        return this.dateRangeTypeOptions;
      }
      return [];
    },
    tagList () {
      return [
        {
          label:this.$t('code.leftScrollbar.inputModule'),
          options: inputComponents
        },
        {
          label:this.$t('code.leftScrollbar.selectModule'),
          options: selectComponents
        }
      ];
    },
    activeTag () {
      return this.activeData.__config__.tag;
    },
    isShowMin () {
      return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1;
    },
    isShowMax () {
      return ['el-input-number', 'el-slider', 'el-rate'].indexOf(this.activeTag) > -1;
    },
    isShowStep () {
      return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1;
    },
    // 计算bindTable值变化
    newBindTable () {
      if (this.baseData.codeFormNumber == 2) {
        return;
      } else {
        return this.activeData.__config__.bindTable;
      }
    }
  },
  watch: {
    formConf: {
      handler (val) {
        saveFormConf(val);
      },
      deep: true
    },

    // 监听bindTable值变化
    newBindTable (val, oldVal) {
      if (val && val !== oldVal &&  store.state.FD.controllerType === 0) this.getBindingsFieldByName(this.baseData.step1.F_DbId, val);
      // val !== oldVal && (this.activeData.__config__.bindTableField = '');
    },
    'activeData.__config__.defaultValue': function (activeDefaultValue, oldVal) {
      this.numberValue = activeDefaultValue;
    },
  'activeData.__config__.F_LgMarkCode' :{
       handler (val) {
		const {F_LgMarkCode ,F_LgMarkName} = this.activeData.__config__;
         this.transDefaultTree = [{
			 F_Id:F_LgMarkCode,
           F_Name:F_LgMarkName,
           F_EnCode:F_LgMarkCode
         }]
	     }
		 
    },
  'activeData.__config__.useDefaultSort': {
		handler (val) {
			this.changeSortOptions(val)
		}
	},
	'activeData.disabled':{
		handler (val) {
		    if(val){
				if(this.activeData.clearable!=undefined) this.activeData.clearable=false;
				if(this.activeData.readonly!=undefined) this.activeData.readonly=true;
        if(this.activeData.__config__.required!=undefined) this.activeData.__config__.required=false;
				if(this.activeData.__config__.tag=='tinymce') this.changeRenderKey()
			}
		}
	},
	'activeData.readonly':{
		handler (val) {
		    if(val){
				if(this.activeData.clearable!=undefined) this.activeData.clearable=false;
				if(this.activeData.__config__.required!=undefined) this.activeData.__config__.required=false;
			}
		}
	},
  'activeData.__config__.regList':{
		handler (val) {
      if(val&&Array.isArray(val)&&val.length>0){
        this.activeData.__config__.required=true;
      }
		}
	},
  },
  async mounted () {

    try {
      //获取编码规则集
      let res = await getCodeRules()
        if(res.data.data){
          this.autoCodeRules = res.data.data;
        }
    } catch (error) {
      
    }
    
    // 初始化绑定字段
    this.$nextTick(() => {
      const { F_DbId } = this.baseData.step1;
      const { bindTable } = this.activeData.__config__;
      bindTable && store.state.FD.controllerType === 0 && this.getBindingsFieldByName(F_DbId, bindTable);
    });


    if(this.activeData.__config__.componentName == 'table'){
      this.dataSourceLabel = this.$t('code.rightPanel.preloadedData');
    }else{
      this.dataSourceLabel = this.$t('mobileDev.formRightSide.labelDataSource');
    }

},
  methods: {	
 
    triggerEventDataComponents(componentMap,obj,formId){
       if(obj.value==formId){
          return false;
       }
      if(obj.triggerEventData.length==0){
        return true;
      }else{
        let canPush = true;
        triggerEventData.forEach(element => {
          if(element.componentFormId==formId){
              canPush = false;
          }
        });
        let obj2= componentMap.has(obj.value)?componentMap.get(obj.value):[];
        return false;
      }
    },
	beforeAvatarUpload (file) {
	  let imgTypes = ['image/png','image/jpeg','image/jpg','image/gif','image/bmp'];
	  const isJPG =imgTypes.includes(file.type);
	  const isLt2M = file.size / 1024 / 1024 < 2;
	  if (!isJPG) {
	    this.$message.error(this.$t('onlyImageUpload'));
	  }
	  if (!isLt2M) {
	    this.$message.error(this.$t('uploadImgMaxSize'));
	  }
	  return isJPG && isLt2M;
	},
	changeSortOptions(val){
		if(val==false){
		  this.sortOptions = this.activeData.__config__.children;
		}
	},
	 /* 获取翻译标记 */ 
   remoteMethod(query) {
      const searchObj = {
        keyword:query
      }
      getLgMarkList(searchObj).then(res => {   
        this.transDefaultTree = res.data.data;   
      });
   },
    handleSelectAutoCode(val){
      this.activeData.__config__.autoCodeRule = val;
    },
    handleTableChildChange(val,child){
      //表格预加载保存字段
      child.__config__.prestrainField = val;
    },
    addTab(){
       this.$emit('addTab');
    },
    tabDelete(column,idx){
      this.$emit('tabDelete',idx);
    },
    uploadFileSize(){
      let val = this.activeData.__config__.fileSize;
      if(typeof val=='number'&&val<0){
        this.$message(this.$t('code.rightPanel.hintMustPlus'));
       this.activeData.__config__.fileSize = 0;
      }
    },
    inputNumberMaxAndMinSetting(){
      let min = this.activeData.min;
      let max = this.activeData.max;
      if(typeof min=='number'&&typeof max =='number'&&min>max){
         this.$message(this.$t('code.rightPanel.hintCounterMin'));
         this.activeData.min = this.activeData.max-1;
      }
       if(min&&typeof min=='number'&&this.numberValue<min){
          this.$message(this.$t('counterCannotLessThanMin'));
            this.numberValue = undefined;
            this.activeData.__config__.defaultValue  = undefined;
        }  
        if(max&&typeof max=='number'&&this.numberValue>max){
          this.$message(this.$t('counterCannotGreaterThanMax'));
            this.numberValue = undefined;
            this.activeData.__config__.defaultValue  = undefined;
        }
    },
    sliderMaxAndMinSetting(){
      let min = this.activeData.min;
      let max = this.activeData.max;
      if(typeof min=='number'&&typeof max =='number'){
        if(min>max){
          this.$message(this.$t('code.rightPanel.hintSliderMin'));
          this.activeData.min = 0;
        }
      }
    },
    rateMaxAndDefaultValueSetting(){
      let max = this.activeData.max;
      let defaultValue = this.activeData.__config__.defaultValue;
      if(max<defaultValue){
        this.activeData.__config__.defaultValue = 0;
        this.$message(this.$t('code.rightPanel.hintScoreMax'));
      }

    },
    
  

  //   addNewDataSource(){
	// 	this.dataSourceVisible=true;
	// },
    addReg () {
      this.activeData.__config__.regList.push({
        pattern: '',
        message: ''
      });
    },
    addSelectItem () {
      this.activeData.__slot__.options.push({
        label: '',
        value: ''
      });
    },
    addTreeItem () {
      ++this.idGlobal;
      this.dialogVisible = true;
      this.currentNode = this.activeData.options;
    },
    format(fmt) {
      let now = new Date();
      let o = {
        "M+": now.getMonth() + 1, //月份
        "d+": now.getDate(), //日
        "h+": now.getHours(), //小时
        "m+": now.getMinutes(), //分
        "s+": now.getSeconds(), //秒
        "q+": Math.floor((now.getMonth() + 3) / 3), //季度
        S: now.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (now.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    emitPreloadFieldOption(list){
      this.preloadFieldOption = list;
      this.activeData.__config__.children = this.activeData.__config__.children.map(ele=>{
          if(!this.preloadComFilter.includes(ele.__config__.tag)){
						if(!this.preloadFieldOption.includes(ele.__config__.prestrainField)){
							ele.__config__.prestrainField = '';
						}
          }
          return ele;
        });
    },
    selectInfoType (val) {
      if (val == 'date') {
         this.activeData.placeholder = this.$t('mobileDev.formRightSide.optionTime');
        this.activeData.__config__.placeholder = this.$t('mobileDev.formRightSide.optionTime');
        this.activeData.disabled = true;
        this.activeData.__slot__ = {
            options: (() => {
              return  [{
                label:this.format("yyyy-MM-dd hh:mm:ss"),
                value:this.format("yyyy-MM-dd hh:mm:ss")
              }]
            })()
          };
      } else if (val == 'company') {
         this.activeData.placeholder = this.$t('mobileDev.searchRightSide.placeholderCompany');
        this.activeData.__config__.placeholder = this.$t('mobileDev.searchRightSide.placeholderCompany');
        this.activeData.disabled = true;
        let userInfoStr = JSON.parse(localStorage.getItem('avue-userInfo'))['content'];
        this.activeData.__slot__ = {
            options: (() => {
              return  [{
                 label: userInfoStr["F_Company"].F_FullName,
                value:userInfoStr["F_Company"].F_CompanyId
              }]
            })()
          };
        // this.activeData.__config__.defaultValue=userInfoStr["F_Company"].F_CompanyId;
      } else if (val == 'department') {
         this.activeData.placeholder = this.$t('mobileDev.formRightSide.optionDepartment');
        this.activeData.__config__.placeholder = this.$t('mobileDev.formRightSide.optionDepartment');
         this.activeData.disabled = false;
         let userInfoStr = JSON.parse(localStorage.getItem('avue-userInfo'))['content'];
        this.activeData.__slot__ = {
            options: (() => {
              if(userInfoStr.F_Department&&userInfoStr.F_Department.length>0){
               return userInfoStr.F_Department.map(x => {
                return {
                  label: x.F_FullName,
                  value: x.F_DepartmentId
                };
              });
              }else{
                return []
              }
              
            })()
          };
      } else if (val == 'user') {
        this.activeData.placeholder = this.$t('mobileDev.formRightSide.optionUser');
        this.activeData.__config__.placeholder = this.$t('mobileDev.formRightSide.optionUser');
        this.activeData.disabled = true;
        let userInfoStr = JSON.parse(localStorage.getItem('avue-userInfo'))['content'];
        this.activeData.__slot__ = {
            options: (() => {
              return  [{
                 label: userInfoStr.F_RealName,
                  value:userInfoStr.F_UserId
              }]
            })()
          };
        // this.activeData.__config__.defaultValue=userInfoStr.F_UserId;
      }
    },
    renderContent (h, { node, data, store }) {
      return (
          `<div class="custom-tree-node">
            <span>{node.label}</span>
            <span class="node-operation">
        <i on-click={() => this.append(data)}
           class="el-icon-plus"
           title="添加"
        ></i>
        <i on-click={() => this.remove(node, data)}
           class="el-icon-delete"
           title="删除"
        ></i>
        </span>
          </div>`
      );
    },
    append (data) {
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      this.dialogVisible = true;
      this.currentNode = data.children;
    },
    remove (node, data) {
      this.activeData.__config__.defaultValue = []; // 避免删除时报错
      const { parent } = node;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
	addNode (data) {
		let _this=this;
		this.activeData.__config__.settings=data;
	},
    setOptionValue (item, val) {
      item.value = isNumberStr(val) ? +val : val;
    },
    setDefaultValue (val) {
      if (Array.isArray(val)) {
        return val.join(',') === ',' ? '' : val.join(',');//时间范围默认值为['','']
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (typeof val === 'boolean') {
        return `${val}`;
      }
      return val;
    },
    setFontSizeValue (val) {
      // if (Array.isArray(val)) {
      //   return val.join(',');
      // }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      // if (typeof val === 'boolean') {
      //   return `${val}`;
      // }
      
      return val;
    },
    
    onDefaultNumberValueInput(val){
      //屏蔽的原因：计数器监听改为change，无需保留input事件的监听输入0.等行为
      // if(val===""||val==="-"||val==="0."||val==='-0'||val==='-0.'||val===undefined){
      //    this.activeData.__config__.defaultValue = undefined;
      // }else{
        this.numberValue=val.replace(/[^\d\.-]/g, "") //先把非数字的都替换掉，除了数字和.
          .replace(/^\./g, "") //必须保证第一个为数字而不是.
          .replace(/\.{2,}/g, ".") //保证只有出现一个.而没有多个.
          .replace(".", "$#$") //保证.只出现一次，而不能出现两次以上
          .replace(/\./g, "")
          .replace("$#$", ".");
        if(this.numberValue==""){
          this.numberValue = undefined;
        }
        if(this.activeData.min&&typeof this.activeData.min=='number'&&this.numberValue<this.activeData.min){
          this.$message(this.$t('counterCannotLessThanMin'));
            this.numberValue = undefined;
        }  
        if(this.activeData.max&&typeof this.activeData.max=='number'&&this.numberValue>this.activeData.max){
          this.$message(this.$t('counterCannotGreaterThanMax'));
            this.numberValue = undefined;
        }
        if(this.numberValue==undefined){
           this.activeData.__config__.defaultValue = undefined;
        }else{
           this.activeData.__config__.defaultValue = parseFloat(this.numberValue);
        }
      // }
    },
    onDefaultValueInput (str) {
      if (Array.isArray(this.activeData.__config__.defaultValue)) {
        // 数组
        this.$set(
            this.activeData.__config__,
            'defaultValue',
            str.split(',').map(val => (isNumberStr(val) ? +val : val))
        );
      } else if (['true', 'false'].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData.__config__, 'defaultValue', JSON.parse(str));
      } else {
        // 字符串和数字
		this.$set(
			this.activeData.__config__,
			'defaultValue',
			isNumberStr(str) ? +str : str
		);

      }
      //评分 输入默认值后，检查跟最大值的比较
      if(this.activeData.__config__.tag === 'el-rate'){
        this.rateMaxAndDefaultValueSetting();
      }
    },
    onSwitchValueInput (val, name) {
      if(val==""){
        this.$set(this.activeData, name, val);
      }else{
        if(val){
        if (['true', 'false'].indexOf(val) > -1) {
          this.$set(this.activeData, name, JSON.parse(val));
        } else {
          this.$set(this.activeData, name, isNumberStr(val) ? +val : val);
        }
      }
      }
      
    },
    setTimeValue (val, type) {
      const valueFormat = type === 'week' ? dateTimeFormat.date : val;
      this.$set(this.activeData.__config__, 'defaultValue', null);
      this.$set(this.activeData, 'value-format', valueFormat);
      this.$set(this.activeData, 'format', val);
    },
    spanChange (val) {
      this.formConf.span = val;
    },
    multipleChange (val) {
      this.$set(this.activeData.__config__, 'defaultValue', val ? [] : '');
    },
    dateTypeChange (val) {
      this.setTimeValue(dateTimeFormat[val], val);
    },
    rangeChange (val) {
      this.$set(
          this.activeData.__config__,
          'defaultValue',
          val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      );
    },
    rateTextChange (val) {
      if (val) this.activeData['show-score'] = false;
    },
    rateScoreChange (val) {
      if (val) this.activeData['show-text'] = false;
    },
    colorFormatChange (val) {
      this.activeData.__config__.defaultValue = null;
      this.activeData['show-alpha'] = val.indexOf('a') > -1;
      this.activeData.__config__.renderKey = +new Date(); // 更新renderKey,重新渲染该组件
    },
    openIconsDialog (model) {
      this.iconsVisible = true;
      this.currentIconModel = model;
    },
    openComputationalDialog(){
      if(!this.activeData){
        this.$message({type:'error',message:this.$t('code.rightPanel.hintActiveNode')});
        return;
      }
      this.getComputationComs();
      this.computationalVisible = true;
    },
    /**
     * 获取计算相关组件，以新的数据结构
     * **/
    getComputationComs(){
      this.computationComs = [];  //增加前 前清空旧数据
      this.numComponents.map((item,index)=>{
        let obj = {};
        obj.label = item.__config__.label;
        obj.type = item.__config__.avueType || item.type;
        obj.formId = item.__config__.formId;
        obj.__vModel__ = item.__vModel__;
        obj.id = item.__config__.formId;
        obj.computationalConfiguration = item.computationalConfiguration;
        obj.relativeComObject = item.relativeComObject;
		obj.from=item.from||null;
        this.computationComs.push(obj);
      });
    },
    setIcon (val) {
      this.activeData[this.currentIconModel] = val;
    },
    tagChange (tagIcon) {
      let target = inputComponents.find(item => item.__config__.tagIcon === tagIcon);
      if (!target) target = selectComponents.find(item => item.__config__.tagIcon === tagIcon);
      this.$emit('tag-change', target);
    },
    changeRenderKey () {
      if (needRerenderList.includes(this.activeData.__config__.tag)) {
        this.activeData.__config__.renderKey = +new Date();
      }
    },
    changeTaxRate(){
      this.activeData.__slot__.prepend = this.$t('taxIncl')+this.activeData.taxRate+'%';
      this.changeRenderKey();
    },


    /*
    * 绑定表
    * */
    async bindTableChange ($event, F_DbId) {
       await this.getBindingsFieldByName(F_DbId, $event);
      const tableObj = this.baseData.step1.list.find(x => x.name == $event);
      const parentTable = this.baseData.step1.list.find(x => x.parentName == 1);
      //判断 如果是子表单组件 不能使用主表
      if (this.activeData.__config__.componentName === 'table') {

        if (tableObj.parentName == 1) {
          this.$message.error(this.$t('code.rightPanel.hintSubform'));
          this.activeData.__config__.bindTable = '';
          return;
        }
      } else {
        //如果是子表单的子组件
        if (tableObj.parentName == 1 && this.activeData.__config__.isChild) {
          this.$message.error(this.$t('code.rightPanel.hintOnlySubtable'));
          if (this.parentNode) {
            this.activeData.__config__.bindTable = this.parentNode.__config__.bindTable;
          }
          //  return;
        } else if (tableObj.parentName == 0 && !this.activeData.__config__.isChild) {

          this.$message.error(this.$t('code.rightPanel.hintSubtable'));

          this.activeData.__config__.bindTable = '';
          return;
        }
      }
     
    },
    /*
    * 获取绑定字段
    * @param {String} id 绑定id
    * @param {String} name 绑定表名
    * */
    async getBindingsFieldByName (id, name) {
      const { data: { data, code } } = await getDbFieldByName(id, name);
      if (code) return;
      this.tableField = data;
    },
    tableFieldChange (val) {
      /* 声明一个空对象，备用存放数据 */
      let obj = {};
      /* 根据原有数组去遍历查找，然后进行对比 */
      obj = this.tableField.find(function (item) {
        /* obj 就是被选中的那个对象 */
        return item.Name === val;
      });
      this.activeData.__config__.bindTableField = val;
      this.activeData.__config__.bindTableFieldType = obj.Type;

      this.activeData.__vModel__ = val;
    },
    checkExpression(expression){
      //正则表达式必须最前和最后带/
      let arr = expression.split('');
      let arrLength = arr.length;
      if(arrLength>0){
        if(arr[0]!='/'||arr[arrLength-1]!='/'){
          this.$message(this.$t('code.rightPanel.hintRegular'));
        }
      }
    },
    handleLgChange(event){
        //this.activeData.__config__.F_LgMarkName = this.transDefaultTree.find(x => x.F_EnCode === event).F_Name
		let name= this.transDefaultTree.find(x => x.F_EnCode === event).F_Name
		this.$set(this.activeData.__config__,'F_LgMarkName',name)
    },
	submitUpload(file) {
	  const loading = this.$loading({
	    lock: true,
	    text: "上传中",
	    spinner: "el-icon-loading",
	    background: "rgba(255, 255, 255, 0.7)"
	  });
	  let action = baseUrl + "/upload/";
	  const formData = new FormData();
	  formData.append("file", file.file);
	  formData.append("remark", "上传");
	  const xhr = new XMLHttpRequest();
	  xhr.open("post", action, true);
	  xhr.setRequestHeader("Authorization", "Bearer " + getToken());
	  xhr.onload = res => {
		  const response = JSON.parse(xhr.response);
		  this.activeData.__config__.defaultValue = baseUrl + response.data.FileAddr[0];
	    loading.close();
	  };
	  xhr.onerror = () => {
	    this.$notify({
	      title: "失败",
	      message: "上传失败",
	      type: "warning"
	    });
	    loading.close();
	  };
	  xhr.ontimeout = function timeout() {
	    this.$notify({
	      title: "失败",
	      message: "上传超时，请刷新重试",
	      type: "warning"
	    });
	    loading.close();
	  };
	  xhr.send(formData);
	}
  }
};
</script>

<style lang="scss" scoped>
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  height:100%;	
  .field-box {
    position: relative;
    height: calc(100% - 75px);
    box-sizing: border-box;
    overflow: hidden;
  }

  .el-scrollbar {
    height: 100%;
  }
}

.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;

  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }

  & .el-input + .el-input {
    margin-left: 4px;
  }
}

.select-item + .select-item {
  margin-top: 4px;
}

.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}

.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}

.option-drag {
  cursor: move;
}

.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}

.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}

.node-label {
  font-size: 14px;
}

.node-icon {
  color: #bebfc3;
}
.el-select{
	width:100%
}
.el-select-dropdown .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  padding-left: 20px;
}

.el-select-dropdown .el-scrollbar .el-scrollbar__view .el-select-dropdown__item > span {
  padding: 0px;
}
.form-rule-box{
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 0px 15px;
  box-sizing: border-box;
}
.el-radio-button__inner, .el-radio-group{
  display: flex;
}
.w100{
  width: 100%;
}
.auto-complete-btn{
  text-align: right;
  padding: 5px 0px;
}
.auto-complete-btn button{
  width: 71%;
}
.tab-label-operate{
  display: flex;
  align-items: center;
}
.tab-label-operate > div{
  margin: 3px 0;
}
.tab-label-operate i{
  font-size: 20px;
  color: #999;
  margin: 0 3px;
  position: relative;
  top: 2px;
  cursor: pointer;
}
.tab-label-operate i.el-icon-rank{
  cursor: move;
}
.add-tab-btn{
  color: #409eff;
  font-size: 14px; 
  padding-left: 7px;
  cursor: pointer;
}
.tab-chosen{
  border: 1px solid rgb(35, 194, 21);
}
.table-fields-conf{
  margin-top: 5px;
  padding: 5px 0;
  border-top: 1px solid #eee;
}
.require-icon{
  color: tomato;
  position: absolute;
  left: 0;
  top: 3px;
}
.require-form-item::before{
  position:absolute;
  line-height: 36px;
  content:"*";
  color: tomato;
}
.attr-item{
  position: relative;
}
</style>
