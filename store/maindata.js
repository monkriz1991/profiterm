import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    main: [],
  }),
  getters: { getMain: (state) => state.main },
  actions: {
    async fetchData() {
      try {
        const { data: datamine } = await useFetch(() => "/api/allpages/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        });
        this.main = datamine;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
  persist: true,
});
