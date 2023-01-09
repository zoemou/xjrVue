<template>
  <div class="menu-wrapper">
    <div v-for="(item, itemIndex) in menu" :key="itemIndex">
      <el-menu-item
				:index="item.moduleId"
        v-if="item.target == 'open'"
        @click="openBlankUrl(item)"
      >
        <i :class="item[iconKey]"></i>
        <span slot="title" :alt="item[pathKey]">{{ generateTitle(item) }}</span>
      </el-menu-item>
      <div v-else>
        <el-menu-item
          v-if="
            validatenull(item[childrenKey]) &&
              item['target'] != 'expand' &&
              vaildRoles(item)
          "
          :index="item.moduleId"
          @click="open(item)"
          :key="item[labelKey]"
          :class="{ 'is-active': vaildAvtive(item) }"
        >
          <i :class="item[iconKey]"></i>
          <span slot="title" :alt="item[pathKey]">{{
            generateTitle(item)
          }}</span>
        </el-menu-item>
        <el-submenu
          v-else-if="
            (!validatenull(item[childrenKey]) || item['target'] == 'expand') &&
              vaildRoles(item)
          "
          :index="item.moduleId"
          :key="item[labelKey]"
        >
          <template slot="title">
            <i :class="item[iconKey]"></i>
            <span
              slot="title"
              :class="{ 'el-menu--display': collapse && first }"
              >{{ generateTitle(item) }}</span
            >
          </template>
          <div v-for="(child, cindex) in item[childrenKey]" :key="cindex">
            <el-menu-item
							:index="child.moduleId"
              v-if="child.target == 'open'"
              @click="openBlankUrl(child)"
            >
              <i :class="child[iconKey]"></i>
              <span>{{ generateTitle(child) }}</span>
            </el-menu-item>
            <div v-else>
              <el-menu-item
                :index="child.moduleId"
                @click="open(child)"
                :class="{ 'is-active': vaildAvtive(child) }"
                v-if="
                  validatenull(child[childrenKey]) &&
                    child['target'] != 'expand'
                "
                :key="child[labelKey]"
              >
                <i :class="child[iconKey]"></i>
                <span slot="title">{{ generateTitle(child) }}</span>
              </el-menu-item>
              <sidebar-item
                v-else
                :menu="[child]"
                :props="props"
                :screen="screen"
                :collapse="collapse"
              ></sidebar-item>
            </div>
          </div>
        </el-submenu>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
import config from "./config.js";
import Cookies from "js-cookie";
import { BI_URL } from "@/config/env";

export default {
  name: "sidebarItem",
  data() {
    return {
      config: config
    };
  },
  props: {
    menu: {
      type: Array
    },
    screen: {
      type: Number
    },
    first: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => {
        return {};
      }
    },
    collapse: {
      type: Boolean
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["roles", "tagList"]),
    labelKey() {
      return this.props.label || this.config.propsDefault.label;
    },
    pathKey() {
      return this.props.path || this.config.propsDefault.path;
    },
    iconKey() {
      return this.props.icon || this.config.propsDefault.icon;
    },
    childrenKey() {
      return this.props.children || this.config.propsDefault.children;
    },
    targetKey() {
      return this.props.target || this.config.propsDefault.target;
    },
    nowTagValue() {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  methods: {
    generateTitle(item) {
      return this.$router.$avueRouter.generateTitle(
        item[this.labelKey],
        (item.meta || {}).i18n
      );
    },
    vaildAvtive(item) {		
      const groupFlag = (item["group"] || []).some(ele =>{
        this.$route.path.includes(ele)}
      );
      return this.nowTagValue === item[this.pathKey]||groupFlag;
    },
    vaildRoles(item) {
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
    },
    validatenull(val) {
      return validatenull(val);
    },
    openBlankUrl(item) {
      let routeData = this.$router.resolve({
        name: item[this.labelKey],
        query: { target: "open" },
        params: {}
      });
      //判断是否外链
      let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/;
      if (!reg.test(routeData.href)) {
        window.open(item.path, "_blank");
      } else {
        window.open(routeData.href, "_blank");
      }
    },
    open(item) {
      if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
      this.$router.$avueRouter.group = item.group;
      this.$router.$avueRouter.meta = item.meta;
      this.$router.$avueRouter.target = item.target;
      if (item.target == "open") {
        let routeData = this.$router.resolve({
          name: item[this.labelKey],
          query: { target: "open" },
          params: {}
        });
        window.open(routeData.href, "_blank");
      } else {
        // const d = {
        //   path: this.$router.$avueRouter.getPath({
        //     name: item[this.labelKey],
        //     src: item[this.pathKey]
        //   }),
        //   query: item.query
        // };

        this.$router.push({
          path: this.$router.$avueRouter.getPath({
            name: item[this.labelKey],
            src: item[this.pathKey]
          }),
          query: item.query
        });
      }
    }
  }
};
</script>
<style scoped>
.fa {
  vertical-align: middle;
  width: 24px;
  text-align: center;
  margin-right: 4px;
  display: inline-block;
}
.menu-wrapper{
	background-color: #030523;
}
.el-submenu{
	background-color: ;
}
</style>
