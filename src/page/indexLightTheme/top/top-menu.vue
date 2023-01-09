<template>
  <div class="top-menu">
    <el-menu :default-active="activeIndex"
             mode="horizontal"
             text-color="#333">
      <template v-for="(item,index) in items">
        <el-menu-item :index="item.index+''"
                      @click.native="openMenu(item)"
                      :key="index">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{generateTitle(item)}}</span>
            <span>{{item.F_FullName}}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "top-menu",
  data () {
    return {
      activeIndex: "0",
      items: []
    };
  },
  inject: ["index"],
  created () {
    this.getMenu();
  },
  computed: {
    ...mapGetters(["tagCurrent", "menu"])
  },
  methods: {
    openMenu (item) {
      this.index.openMenu(item)
    },
    getMenu () {
      this.$store.dispatch("GetTopMenu").then(res => {
		  res.forEach(function(e,i){
			  e.index=i;
		  })
        this.items = res;
      });
    },
    generateTitle (item) {
      return this.$router.$avueRouter.generateTitle(item.label, (item.meta || {}).i18n);
    }
  }
};
</script>