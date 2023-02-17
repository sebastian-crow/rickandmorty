import STRIPE from "./assets/stripe-keys.js";

var app = new Vue({
  el: "#app",
  data: {
    productsApi: [],
    productsApiID: [],
    showLoader: false,
  },

  methods: {
    getProducts() {
      let fetchOptions = {
        headers: {
          Authorization: `Bearer ${STRIPE.secret}`,
        },
      };
      let prices;
      let products;
      let IdProducs = [];
      let apiProducs = [];
      this.showLoader = true;
      Promise.all([
        fetch("https://api.stripe.com/v1/products", fetchOptions),
        fetch("https://api.stripe.com/v1/prices", fetchOptions),
      ]).then((responses) =>
        Promise.all(responses.map((response) => response.json()))
          .then((json) => {
            // console.log(json);
            products = json[0].data;
            prices = json[1].data;
            // console.log(prices);
            // console.log(products);

            prices.forEach((el) => {
              let productData = products.filter(
                (product) => product.id === el.product
              );
              // console.log(productData);
              IdProducs.push(el.id);
              this.productsApiID = [...IdProducs.slice(0, 4)];
              apiProducs.push(productData[0]);
              this.productsApi = [...apiProducs.slice(0, 4)];
              let newArray = this.productsApiID.map((el) => el);
              this.productsApi = this.productsApi.map((product, index) => {
                return {
                  ...product,
                  dataPrice: newArray[index],
                };
              });
            });
            // console.log(this.productsApiID);
            console.log(this.productsApi);
            this.showLoader = false;
          })
          .catch((err) => {
            console.log(err);
            let message =
              err.statusText ||
              "Ocurrio un error al conectar con la API de Stripe";
          })
      );
    },
  },

  created() {
    this.getProducts();
  },
  mouted() {},
});
