import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
// import enLocale from './en'
// import zhLocale from './zh-CN'
import { getStore } from '@/util/store'
var Avue = window.AVUE;
Vue.use(VueI18n)

const messages = {
  en: {
    // ...enLocale,
    ...elementEnLocale,
    ...Avue.locale.en,
  },
  zh: {
//    ...zhLocale,
    ...elementZhLocale,
    ...Avue.locale.zh,
  }
}

const i18n = new VueI18n({
  locale: getStore({ name: 'language' }) || 'zh-CN',
  messages,
  silentTranslationWarn:true
})



const i18n_code=[{
		"F_Name":"简体中文",
		"F_Code":"zh-CN"
	},{
		"F_Name":"英语",
		"F_Code":"en"
	},{
		"F_Name":"德语",
		"F_Code":"de"
	},{
		"F_Name":"葡萄牙语",
		"F_Code":"pt"
	},{
		"F_Name":"西班牙语",
		"F_Code":"es"
	},{
		"F_Name":"丹麦语",
		"F_Code":"da"
	},{
		"F_Name":"法语",
		"F_Code":"fr"
	},{
		"F_Name":"挪威语",
		"F_Code":"nb-NO"
	},{
		"F_Name":"繁体中文",
		"F_Code":"zh-TW"
	},{
		"F_Name":"意大利语",
		"F_Code":"it"
	},{
		"F_Name":"韩语",
		"F_Code":"ko"
	},{
		"F_Name":"日语",
		"F_Code":"ja"
	},{
		"F_Name":"荷兰语",
		"F_Code":"nl"
	},{
		"F_Name":"越南语",
		"F_Code":"vi"
	},{
		"F_Name":"俄语",
		"F_Code":"ru-RU"
	},{
		"F_Name":"土耳其语",
		"F_Code":"tr-TR"
	},{
		"F_Name":"巴西葡萄牙语",
		"F_Code":"pt-br"
	},{
		"F_Name":"波斯语",
		"F_Code":"fa"
	},{
		"F_Name":"泰语",
		"F_Code":"th"
	},{
		"F_Name":"印尼语",
		"F_Code":"id"
	},{
		"F_Name":"保加利亚语",
		"F_Code":"bg"
	},{
		"F_Name":"波兰语",
		"F_Code":"pl"
	},{
		"F_Name":"芬兰语",
		"F_Code":"fi"
	},{
		"F_Name":"瑞典语",
		"F_Code":"sv-SE"
	},{
		"F_Name":"希腊语",
		"F_Code":"el"
	},{
		"F_Name":"斯洛伐克语",
		"F_Code":"sk"
	},{
		"F_Name":"加泰罗尼亚语",
		"F_Code":"ca"
	},{
		"F_Name":"捷克语",
		"F_Code":"cs-CZ"
	},{
		"F_Name":"乌克兰语",
		"F_Code":"ua"
	},{
		"F_Name":"土库曼语",
		"F_Code":"tk"
	},{
		"F_Name":"泰米尔语",
		"F_Code":"ta"
	},{
		"F_Name":"拉脱维亚语",
		"F_Code":"lv"
	},{
		"F_Name":"南非荷兰语",
		"F_Code":"af-ZA"
	},{
		"F_Name":"爱沙尼亚语",
		"F_Code":"ee"
	},{
		"F_Name":"斯洛文尼亚语",
		"F_Code":"sl"
	},{
		"F_Name":"阿拉伯语",
		"F_Code":"ar"
	},{
		"F_Name":"希伯来语",
		"F_Code":"he"
	},{
		"F_Name":"立陶宛语",
		"F_Code":"lt"
	},{
		"F_Name":"蒙古语",
		"F_Code":"mn"
	},{
		"F_Name":"哈萨克斯坦语",
		"F_Code":"kz"
	},{
		"F_Name":"匈牙利语",
		"F_Code":"hu"
	},{
		"F_Name":"罗马尼亚语",
		"F_Code":"ro"
	},{
		"F_Name":"库尔德语",
		"F_Code":"ku"
	},{
		"F_Name":"维吾尔语",
		"F_Code":"ug-CN"
	},{
		"F_Name":"高棉语",
		"F_Code":"km"
	},{
		"F_Name":"塞尔维亚语",
		"F_Code":"sr"
	},{
		"F_Name":"巴斯克语",
		"F_Code":"eu"
	},{
		"F_Name":"吉尔吉斯语",
		"F_Code":"kg"
	},{
		"F_Name":"亚美尼亚语",
		"F_Code":"hy"
	},{
		"F_Name":"克罗地亚",
		"F_Code":"hr"
	},{
		"F_Name":"世界语",
		"F_Code":"eo"
	}];
	
export default i18n;
export {i18n_code}