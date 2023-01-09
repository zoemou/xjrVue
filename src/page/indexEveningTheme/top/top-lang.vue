<template>
  <el-dropdown trigger="click" @command="handleSetLanguage">
    <i class="icon-zhongyingwen"></i>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="it in langCode"
        :key="index"
        :disabled="language === it.F_Code"
        :command="it.F_Code"
        >{{ it.F_Name }}</el-dropdown-item
      >
      <!-- <el-dropdown-item :disabled="language==='en'"
                        command="en">English</el-dropdown-item> -->
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from "vuex";
import { getLanguageType } from "@/api/language/type";
import { getTranslationByType } from "@/api/language/translation";
import { getStore } from "@/util/store";
import { setStore } from "@/util/store";
export default {
  name: "top-lang",
  inject: ["reload"],
  data() {
    return {
      langCode: []
    };
  },
  created() {
    let storeLangCode = getStore({ name: "language" });
    getLanguageType().then(res => {
      this.langCode = res.data.data;
      // this.langCode.forEach(it=>{
      // 	if(it.F_Code=="zh-CN"){
      // 		it.F_Code='zh'
      // 	}
      // })
      if (storeLangCode) {
        this.initSetLanguage(storeLangCode);
        return;
      }
      this.langCode.forEach(it => {
        if (it.F_IsMain == 1) this.initSetLanguage(it.F_Code);
      });
    });
  },
  mounted() {},
  computed: {
    ...mapGetters(["language", "tag"])
  },
  props: [],
  methods: {
 async handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.commit("SET_LANGUAGE", lang);

      const local = await getTranslationByType(lang);
      const langObj = local.data.data;

      const elLocal = await import("element-ui/lib/locale/lang/" + lang);

      // const allLg = Object.assign(local.data.data,defaultLg)
      let obj = {
        ...JSON.parse(langObj),
        ...elLocal.default
        //...Avue.locale[i18n.locale]
      };

      this.$i18n.setLocaleMessage(lang, obj);

      setStore({ name: "lg-mark-" + lang, content: obj });

      // this.$i18n.setLocaleMessage(lang, lgMarkList);
      location.reload();
    },
    initSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.commit("SET_LANGUAGE", lang);
      let tag = this.tag;
      let title = this.$router.$avueRouter.generateTitle(
        tag.label,
        (tag.meta || {}).i18n
      );
      //根据当前的标签也获取label的值动态设置浏览器标题
      this.$router.$avueRouter.setTitle(title);
    }
  }
};
</script>

<style lang="scss" scoped></style>
