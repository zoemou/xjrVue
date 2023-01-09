<template> </template>
<script>
import { BIUrl } from "@/config/env.js";
export default {
  created() {
    const url = this.$route.path.split('/bi/view')[1].replace('/index','');
    window.location.href = `${BIUrl}/view${url}`;
  }
};
</script>
