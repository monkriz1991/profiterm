import { defineStore } from "pinia";

export const useBasketStore = defineStore("basket", {
  state: () => ({
    basket: [],
  }),
  getters: {
    getBasket: (state) => state.basket,
  },
  actions: {
    addBasket(item) {
      this.basket.push({
        _id: item._id,
        count: "1",
      });
      console.log(this.basket);
    },
  },
  persist: true,
});
