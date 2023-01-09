<template>  
    <iframe width="100%" height="100%"  frameborder="0" :src="wfIframe"></iframe>
</template>

<script>
    export default {
        name: "WFMenu",
        data() {
            return {wfIframe:''}
        },
        created() { 
            //多模板           
            //this.wfIframe = '/XJR-pa/modules/WorkFlow/WFProcess/index.htm?nwfSchemeInfoId=0xTQ8Sl6g6,3fUB961fN6';
            //单模板
            this.wfIframe = '/XJR-pa/modules/WorkFlow/WFMenu/Preview.htm?id=Jv3kb9K2c9';
        }
    }
</script>