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
    codes: [
      "326ac831-0538-4022-8ff0-632c89f420c7",
      "76189a1a-620c-4656-bb71-2abccdfe5205",
      "eac53ffd-f49f-4d21-903d-bca3907d2073",
      "08ce4d54-5793-4476-8ee4-49acc939cf43",
      "367464ed-1a66-4a95-a4d5-b10781b08501",
    ],
    isValidCheckout: false,
    arrayFilterEvents: [],
    cod: null,
  },

  methods: {
    logOut() {
      Swal.fire({
        title: "Desea Cerrar La Sesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Cerrar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Cerrando Sesión", "", "success");
          this.isUserActive = {};
          localStorage.removeItem("userActive", JSON.stringify(this.isUserActive));
          location.reload();
        }
      });
    },

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
      let coins = e.target.getAttribute("data-amount").slice(0, -10).trim();
      localStorage.setItem("coins", coins);

      // console.log(Stripe);
      // console.log(coins);

      let price = e.target.parentElement.parentElement.getAttribute("data-price");
      console.log(price);
      this.showLoader = true;
      Stripe(STRIPE.public)
        .redirectToCheckout({
          lineItems: [{ price, quantity: 1 }],
          mode: "payment",
          successUrl: "https://b9d78345-1579-4c19-8b5f-825db8dc6a8d.netlify.app",
        })
        .then((res) => {
          alert(res);
          console.log(res.error);
          console.log(res.json());
        });
      this.showLoader = true;
    },

    addCoinsArrayUsers() {
      this.isUserActive.RickyCoins += parseInt(localStorage.getItem("coins"));
      console.log(this.isUserActive);
      localStorage.setItem("userActive", JSON.stringify(this.isUserActive));
      let userUpdate = this.users.find((el) => el.username.toLowerCase() === this.isUserActive.username.toLowerCase());
      console.log(userUpdate);

      userUpdate = { ...userUpdate, RickyCoins: this.isUserActive.RickyCoins };
      // console.log(this.users);
      this.users = this.users.map((el, i) => (el.username === userUpdate.username ? (el = userUpdate) : el));
      localStorage.setItem("users", JSON.stringify(this.users));
      console.log(this.users);
    },

    async events() {
      let key = "sk_test_51LGllkFVtJKu5C8LrBXgcFkboxS60SeefnzHtI35H9AUufghujWkLzziPcwNgVl9HsqXj2KRgF1W7Zi8UvRzKT9I00FVDICJHB";
      let fetchOptions = {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      };
      this.showLoader = true;
      let res = await fetch("https://api.stripe.com/v1/events", fetchOptions);
      let data = await res.json();
      console.log();

      if (data.data[0].type === "payment_intent.created") return;

      if (data.data[0].type === "checkout.session.completed") {
        let arrayFilter = data.data.filter((el) => el.type === "checkout.session.completed");
        // console.log(arrayFilter[0].data.object);
        this.arrayFilterEvents = arrayFilter[0].data.object;
        if (this.arrayFilterEvents) {
          this.isValidCheckout = true;
          console.log(this.arrayFilterEvents);
        }
      }

      this.showLoader = false;
    },

    runCode() {
      let { payment_status } = this.arrayFilterEvents;
      if (payment_status === "paid") {
        if (this.codes.some((code) => code === this.cod)) {
          console.log(this.cod);
          this.addCoinsArrayUsers();

          localStorage.removeItem("coins");
          this.isValidCheckout = false;
        } else {
          Swal.fire({
            icon: "error",
            title: "Codigo Invalido...",
            text: `Codigo ${this.cod} no es valido`,
          });
          return false;
        }
      }
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

      //new code

      let coins = localStorage.getItem("coins");
      // isActive.RickyCoins = coins;
      if (coins !== null) {
        this.events();
      }
    } else {
      location.href = "../Login/index.html";
    }

    // this.redirectToCoins();
  },

  mouted() {
    this.showLoader = false;
  },
});
