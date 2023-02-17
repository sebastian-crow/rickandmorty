import STRIPE from "./assets/stripe-keys.js";

var app = new Vue({
  el: "#app",
  data: {
    productsApi: [],
    productsApiID: [],
    showLoader: false,
    paymentCard: [
      {
        bank: "Visa",
        numbers: [4242424242424242, 4000056655665556],
      },

      {
        bank: "Mastercard",
        numbers: [
          5555555555554444, 2223003122003222, 5200828282828210,
          5105105105105100,
        ],
      },
    ],
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
              let productData = products.filter(
                (product) => product.id === el.product
              );
              // console.log(productData);
              IdProducs.push(el.id);
              this.productsApiID = [...IdProducs.slice(0, 4)];
              apiProducs.push(productData[0]);
              this.productsApi = [...apiProducs.slice(0, 4)];
              let newArray = this.productsApiID.map((el) => el);
              let newPrices = prices.map((el) => el.unit_amount_decimal);
              newPrices = [...newPrices.slice(0, 4)];
              newPrices = newPrices.map((el) =>
                formatter.format(`${el.slice(0, -2)}`)
              );
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
            let message =
              err.statusText ||
              "Ocurrio un error al conectar con la API de Stripe";
          })
      );
    },

    buyCoins(e) {
      let price =
        e.target.parentElement.parentElement.getAttribute("data-price");
      // console.log(price);
      this.showLoader = true;
      Stripe(STRIPE.public)
        .redirectToCheckout({
          lineItems: [{ price, quantity: 1 }],
          mode: "payment",
          successUrl:
            "http://127.0.0.1:5500/Creditos/assets/stripe-succes.html",
          cancelUrl: "http://127.0.0.1:5500/Creditos/assets/stripe-cancel.html",
        })
        .then((res) => {
          alert(res);
          console.log(res.error);
          $tacos.insertAdjacentHTML("afterend", res.error.message);
          return result.json();
        });
      this.showLoader = true;
    },
  },

  created() {
    this.getProducts();
  },
  mouted() {},
});

// d.addEventListener("click", (e) => {
//   if (e.target.matches(".taco *")) {
//     let price = e.target.parentElement.dataset.price;
//     // console.log(price);
//     Stripe(STRIPE_KEYS.public)
//       .redirectToCheckout({
//         lineItems: [{ price, quantity: 1 }],
//         mode: "subscription",
//         successUrl: "http://127.0.0.1:5500/ajax-ejercicios/assets/succes.html",
//         cancelUrl: "http://127.0.0.1:5500/ajax-ejercicios/assets/cancel.html",
//       })
//       .then((res) => {
//         alert(res);
//         console.log(res.error);
//         $tacos.insertAdjacentHTML("afterend", res.error.message);
//       });
//   }
// });
