<template>  
<div></div>
    <!-- <iframe width="100%" height="100%"  frameborder="0" :src="reportIframe" style="padding:0px 10px; box-sizing: border-box;"></iframe> -->
</template>

<script>
    import {baseUrl} from '@/config/env';
    export default {
        name: "ReportDesign",
        data() {
            return {reportIframe:''}
        },
        created() {
            this.reportIframe = baseUrl+'/ureport/designer';

            window.location.href = this.reportIframe
            // var newDesign = window.open('_blank')
            // newDesign.location = this.reportIframe 

        }
    }
</script>