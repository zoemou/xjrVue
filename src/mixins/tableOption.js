import { getStore } from "@/util/store";

export default {
	data() {
		return {
			openDoubleClickEdit: true,//双击编辑 开关
			option: {
				height: 'calc(100% - 100px)',
				simplePage: true,
				refreshBtn: false
			},
		};
	},
	watch: {
		page: {
			handler(val) {
				//如果page不存在用户得手动刷新页面才能更新布局
				this.$nextTick(() => { this.changeBodyHeight(); })
			},
			deep: true
		}
	},
	mounted() {
		this.$nextTick(() => {
			setTimeout(() => {
				this.changeBodyHeight();
			}, 500)
		})

		window.addEventListener('resize', () => { // 定义窗口大小变更通知事件
			this.changeBodyHeight();
		});
	},
	methods: {
		changeBodyHeight() {
			//根据组件高度重新计算table高度，超出出现滚动条
			var search = document.getElementsByClassName('search-box')[0] ||
				document.getElementsByClassName('searchBox')[0] ||
				document.getElementsByClassName('search-container')[0];
			let table = document.getElementsByClassName("main-table-content");


			//table[0].style.height="100%";
			if (table[0] === undefined) {
				setTimeout(() => {
					this.changeBodyHeight();
				}, 200)
				return;
			}
			if (search) {
				//初始化样式
				search.style.position = "absolute";
				search.style.padding = "0";
			}
			let clientWidth = table[0]?.offsetWidth || 0;
			let searchWidth = search?.offsetWidth || 0;
			let btnWidth = document.getElementsByClassName('avue-crud__left')[0]?.offsetWidth || 0;


			if (clientWidth >= (searchWidth + btnWidth)) {
				if (table[0]) table[0].style.height = "100%";
			} else {
				//重新设置样式
				search.style.position = "static";
				search.style.padding = "6px 20px 0 5px";
				if (table[0]) table[0].style.height = `calc(100% - ${search.offsetHeight}px)`;
			}

			setTimeout(() => {
				let page = document.getElementsByClassName("avue-crud__pagination")
				let conTable = document.getElementsByClassName("el-table")
				if (conTable[0]) {
					if (page?.length > 0) {
						if (page[0].children?.length > 0) {
							if (this.option?.header === false) {
								conTable[0].style.height = 'calc(100% - 60px)'
							} else {
								conTable[0].style.height = 'calc(100% - 100px)'
							}
						} else {
							conTable[0].style.height = 'calc(100% - 40px)'
						}
					} else {
						conTable[0].style.height = 'calc(100% - 40px)'
					}
				}
			}, 500)

		}
	},
};
