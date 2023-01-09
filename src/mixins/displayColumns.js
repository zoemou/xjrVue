import { getShowColumns } from "@/api/systemManagement/menu";

export default {
  data() {
    return {
      showColumn: '',
    };
  },
  created() {
    this.getShowColumns()
  },
  methods: {
    getShowColumns: async function () {
      const id = this.$route.meta.moduleid
      let { data } = await getShowColumns(id)
      if (data.data) {
        this.showColumn = data.data ==='[]' ? '[]' : JSON.parse(data.data)
      }
    }
  },
};
