var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue!",
    users: [],
    isUserActive: {},
  },

  method: {},

  created() {
    let users = JSON.parse(localStorage.getItem("users"));
    if (users !== null) {
      this.users = users;
    }

    let isActive = JSON.parse(localStorage.getItem("userActive"));
    if (isActive !== null) {
      isActive.RickyCoins = localStorage.getItem("coins");
      console.log(isActive);
      this.isUserActive = isActive;
    } else {
      location.href = "../Login/index.html";
    }
  },
});
