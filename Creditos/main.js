import STRIPE from "./assets/stripe-keys.js";

var app = new Vue({
  el: "#app",
  data: {
    users: [],
    productsApi: [],
    productsApiID: [],
    showLoader: false,
    isUserActive: {},
    paymentCard: ["Visa", "4242424242424242"],
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
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      });

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
              let productData = products.filter((product) => product.id === el.product);
              // console.log(productData);
              IdProducs.push(el.id);
              this.productsApiID = [...IdProducs.slice(0, 4)];
              apiProducs.push(productData[0]);
              this.productsApi = [...apiProducs.slice(0, 4)];
              let newArray = this.productsApiID.map((el) => el);
              let newPrices = prices.map((el) => el.unit_amount_decimal);
              newPrices = [...newPrices.slice(0, 4)];
              newPrices = newPrices.map((el) => formatter.format(`${el.slice(0, -2)}`));
              // console.log(newPrices);
              this.productsApi = this.productsApi.map((product, index) => {
                return {
                  ...product,
                  dataPrice: newArray[index],
                  price: newPrices[index],
                };
              });
            });
            // console.log(this.productsApiID);
            // console.log(this.productsApi);
            this.showLoader = false;
          })
          .catch((err) => {
            console.log(err);
            let message = err.statusText || "Ocurrio un error al conectar con la API de Stripe";
          })
      );
    },

    buyCoins(e) {
      this.showLoader = true;

      let price = e.target.parentElement.parentElement.getAttribute("data-price");
      console.log(price);
      this.showLoader = true;
      Stripe(STRIPE.public)
        .redirectToCheckout({
          lineItems: [{ price, quantity: 1 }],
          mode: "payment",
          successUrl: "http://127.0.0.1:5500/Creditos/assets/stripe-succes.html",
          cancelUrl: "http://127.0.0.1:5500/Creditos/assets/stripe-cancel.html",
        })
        .then((res) => {
          alert(res);
          console.log(res.error);
          console.log(res.json());
        });
      this.showLoader = true;
    },
  },

  created() {
    let users = JSON.parse(localStorage.getItem("users"));
    if (users !== null) {
      this.users = users;
    }

    let isActive = JSON.parse(localStorage.getItem("userActive"));
    if (isActive !== null) {
      this.getProducts();
      this.isUserActive = isActive;
    } else {
      location.href = "../Login/index.html";
    }

    // this.redirectToCoins();
  },

  mouted() {
    this.showLoader = false;
  },
});
