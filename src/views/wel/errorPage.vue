<template>
    <Error403 />
</template>
<script>
import Error403 from "@/components/error-page/403.vue";

export default {
  name: "errorPage",
  data() {
    return {};
  },
  components: { Error403 },
  methods: {}
};
</script>
