<template>
 <div class="loading-mask" style="">
         <div class="el-loading-spinner">
           <svg viewBox="25 25 50 50" class="circular">
             <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
            </svg>
        </div>
      </div>
</template>
<style lang="css" scoped>
.loading-mask {
	position: absolute;
	z-index: 2000;
	background-color:rgba(255, 255, 255, .6);
	margin: 0;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	-webkit-transition: opacity .3s;
	transition: opacity .3s
}
</style>