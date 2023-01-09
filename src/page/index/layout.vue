<template>
  <div>
    <keep-alive>
      <router-view class="avue-view"
                   v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view class="avue-view erp-avue-view"
                 v-if="!$route.meta.keepAlive" 
				 style="height:100%;"
				 />
  </div>
</template>