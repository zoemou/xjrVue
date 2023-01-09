<template>
	<div class="default">
		<div class="avue-sidebar">

			<!-- <el-scrollbar style="height:calc(100% - 30px)"> -->
			<div v-if="validatenull(menu)" class="avue-sidebar--tip">{{$t('menuTip')}}</div>

			<el-menu unique-opened :default-active="nowTagValue" mode="vertical" :show-timeout="200" :default-openeds="menuCollapse"
				:collapse="keyCollapse">
				<sidebar-item :menu="menu" :screen="screen" first :props="website.menu.props" :collapse="keyCollapse" disabled
					:index="1"></sidebar-item>
			</el-menu>
			<!-- </el-scrollbar> -->
			<!-- <el-link :underline="false" icon="fa fa-exchange" style="text-align:center;width: 100%;line-height: 50px;color: rgba(255, 255, 255, 0.7);" @click="changeSystem()">切换系统</el-link> -->

		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from "vuex";

	import sidebarItem from "./sidebarItem";
	import {
		isURL,
		validatenull
	} from "@/util/validate";
	import webiste from "@/config/website";
	// function addPath(ele, first) {
	//   const menu = webiste.menu;
	//   const propsConfig = menu.props;

	//   const propsDefault = {
	//     label: propsConfig.label || "label",
	//     path: propsConfig.path || "path",
	//     icon: propsConfig.icon || "icon",
	//     children: propsConfig.children || "children",
	//     target: propsConfig.target || "target",
	//   };
	//   const icon = ele[propsDefault.icon];
	//   ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
	//   const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;

	//   if (isURL(ele[propsDefault.path])) {

	//     ele[propsDefault.path] = ele[propsDefault.path].replace(/&/g, "$");
	//   }
	//   if (!isChild && first && !isURL(ele[propsDefault.path])) {
	//     ele[propsDefault.path] = ele[propsDefault.path] + "/index";
	//   } else {
	//     ele[propsDefault.children] &&
	//       ele[propsDefault.children].forEach((child) => {
	//         if (!isURL(child[propsDefault.path])) {
	//           child[propsDefault.path] = `${ele[propsDefault.path]}${
	//             child[propsDefault.path] ? child[propsDefault.path] : "index"
	//           }`;
	//         }
	//         addPath(child);
	//       });
	//   }
	// }
	export default {
		name: "sidebar",
		components: {
			sidebarItem
		},
		inject: ["index"],
		data() {
			return {

			};
		},
		created() {
			this.index.openMenu(this.sysCategory)
		},
		computed: {
			...mapGetters(["website", "menu", "tag", "keyCollapse", "screen", "menuId", "sysCategory", "allSystem",
				"systemId", "tagList","menuCollapse"
			]),
			nowTagValue: function() {
				return this.$router.$avueRouter.getValue(this.$route);
			}
		},
		mounted() {

			setTimeout(() => {
				let haveMainSystem = this.allSystem.find(item => {
					return item.F_Id == '0'
				});
				if (!haveMainSystem && this.allSystem.length && this.systemId == '0') {
					this.$store.commit('SET_SYSTEMID', this.allSystem[0].F_Id);
					let url = this.allSystem[0].F_IndexUrl;
					this.$store.commit('SET_INDEX_URL', url);
					this.$event.$emit('noMainSystemExec');
				}

			}, 500);
		},
		methods: {

		}
	};
</script>
<style lang="scss" scoped>

</style>
