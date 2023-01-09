<template> </template>
<script>
import { BIUrl } from "@/config/env.js";
export default {
  created() {
    window.location.href = BIUrl;
  }
};
</script>
