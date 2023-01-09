//字符50长度校验
import i18n from "@/lang";
export const validateShortLength = (rule,value,callback) => {
    function getStrLength(str) {
      return str.replace(/[^x00-xff]/g,'ab').length;//将中文转换为2个字符长度
    }
    if(!value){
      rule.message?callback(new Error(rule.message)):callback();
    }else if(getStrLength(value)<=50){
      callback();
    }else{
      return callback(new Error(i18n.t('cannotExceed50Characters')))
    }
  }; 
//字符100长度校验
export const validateLength = (rule,value,callback) => {
    function getStrLength(str) {
      return str.replace(/[^x00-xff]/g,'ab').length;//将中文转换为2个字符长度
    }
    if(!value){
      rule.message?callback(new Error(rule.message)):callback();
    }else if(getStrLength(value)<=100){
      callback();
    }else{
      return callback(new Error(i18n.t('cannotExceed100Characters')))
    }
  }; 

  export const validateDesLength = (rule,value,callback) => {
    function getStrLength(str) {
      return str.replace(/[^x00-xff]/g,'ab').length;//将中文转换为2个字符长度
    }
    if(!value){
      rule.message?callback(new Error(rule.message)):callback();
    }else if(getStrLength(value)<=1600){
      callback();
    }else{
      return callback(new Error(i18n.t('cannotExceed1600Characters')))
    }
  }; 

  export const validateFuncLength = (rule,value,callback) => {
    function getStrLength(str) {
      return str.replace(/[^x00-xff]/g,'ab').length;//将中文转换为2个字符长度
    }
    if(!value){
      rule.message?callback(new Error(rule.message)):callback();
    }else if(getStrLength(value)<=1000){
      callback();
    }else{
      return callback(new Error(i18n.t('cannotExceed1000Characters')))
    }
  }; 

//电话正则校验
export const validatePhone = (rule,value,callback) => {
    const phoneReg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    if(!phoneReg.test(value) && value){
      callback(new Error(i18n.t('enterCorrectPhoneNumber')));
    }else{
      rule.message?callback(new Error(rule.message)):callback();
    }
};

//传真正则校验
export const validateFax = (rule,value,callback) => {
  const faxReg = /^(\d{3,4}-)?\d{7,8}$/;
  if(!faxReg.test(value) && value){
    callback(new Error(i18n.t('EnterCorrectFax')));
  }else{
    rule.message?callback(new Error(rule.message)):callback();
  }
};
//手机或座机的正则校验
export const validateTelePhone = (rule,value,callback) => {
  const phoneReg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  const faxReg = /^(\d{3,4}-)?\d{7,8}$/;
  if(!(phoneReg.test(value)||faxReg.test(value)) && value){
    callback(new Error(i18n.t('correctPhoneLandlineNumber')));
  }else{
    rule.message?callback(new Error(rule.message)):callback();
  }
};

//邮箱正则校验
export const validateEmail = (rule,value,callback) => {
  const emailReg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
  if (!emailReg.test(value) && value) {
    callback(new Error(i18n.t('inputVaildEmail')));
  }else{
    rule.message?callback(new Error(rule.message)):callback();
  }
};

//qq号正则验证
export const validateOicq = (rule,value,callback) => {
  const oicqReg = /^[1-9][0-9]{4,9}$/;
  if (!oicqReg.test(value) && value) {
    callback(new Error(i18n.t('enterCorrectQQNumber')));
  }else{
    rule.message?callback(new Error(rule.message)):callback();
  }
};

//英文字母数字下划线验证
export const validateLetter = (rule,value,callback) => {
  const letterReg = /^[0-9a-zA-Z_]{1,}$/;
  function getLength(str) {
    return str.length;
  }
  if(!letterReg.test(value) && value) {
    callback(new Error(i18n.t('useEnglishNumbersUnderscore')));
  }else if(getLength(value) > 100){
    callback(new Error(i18n.t('cannotExceed100Characters')));
  }else{
    rule.message?callback(new Error(rule.message)):callback();
  }
};

//排序验证
export const validateSort = (rule,value,callback) => {
  const sortReg = /^[0-9]{1,5}$/;
  if(/^[0-9]{1,}$/.test(value)){
    if (!sortReg.test(value) && value) {
      callback(new Error(i18n.t('cannotExceed5Characters')));
    }else{
      callback();
    }
  }else{
	  if(value===''||value===null||value===undefined){
		rule.message?callback(new Error(rule.message)):callback();
	  }else{
		callback(new Error(i18n.t('enterNumber')));  
	  }    
  }  
};

//排序验证
export const validateMobSort = (rule,value,callback) => {
  const sortReg = /^[0-9]{1,4}$/;
  if(/^[0-9]{1,}$/.test(value)){
    if (!sortReg.test(value) && value) {
      callback(new Error(i18n.t('cannotExceed4Characters')));
    }else{
      callback();
    }
  }else{
    if(value===''||value===null||value===undefined){
    	rule.message?callback(new Error(rule.message)):callback();
    }else{
    		callback(new Error(i18n.t('enterNumber')));  
    } 
  }
  
};

//高宽验证
export const validateGap = (rule,value,callback) => {
  const gapReg = /^[0-9]{1,3}$/;
  if(/^[0-9]{1,}$/.test(value)){
    if (!gapReg.test(value) && value) {
      callback(new Error(i18n.t('cannotExceed3Characters')));
    }else{
      callback();
    }
  }else{
    if(value===''||value===null||value===undefined){
    	rule.message?callback(new Error(rule.message)):callback();
    }else{
    		callback(new Error(i18n.t('enterNumber')));  
    } 
  }
  
};

//高宽
export const validateWidth = (rule,value,callback) => {
  const widthReg = /^[0-9]{1,10}$/;
  if(/^[0-9]{1,}$/.test(value)){
    if (!widthReg.test(value) && value) {
      callback(new Error(i18n.t('cannotExceed10Characters')));
    }else{
      callback();
    }
  }else{
    if(value===''||value===null||value===undefined){
    	rule.message?callback(new Error(rule.message)):callback();
    }else{
    		callback(new Error(i18n.t('enterNumber')));  
    } 
  }
  
};

export const validateSubSort = (rule,value,callback) => {
  const gapReg = /^[0-9]{1,2}$/;
  if(/^[0-9]{1,}$/.test(value)){
    if (!gapReg.test(value) && value) {
      callback(new Error(i18n.t('cannotExceed2Characters')));
    }else{
      callback();
    }
  }else{
    if(value===''||value===null||value===undefined){
    	rule.message?callback(new Error(rule.message)):callback();
    }else{
    		callback(new Error(i18n.t('enterNumber')));  
    } 
  }
  
};
