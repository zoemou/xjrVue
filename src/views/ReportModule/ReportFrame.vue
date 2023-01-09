<template>
  <!-- <avue-iframe :routerPath="reportIframe" ></avue-iframe> -->
  <iframe
    width="100%"
    height="100%"
    frameborder="0"
    :src="reportIframe"
    style="padding: 0px 10px; box-sizing: border-box"
  ></iframe>
</template>

<script>
import { flowableUrl, baseUrl } from "@/config/env";
import { mapGetters } from "vuex";
import AvueIframe from "@/components/iframe/main";
import website from "@/config/website";
export default {
  name: "ReportDesign",
  data() {
    return { reportIframe: "" };
  },
  components: {
    AvueIframe,
  },
  computed: {
    ...mapGetters(["website"]),
  },
  watch: {
    $route(to, from) {
      this.getPath(to.path);
    },
  },
  mounted() {
    this.getPath(this.$route.path);
  },
  methods: {
    getPath(path) {
      const newUrl = path.replace("/index","")
      const urlArry = newUrl.split("/");
      const id = urlArry[urlArry.length - 1];


      this.reportIframe = baseUrl + `/ureport/preview?_u=xjr:${id}.ureport.xml`;
    },
  },
};
</script>
