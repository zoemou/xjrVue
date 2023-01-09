// 转数字为中文大写数字 
export function convertToChineseCapital(num) {
	if(Object.prototype.toString.call(num)==='[object Number]'){
		if(isNaN(num)||!isFinite(num)) return '零元';
	}
	if((num==''||num==null||num==undefined)&&num!==0) return;
	let plusMinus=''
	if(num<0) plusMinus='负'
	num=Math.abs(num);
   let NUM = new Array(
     "零",
     "壹",
     "贰",
     "叁",
     "肆",
     "伍",
     "陆",
     "柒",
     "捌",
     "玖",
     "拾"
   );
   let UNIT = new Array("", "拾", "佰", "仟", "万", "亿", "元", "");
   let splitNum = ("" + num).replace(/(^0*)/g, "").split("."),
    index = 0,
    numStr = "";
   for (let i = splitNum[0].length - 1; i >= 0; i--) {
     switch (index) {
       case 0:
        numStr = UNIT[7] +numStr;
         break;
       case 4:
         if (!new RegExp("0{4}//d{" + (splitNum[0].length - i - 1) + "}$").test(splitNum[0]))
          numStr = UNIT[4] +numStr;
         break;
       case 8:
        numStr = UNIT[5] +numStr;
         UNIT[7] = UNIT[5];
        index = 0;
         break;
     }
     if (index % 4 == 2 && splitNum[0].charAt(i + 2) != 0 && splitNum[0].charAt(i + 1) == 0)
      numStr = NUM[0] +numStr;
     if (splitNum[0].charAt(i) != 0)numStr = NUM[splitNum[0].charAt(i)] + UNIT[index % 4] +numStr;
    index++;
   }
   if(splitNum[0]==""){
     numStr = NUM[0];
   }
   if (splitNum.length > 1) {
     let UNit2 = ['角','分'];
     let roundNum = 2;
     // 加上小数部分(如果有小数部分)  保留两位小数
    numStr += UNIT[6];
     for (let i = 0; i < roundNum; i++){
       let tempVal = splitNum[1].charAt(i)?splitNum[1].charAt(i):0;
       numStr += NUM[tempVal]+UNit2[i];
     }
   }else{
     numStr += UNIT[6];
   }
   if (numStr == "一十")numStr = "十";
   if (numStr.match(/^一/) &&numStr.length == 3)numStr =numStr.replace("一", "");
  return plusMinus+numStr;
}
export function getNumberFixed2(number) {

	if((number==''||number==null||number==undefined)&&number!==0) return number;
	let splitNum = ("" + number).replace(/(^0*)/g, "").split(".");
	let num = splitNum[0]==""?'0':splitNum[0];
	if (splitNum.length > 1) {
		num += '.';
		let roundNum = 2;//保留两位小数
		for (let i = 0; i < roundNum; i++){
		  num += splitNum[1][i];
		}
	}
	return  parseFloat(num);
};
//更改json配置中默认值（主要是因为计算配置）
export function changeFormConfigDefaultValue(jsonList) {
  let valueForFormIdMap = new Map();
  
  jsonList.forEach((ele) => {
    if (ele.__config__.componentName == "table") {
      ele.__config__.children.forEach((element) => {
        valueForFormIdMap.set(
          ele.__config__.formId + "-table-" + element.__config__.formId,
          element.__config__.defaultValue
        );
      });
    } else if(ele.__config__.componentName == 'avue-tabs'){
      let childrenObj = ele?.__config__?.childrenObj || {};
      let _arr = getValByTabs(childrenObj);
      _arr.map(item=>{
        valueForFormIdMap.set(
          item.formId,
          item.defaultValue
        );
      });
    } else {
      valueForFormIdMap.set(ele.__config__.formId, ele.__config__.defaultValue);
    }
  });
  
  jsonList.forEach((ele, index) => {
    if (ele.__config__.componentName == "table") {
      ele.__config__.children.forEach((element, childrenIndex) => {
        let defaultValue = 0;
        if (element.computationalConfiguration?.length > 0) {
          let formulaStr = "";
          element.computationalConfiguration.forEach((item) => {
            if (item.type == "taxRate") {
              //税率
              if (element.taxRate >= 0) {
                formulaStr += element.taxRate * 0.01;
                
              }
            } else {
              let eleValue = valueForFormIdMap.get(item.formId) || 0;
              formulaStr +=
                item.formId == 0 ? item.name : valueForFormIdMap.get(eleValue);
            }
          });
          defaultValue = eval(formulaStr)*100;
          defaultValue = getNumberFixed2(defaultValue)/100;
          jsonList[index].__config__.children[
            childrenIndex
          ].__config__.defaultValue = defaultValue;
        }
      });
    } else if(ele.__config__.componentName == 'avue-tabs'){
      //avue-tabs
      calcDefaultValueByTabs(ele?.__config__?.childrenObj,valueForFormIdMap);
    }  else {
      let defaultValue = 0;
      if (
        ele.computationalConfiguration &&
        ele.computationalConfiguration.length > 0
      ) {
        let formulaStr = "";
        ele.computationalConfiguration.forEach((item) => {
          
          if (item.type == "taxRate") {
            //税率
            if (ele.taxRate >= 0) {
              formulaStr += ele.taxRate * 0.01;
            }
          } else {
            let eleValue = valueForFormIdMap.get(item.formId) || 0;
            formulaStr += item.formId == 0 ? item.name : eleValue;
          }
        });
        defaultValue = eval(formulaStr)*100;
        defaultValue = getNumberFixed2(defaultValue)/100;
        jsonList[index].__config__.defaultValue = defaultValue;
      }
    }
  });
  return jsonList;
}
export function updateDefaultVal(formId,fields){
  let defaultValue = '';

  for(let i = 0; i < fields.length; i++){
    if(fields[i]?.__config__?.componentName == 'avue-tabs'){
      let childrenObj = fields[i]?.__config__?.childrenObj;
      for(let key in childrenObj){
        defaultValue = updateDefaultVal(formId,childrenObj[key]);
        if(defaultValue){
          break;
        }
      }
      if(defaultValue){
        break;
      }
    }else{
      if(fields[i].__config__.formId == formId){
          defaultValue = fields[i].__config__.defaultValue;
          break;
      }
    }
  }
  return defaultValue;
}
function getValByTabs(childrenObj){
  let _arr = [];
  if(!childrenObj || !(childrenObj instanceof Object)) return [];
  for(let key in childrenObj){
    let children  = childrenObj[key];
    children.map(item=>{
      if(item?.__config__?.componentName == 'avue-tabs'){
        _arr.push(...getValByTabs(item?.__config__?.childrenObj));
      }else{
        let _obj = {};
        _obj.formId = item.__config__.formId;
        _obj.defaultValue = item.__config__.defaultValue;
        _arr.push(_obj);
      }
    });
  }
  return (()=>{ return _arr; })()
}
function calcDefaultValueByTabs(childrenObj,valueForFormIdMap){
  if(!childrenObj || !(childrenObj instanceof Object)) return;
  for(let key in childrenObj){
    let children = childrenObj[key];
    children.map(item=>{
      if(item?.__config__?.componentName == 'avue-tabs'){
        calcDefaultValueByTabs(item?.__config__?.childrenObj,valueForFormIdMap);
      }else{
          let defaultValue = 0;
          if (
            item.computationalConfiguration &&
            item.computationalConfiguration.length > 0
          ) {
            let formulaStr = "";
            item.computationalConfiguration.forEach((c) => {
              
              if (c.type == "taxRate") {
                //税率
                if (item.taxRate >= 0) {
                  formulaStr += item.taxRate * 0.01;
                  
                }
              } else {
                let eleValue = valueForFormIdMap.get(c.formId) || 0;
                formulaStr += c.formId == 0 ? c.name : eleValue;
              }
            });
            defaultValue = eval(formulaStr)*100;
            defaultValue = getNumberFixed2(defaultValue)/100;
            item.__config__.defaultValue = defaultValue;
        }
      }
    });
  }
}