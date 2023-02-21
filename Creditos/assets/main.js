var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue!",
    users: [],
    isUserActive: {},
    showInfoUser: {},
    counter: 0,
  },

  method: {},

  created() {
    let users = JSON.parse(localStorage.getItem("users"));
    if (users !== null) {
      this.users = users;
    }

    let isActive = JSON.parse(localStorage.getItem("userActive"));
    if (isActive !== null) {
      // console.log(isActive);

      // Funcion actualizar creditos users
      const addCoinsArrayUsers = (userActive) => {
        let userUpdate = this.users.find((el) => el.username.toLowerCase() === userActive.username.toLowerCase());

        userUpdate = { ...userUpdate, RickyCoins: userActive.RickyCoins };

        this.users = this.users.map((el, i) => (el.username === userUpdate.username ? (el = userUpdate) : el));
        localStorage.setItem("users", JSON.stringify(this.users));
        // console.log(this.users);
      };

      this.showLoader = true;

      let arrayFilter;
      const events = async () => {
        let key = "sk_test_51LGllkFVtJKu5C8LrBXgcFkboxS60SeefnzHtI35H9AUufghujWkLzziPcwNgVl9HsqXj2KRgF1W7Zi8UvRzKT9I00FVDICJHB";
        let fetchOptions = {
          headers: {
            Authorization: `Bearer ${key}`,
          },
        };
        let res = await fetch("https://api.stripe.com/v1/events", fetchOptions);
        let data = await res.json();

        arrayFilter = data.data.filter((el) => el.type === "checkout.session.completed");
        // console.log(arrayFilter);
        // let counter = arrayFilter[0].created;

        const { amount_total, customer_details } = arrayFilter[0].data.object;
        if (arrayFilter[0].created) {
          if (amount_total === 10000000) {
            isActive = { ...isActive, RickyCoins: isActive.RickyCoins + 1200 };
            localStorage.setItem("userActive", JSON.stringify(isActive));
            // console.log(isActive);
            addCoinsArrayUsers(isActive);
          }
          if (amount_total === 5000000) {
            isActive = { ...isActive, RickyCoins: isActive.RickyCoins + 500 };
            localStorage.setItem("userActive", JSON.stringify(isActive));
            addCoinsArrayUsers(isActive);
          }
          if (amount_total === 2000000) {
            isActive = { ...isActive, RickyCoins: isActive.RickyCoins + 200 };
            localStorage.setItem("userActive", JSON.stringify(isActive));
            addCoinsArrayUsers(isActive);
          }
          if (amount_total === 1000000) {
            isActive = { ...isActive, RickyCoins: isActive.RickyCoins + 100 };
            localStorage.setItem("userActive", JSON.stringify(isActive));
            addCoinsArrayUsers(isActive);
          }
        }

        this.isUserActive = { ...isActive };
        const jsConfetti = new JSConfetti();
        setTimeout(() => {
          jsConfetti.addConfetti();
        }, 500);

        this.showInfoUser = { ...customer_details, ...isActive };
        this.counter = arrayFilter[0].created;
        localStorage.setItem("counter", this.counter);
        setTimeout(() => {
          location.href = "../../Login/index.html";
        }, 1000);
      };

      let counter = JSON.parse(localStorage.getItem("counter"));
      if (counter !== null) {
        events();
      }
    } else {
      location.href = "../../Login/index.html";
    }
  },
});
