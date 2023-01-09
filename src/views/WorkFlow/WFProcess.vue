<template>
  <ProcessTasks :leftTreeColumn="leftTreeColumn"></ProcessTasks>
</template>

<script>
import ProcessTasks from "./components/ProcessTasks";
import { leftTreeColumn } from "./components/processTasksConfig";
export default {
  components: {
    ProcessTasks,
  },
  data() {
    return {
      leftTreeColumn: leftTreeColumn,
    };
  },
};
</script>

<style lang="scss" scoped></style>
