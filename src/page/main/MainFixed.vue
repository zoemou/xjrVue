<template>
    <div class="main-fixed">
        <div class="main-box">
            <div v-if="title" class="main-header">{{title}}<slot name="icon"></slot></div>
            <div class="main-body">
                <slot name="list"></slot>
            </div>
        </div>
        <div class="mainFixedResize" title="收缩侧边栏" v-if="resize"> ⋮ 
        </div>
    </div>
</template>

<script>
    export default {
        name: "MainFixed",
        props: {
            title: {
                type: String,
                default: ''
            },
            resize:{  //是否放大缩小左侧栏
                type:Boolean,
                default:false
            }
        },
        mounted(){
            if(this.resize){
                this.dragControllerDiv()
            }
        },
        methods:{
            dragControllerDiv() {               
                var left = document.getElementsByClassName('main-fixed');				
                var box = document.getElementsByClassName('main-content');				
                for (let i = 0; i < left.length; i++) {
					let resize = left[i].getElementsByClassName('mainFixedResize')[0];
					if(resize){
						// 鼠标按下事件
						resize.onmousedown = function (e) {
							//颜色改变提醒
							resize.style.background = '#818181';
							var startX = e.clientX;
							resize.left = resize.offsetLeft;
							// 鼠标拖动事件
							document.onmousemove = function (e) {

								var endX = e.clientX;
								var moveLen = resize.left +(endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
								

								if (moveLen < 200) moveLen = 200; // 左边区域的最小宽度为32px
								if (moveLen > 800) moveLen = 800; //左边区域最大宽度为800px

								resize.style.left = moveLen+'px'; // 设置左侧区域的宽度

								//for (let j = 0; j < left.length; j++) {
									left[i].style.width = moveLen + 'px';
									box[i].style.paddingLeft= moveLen+5+'px'; // 右边区域的宽度
								//}
							};
							// 鼠标松开事件
							document.onmouseup = function (evt) {
								//颜色恢复
								resize.style.background = '#d6d6d6';
								document.onmousemove = null;
								document.onmouseup = null;
								resize.releaseCapture && resize.releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
							};
							resize.setCapture && resize.setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
							return false;
						};
					}
                }
            }
        }
    }
</script>

<style scoped>
    .main-fixed {
        float: left;
        width: 200px;
        height: 100%;
		position: relative;
		z-index: 1;
    }
    /*拖拽区div样式*/
    .mainFixedResize {
        cursor: col-resize;
        /* float: left; */
        position: relative;
        bottom: 45%;
        background-color: #d6d6d6;
        border-radius: 10px;
        margin-top: -50px;
        width: 5px;
        height: 50px;
		line-height: 50px;
        /* background-size: cover;
        background-position: center;
        z-index: 99999; */
        font-size:16px;
        color: white;
        left: 200px;
    }
    /*拖拽区鼠标悬停样式*/
    .mainFixedResize:hover {
        color: #444444;
    }
    .main-box {
        position: relative;
        height: 100%;
        ____border-top: 1px solid #E9E9E9;
		z-index: 1;
    }
    .main-header {
        height: 40px;
        padding-left:10px;
        font-size: 16px;
        line-height: 40px;
        font-weight: normal;
        background: #fff;
        box-sizing: border-box;
		color: #333;
    }
    .main-body {
        height: calc(100% - 40px);
        padding: 10px 0 0;
        background: #fff;
        border-top: 1px solid #f2f2f2;
        overflow-y: auto;
        box-sizing: border-box;
    }
</style>